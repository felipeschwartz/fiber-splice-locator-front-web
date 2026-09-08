import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CeoForm from '../components/CeoForm';
import { createCeo } from '../api/ceoService';
import { getApiErrorMessage } from '../api/client';

export default function CeoCreatePage() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleSubmit(values) {
    setSaving(true);
    setError('');
    try {
      const created = await createCeo(values);
      navigate(`/ceos/${created.id}`);
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
          <h1 className="page-title">Nova CEO</h1>
          <p className="page-subtitle">Cadastre uma nova caixa de emendas ópticas.</p>
        </div>
      </div>
      <CeoForm submitLabel="Cadastrar CEO" onSubmit={handleSubmit} onCancel={() => navigate('/ceos')} saving={saving} error={error} />
    </div>
  );
}
