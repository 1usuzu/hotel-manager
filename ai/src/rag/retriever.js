// placeholder retriever – team tự thay bằng pgvector truy vấn top-k
export async function retrieveTopK(query, k = 5) {
  // TODO: embed(query) -> SELECT ... ORDER BY cosine_distance LIMIT k
  return [{ id: 'kb-1', text: 'Sample passage', score: 0.12 }];
}
