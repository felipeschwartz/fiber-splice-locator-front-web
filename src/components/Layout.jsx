import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const linkStyle = ({ isActive }) => ({
  padding: '7px 12px',
  borderRadius: 8,
  textDecoration: 'none',
  fontWeight: 600,
  fontSize: 13,
  whiteSpace: 'nowrap',
  color: isActive ? '#FFFFFF' : '#CBD5E1',
  background: isActive ? 'var(--color-primary)' : 'transparent',
});

const NAV_ITEMS = [
  { to: '/welcome', label: 'Início' },
  { to: '/service-orders', label: 'Ordens de serviço' },
  { to: '/ceos', label: 'CEOs' },
  { to: '/users', label: 'Usuários' },
  { to: '/reports', label: 'Relatórios' },
];

export default function Layout() {
  const { user, logout } = useAuth();

  return (
    <div style={{ minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
      <header style={{ background: 'var(--color-navy)', padding: '14px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 10 }}>
          <strong style={{ color: '#FFFFFF', fontSize: 16 }}>Fiber Splice Locator · Painel</strong>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{ color: '#CBD5E1', fontSize: 13 }}>{user?.name}</span>
            <button
              onClick={logout}
              style={{
                background: 'transparent',
                border: '1px solid #64748B',
                color: '#FFFFFF',
                borderRadius: 8,
                padding: '6px 12px',
                cursor: 'pointer',
                fontSize: 13,
              }}
            >
              Sair
            </button>
          </div>
        </div>

        <nav style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.to} to={item.to} style={linkStyle}>
              {item.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main style={{ flex: 1, padding: 24, maxWidth: 1200, width: '100%', margin: '0 auto', boxSizing: 'border-box' }}>
        <Outlet />
      </main>
    </div>
  );
}
