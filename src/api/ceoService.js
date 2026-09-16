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
