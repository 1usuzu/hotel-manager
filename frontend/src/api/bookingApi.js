import api from './apiClient'

export async function createBooking({ room_id, check_in, check_out }) {
  const res = await api.post('/bookings', { room_id, check_in, check_out })
  return res.data
}

export async function getMyBookings() {
  const res = await api.get('/bookings/my-bookings')
  return res.data
}

export async function cancelBooking(id) {
  const res = await api.put(`/bookings/${id}/cancel`)
  return res.data
}
