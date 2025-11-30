import api from './apiClient'

export async function searchRooms(params) {
  const res = await api.get('/rooms/search', { params })
  return res.data
}

export async function getRoomDetails(id) {
  const res = await api.get(`/rooms/${id}`)
  return res.data
}

export async function getRoomById(id) {
  const res = await api.get(`/rooms/${id}`)
  return res.data
}

export async function addRoomReview(id, { rating, comment }) {
  const res = await api.post(`/rooms/${id}/reviews`, { rating, comment })
  return res.data
}

export async function getRoomByNumber(id) {
  const res = await api.get(`/rooms/number/${id}`)
  return res.data
}

// NEW: lấy danh sách phòng gợi ý cho homepage
export async function getRecommendedRooms() {
  const res = await api.get('/rooms/recommendations')
  return res.data
}
