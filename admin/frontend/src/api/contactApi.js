import { get, put, del } from './api';

// Lấy tất cả contacts
export async function getAllContacts(params = {}) {
  const queryString = new URLSearchParams(params).toString();
  return await get(`/contacts${queryString ? `?${queryString}` : ''}`, []);
}

// Lấy thống kê contacts
export async function getContactStats() {
  return await get('/contacts/stats', { total: 0, new: 0, read: 0, replied: 0 });
}

// Lấy chi tiết contact
export async function getContactById(id) {
  return await get(`/contacts/${id}`, null);
}

// Cập nhật status contact
export async function updateContactStatus(id, status) {
  return await put(`/contacts/${id}/status`, { status });
}

// Xóa contact
export async function deleteContact(id) {
  return await del(`/contacts/${id}`);
}
