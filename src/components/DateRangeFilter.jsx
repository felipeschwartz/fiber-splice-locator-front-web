const fieldStyle = {
  border: '1px solid var(--color-border)',
  borderRadius: 8,
  padding: '8px 10px',
  fontSize: 14,
  color: 'var(--color-text-title)',
};

export default function DateRangeFilter({ from, to, onChangeFrom, onChangeTo }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
      <label style={{ fontSize: 13, color: 'var(--color-text-muted)', fontWeight: 600 }}>
        De
        <input
          type="date"
          value={from}
          max={to}
          onChange={(event) => onChangeFrom(event.target.value)}
          style={{ ...fieldStyle, marginLeft: 8 }}
        />
      </label>

      <label style={{ fontSize: 13, color: 'var(--color-text-muted)', fontWeight: 600 }}>
        Até
        <input
          type="date"
          value={to}
          min={from}
          onChange={(event) => onChangeTo(event.target.value)}
          style={{ ...fieldStyle, marginLeft: 8 }}
        />
      </label>
    </div>
  );
}
