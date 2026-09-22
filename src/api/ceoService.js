import { api } from './client';
import { API_PATHS } from './config';
import { unwrapCollection, unwrapPage } from './unwrap';

export async function listCeos(page = 0, size = 20, options = {}) {
  const { data } = await api.get(API_PATHS.ceosPage(page, size, options));
  return unwrapPage(data);
}

export async function searchCeos(query) {
  const { data } = await api.get(API_PATHS.ceoSearch(query));
  return unwrapCollection(data);
}

export async function getCeo(id) {
  const { data } = await api.get(API_PATHS.ceoById(id));
  return data;
}

export async function createCeo(ceo) {
  const { data } = await api.post(API_PATHS.ceos, ceo);
  return data;
}

export async function updateCeo(id, ceo) {
  const { data } = await api.put(API_PATHS.ceoById(id), ceo);
  return data;
}

const EXPORT_MIME_TYPES = {
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  csv: 'text/csv',
};

// <a href> comum não manda o token nem escolhe o formato (Accept), então
// baixamos via axios como blob e disparamos o download manualmente —
// mesmo motivo do AuthenticatedImage para as fotos.
export async function exportCeos({ statuses, sort, format = 'xlsx' } = {}) {
  const mimeType = EXPORT_MIME_TYPES[format] || EXPORT_MIME_TYPES.xlsx;
  const response = await api.get(API_PATHS.ceoExport({ statuses, sort }), {
    headers: { Accept: mimeType },
    responseType: 'blob',
  });

  const url = URL.createObjectURL(response.data);
  const link = document.createElement('a');
  link.href = url;
  link.download = `ceos_exported.${format}`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
