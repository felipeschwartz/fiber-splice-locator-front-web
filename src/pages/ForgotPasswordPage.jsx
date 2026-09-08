import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { forgotPassword } from '../api/authService';
import { getApiErrorMessage } from '../api/client';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!email.trim()) {
      setError('Informe seu e-mail.');
      return;
    }

    setError('');
    setSubmitting(true);

    try {
      await forgotPassword(email.trim());
      setSent(true);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Não foi possível enviar o código.'));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div style={{ minHeight: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-navy)' }}>
      <div style={{ background: 'var(--color-surface)', borderRadius: 16, padding: 32, width: 360, boxShadow: '0 20px 40px rgba(0,0,0,0.25)' }}>
        <h1 style={{ fontSize: 20, color: 'var(--color-text-title)', marginBottom: 4 }}>Esqueci minha senha</h1>
        <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginTop: 0, marginBottom: 20 }}>
          Informe o e-mail da sua conta. Se ele existir, você vai receber um código de redefinição.
        </p>

        {sent ? (
          <>
            <p style={{ fontSize: 14, color: 'var(--color-text-body)' }}>
              Se <strong>{email.trim()}</strong> estiver cadastrado, um código foi enviado. Confira seu e-mail.
            </p>
            <button className="btn" style={{ width: '100%', marginTop: 8 }} onClick={() => navigate('/reset-password', { state: { email: email.trim() } })}>
              Já tenho o código
            </button>
          </>
        ) : (
          <form onSubmit={handleSubmit}>
            <label className="field-label">E-mail</label>
            <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="field-input" autoComplete="username" />

            {error ? <div className="banner-error" style={{ marginTop: 14, marginBottom: 0 }}>{error}</div> : null}

            <button type="submit" disabled={submitting} className="btn" style={{ width: '100%', marginTop: 18 }}>
              {submitting ? 'Enviando...' : 'Enviar código'}
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
