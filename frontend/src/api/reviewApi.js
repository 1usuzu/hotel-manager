import api from './apiClient';

// Lấy tất cả đánh giá
export async function getAllReviews(params = {}) {
  const res = await api.get('/reviews', { params });
  return res.data;
}

// Lấy đánh giá của một phòng
export async function getRoomReviews(roomId) {
  const res = await api.get(`/reviews/room/${roomId}`);
  return res.data;
}

// Tạo đánh giá mới (cần auth)
export async function createReview(data) {
  const res = await api.post('/reviews', data);
  return res.data;
}

// Lấy đánh giá của mình (cần auth)
export async function getMyReviews() {
  const res = await api.get('/reviews/my-reviews');
  return res.data;
}

// Cập nhật đánh giá (cần auth)
export async function updateReview(id, data) {
  const res = await api.put(`/reviews/${id}`, data);
  return res.data;
}

// Xóa đánh giá (cần auth)
export async function deleteReview(id) {
  const res = await api.delete(`/reviews/${id}`);
  return res.data;
}
