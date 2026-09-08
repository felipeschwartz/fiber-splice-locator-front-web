import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { listCeos } from '../api/ceoService';
import { getApiErrorMessage } from '../api/client';

const STATUS_LABEL = {
  STANDARDIZED: 'Padronizada',
  DAMAGED: 'Danificada',
  UNDER_MAINTENANCE: 'Em manutenção',
  CANCELLED: 'Cancelada',
};

const STATUS_BADGE = {
  STANDARDIZED: 'badge-success',
  DAMAGED: 'badge-danger',
  UNDER_MAINTENANCE: 'badge-warning',
  CANCELLED: 'badge-neutral',
};

export default function CeosListPage() {
  const [ceos, setCeos] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setCeos(await listCeos());
    } catch (err) {
      setError(getApiErrorMessage(err, 'Não foi possível carregar as CEOs.'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ceos;
    return ceos.filter((c) => c.boxNumber?.toLowerCase().includes(q) || c.notes?.toLowerCase().includes(q));
  }, [ceos, query]);

  return (
    <div>
      <div className="page-head">
        <div>
          <h1 className="page-title">Caixas de Emendas Ópticas</h1>
          <p className="page-subtitle">Cadastro e situação das CEOs.</p>
        </div>
        <div className="actions-row">
          <input className="search-input" placeholder="Buscar por boxNumber ou descrição" value={query} onChange={(event) => setQuery(event.target.value)} />
          <Link to="/ceos/new" className="btn">+ Nova CEO</Link>
        </div>
      </div>

      {error ? <div className="banner-error">{error}</div> : null}

      {loading ? (
        <p className="muted">Carregando...</p>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table>
            <thead>
              <tr>
                <th>BoxNumber</th>
                <th>Descrição</th>
                <th>Cidade</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((ceo) => (
                <tr key={ceo.id}>
                  <td>{ceo.boxNumber}</td>
                  <td>{ceo.notes || '—'}</td>
                  <td>{ceo.address?.city || '—'}</td>
                  <td>
                    <span className={`badge ${STATUS_BADGE[ceo.status] || 'badge-neutral'}`}>
                      {STATUS_LABEL[ceo.status] || ceo.status}
                    </span>
                  </td>
                  <td>
                    <Link to={`/ceos/${ceo.id}`} className="link-button">Ver detalhes</Link>
                  </td>
                </tr>
              ))}
              {!filtered.length ? (
                <tr><td colSpan={5} className="muted">Nenhuma CEO encontrada.</td></tr>
              ) : null}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
