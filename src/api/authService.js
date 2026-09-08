import { api } from './client';
import { API_PATHS } from './config';

export async function login(email, password) {
  const { data } = await api.post(API_PATHS.login, { email, password });
  return data;
}

export async function forgotPassword(email) {
  await api.post(API_PATHS.forgotPassword, { email });
}

export async function resetPassword({ email, token, newPassword }) {
  await api.post(API_PATHS.resetPassword, { email, token, newPassword });
}
