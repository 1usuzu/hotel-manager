import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import AOS from 'aos'
import 'aos/dist/aos.css'
import Header from '@/layouts/Header'
import Footer from '@/layouts/Footer'
import { getRoomDetails } from '@/api/roomApi'
import { getRoomReviews } from '@/api/reviewApi'

export default function RoomDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [room, setRoom] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Reviews state
  const [reviews, setReviews] = useState([])
  const [reviewsLoading, setReviewsLoading] = useState(false)
  const [reviewsError, setReviewsError] = useState('')

  const API_BASE =
    import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api'
  const API_ORIGIN = API_BASE.replace(/\/api$/, '')

  useEffect(() => {
    AOS.init({ duration: 800, once: true })
  }, [])

  useEffect(() => {
    async function fetchRoom() {
      try {
        const data = await getRoomDetails(id)
        const roomData = data.room || data
        setRoom(roomData)
      } catch (e) {
        console.error(e)
        setError('Không tìm thấy phòng')
      } finally {
        setLoading(false)
      }
    }

    fetchRoom()
  }, [id])

  // Load reviews của phòng này
  useEffect(() => {
    async function fetchReviews() {
      if (!id) return

      try {
        setReviewsLoading(true)
        const data = await getRoomReviews(id)
        setReviews(data)
      } catch (e) {
        console.error(e)
        setReviewsError('Không thể tải đánh giá')
      } finally {
        setReviewsLoading(false)
      }
    }

    fetchReviews()
  }, [id])

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('vi-VN')
  }

  const getAvatarUrl = (userId) => {
    const avatars = [
      'https://randomuser.me/api/portraits/men/32.jpg',
      'https://randomuser.me/api/portraits/women/44.jpg',
      'https://randomuser.me/api/portraits/men/67.jpg',
      'https://randomuser.me/api/portraits/women/68.jpg',
      'https://randomuser.me/api/portraits/men/45.jpg',
      'https://randomuser.me/api/portraits/women/50.jpg',
    ]
    return avatars[userId % avatars.length]
  }

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0)
    return (sum / reviews.length).toFixed(1)
  }

  const handleBook = () => {
    if (!room) return
    navigate(`/booking?room=${room.room_id}&amount=${room.price}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050816] text-white flex items-center justify-center">
        <p>Đang tải dữ liệu phòng...</p>
      </div>
    )
  }

  if (error || !room) {
    return (
      <div className="min-h-screen bg-[#050816] text-white flex items-center justify-center">
        <p>{error || 'Không tìm thấy phòng'}</p>
      </div>
    )
  }

  const roomImg = room.image_url
    ? room.image_url.startsWith('http')
      ? room.image_url
      : `${API_ORIGIN}${room.image_url}`
    : room.image && room.image.startsWith('http')
    ? room.image
    : room.image
    ? `${API_ORIGIN}${room.image}`
    : null

  return (
    <div className="min-h-screen bg-[#050816] text-white">
      <Header />
      <main className="pt-24 pb-16 px-4 max-w-6xl mx-auto">
        <section className="grid md:grid-cols-2 gap-10 items-start">
          {/* Cột ảnh */}
          <div data-aos="fade-right" className="space-y-4">
            <div className="overflow-hidden rounded-3xl shadow-[0_0_40px_rgba(251,191,36,0.25)] w-full h-[320px] md:h-[380px] bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
              {roomImg ? (
                <img
                  src={roomImg}
                  alt={room.room_number || `Phòng ${room.room_id}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-slate-800/40 text-slate-300 text-sm">
                  Ảnh phòng đang cập nhật
                </div>
              )}
            </div>
          </div>

          {/* Cột thông tin */}
          <div data-aos="fade-left" className="space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold text-amber-400">
              Phòng {room.room_number || room.room_id}
            </h1>

            <p className="text-gray-300">
              Loại phòng: {room.type || 'Chưa cập nhật'}
            </p>
            <p className="text-gray-300">
              Sức chứa: {room.capacity || '?'} người
            </p>
            <p className="text-gray-300">
              Giá: {Number(room.price).toLocaleString('vi-VN') || 'N/A'} đ / đêm
            </p>
            <p className="text-gray-300">
              Trạng thái{' '}
              <span
                className={
                  room.status === 'available'
                    ? 'text-green-400'
                    : 'text-red-400'
                }
              >
                {room.status === 'available' ? 'Còn phòng' : 'Không khả dụng'}
              </span>
            </p>

            <p className="mt-4 text-gray-200 leading-relaxed">
              {room.description || 'Chưa có mô tả cho phòng này.'}
            </p>

            {room.status === 'available' && (
              <button
                onClick={handleBook}
                className="mt-6 px-10 py-3 bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-semibold rounded-full shadow-[0_0_25px_rgba(251,191,36,0.6)] hover:shadow-[0_0_35px_rgba(251,191,36,0.9)] transition-all duration-300"
              >
                Đặt phòng ngay
              </button>
            )}
          </div>
        </section>

        {/* Phần đánh giá */}
        <section className="mt-16" data-aos="fade-up">
          <div className="border-t border-slate-700 pt-10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-amber-400">
                  Đánh giá từ khách hàng
                </h2>
                {reviews.length > 0 && (
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <svg
                          key={i}
                          className={`w-5 h-5 ${
                            i < Math.round(calculateAverageRating())
                              ? 'text-amber-400'
                              : 'text-gray-600'
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.97a1 1 0 00.95.69h4.173c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.97c.3.921-.755 1.688-1.54 1.118l-3.38-2.455a1 1 0 00-1.176 0l-3.38 2.455c-.785.57-1.84-.197-1.54-1.118l1.287-3.97a1 1 0 00-.364-1.118L2.06 9.397c-.783-.57-.38-1.81.588-1.81h4.173a1 1 0 00.95-.69l1.286-3.97z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-lg font-semibold text-amber-400">
                      {calculateAverageRating()}
                    </span>
                    <span className="text-sm text-gray-400">
                      ({reviews.length} đánh giá)
                    </span>
                  </div>
                )}
              </div>
            </div>

            {reviewsLoading ? (
              <div className="text-center py-8 text-gray-400">
                <p>Đang tải đánh giá...</p>
              </div>
            ) : reviewsError ? (
              <div className="text-center py-8 text-red-400">
                <p>{reviewsError}</p>
              </div>
            ) : reviews.length === 0 ? (
              <div className="text-center py-12 bg-slate-800/30 rounded-2xl border border-slate-700">
                <p className="text-gray-400">
                  Chưa có đánh giá nào cho phòng này.
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Hãy là người đầu tiên đánh giá sau khi trải nghiệm!
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {reviews.map((review) => (
                  <div
                    key={review.review_id}
                    className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-5 hover:border-amber-400/30 transition-all duration-300"
                  >
                    <div className="flex items-start gap-4 mb-3">
                      <img
                        src={getAvatarUrl(review.user_id)}
                        alt={review.User?.username || 'User'}
                        className="w-12 h-12 rounded-full object-cover border-2 border-amber-400"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-white">
                          {review.User?.username || 'Khách hàng'}
                        </h4>
                        <p className="text-xs text-gray-400">
                          {formatDate(review.created_at)}
                        </p>
                        <div className="flex mt-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <svg
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating
                                  ? 'text-amber-400'
                                  : 'text-gray-600'
                              }`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.97a1 1 0 00.95.69h4.173c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.97c.3.921-.755 1.688-1.54 1.118l-3.38-2.455a1 1 0 00-1.176 0l-3.38 2.455c-.785.57-1.84-.197-1.54-1.118l1.287-3.97a1 1 0 00-.364-1.118L2.06 9.397c-.783-.57-.38-1.81.588-1.81h4.173a1 1 0 00.95-.69l1.286-3.97z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {review.comment || 'Không có nhận xét'}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
