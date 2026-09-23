import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { listUsers, disableUser } from '../api/userService';
import { getApiErrorMessage } from '../api/client';
import { canDisableUser, canEditUser, isSuperAdmin } from '../utils/permissions';

const ROLE_LABEL = {
  SUPER_ADMIN: 'Super Admin',
  ADMIN: 'Admin',
  FIELD_TECHNICIAN: 'Técnico',
};

const ROLE_BADGE = {
  FIELD_TECHNICIAN: 'badge-neutral',
  ADMIN: 'badge-warning',
  SUPER_ADMIN: 'badge-primary',
};

function RoleBadges({ roles }) {
  return (
    <div className="actions-row">
      {(roles || []).map((role) => (
        <span key={role} className={`badge ${ROLE_BADGE[role] || 'badge-neutral'}`}>
          {ROLE_LABEL[role] || role}
        </span>
      ))}
    </div>
  );
}

export default function UsersListPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [disablingId, setDisablingId] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setUsers(await listUsers());
    } catch (err) {
      setError(getApiErrorMessage(err, 'Não foi possível carregar os usuários.'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) => u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q));
  }, [users, query]);

  async function handleDisable(target) {
    if (!window.confirm(`Desativar o usuário "${target.name}"? Ele não conseguirá mais fazer login.`)) return;

    setDisablingId(target.id);
    setError('');

    try {
      await disableUser(target.id);
      await load();
    } catch (err) {
      setError(getApiErrorMessage(err, 'Não foi possível desativar o usuário.'));
    } finally {
      setDisablingId(null);
    }
  }

  return (
    <div>
      <div className="page-head">
        <div>
          <h1 className="page-title">Usuários</h1>
          <p className="page-subtitle">Gestão de contas de acesso ao sistema.</p>
        </div>
        <div className="actions-row">
          <input
            className="search-input"
            placeholder="Buscar por nome ou e-mail"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <Link to="/users/new" className="btn">
            + Novo usuário
          </Link>
        </div>
      </div>

      {error ? <div className="banner-error">{error}</div> : null}

      {loading ? (
        <p className="muted">Carregando...</p>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>E-mail</th>
                <th>Perfil</th>
                <th>Situação</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td><RoleBadges roles={u.roles} /></td>
                  <td>
                    <span className={u.active ? 'badge badge-success' : 'badge badge-danger'}>
                      {u.active ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td>
                    <div className="actions-row">
                      {canEditUser(currentUser, u) ? (
                        <Link to={`/users/${u.id}/edit`} className="link-button">
                          Editar
                        </Link>
                      ) : null}
                      {u.active && canDisableUser(currentUser, u) ? (
                        <button
                          className="link-button"
                          style={{ color: 'var(--color-danger)' }}
                          disabled={disablingId === u.id}
                          onClick={() => handleDisable(u)}
                        >
                          {disablingId === u.id ? 'Desativando...' : 'Desativar'}
                        </button>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))}
              {!filtered.length ? (
                <tr>
                  <td colSpan={5} className="muted">Nenhum usuário encontrado.</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      )}

      {!isSuperAdmin(currentUser) ? (
        <p className="muted" style={{ marginTop: 12 }}>
          Como ADMIN, você só pode criar e desativar contas de técnico. Contas de administrador só podem ser geridas por um SUPER_ADMIN.
        </p>
      ) : null}
    </div>
  );
}
