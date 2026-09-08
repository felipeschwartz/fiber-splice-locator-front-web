import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getUser, updateUser } from '../api/userService';
import { getApiErrorMessage } from '../api/client';

const ROLE_LABEL = { GOD_ADMIN: 'God Admin', ADMIN: 'Admin', FIELD_TECHNICIAN: 'Técnico' };

export default function UserEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [original, setOriginal] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getUser(id);
      setOriginal(data);
      setName(data.name || '');
      setEmail(data.email || '');
    } catch (err) {
      setError(getApiErrorMessage(err, 'Não foi possível carregar o usuário.'));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!name.trim() || !email.trim()) {
      setError('Preencha nome e e-mail.');
      return;
    }

    setError('');
    setSaving(true);

    try {
      await updateUser(id, { name: name.trim(), email: email.trim() });
      navigate('/users');
    } catch (err) {
      setError(getApiErrorMessage(err, 'Não foi possível salvar as alterações.'));
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="muted">Carregando...</p>;
  if (error && !original) return <div className="banner-error">{error}</div>;

  return (
    <div>
      <div className="page-head">
        <div>
          <h1 className="page-title">Editar usuário</h1>
          <p className="page-subtitle">Perfil e situação não são editáveis aqui — use a lista de usuários para desativar uma conta.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="card" style={{ maxWidth: 480 }}>
        <label className="field-label">Nome</label>
        <input className="field-input" value={name} onChange={(event) => setName(event.target.value)} style={{ marginBottom: 14 }} />

        <label className="field-label">E-mail</label>
        <input type="email" className="field-input" value={email} onChange={(event) => setEmail(event.target.value)} style={{ marginBottom: 14 }} />

        <div className="field-row" style={{ marginBottom: 14 }}>
          <div className="field">
            <span className="field-label">Perfil</span>
            <div className="actions-row">
              {(original?.roles || []).map((role) => (
                <span key={role} className="badge badge-neutral">{ROLE_LABEL[role] || role}</span>
              ))}
            </div>
          </div>
          <div className="field">
            <span className="field-label">Situação</span>
            <span className={original?.active ? 'badge badge-success' : 'badge badge-danger'}>
              {original?.active ? 'Ativo' : 'Inativo'}
            </span>
          </div>
        </div>

        {error ? <div className="banner-error">{error}</div> : null}

        <div className="actions-row" style={{ marginTop: 8 }}>
          <button type="button" className="btn btn-outline" onClick={() => navigate('/users')}>
            Cancelar
          </button>
          <button type="submit" className="btn" disabled={saving}>
            {saving ? 'Salvando...' : 'Salvar alterações'}
          </button>
        </div>
      </form>
    </div>
  );
}
