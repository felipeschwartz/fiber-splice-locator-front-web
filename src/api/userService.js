import { api } from './client';
import { API_PATHS } from './config';
import { unwrapCollection } from './unwrap';

export async function listUsers() {
  const { data } = await api.get(API_PATHS.users);
  return unwrapCollection(data);
}

export async function getUser(id) {
  const { data } = await api.get(API_PATHS.userById(id));
  return data;
}

export async function createUser({ name, email, password, roles, active = true }) {
  const { data } = await api.post(API_PATHS.users, { name, email, password, roles, active });
  return data;
}

// PUT genérico só atualiza nome/e-mail — perfil e situação (ativo/inativo)
// ficam de fora de propósito, protegidos pelos fluxos dedicados (criação
// escolhe o perfil; desativação tem a checagem de hierarquia).
export async function updateUser(id, { name, email }) {
  const { data } = await api.put(API_PATHS.userById(id), { name, email });
  return data;
}

export async function disableUser(id) {
  await api.patch(API_PATHS.disableUser(id));
}
