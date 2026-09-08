import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { resetPassword } from '../api/authService';
import { getApiErrorMessage } from '../api/client';

const MIN_PASSWORD_LENGTH = 6;

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState(location.state?.email || '');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    if (!email.trim() || !token.trim() || !newPassword || !confirmPassword) {
      setError('Preencha o e-mail, o código e a nova senha.');
      return;
    }
    if (newPassword.length < MIN_PASSWORD_LENGTH) {
      setError(`A nova senha deve ter pelo menos ${MIN_PASSWORD_LENGTH} caracteres.`);
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('A nova senha e a confirmação precisam ser iguais.');
      return;
    }

    setError('');
    setSubmitting(true);

    try {
      await resetPassword({ email: email.trim(), token: token.trim(), newPassword });
      setSuccess(true);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Código inválido ou expirado. Solicite um novo.'));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div style={{ minHeight: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-navy)' }}>
      <div style={{ background: 'var(--color-surface)', borderRadius: 16, padding: 32, width: 380, boxShadow: '0 20px 40px rgba(0,0,0,0.25)' }}>
        <h1 style={{ fontSize: 20, color: 'var(--color-text-title)', marginBottom: 4 }}>Redefinir senha</h1>

        {success ? (
          <>
            <p style={{ fontSize: 14, color: 'var(--color-text-body)', marginTop: 16 }}>
              Sua senha foi atualizada. Faça login com a nova senha.
            </p>
            <button className="btn" style={{ width: '100%', marginTop: 8 }} onClick={() => navigate('/login')}>
              Ir para o login
            </button>
          </>
        ) : (
          <form onSubmit={handleSubmit}>
            <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginTop: 0, marginBottom: 20 }}>
              Cole o código recebido por e-mail e defina sua nova senha.
            </p>

            <label className="field-label">E-mail</label>
            <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="field-input" style={{ marginBottom: 14 }} autoComplete="username" />

            <label className="field-label">Código recebido por e-mail</label>
            <input
              value={token}
              onChange={(event) => setToken(event.target.value)}
              className="field-input"
              style={{ marginBottom: 14, textTransform: 'uppercase' }}
              placeholder="Ex.: A2B7K9QX"
            />

            <label className="field-label">Nova senha</label>
            <input
              type="password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              className="field-input"
              style={{ marginBottom: 14 }}
              placeholder={`Mínimo de ${MIN_PASSWORD_LENGTH} caracteres`}
              autoComplete="new-password"
            />

            <label className="field-label">Confirmar nova senha</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className="field-input"
              autoComplete="new-password"
            />

            {error ? <div className="banner-error" style={{ marginTop: 14, marginBottom: 0 }}>{error}</div> : null}

            <button type="submit" disabled={submitting} className="btn" style={{ width: '100%', marginTop: 18 }}>
              {submitting ? 'Salvando...' : 'Redefinir senha'}
            </button>
          </form>
        )}

        <button className="link-button" style={{ marginTop: 16 }} onClick={() => navigate('/login')}>
          ‹ Voltar ao login
        </button>
      </div>
    </div>
  );
}
