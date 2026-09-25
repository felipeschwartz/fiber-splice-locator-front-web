# Fiber Splice Locator — Painel Web

Painel administrativo web (React + Vite) usado por administradores (perfis
`ADMIN` e `SUPER_ADMIN`) para gerenciar CEOs, ordens de serviço e usuários, e
acompanhar indicadores de produtividade — sem os recursos exclusivos de campo
do app mobile (câmera e GPS).

## Sobre o projeto

Este painel foi desenvolvido como extensão do trabalho da disciplina
Programação para Dispositivos Móveis, do curso de Análise e Desenvolvimento
de Sistemas da Universidade Unisinos, para dar à POP-RS/RNP uma forma de
gerenciar o sistema a partir de um computador, sem depender do app mobile
(pensado para os técnicos em campo).

O projeto atende a uma necessidade real da
[POP-RS/RNP](https://pop-rs.rnp.br/), que hoje controla suas Caixas de Emenda
Óptica (CEOs) por planilhas de Excel e fotos trocadas por WhatsApp. Este
repositório é o painel web; a API que ele consome está em
[fiber-splice-locator](https://github.com/felipeschwartz/fiber-splice-locator),
e o app usado pelos técnicos em campo está em
[fiber-splice-locator-front](https://github.com/felipeschwartz/fiber-splice-locator-front).

**Desenvolvedor principal:** [Felipe Schwartz](https://github.com/felipeschwartz)
**Colaboradores:** Eduardo Ribeiro Silveira, Vorni Valpir Fagundes da Cunha
Junior, Diego Ribeiro Torres, Lucas Candido Vargas

## Tecnologias utilizadas

- **React 19** + **Vite** (dev server e build)
- **React Router** (rotas e proteção de rotas autenticadas)
- **Axios** para chamadas HTTP
- **Recharts** para o gráfico de atendimentos por técnico
- CSS puro com variáveis (`src/index.css`) — sem framework de UI, mesma
  paleta de cores do app mobile

## Pré-requisitos

- **Node.js** (LTS) e **npm**, para rodar em modo de desenvolvimento, **ou**
  **Docker**, para rodar a versão de produção num container
- O [BackEnd](https://github.com/felipeschwartz/fiber-splice-locator) rodando
  localmente em `http://localhost:8080` (local ou via Docker — veja o README
  de lá)
- Um usuário `ADMIN` ou `SUPER_ADMIN` cadastrado — o login recusa qualquer
  outro perfil (ex.: `FIELD_TECHNICIAN`) neste painel

## Como rodar

### Em modo de desenvolvimento (Vite)

```bash
npm install
npm run dev
```

Acesse `http://localhost:5173`. Nesse modo, a página recarrega sozinha a cada
alteração no código.

### Com Docker

O `Dockerfile` gera a versão de produção em duas etapas: primeiro faz o build
com Node, depois serve os arquivos estáticos com **nginx**. O Node não vai
para a imagem final.

```bash
docker build --build-arg VITE_API_BASE_URL=http://localhost:8080 -t fiber-splice-locator-web .
docker run -d --name fiber-splice-locator-web -p 8081:80 fiber-splice-locator-web
```

Acesse `http://localhost:8081`.

- Dentro do container, o nginx escuta na porta **80**. O `-p 8081:80` liga a
  porta 8081 do seu computador à porta 80 do container. A 8081 é só uma
  escolha: pode ser qualquer porta livre, desde que ela também esteja
  liberada no CORS do backend (veja abaixo).
- O `VITE_API_BASE_URL` é gravado no JavaScript **durante o build**. Mudar
  essa variável com o container já rodando não tem efeito; para apontar para
  outro backend, é preciso gerar a imagem de novo.
- `localhost:8080` funciona mesmo com o painel dentro do container, porque
  quem chama a API é o navegador, que roda no seu computador, e não o
  container.

No **IntelliJ Ultimate**, dá para fazer o mesmo por uma Run Configuration do
tipo *Dockerfile*: informe o *Image tag*, o *Container name*, o *Bind ports*
(`8081:80`) e o *Build args* (`VITE_API_BASE_URL=http://localhost:8080`).

## Configurar a API e o CORS

O endereço do backend vem da variável de ambiente `VITE_API_BASE_URL`, lida
em `src/api/config.js`. Se ela não for informada, o painel usa
`http://localhost:8080`:

```js
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
```

Onde definir a variável, conforme a forma de rodar:

| Forma de rodar | Onde definir |
|---|---|
| `npm run dev` | Não precisa, se o backend estiver em `localhost:8080`. Para outro endereço, crie um arquivo `.env.local` com `VITE_API_BASE_URL=...` |
| Docker | `--build-arg VITE_API_BASE_URL=...` no `docker build` |
| Render | *Environment Variables* do site |

O Vite só expõe para o navegador as variáveis que começam com `VITE_`.

Como o painel roda no navegador (não é um app nativo), o backend precisa
liberar CORS para o endereço em que o painel está aberto. Isso é configurado
do lado do backend, em `application.yml`:

```yaml
cors:
  originPatterns: http://localhost:3000,http://localhost:4200,http://localhost:8080,http://localhost:5173,https://fiber-splice-locator-front-web.onrender.com,http://localhost:8081
```

A lista precisa incluir a porta que você está usando: a **5173** no modo de
desenvolvimento, ou a porta mapeada no `docker run` (a **8081** do exemplo
acima). Se o Vite subir em outra porta (ex.: 5174, com a 5173 ocupada) ou
você mapear o container para outra porta, adicione-a nessa lista e reinicie
o backend. Sem isso, toda chamada da API falha com erro de conexão no
navegador, porque o preflight `OPTIONS` é rejeitado antes de chegar nas
rotas.

## Contas de teste

O backend, ao subir com o banco vazio, já cria usuários de exemplo — só
`ADMIN` e `SUPER_ADMIN` conseguem entrar neste painel:

| E-mail | Senha | Perfil |
|---|---|---|
| superadmin@fiberlocator.com | superadmin123 | SUPER_ADMIN |
| admin@fiberlocator.com | admin123 | ADMIN |

## Estrutura do projeto

```
Dockerfile           build em duas etapas: Node gera o build, nginx serve
                      os arquivos estáticos.
nginx.conf           configuração do nginx no container; redireciona
                      qualquer rota para o index.html, senão recarregar uma
                      página como /ceos/5 devolveria 404.
.dockerignore        o que não entra na imagem (node_modules, dist, etc.).
src/index.css        variáveis de cor/espaçamento e classes utilitárias
                      (.card, .btn, .field-*, .badge, .banner-*, etc.) — o
                      kit de estilo compartilhado por todas as páginas.
src/api/              chamadas HTTP (axios) por domínio (auth, ceo, usuário,
                      ordem de serviço, relatórios), client.js (instância do
                      axios + token no localStorage) e config.js (URL base e
                      mapa de rotas do backend).
src/context/          estado de autenticação (AuthContext) — recusa login de
                      quem não é ADMIN/SUPER_ADMIN.
src/components/       peças reutilizáveis entre páginas: Layout (barra de
                      navegação), ProtectedRoute, DateRangeFilter, CeoForm
                      (compartilhado entre criar/editar CEO),
                      AuthenticatedImage (carrega fotos de OS com o token,
                      já que <img> do navegador não manda Authorization) e
                      reports/ (conteúdo dos dois relatórios).
src/pages/            uma página por rota (Login, Esqueci/Redefinir senha,
                      Boas-vindas, listas/detalhes/formulários de Ordens de
                      Serviço, CEOs e Usuários, Relatórios).
src/utils/            formatação de data e período padrão (format.js) e a
                      regra de hierarquia de quem pode desativar quem
                      (permissions.js), espelhando a regra do backend só
                      para decidir o que mostrar na tela.
```

### Para mudar o visual do painel

Edite as variáveis em `src/index.css` (`:root { --color-... }`) — evite
hexadecimais soltos dentro das páginas.

### Para adicionar uma página nova

Componha com as classes de `index.css` (`.page-head`, `.card`, `.field-*`,
`.btn`) para manter o mesmo espaçamento e visual das demais páginas.
Cadastre a rota em `src/App.jsx` — dentro do grupo protegido por
`ProtectedRoute`/`Layout` se exigir login, ou fora dele (como
`/login`, `/forgot-password`) se não exigir — e, se fizer sentido como item
de navegação principal, em `NAV_ITEMS` dentro de `src/components/Layout.jsx`.

## Repositórios relacionados

- **BackEnd:** [fiber-splice-locator](https://github.com/felipeschwartz/fiber-splice-locator)
- **App mobile:** [fiber-splice-locator-front](https://github.com/felipeschwartz/fiber-splice-locator-front)
