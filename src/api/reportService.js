import { api } from './client';
import { API_PATHS } from './config';

export async function getServiceOrdersByTechnician(from, to) {
  const { data } = await api.get(API_PATHS.serviceOrdersByTechnician, { params: { from, to } });
  return data;
}

export async function getCeoRecurrence(from, to) {
  const { data } = await api.get(API_PATHS.ceoRecurrence, { params: { from, to } });
  return data;
}
