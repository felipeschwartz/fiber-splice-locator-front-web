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

- **Node.js** (LTS) e **npm**
- O [BackEnd](https://github.com/felipeschwartz/fiber-splice-locator) rodando
  localmente em `http://localhost:8080` (local ou via Docker — veja o README
  de lá)
- Um usuário `ADMIN` ou `SUPER_ADMIN` cadastrado — o login recusa qualquer
  outro perfil (ex.: `FIELD_TECHNICIAN`) neste painel

## Como rodar

```bash
npm install
npm run dev
```

Acesse `http://localhost:5173`.

## Configurar a API e o CORS

O endereço do backend fica em `src/api/config.js`:

```js
export const API_BASE_URL = 'http://localhost:8080';
```

Como o painel roda no navegador (não é um app nativo), o backend precisa
liberar CORS para a origem do Vite. Isso é configurado do lado do backend, em
`application.yml`:

```yaml
cors:
  originPatterns: http://localhost:3000,http://localhost:4200,http://localhost:8080,http://localhost:5173
```

Se a porta do Vite mudar (ex.: 5173 já estiver ocupada e ele subir em 5174),
adicione a nova porta nessa lista e reinicie o backend — sem isso, toda
chamada da API falha com erro de conexão no navegador (o preflight `OPTIONS`
é rejeitado antes mesmo de chegar nas rotas).

## Contas de teste

O backend, ao subir com o banco vazio, já cria usuários de exemplo — só
`ADMIN` e `SUPER_ADMIN` conseguem entrar neste painel:

| E-mail | Senha | Perfil |
|---|---|---|
| superadmin@fiberlocator.com | superadmin123 | SUPER_ADMIN |
| admin@fiberlocator.com | admin123 | ADMIN |

## Estrutura do projeto

```
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
