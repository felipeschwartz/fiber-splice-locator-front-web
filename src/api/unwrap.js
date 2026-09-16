// GET /api/{user,ceo}/v1 devolvem um CollectionModel do Spring HATEOAS —
// os itens ficam em "_embedded.<chave gerada a partir do nome do DTO>".
// Em vez de apostar no nome exato da chave, pegamos o primeiro array que
// existir ali dentro (mesma estratégia usada no app mobile).
export function unwrapCollection(data) {
  if (Array.isArray(data)) return data;
  if (data?._embedded) {
    const embedded = Object.values(data._embedded).find((value) => Array.isArray(value));
    if (embedded) return embedded;
  }
  return [];
}

// GET paginado (PagedModel do Spring HATEOAS) também traz um bloco "page"
// com os metadados — separado aqui pra quem precisa montar os controles
// de "página X de Y" / próxima / anterior.
export function unwrapPage(data) {
  return {
    content: unwrapCollection(data),
    number: data?.page?.number ?? 0,
    size: data?.page?.size ?? 0,
    totalElements: data?.page?.totalElements ?? 0,
    totalPages: data?.page?.totalPages ?? 0,
  };
}
