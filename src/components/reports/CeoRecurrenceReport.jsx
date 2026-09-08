import { useCallback, useEffect, useState } from 'react';
import { getCeoRecurrence } from '../../api/reportService';
import { getApiErrorMessage } from '../../api/client';
import DateRangeFilter from '../DateRangeFilter';
import { defaultDateRange, formatDateTime } from '../../utils/format';

// A partir de quantas OS no período uma CEO é destacada como possível
// problema recorrente (número simples, sem análise do texto da descrição).
const RECURRENCE_THRESHOLD = 3;

export default function CeoRecurrenceReport() {
  const [{ from, to }, setRange] = useState(() => defaultDateRange());
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      setRows(await getCeoRecurrence(from, to));
    } catch (err) {
      setError(getApiErrorMessage(err, 'Não foi possível carregar o relatório.'));
    } finally {
      setLoading(false);
    }
  }, [from, to]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16, marginBottom: 16 }}>
        <p className="muted" style={{ margin: 0 }}>
          CEOs com {RECURRENCE_THRESHOLD} ou mais ordens de serviço no período ficam destacadas — pode indicar manutenção malfeita ou problema recorrente no local.
        </p>
        <DateRangeFilter from={from} to={to} onChangeFrom={(value) => setRange((r) => ({ ...r, from: value }))} onChangeTo={(value) => setRange((r) => ({ ...r, to: value }))} />
      </div>

      {error ? <div className="banner-error">{error}</div> : null}

      {loading ? (
        <p className="muted">Carregando...</p>
      ) : !rows.length ? (
        <p className="muted">Nenhuma ordem de serviço encontrada no período.</p>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table>
            <thead>
              <tr>
                <th>CEO</th>
                <th>Ordens de serviço no período</th>
                <th>Última OS</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const flagged = row.total >= RECURRENCE_THRESHOLD;
                return (
                  <tr key={row.ceoId} style={flagged ? { background: 'var(--color-warning-bg)' } : undefined}>
                    <td>{row.boxNumber}</td>
                    <td style={flagged ? { color: 'var(--color-warning-text)', fontWeight: 700 } : undefined}>
                      {row.total} {flagged ? '⚠' : ''}
                    </td>
                    <td>{formatDateTime(row.lastServiceOrderAt)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
