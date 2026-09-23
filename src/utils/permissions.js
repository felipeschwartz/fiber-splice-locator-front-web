// Espelha a regra do backend (UserService.ensureCanDisable) só pra decidir
// o que mostrar na tela — a garantia de verdade continua no servidor.
export function canDisableUser(currentUser, target) {
  if (!currentUser || !target) return false;
  if (currentUser.id === target.id) return false;

  const targetRoles = target.roles || [];
  const targetIsPrivileged = targetRoles.includes('SUPER_ADMIN') || targetRoles.includes('ADMIN');
  const actorIsSuperAdmin = (currentUser.roles || []).includes('SUPER_ADMIN');

  return !targetIsPrivileged || actorIsSuperAdmin;
}

export function isSuperAdmin(user) {
  return Boolean(user?.roles?.includes('SUPER_ADMIN'));
}

// Espelha a regra do backend (UserService.ensureCanEdit) só pra decidir
// o que mostrar na tela — a garantia de verdade continua no servidor.
export function canEditUser(currentUser, target) {
  if (!currentUser || !target) return false;
  if (!isSuperAdmin(target)) return true;
  return isSuperAdmin(currentUser);
}
