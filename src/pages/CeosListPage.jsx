import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listCeos, searchCeos } from '../api/ceoService';
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

const STATUS_FILTERS = ['ALL', 'DAMAGED', 'UNDER_MAINTENANCE', 'STANDARDIZED', 'CANCELLED'];

const PAGE_SIZE = 20;

export default function CeosListPage() {
  const [ceos, setCeos] = useState([]);
  const [query, setQuery] = useState('');
  const [activeSearch, setActiveSearch] = useState('');
  const [statusFilters, setStatusFilters] = useState(['DAMAGED']);
  const [sortField, setSortField] = useState('boxNumber');
  const [sortAscending, setSortAscending] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Busca (via /search, sem paginação) e navegação por página (via
  // findAll paginado, com filtro de status e ordenação) são fluxos
  // separados — o mesmo padrão já usado no app mobile para a listagem de CEOs.
  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      if (activeSearch) {
        const results = await searchCeos(activeSearch);
        setCeos(results);
        setTotalPages(1);
        setTotalElements(results.length);
      } else {
        const result = await listCeos(page, PAGE_SIZE, {
          statuses: statusFilters,
          sort: `${sortField},${sortAscending ? 'asc' : 'desc'}`,
        });
        setCeos(result.content);
        setTotalPages(result.totalPages);
        setTotalElements(result.totalElements);
      }
    } catch (err) {
      setError(getApiErrorMessage(err, 'Não foi possível carregar as CEOs.'));
    } finally {
      setLoading(false);
    }
  }, [activeSearch, page, statusFilters, sortField, sortAscending]);

  useEffect(() => {
    load();
  }, [load]);

  function handleSearchSubmit(event) {
    event.preventDefault();
    setPage(0);
    setActiveSearch(query.trim());
  }

  function clearSearch() {
    setQuery('');
    setActiveSearch('');
    setPage(0);
  }

  function toggleStatusFilter(status) {
    setPage(0);
    if (status === 'ALL') {
      setStatusFilters([]);
      return;
    }
    setStatusFilters((current) =>
      current.includes(status) ? current.filter((s) => s !== status) : [...current, status]
    );
  }

  function toggleSort(field) {
    setPage(0);
    if (sortField === field) {
      setSortAscending((value) => !value);
    } else {
      setSortField(field);
      setSortAscending(true);
    }
  }

  function renderSortArrow(field) {
    if (sortField !== field) {
      return (
        <span aria-hidden="true" style={{ marginLeft: 6, fontSize: '0.95em', opacity: 0.35 }}>
          ⇅
        </span>
      );
    }
    return (
      <span aria-hidden="true" style={{ marginLeft: 6, fontSize: '1.3em', fontWeight: 'bold', color: 'var(--color-primary)' }}>
        {sortAscending ? '↑' : '↓'}
      </span>
    );
  }

  return (
    <div>
      <div className="page-head">
        <div>
          <h1 className="page-title">Caixas de Emendas Ópticas</h1>
          <p className="page-subtitle">Cadastro e situação das CEOs.</p>
        </div>
        <div className="actions-row">
          <form onSubmit={handleSearchSubmit} className="actions-row" style={{ margin: 0 }}>
            <input
              className="search-input"
              placeholder="Buscar por ID ou boxNumber"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            <button type="submit" className="btn btn-outline">Buscar</button>
            {activeSearch ? (
              <button type="button" className="btn btn-outline" onClick={clearSearch}>Limpar</button>
            ) : null}
          </form>
          <Link to="/ceos/new" className="btn">+ Nova CEO</Link>
        </div>
      </div>

      {!activeSearch ? (
        <div className="actions-row" style={{ marginBottom: 16, alignItems: 'center', flexWrap: 'wrap' }}>
          {STATUS_FILTERS.map((status) => {
            const active = status === 'ALL' ? statusFilters.length === 0 : statusFilters.includes(status);
            return (
              <button
                key={status}
                type="button"
                className={active ? 'btn btn-sm' : 'btn btn-outline btn-sm'}
                onClick={() => toggleStatusFilter(status)}
              >
                {status === 'ALL' ? 'Todas' : STATUS_LABEL[status]}
              </button>
            );
          })}
        </div>
      ) : null}

      {error ? <div className="banner-error">{error}</div> : null}

      {loading ? (
        <p className="muted">Carregando...</p>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table>
            <thead>
              <tr>
                <th
                  style={activeSearch ? undefined : { cursor: 'pointer', userSelect: 'none' }}
                  onClick={activeSearch ? undefined : () => toggleSort('boxNumber')}
                >
                  BoxNumber{renderSortArrow('boxNumber')}
                </th>
                <th>Descrição</th>
                <th>Cidade</th>
                <th
                  style={activeSearch ? undefined : { cursor: 'pointer', userSelect: 'none' }}
                  onClick={activeSearch ? undefined : () => toggleSort('status')}
                >
                  Status{renderSortArrow('status')}
                </th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {ceos.map((ceo) => (
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
              {!ceos.length ? (
                <tr><td colSpan={5} className="muted">Nenhuma CEO encontrada.</td></tr>
              ) : null}
            </tbody>
          </table>
        </div>
      )}

      {!loading && !activeSearch && totalPages > 1 ? (
        <div className="actions-row" style={{ marginTop: 16, alignItems: 'center' }}>
          <button
            type="button"
            className="btn btn-outline"
            disabled={page <= 0}
            onClick={() => setPage((current) => Math.max(0, current - 1))}
          >
            Anterior
          </button>
          <span className="muted">
            Página {page + 1} de {totalPages} ({totalElements} CEOs)
          </span>
          <button
            type="button"
            className="btn btn-outline"
            disabled={page >= totalPages - 1}
            onClick={() => setPage((current) => Math.min(totalPages - 1, current + 1))}
          >
            Próxima
          </button>
        </div>
      ) : null}
    </div>
  );
}
