// App web roda no navegador, na mesma máquina do backend em dev — sem o
// alias especial que o app mobile precisa (10.0.2.2 pro emulador Android).
// Se o backend rodar em outra máquina/porta, troque só esta constante.
export const API_BASE_URL = 'http://localhost:8080';

export const API_PATHS = {
  login: '/api/auth/v1/login',
  forgotPassword: '/api/auth/v1/forgot-password',
  resetPassword: '/api/auth/v1/reset-password',

  serviceOrdersByTechnician: '/api/reports/v1/service-orders-by-technician',
  ceoRecurrence: '/api/reports/v1/ceo-recurrence',

  users: '/api/user/v1',
  userById: (id) => `/api/user/v1/id/${encodeURIComponent(id)}`,
  userSearch: (query) => `/api/user/v1/search?q=${encodeURIComponent(query)}`,
  disableUser: (id) => `/api/user/v1/id/${encodeURIComponent(id)}/disable`,

  ceos: '/api/ceo/v1',
  ceoById: (id) => `/api/ceo/v1/id/${encodeURIComponent(id)}`,

  serviceOrders: '/api/service_orders/v1',
  serviceOrdersByCeo: (ceoId) => `/api/service_orders/v1/ceo/${encodeURIComponent(ceoId)}`,
  openServiceOrder: '/api/service_orders/v1/open',
  serviceOrderById: (id) => `/api/service_orders/v1/id/${encodeURIComponent(id)}`,
  assignTechnician: (id) => `/api/service_orders/v1/${encodeURIComponent(id)}/assign-technician`,

  serviceOrderPhotos: (id) => `/api/service_order_photos/v1/service-order/${encodeURIComponent(id)}`,
  serviceOrderStatusDescriptions: (id) =>
    `/api/service_orders_status_descriptions/v1/service-order/${encodeURIComponent(id)}`,
};
