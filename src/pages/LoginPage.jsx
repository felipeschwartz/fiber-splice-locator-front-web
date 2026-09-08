import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getApiErrorMessage } from '../api/client';

export default function LoginPage() {
  const { isAuthenticated, login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (isAuthenticated) return <Navigate to="/welcome" replace />;

  async function handleSubmit(event) {
    event.preventDefault();
    if (!email.trim() || !password) {
      setError('Informe e-mail e senha.');
      return;
    }

    setError('');
    setSubmitting(true);

    try {
      await login(email.trim(), password);
    } catch (err) {
      setError(err.message?.startsWith('Este painel') ? err.message : getApiErrorMessage(err, 'Não foi possível entrar.'));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      style={{
        minHeight: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--color-navy)',
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          background: 'var(--color-surface)',
          borderRadius: 16,
          padding: 32,
          width: 340,
          boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
        }}
      >
        <h1 style={{ fontSize: 20, color: 'var(--color-text-title)', marginBottom: 4 }}>Painel administrativo</h1>
        <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginTop: 0, marginBottom: 24 }}>
          Fiber Splice Locator — acesso restrito a administradores.
        </p>

        <label className="field-label">E-mail</label>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete="username"
          className="field-input"
        />

        <label className="field-label" style={{ marginTop: 14 }}>
          Senha
        </label>
        <div style={{ position: 'relative' }}>
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            className="field-input"
            style={{ paddingRight: 70 }}
          />
          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            className="link-button"
            style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 12 }}
          >
            {showPassword ? 'Ocultar' : 'Mostrar'}
          </button>
        </div>

        <div style={{ textAlign: 'right', marginTop: 10 }}>
          <Link to="/forgot-password" style={{ fontSize: 13, fontWeight: 600 }}>
            Esqueci minha senha
          </Link>
        </div>

        {error ? <div className="banner-error" style={{ marginTop: 16, marginBottom: 0 }}>{error}</div> : null}

        <button type="submit" disabled={submitting} className="btn" style={{ width: '100%', marginTop: 20 }}>
          {submitting ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </div>
  );
}
