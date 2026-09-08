import { api } from './client';
import { API_PATHS } from './config';

export async function listServiceOrders() {
  const { data } = await api.get(API_PATHS.serviceOrders);
  return Array.isArray(data) ? data : [];
}

export async function listServiceOrdersByCeo(ceoId) {
  const { data } = await api.get(API_PATHS.serviceOrdersByCeo(ceoId));
  return Array.isArray(data) ? data : [];
}

export async function getServiceOrder(id) {
  const { data } = await api.get(API_PATHS.serviceOrderById(id));
  return data;
}

export async function openServiceOrder({ ceoId, ceoStatus, userId, statusDescription }) {
  const payload = {
    ceo: { id: Number(ceoId) },
    ceoStatus,
    status: 'OPEN',
    user: { id: Number(userId) },
    serviceOrderStatusDescriptions: statusDescription.trim() ? [{ statusDescription: statusDescription.trim() }] : [],
  };
  const { data } = await api.post(API_PATHS.openServiceOrder, payload);
  return data;
}

export async function assignTechnician(serviceOrderId, userId) {
  const { data } = await api.patch(API_PATHS.assignTechnician(serviceOrderId), { userId: Number(userId) });
  return data;
}

export async function listServiceOrderStatusDescriptions(serviceOrderId) {
  const { data } = await api.get(API_PATHS.serviceOrderStatusDescriptions(serviceOrderId));
  return Array.isArray(data) ? data : [];
}

export async function listServiceOrderPhotos(serviceOrderId) {
  const { data } = await api.get(API_PATHS.serviceOrderPhotos(serviceOrderId));
  return Array.isArray(data) ? data : [];
}
