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
