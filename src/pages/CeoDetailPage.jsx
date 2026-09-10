import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getCeo } from '../api/ceoService';
import { listServiceOrdersByCeo, openServiceOrder } from '../api/serviceOrderService';
import { listUsers } from '../api/userService';
import { getApiErrorMessage } from '../api/client';
import { formatDateTime } from '../utils/format';

const STATUS_LABEL = {
  OPEN: 'Aberta', IN_PROGRESS: 'Em andamento', COMPLETED: 'Concluída', CANCELLED: 'Cancelada',
};
const CEO_STATUS_LABEL = {
  STANDARDIZED: 'Padronizada', DAMAGED: 'Danificada', UNDER_MAINTENANCE: 'Em manutenção', CANCELLED: 'Cancelada',
};
const CEO_STATUS_BADGE = {
  STANDARDIZED: 'badge-success', DAMAGED: 'badge-danger', UNDER_MAINTENANCE: 'badge-warning', CANCELLED: 'badge-neutral',
};
// Ao abrir uma OS a CEO está passando por um problema, então não faz
// sentido oferecer "Padronizada" como novo status nesse momento.
const OPEN_OS_STATUS_OPTIONS = [
  { value: 'DAMAGED', label: 'Danificada' },
  { value: 'UNDER_MAINTENANCE', label: 'Em manutenção' },
  { value: 'CANCELLED', label: 'Cancelada' },
];

export default function CeoDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [ceo, setCeo] = useState(null);
  const [orders, setOrders] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [ascending, setAscending] = useState(false);

  const [showOpenForm, setShowOpenForm] = useState(false);
  const [technicianId, setTechnicianId] = useState('');
  const [description, setDescription] = useState('');
  const [newCeoStatus, setNewCeoStatus] = useState('');
  const [openError, setOpenError] = useState('');
  const [opening, setOpening] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [ceoData, orderData, users] = await Promise.all([
        getCeo(id),
        listServiceOrdersByCeo(id),
        listUsers(),
      ]);
      setCeo(ceoData);
      setOrders(orderData);
      setTechnicians(users.filter((u) => (u.roles || []).includes('FIELD_TECHNICIAN') && u.active));
    } catch (err) {
      setError(getApiErrorMessage(err, 'Não foi possível carregar a CEO.'));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const sortedOrders = useMemo(() => {
    const copy = [...orders];
    copy.sort((a, b) => {
      const diff = new Date(a.createdAt) - new Date(b.createdAt);
      return ascending ? diff : -diff;
    });
    return copy;
  }, [orders, ascending]);

  async function handleOpenServiceOrder(event) {
    event.preventDefault();
    if (!technicianId) {
      setOpenError('Selecione o técnico responsável.');
      return;
    }
    if (!newCeoStatus) {
      setOpenError('Selecione o novo status da CEO.');
      return;
    }
    if (!description.trim()) {
      setOpenError('Descreva o problema/motivo do chamado.');
      return;
    }

    setOpenError('');
    setOpening(true);

    try {
      await openServiceOrder({ ceoId: id, ceoStatus: newCeoStatus, userId: technicianId, statusDescription: description });
      setShowOpenForm(false);
      setDescription('');
      setTechnicianId('');
      setNewCeoStatus('');
      await load();
    } catch (err) {
      setOpenError(getApiErrorMessage(err, 'Não foi possível abrir a ordem de serviço.'));
    } finally {
      setOpening(false);
    }
  }

  if (loading) return <p className="muted">Carregando...</p>;
  if (error && !ceo) return <div className="banner-error">{error}</div>;

  const address = ceo.address || {};

  return (
    <div>
      <div className="page-head">
        <div>
          <h1 className="page-title">{ceo.boxNumber}</h1>
        </div>
        <div className="actions-row">
          <Link to={`/ceos/${id}/edit`} className="btn btn-outline">Editar</Link>
          <button className="btn" onClick={() => setShowOpenForm((v) => !v)}>+ Abrir OS</button>
        </div>
      </div>

      {error ? <div className="banner-error">{error}</div> : null}

      {showOpenForm ? (
        <form onSubmit={handleOpenServiceOrder} className="card" style={{ marginBottom: 20 }}>
          <h3 style={{ fontSize: 15, margin: '0 0 12px' }}>Abrir nova ordem de serviço</h3>

          <label className="field-label">Técnico responsável</label>
          <select className="field-select" value={technicianId} onChange={(event) => setTechnicianId(event.target.value)} style={{ marginBottom: 14 }} required>
            <option value="">Selecione um técnico</option>
            {technicians.map((tech) => (
              <option key={tech.id} value={tech.id}>{tech.name}</option>
            ))}
          </select>

          <label className="field-label">Novo status da CEO</label>
          <select className="field-select" value={newCeoStatus} onChange={(event) => setNewCeoStatus(event.target.value)} style={{ marginBottom: 14 }} required>
            <option value="">Selecione o novo status</option>
            {OPEN_OS_STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>

          <label className="field-label">Descrição do problema</label>
          <textarea className="field-textarea" value={description} onChange={(event) => setDescription(event.target.value)} style={{ marginBottom: 14 }} required />

          {openError ? <div className="banner-error">{openError}</div> : null}

          <div className="actions-row">
            <button type="button" className="btn btn-outline" onClick={() => setShowOpenForm(false)}>Cancelar</button>
            <button type="submit" className="btn" disabled={opening}>{opening ? 'Abrindo...' : 'Abrir OS'}</button>
          </div>
        </form>
      ) : null}

      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <h3 style={{ fontSize: 15, margin: 0 }}>Informações</h3>
          <span className={`badge ${CEO_STATUS_BADGE[ceo.status] || 'badge-neutral'}`}>
            {CEO_STATUS_LABEL[ceo.status] || ceo.status}
          </span>
        </div>
        <p style={{ margin: '4px 0' }}><strong>Descrição:</strong> {ceo.notes || '—'}</p>
        <p style={{ margin: '4px 0' }}>
          <strong>Endereço:</strong> {[address.street, address.streetNumber, address.neighborhood, address.city].filter(Boolean).join(', ') || '—'}
        </p>
        {address.referencePoint ? (
          <p style={{ margin: '4px 0' }}><strong>Ponto de referência:</strong> {address.referencePoint}</p>
        ) : null}
        {address.geoLocation ? (
          <p style={{ margin: '4px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
            <strong>Geolocalização:</strong> {address.geoLocation}
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address.geoLocation)}`}
              target="_blank"
              rel="noreferrer"
              title="Abrir no Google Maps"
              style={{ lineHeight: 1 }}
            >
              📍
            </a>
          </p>
        ) : null}
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h3 style={{ fontSize: 15, margin: 0 }}>Ordens de serviço</h3>
          <button className="link-button" onClick={() => setAscending((v) => !v)}>
            Ordenar: {ascending ? 'mais antigas' : 'mais recentes'}
          </button>
        </div>

        {!sortedOrders.length ? (
          <p className="muted">Nenhuma ordem de serviço registrada para esta CEO.</p>
        ) : (
          <table>
            <thead>
              <tr><th>OS</th><th>Status</th><th>Técnico</th><th>Data</th></tr>
            </thead>
            <tbody>
              {sortedOrders.map((order) => (
                <tr key={order.serviceOrderId} style={{ cursor: 'pointer' }} onClick={() => navigate(`/service-orders/${order.serviceOrderId}`)}>
                  <td>#{order.serviceOrderId}</td>
                  <td><span className="badge badge-neutral">{STATUS_LABEL[order.status] || order.status}</span></td>
                  <td>{order.user?.name || '—'}</td>
                  <td>{formatDateTime(order.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
