import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const SHORTCUTS = [
  { icon: '🛠', label: 'Ordens de serviço', to: '/service-orders' },
  { icon: '📦', label: 'CEOs', to: '/ceos' },
  { icon: '👥', label: 'Usuários', to: '/users' },
  { icon: '📊', label: 'Relatórios', to: '/reports' },
];

const COLLABORATORS = [
  'Eduardo Ribeiro Silveira',
  'Diego Ribeiro Torres',
];

export default function WelcomePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [aboutVisible, setAboutVisible] = useState(false);
  const firstName = user?.name?.split(' ')[0];

  return (
    <div
      style={{
        minHeight: '100%',
        background: 'var(--color-navy)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '32px 24px',
      }}
    >
      <div style={{ maxWidth: 720, margin: '0 auto', width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: '#7FD9C4', fontWeight: 800, letterSpacing: '0.06em', fontSize: 13 }}>
            FIBER SPLICE LOCATOR
          </span>
          <button
            onClick={() => setAboutVisible(true)}
            title="Sobre"
            style={{ background: 'none', border: 'none', color: '#7FD9C4', fontSize: 20, cursor: 'pointer' }}
          >
            ⓘ
          </button>
        </div>

        <h1 style={{ color: '#FFFFFF', fontSize: 32, lineHeight: 1.3, marginTop: 16 }}>
          Olá{firstName ? `, ${firstName}` : ''}! O que você deseja fazer?
        </h1>
        <p style={{ color: '#CBD5E1', fontSize: 16, lineHeight: 1.5, marginTop: 10 }}>
          Acesse CEOs, gerencie usuários e acompanhe as ordens de serviço e os indicadores.
        </p>

        <div className="shortcut-grid" style={{ marginTop: 40 }}>
          {SHORTCUTS.map((shortcut) => (
            <button key={shortcut.to} className="shortcut-tile" onClick={() => navigate(shortcut.to)}>
              <span className="shortcut-icon">{shortcut.icon}</span>
              {shortcut.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ textAlign: 'center' }}>
        <button
          onClick={logout}
          style={{ background: 'none', border: 'none', color: '#94A3B8', fontWeight: 700, cursor: 'pointer', padding: 16 }}
        >
          Sair da conta
        </button>
      </div>

      {aboutVisible ? (
        <div className="modal-backdrop" onClick={() => setAboutVisible(false)}>
          <div className="modal-card" onClick={(event) => event.stopPropagation()}>
            <button className="modal-close" onClick={() => setAboutVisible(false)}>✕</button>

            <h2 style={{ fontSize: 20, color: 'var(--color-text-title)', marginTop: 0 }}>Sobre o Fiber Splice Locator</h2>

            <p style={{ color: 'var(--color-text-body)', lineHeight: 1.6 }}>
              Este aplicativo foi desenvolvido como trabalho da disciplina Programação para Dispositivos
              Móveis, do curso de Análise e Desenvolvimento de Sistemas da Universidade Unisinos.
            </p>

            <p style={{ color: 'var(--color-text-body)', lineHeight: 1.6 }}>
              O projeto atende a uma necessidade real da{' '}
              <a href="https://pop-rs.rnp.br/" target="_blank" rel="noreferrer">POP-RS/RNP</a>, que hoje controla
              suas Caixas de Emenda Óptica (CEOs) por planilhas de Excel e fotos trocadas por WhatsApp.
            </p>

            <h3 style={{ fontSize: 13, textTransform: 'uppercase', color: 'var(--color-text-title)', marginBottom: 4 }}>
              Desenvolvedor principal
            </h3>
            <p style={{ color: 'var(--color-text-body)' }}>
              <a href="https://github.com/felipeschwartz" target="_blank" rel="noreferrer">Felipe Schwartz</a>
            </p>

            <h3 style={{ fontSize: 13, textTransform: 'uppercase', color: 'var(--color-text-title)', marginBottom: 4 }}>
              Colaboradores
            </h3>
            {COLLABORATORS.map((name) => (
              <p key={name} style={{ color: 'var(--color-text-body)', margin: '2px 0' }}>{name}</p>
            ))}

            <h3 style={{ fontSize: 13, textTransform: 'uppercase', color: 'var(--color-text-title)', marginBottom: 4, marginTop: 12 }}>
              Repositórios
            </h3>
            <p style={{ color: 'var(--color-text-body)', margin: '2px 0' }}>
              Mobile:{' '}
              <a href="https://github.com/felipeschwartz/fiber-splice-locator-front-app" target="_blank" rel="noreferrer">
                fiber-splice-locator-front-app
              </a>
            </p>
            <p style={{ color: 'var(--color-text-body)', margin: '2px 0' }}>
              BackEnd:{' '}
              <a href="https://github.com/felipeschwartz/fiber-splice-locator" target="_blank" rel="noreferrer">
                fiber-splice-locator
              </a>
            </p>
            <p style={{ color: 'var(--color-text-body)', margin: '2px 0' }}>
              Web:{' '}
              <a href="https://github.com/felipeschwartz/fiber-splice-locator-front-web" target="_blank" rel="noreferrer">
                fiber-splice-locator-front-web
              </a>
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
