import { useState } from 'react';
import TechnicianReport from '../components/reports/TechnicianReport';
import CeoRecurrenceReport from '../components/reports/CeoRecurrenceReport';

const REPORT_TYPES = [
  { value: 'technicians', label: 'Atendimentos por técnico' },
  { value: 'ceo-recurrence', label: 'Reincidência por CEO' },
];

export default function ReportsPage() {
  const [reportType, setReportType] = useState('technicians');

  return (
    <div>
      <div className="page-head">
        <div>
          <h1 className="page-title">Relatórios</h1>
          <p className="page-subtitle">Selecione o indicador que deseja consultar.</p>
        </div>
        <div className="actions-row">
          {REPORT_TYPES.map((type) => (
            <button
              key={type.value}
              className={reportType === type.value ? 'btn btn-sm' : 'btn btn-outline btn-sm'}
              onClick={() => setReportType(type.value)}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {reportType === 'technicians' ? <TechnicianReport /> : <CeoRecurrenceReport />}
    </div>
  );
}
