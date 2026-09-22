// Em dev, roda no navegador na mesma máquina do backend, por isso o
// fallback aponta pro localhost. Em produção (build do Render), defina
// VITE_API_BASE_URL nas Environment Variables do site apontando pra URL
// pública do backend — o Vite só expõe variáveis prefixadas com VITE_.
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

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
  ceosPage: (page = 0, size = 20, { statuses, sort } = {}) => {
    const params = new URLSearchParams({ page, size });
    (statuses || []).forEach((status) => params.append('status', status));
    if (sort) params.set('sort', sort);
    return `/api/ceo/v1?${params.toString()}`;
  },
  ceoById: (id) => `/api/ceo/v1/id/${encodeURIComponent(id)}`,
  ceoSearch: (query) => `/api/ceo/v1/search?q=${encodeURIComponent(query)}`,
  ceoExport: ({ statuses, sort } = {}) => {
    const params = new URLSearchParams();
    (statuses || []).forEach((status) => params.append('status', status));
    if (sort) params.set('sort', sort);
    const query = params.toString();
    return `/api/ceo/v1/exportPage${query ? `?${query}` : ''}`;
  },

  serviceOrders: '/api/service_orders/v1',
  serviceOrdersByCeo: (ceoId) => `/api/service_orders/v1/ceo/${encodeURIComponent(ceoId)}`,
  openServiceOrder: '/api/service_orders/v1/open',
  serviceOrderById: (id) => `/api/service_orders/v1/id/${encodeURIComponent(id)}`,
  assignTechnician: (id) => `/api/service_orders/v1/${encodeURIComponent(id)}/assign-technician`,
  cancelServiceOrder: (id) => `/api/service_orders/v1/${encodeURIComponent(id)}/cancel`,

  serviceOrderPhotos: (id) => `/api/service_order_photos/v1/service-order/${encodeURIComponent(id)}`,
  serviceOrderStatusDescriptions: (id) =>
    `/api/service_orders_status_descriptions/v1/service-order/${encodeURIComponent(id)}`,
};
