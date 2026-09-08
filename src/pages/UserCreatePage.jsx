import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createUser } from '../api/userService';
import { getApiErrorMessage } from '../api/client';
import { isGodAdmin } from '../utils/permissions';

const AVAILABLE_ROLES = ['FIELD_TECHNICIAN', 'ADMIN', 'GOD_ADMIN'];
const ROLE_LABEL = { GOD_ADMIN: 'God Admin', ADMIN: 'Admin', FIELD_TECHNICIAN: 'Técnico' };

export default function UserCreatePage() {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const canChooseRoles = isGodAdmin(currentUser);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [roles, setRoles] = useState(['FIELD_TECHNICIAN']);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  function toggleRole(role) {
    setRoles((current) => (current.includes(role) ? current.filter((r) => r !== role) : [...current, role]));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!name.trim() || !email.trim() || !password) {
      setError('Preencha nome, e-mail e senha.');
      return;
    }
    if (canChooseRoles && !roles.length) {
      setError('Selecione ao menos um perfil de acesso.');
      return;
    }

    setError('');
    setSaving(true);

    try {
      await createUser({
        name: name.trim(),
        email: email.trim(),
        password,
        roles: canChooseRoles ? roles : ['FIELD_TECHNICIAN'],
        active: true,
      });
      navigate('/users');
    } catch (err) {
      setError(getApiErrorMessage(err, 'Verifique os dados e tente novamente.'));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="page-head">
        <div>
          <h1 className="page-title">Novo usuário</h1>
          <p className="page-subtitle">
            {canChooseRoles ? 'Cadastre um novo usuário e escolha seu perfil de acesso.' : 'Como ADMIN, o novo usuário será sempre criado como técnico de campo.'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="card" style={{ maxWidth: 480 }}>
        <label className="field-label">Nome</label>
        <input className="field-input" value={name} onChange={(event) => setName(event.target.value)} style={{ marginBottom: 14 }} />

        <label className="field-label">E-mail</label>
        <input
          type="email"
          className="field-input"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          style={{ marginBottom: 14 }}
          autoComplete="username"
        />

        <label className="field-label">Senha provisória</label>
        <input
          type="password"
          className="field-input"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          style={{ marginBottom: 14 }}
          autoComplete="new-password"
        />

        {canChooseRoles ? (
          <>
            <label className="field-label">Perfil de acesso</label>
            <div className="actions-row" style={{ marginBottom: 14 }}>
              {AVAILABLE_ROLES.map((role) => (
                <label key={role} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
                  <input type="checkbox" checked={roles.includes(role)} onChange={() => toggleRole(role)} />
                  {ROLE_LABEL[role]}
                </label>
              ))}
            </div>
          </>
        ) : (
          <p className="field-hint" style={{ marginBottom: 14 }}>Perfil: Técnico de campo</p>
        )}

        {error ? <div className="banner-error">{error}</div> : null}

        <div className="actions-row" style={{ marginTop: 8 }}>
          <button type="button" className="btn btn-outline" onClick={() => navigate('/users')}>
            Cancelar
          </button>
          <button type="submit" className="btn" disabled={saving}>
            {saving ? 'Salvando...' : 'Criar usuário'}
          </button>
        </div>
      </form>
    </div>
  );
}
