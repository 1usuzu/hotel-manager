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
