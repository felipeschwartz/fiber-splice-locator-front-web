import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  assignTechnician,
  getServiceOrder,
  listServiceOrderPhotos,
  listServiceOrderStatusDescriptions,
} from '../api/serviceOrderService';
import { listUsers } from '../api/userService';
import { getApiErrorMessage } from '../api/client';
import { formatDateTime } from '../utils/format';
import AuthenticatedImage from '../components/AuthenticatedImage';

const STATUS_LABEL = { OPEN: 'Aberta', IN_PROGRESS: 'Em andamento', COMPLETED: 'Concluída', CANCELLED: 'Cancelada' };

export default function ServiceOrderDetailPage() {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [history, setHistory] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [selectedTechnician, setSelectedTechnician] = useState('');
  const [assignError, setAssignError] = useState('');
  const [assigning, setAssigning] = useState(false);
  const [viewerPhoto, setViewerPhoto] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [orderData, historyData, photoData, users] = await Promise.all([
        getServiceOrder(id),
        listServiceOrderStatusDescriptions(id),
        listServiceOrderPhotos(id),
        listUsers(),
      ]);
      setOrder(orderData);
      setHistory(historyData);
      setPhotos(photoData);
      setTechnicians(users.filter((u) => (u.roles || []).includes('FIELD_TECHNICIAN') && u.active));
      setSelectedTechnician(orderData.user?.id ? String(orderData.user.id) : '');
    } catch (err) {
      setError(getApiErrorMessage(err, 'Não foi possível carregar a ordem de serviço.'));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleAssign(event) {
    event.preventDefault();
    if (!selectedTechnician) {
      setAssignError('Selecione um técnico.');
      return;
    }

    setAssignError('');
    setAssigning(true);

    try {
      const updated = await assignTechnician(id, selectedTechnician);
      setOrder(updated);
    } catch (err) {
      setAssignError(getApiErrorMessage(err, 'Não foi possível encaminhar o atendimento.'));
    } finally {
      setAssigning(false);
    }
  }

  if (loading) return <p className="muted">Carregando...</p>;
  if (error && !order) return <div className="banner-error">{error}</div>;

  const ceo = order.ceo || {};

  return (
    <div>
      <div className="page-head">
        <div>
          <h1 className="page-title">Ordem de serviço #{order.serviceOrderId}</h1>
          <p className="page-subtitle">
            <Link to={`/ceos/${ceo.id}`}>{ceo.boxNumber}</Link> · <span className="badge badge-neutral">{STATUS_LABEL[order.status] || order.status}</span>
          </p>
        </div>
      </div>

      {error ? <div className="banner-error">{error}</div> : null}

      <div className="field-row" style={{ alignItems: 'flex-start' }}>
        <div className="card" style={{ flex: 1, minWidth: 320 }}>
          <h3 style={{ fontSize: 15, margin: '0 0 12px' }}>Informações</h3>
          <p style={{ margin: '4px 0' }}><strong>Descrição da CEO:</strong> {ceo.notes || '—'}</p>
          <p style={{ margin: '4px 0' }}><strong>Técnico atual:</strong> {order.user?.name || '—'}</p>
          <p style={{ margin: '4px 0' }}><strong>Aberta em:</strong> {formatDateTime(order.createdAt)}</p>
          <p style={{ margin: '4px 0' }}><strong>Última atualização:</strong> {formatDateTime(order.updatedAt)}</p>
        </div>

        <form onSubmit={handleAssign} className="card" style={{ flex: 1, minWidth: 280 }}>
          <h3 style={{ fontSize: 15, margin: '0 0 12px' }}>Encaminhar atendimento</h3>
          <label className="field-label">Técnico responsável</label>
          <select className="field-select" value={selectedTechnician} onChange={(event) => setSelectedTechnician(event.target.value)} style={{ marginBottom: 14 }}>
            <option value="">Selecione um técnico</option>
            {technicians.map((tech) => (
              <option key={tech.id} value={tech.id}>{tech.name}</option>
            ))}
          </select>
          {assignError ? <div className="banner-error">{assignError}</div> : null}
          <button type="submit" className="btn" disabled={assigning || String(order.user?.id) === selectedTechnician}>
            {assigning ? 'Encaminhando...' : 'Encaminhar'}
          </button>
        </form>
      </div>

      <div className="card">
        <h3 style={{ fontSize: 15, margin: '0 0 12px' }}>Histórico de atendimentos</h3>
        {!history.length ? (
          <p className="muted">Nenhum registro de atendimento ainda.</p>
        ) : (
          history.map((entry) => (
            <div key={entry.id} style={{ borderBottom: '1px solid var(--color-border-soft)', padding: '10px 0' }}>
              <div className="muted" style={{ textTransform: 'uppercase', fontWeight: 700, fontSize: 11 }}>{formatDateTime(entry.createdAt)}</div>
              <div>{entry.statusDescription}</div>
            </div>
          ))
        )}
      </div>

      <div className="card">
        <h3 style={{ fontSize: 15, margin: '0 0 12px' }}>Fotos anexadas ({photos.length})</h3>
        {!photos.length ? (
          <p className="muted">Nenhuma foto anexada.</p>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {photos.map((photo) => (
              <AuthenticatedImage
                key={photo.id}
                src={photo.contentUrl}
                alt={photo.originalFilename}
                style={{ width: 96, height: 96, objectFit: 'cover', borderRadius: 8, cursor: 'pointer' }}
                onClick={() => setViewerPhoto(photo)}
              />
            ))}
          </div>
        )}
      </div>

      {viewerPhoto ? (
        <div
          onClick={() => setViewerPhoto(null)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'zoom-out', zIndex: 50,
          }}
        >
          <AuthenticatedImage
            src={viewerPhoto.contentUrl}
            alt={viewerPhoto.originalFilename}
            style={{ maxWidth: '85vw', maxHeight: '85vh', borderRadius: 8 }}
          />
        </div>
      ) : null}
    </div>
  );
}
