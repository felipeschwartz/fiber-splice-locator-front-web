import { useState } from 'react';

const CEO_STATUS_OPTIONS = [
  { value: 'STANDARDIZED', label: 'Padronizada' },
  { value: 'DAMAGED', label: 'Danificada' },
  { value: 'UNDER_MAINTENANCE', label: 'Em manutenção' },
  { value: 'CANCELLED', label: 'Cancelada' },
];

const ADDRESS_FIELDS = [
  ['addressType', 'Tipo de endereço'],
  ['street', 'Rua / Avenida'],
  ['streetNumber', 'Número'],
  ['neighborhood', 'Bairro'],
  ['city', 'Cidade'],
  ['referencePoint', 'Ponto de referência'],
];

const EMPTY_ADDRESS = {
  addressType: '', street: '', streetNumber: '', neighborhood: '', city: '', referencePoint: '', geoLocation: '',
};

export default function CeoForm({ initialValues, onSubmit, submitLabel, onCancel, saving, error }) {
  const [boxNumber, setBoxNumber] = useState(initialValues?.boxNumber || '');
  const [notes, setNotes] = useState(initialValues?.notes || '');
  const [status, setStatus] = useState(initialValues?.status || 'STANDARDIZED');
  const [address, setAddress] = useState({ ...EMPTY_ADDRESS, ...(initialValues?.address || {}) });
  const [formError, setFormError] = useState('');

  function setAddressField(key, value) {
    setAddress((current) => ({ ...current, [key]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!boxNumber.trim()) {
      setFormError('Informe o boxNumber da CEO.');
      return;
    }
    setFormError('');
    onSubmit({ boxNumber: boxNumber.trim(), notes: notes.trim(), status, address });
  }

  return (
    <form onSubmit={handleSubmit} className="card" style={{ maxWidth: 560 }}>
      <label className="field-label">BoxNumber</label>
      <input className="field-input" value={boxNumber} onChange={(event) => setBoxNumber(event.target.value)} style={{ marginBottom: 14 }} placeholder="Ex.: CEO-006" />

      <label className="field-label">Descrição</label>
      <textarea className="field-textarea" value={notes} onChange={(event) => setNotes(event.target.value)} style={{ marginBottom: 14 }} />

      <label className="field-label">Status</label>
      <select className="field-select" value={status} onChange={(event) => setStatus(event.target.value)} style={{ marginBottom: 20 }}>
        {CEO_STATUS_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>

      <h3 style={{ fontSize: 15, color: 'var(--color-text-title)', margin: '0 0 12px' }}>Endereço</h3>

      <div className="field-row">
        {ADDRESS_FIELDS.map(([key, label]) => (
          <div className="field" key={key}>
            <label className="field-label">{label}</label>
            <input className="field-input" value={address[key]} onChange={(event) => setAddressField(key, event.target.value)} />
          </div>
        ))}
      </div>

      <label className="field-label">Geolocalização</label>
      <input
        className="field-input"
        value={address.geoLocation}
        onChange={(event) => setAddressField('geoLocation', event.target.value)}
        placeholder="latitude, longitude"
        style={{ marginBottom: 8 }}
      />
      <p className="field-hint" style={{ marginBottom: 14 }}>
        Sem GPS na interface web — cole as coordenadas manualmente se souber (ex.: do Google Maps).
      </p>

      {(formError || error) ? <div className="banner-error">{formError || error}</div> : null}

      <div className="actions-row" style={{ marginTop: 8 }}>
        <button type="button" className="btn btn-outline" onClick={onCancel}>Cancelar</button>
        <button type="submit" className="btn" disabled={saving}>{saving ? 'Salvando...' : submitLabel}</button>
      </div>
    </form>
  );
}
