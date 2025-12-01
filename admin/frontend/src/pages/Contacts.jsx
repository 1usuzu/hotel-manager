import { useState, useEffect } from 'react';
import {
  getAllContacts,
  getContactStats,
  updateContactStatus,
  deleteContact,
} from '../api/contactApi';

export default function Contacts() {
  const [contacts, setContacts] = useState([]);
  const [stats, setStats] = useState({ total: 0, new: 0, read: 0, replied: 0 });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, new, read, replied
  const [selectedContact, setSelectedContact] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadData();
  }, [filter]);

  async function loadData() {
    setLoading(true);
    try {
      const params = filter !== 'all' ? { status: filter } : {};
      const [contactsData, statsData] = await Promise.all([
        getAllContacts(params),
        getContactStats(),
      ]);

      setContacts(contactsData.contacts || contactsData || []);
      setStats(statsData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(id, newStatus) {
    try {
      await updateContactStatus(id, newStatus);
      loadData();
    } catch (err) {
      console.error(err);
      alert('Lỗi khi cập nhật trạng thái');
    }
  }

  async function handleDelete(id) {
    if (!confirm('Bạn có chắc muốn xóa tin nhắn này?')) return;

    try {
      await deleteContact(id);
      loadData();
      setShowModal(false);
    } catch (err) {
      console.error(err);
      alert('Lỗi khi xóa tin nhắn');
    }
  }

  function openModal(contact) {
    setSelectedContact(contact);
    setShowModal(true);

    // Tự động đánh dấu đã đọc
    if (contact.status === 'new') {
      handleStatusChange(contact.contact_id, 'read');
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN');
  };

  const getStatusBadge = (status) => {
    const badges = {
      new: 'bg-blue-100 text-blue-800',
      read: 'bg-yellow-100 text-yellow-800',
      replied: 'bg-green-100 text-green-800',
    };
    const labels = {
      new: 'Mới',
      read: 'Đã đọc',
      replied: 'Đã trả lời',
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${badges[status]}`}>
        {labels[status]}
      </span>
    );
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý Liên hệ</h1>
        <p className="text-gray-600 mt-1">Xem và quản lý tin nhắn từ khách hàng</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-600">Tổng số</div>
          <div className="text-2xl font-bold text-gray-800">{stats.total}</div>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg shadow">
          <div className="text-sm text-blue-600">Tin mới</div>
          <div className="text-2xl font-bold text-blue-800">{stats.new}</div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg shadow">
          <div className="text-sm text-yellow-600">Đã đọc</div>
          <div className="text-2xl font-bold text-yellow-800">{stats.read}</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg shadow">
          <div className="text-sm text-green-600">Đã trả lời</div>
          <div className="text-2xl font-bold text-green-800">{stats.replied}</div>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded ${
              filter === 'all'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Tất cả
          </button>
          <button
            onClick={() => setFilter('new')}
            className={`px-4 py-2 rounded ${
              filter === 'new'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Mới ({stats.new})
          </button>
          <button
            onClick={() => setFilter('read')}
            className={`px-4 py-2 rounded ${
              filter === 'read'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Đã đọc ({stats.read})
          </button>
          <button
            onClick={() => setFilter('replied')}
            className={`px-4 py-2 rounded ${
              filter === 'replied'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Đã trả lời ({stats.replied})
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Đang tải...</div>
        ) : contacts.length === 0 ? (
          <div className="p-8 text-center text-gray-500">Không có tin nhắn nào</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Tên
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Nội dung
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Ngày gửi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {contacts.map((contact) => (
                <tr
                  key={contact.contact_id}
                  className={`hover:bg-gray-50 cursor-pointer ${
                    contact.status === 'new' ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => openModal(contact)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {contact.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{contact.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 truncate max-w-xs">
                      {contact.message}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(contact.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(contact.created_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openModal(contact);
                      }}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      Xem
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {showModal && selectedContact && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold text-gray-800">Chi tiết tin nhắn</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Tên:</label>
                  <div className="text-gray-900">{selectedContact.name}</div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">Email:</label>
                  <div className="text-gray-900">
                    <a
                      href={`mailto:${selectedContact.email}`}
                      className="text-blue-600 hover:underline"
                    >
                      {selectedContact.email}
                    </a>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">Nội dung:</label>
                  <div className="text-gray-900 whitespace-pre-wrap bg-gray-50 p-4 rounded">
                    {selectedContact.message}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">Trạng thái:</label>
                  <div className="mt-1">{getStatusBadge(selectedContact.status)}</div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">Ngày gửi:</label>
                  <div className="text-gray-900">{formatDate(selectedContact.created_at)}</div>
                </div>

                <div className="pt-4 border-t">
                  <label className="text-sm font-medium text-gray-600 block mb-2">
                    Cập nhật trạng thái:
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        handleStatusChange(selectedContact.contact_id, 'read')
                      }
                      className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                    >
                      Đánh dấu đã đọc
                    </button>
                    <button
                      onClick={() =>
                        handleStatusChange(selectedContact.contact_id, 'replied')
                      }
                      className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      Đánh dấu đã trả lời
                    </button>
                    <button
                      onClick={() => handleDelete(selectedContact.contact_id)}
                      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 ml-auto"
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
