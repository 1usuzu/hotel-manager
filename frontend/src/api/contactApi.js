import api from './apiClient';

// Gửi tin nhắn liên hệ (public - không cần auth)
export async function sendContact(data) {
  const res = await api.post('/contacts', data);
  return res.data;
}

// Admin APIs (cần auth)
export async function getAllContacts(params = {}) {
  const res = await api.get('/contacts', { params });
  return res.data;
}

export async function getContactById(id) {
  const res = await api.get(`/contacts/${id}`);
  return res.data;
}

export async function updateContactStatus(id, status) {
  const res = await api.put(`/contacts/${id}/status`, { status });
  return res.data;
}

export async function deleteContact(id) {
  const res = await api.delete(`/contacts/${id}`);
  return res.data;
}

export async function getContactStats() {
  const res = await api.get('/contacts/stats');
  return res.data;
}
