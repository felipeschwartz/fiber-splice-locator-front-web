import { useCallback, useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { getServiceOrdersByTechnician } from '../../api/reportService';
import { getApiErrorMessage } from '../../api/client';
import DateRangeFilter from '../DateRangeFilter';
import { defaultDateRange } from '../../utils/format';

export default function TechnicianReport() {
  const [{ from, to }, setRange] = useState(() => defaultDateRange());
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      setRows(await getServiceOrdersByTechnician(from, to));
    } catch (err) {
      setError(getApiErrorMessage(err, 'Não foi possível carregar o relatório.'));
    } finally {
      setLoading(false);
    }
  }, [from, to]);

  useEffect(() => {
    load();
  }, [load]);

  const totalServiceOrders = rows.reduce((sum, row) => sum + Number(row.total), 0);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16, marginBottom: 16 }}>
        <p className="muted" style={{ margin: 0 }}>
          Quantidade de ordens de serviço abertas por cada técnico no período selecionado.
        </p>
        <DateRangeFilter from={from} to={to} onChangeFrom={(value) => setRange((r) => ({ ...r, from: value }))} onChangeTo={(value) => setRange((r) => ({ ...r, to: value }))} />
      </div>

      {error ? <div className="banner-error">{error}</div> : null}

      {loading ? (
        <p className="muted">Carregando...</p>
      ) : !rows.length ? (
        <p className="muted">Nenhuma ordem de serviço encontrada no período.</p>
      ) : (
        <>
          <div className="card">
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={rows} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-soft)" />
                <XAxis dataKey="userName" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="total" name="Ordens de serviço" fill="var(--color-primary)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <table>
              <thead>
                <tr>
                  <th>Técnico</th>
                  <th>Ordens de serviço</th>
                  <th>% do total</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.userId}>
                    <td>{row.userName}</td>
                    <td>{row.total}</td>
                    <td>{totalServiceOrders ? `${((row.total / totalServiceOrders) * 100).toFixed(0)}%` : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
