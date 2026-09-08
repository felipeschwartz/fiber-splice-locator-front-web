import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CeoForm from '../components/CeoForm';
import { getCeo, updateCeo } from '../api/ceoService';
import { getApiErrorMessage } from '../api/client';

export default function CeoEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [ceo, setCeo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [saveError, setSaveError] = useState('');
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError('');
    try {
      setCeo(await getCeo(id));
    } catch (err) {
      setLoadError(getApiErrorMessage(err, 'Não foi possível carregar a CEO.'));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleSubmit(values) {
    setSaving(true);
    setSaveError('');
    try {
      await updateCeo(id, values);
      navigate(`/ceos/${id}`);
    } catch (err) {
      setSaveError(getApiErrorMessage(err, 'Verifique os dados e tente novamente.'));
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="muted">Carregando...</p>;
  if (loadError) return <div className="banner-error">{loadError}</div>;

  return (
    <div>
      <div className="page-head">
        <div>
          <h1 className="page-title">Editar CEO {ceo.boxNumber}</h1>
        </div>
      </div>
      <CeoForm initialValues={ceo} submitLabel="Salvar alterações" onSubmit={handleSubmit} onCancel={() => navigate(`/ceos/${id}`)} saving={saving} error={saveError} />
    </div>
  );
}
