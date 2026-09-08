export function toDateInputValue(date) {
  return date.toISOString().slice(0, 10);
}

export function defaultDateRange(days = 30) {
  const to = new Date();
  const from = new Date();
  from.setDate(from.getDate() - days);
  return { from: toDateInputValue(from), to: toDateInputValue(to) };
}

// A API devolve datas ISO local (ex.: "2026-08-31T14:23:00").
export function formatDateTime(value) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);

  const pad = (n) => String(n).padStart(2, '0');
  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}
