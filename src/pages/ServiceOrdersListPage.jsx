import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { listServiceOrders } from '../api/serviceOrderService';
import { getApiErrorMessage } from '../api/client';
import { formatDateTime } from '../utils/format';

const STATUS_FILTERS = ['ALL', 'OPEN', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];
const STATUS_LABEL = { OPEN: 'Aberta', IN_PROGRESS: 'Em andamento', COMPLETED: 'Concluída', CANCELLED: 'Cancelada' };
const STATUS_BADGE = { OPEN: 'badge-neutral', IN_PROGRESS: 'badge-warning', COMPLETED: 'badge-success', CANCELLED: 'badge-danger' };

export default function ServiceOrdersListPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('OPEN');
  const [ascending, setAscending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setOrders(await listServiceOrders());
    } catch (err) {
      setError(getApiErrorMessage(err, 'Não foi possível carregar as ordens de serviço.'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const visible = useMemo(() => {
    const filtered = filter === 'ALL' ? orders : orders.filter((o) => o.status === filter);
    const copy = [...filtered];
    copy.sort((a, b) => {
      const diff = new Date(a.createdAt) - new Date(b.createdAt);
      return ascending ? diff : -diff;
    });
    return copy;
  }, [orders, filter, ascending]);

  return (
    <div>
      <div className="page-head">
        <div>
          <h1 className="page-title">Ordens de serviço</h1>
          <p className="page-subtitle">Todas as OS do sistema.</p>
        </div>
        <button className="link-button" onClick={() => setAscending((v) => !v)}>
          Ordenar: {ascending ? 'mais antigas' : 'mais recentes'}
        </button>
      </div>

      <div className="actions-row" style={{ marginBottom: 16 }}>
        {STATUS_FILTERS.map((status) => (
          <button
            key={status}
            className={filter === status ? 'btn btn-sm' : 'btn btn-outline btn-sm'}
            onClick={() => setFilter(status)}
          >
            {status === 'ALL' ? 'Todas' : STATUS_LABEL[status]}
          </button>
        ))}
      </div>

      {error ? <div className="banner-error">{error}</div> : null}

      {loading ? (
        <p className="muted">Carregando...</p>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table>
            <thead>
              <tr><th>OS</th><th>CEO</th><th>Técnico</th><th>Status</th><th>Data</th></tr>
            </thead>
            <tbody>
              {visible.map((order) => (
                <tr key={order.serviceOrderId} style={{ cursor: 'pointer' }} onClick={() => navigate(`/service-orders/${order.serviceOrderId}`)}>
                  <td>#{order.serviceOrderId}</td>
                  <td>{order.ceo?.boxNumber || '—'}</td>
                  <td>{order.user?.name || '—'}</td>
                  <td><span className={`badge ${STATUS_BADGE[order.status] || 'badge-neutral'}`}>{STATUS_LABEL[order.status] || order.status}</span></td>
                  <td>{formatDateTime(order.createdAt)}</td>
                </tr>
              ))}
              {!visible.length ? <tr><td colSpan={5} className="muted">Nenhuma ordem encontrada.</td></tr> : null}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
