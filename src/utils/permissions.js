// Espelha a regra do backend (UserService.ensureCanDisable) só pra decidir
// o que mostrar na tela — a garantia de verdade continua no servidor.
export function canDisableUser(currentUser, target) {
  if (!currentUser || !target) return false;
  if (currentUser.id === target.id) return false;

  const targetRoles = target.roles || [];
  const targetIsPrivileged = targetRoles.includes('GOD_ADMIN') || targetRoles.includes('ADMIN');
  const actorIsGodAdmin = (currentUser.roles || []).includes('GOD_ADMIN');

  return !targetIsPrivileged || actorIsGodAdmin;
}

export function isGodAdmin(user) {
  return Boolean(user?.roles?.includes('GOD_ADMIN'));
}

// Espelha a regra do backend (UserService.ensureCanEdit) só pra decidir
// o que mostrar na tela — a garantia de verdade continua no servidor.
export function canEditUser(currentUser, target) {
  if (!currentUser || !target) return false;
  if (!isGodAdmin(target)) return true;
  return isGodAdmin(currentUser);
}
