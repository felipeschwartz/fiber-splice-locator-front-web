import { api } from './client';
import { API_PATHS } from './config';
import { unwrapCollection } from './unwrap';

export async function listCeos() {
  const { data } = await api.get(API_PATHS.ceos);
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
