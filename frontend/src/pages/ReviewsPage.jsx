import { useState, useEffect } from 'react'
import AOS from 'aos'
import 'aos/dist/aos.css'
import Header from '@/layouts/Header'
import Footer from '@/layouts/Footer'
import { useAuth } from '@/features/auth/AuthProvider'
import { getAllReviews, createReview } from '@/api/reviewApi'

export default function Reviews() {
  const { isAuthenticated } = useAuth()
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [newReview, setNewReview] = useState({ room_id: '', comment: '', rating: 5 })
  const [submitting, setSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')

  // Danh sách phòng đã đặt của user
  const [myBookings, setMyBookings] = useState([])
  const [loadingBookings, setLoadingBookings] = useState(false)

  useEffect(() => {
    document.title = 'Đánh giá | New World Saigon Hotel'
  }, [])

  useEffect(() => {
    AOS.init({ duration: 800, once: true })
  }, [])

  // Load reviews from API
  useEffect(() => {
    async function fetchReviews() {
      try {
        setLoading(true)
        const data = await getAllReviews({ limit: 50 })
        setReviews(data)
      } catch (err) {
        console.error(err)
        setError('Không thể tải đánh giá')
      } finally {
        setLoading(false)
      }
    }

    fetchReviews()
  }, [])

  // Load danh sách phòng đã đặt khi user đăng nhập
  useEffect(() => {
    async function fetchMyBookings() {
      if (!isAuthenticated) {
        setMyBookings([])
        return
      }

      try {
        setLoadingBookings(true)
        const { getMyBookings } = await import('@/api/bookingApi')
        const data = await getMyBookings()

        // Chỉ lấy booking đã confirmed hoặc completed
        const eligibleBookings = data.filter(
          (b) => b.status === 'confirmed' || b.status === 'completed'
        )
        setMyBookings(eligibleBookings)
      } catch (err) {
        console.error(err)
      } finally {
        setLoadingBookings(false)
      }
    }

    fetchMyBookings()
  }, [isAuthenticated])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitMessage('')

    if (!isAuthenticated) {
      setSubmitMessage('Vui lòng đăng nhập để gửi đánh giá')
      return
    }

    if (!newReview.room_id || !newReview.comment) {
      setSubmitMessage('Vui lòng nhập đầy đủ thông tin')
      return
    }

    try {
      setSubmitting(true)
      const result = await createReview({
        room_id: Number(newReview.room_id),
        rating: Number(newReview.rating),
        comment: newReview.comment.trim(),
      })

      // Thêm review mới vào đầu danh sách
      setReviews([result.review, ...reviews])
      setNewReview({ room_id: '', comment: '', rating: 5 })
      setSubmitMessage('Gửi đánh giá thành công!')

      // Reload lại danh sách sau 1s
      setTimeout(async () => {
        const data = await getAllReviews({ limit: 50 })
        setReviews(data)
      }, 1000)
    } catch (err) {
      console.error(err)
      setSubmitMessage(
        err?.response?.data?.error || 'Lỗi khi gửi đánh giá'
      )
    } finally {
      setSubmitting(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('vi-VN')
  }

  const getAvatarUrl = (userId) => {
    // Generate consistent avatar based on user_id
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

  return (
    <div className="relative min-h-screen bg-[url('https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center text-white">
      {/* Overlay sang trọng */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>

      {/* Header giống Home */}
      <Header />

      {/* Hero */}
      <section className="relative z-10 text-center pt-32 pb-20 px-6">
        <h1
          className="text-5xl font-[Playfair_Display] font-bold text-amber-400 drop-shadow-[0_2px_10px_rgba(251,191,36,0.6)]"
          data-aos="fade-down"
        >
          Đánh giá từ khách hàng
        </h1>
        <p
          className="max-w-2xl mx-auto text-gray-300 text-lg mt-4"
          data-aos="fade-up"
        >
          Cảm nhận chân thật từ những vị khách đã trải nghiệm tại{' '}
          <span className="text-amber-400 font-semibold">New World Saigon Hotel</span>.
        </p>
      </section>

      {/* Danh sách đánh giá */}
      <section className="relative z-10 container mx-auto px-6 pb-16">
        {loading ? (
          <div className="text-center text-gray-300">
            <p>Đang tải đánh giá...</p>
          </div>
        ) : error ? (
          <div className="text-center text-red-400">
            <p>{error}</p>
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center text-gray-300">
            <p>Chưa có đánh giá nào. Hãy là người đầu tiên!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reviews.map((r, i) => (
              <div
                key={r.review_id || i}
                className="bg-white/10 backdrop-blur-lg border border-amber-400/20 rounded-2xl p-6 shadow-[0_0_25px_rgba(251,191,36,0.15)] hover:shadow-[0_0_35px_rgba(251,191,36,0.25)] transition-all duration-300"
                data-aos="fade-up"
                data-aos-delay={i * 100}
              >
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={getAvatarUrl(r.user_id)}
                    alt={r.User?.username || 'User'}
                    className="w-12 h-12 rounded-full object-cover border-2 border-amber-400"
                  />
                  <div>
                    <h3 className="text-amber-400 font-semibold">
                      {r.User?.username || 'Khách hàng'}
                    </h3>
                    <p className="text-xs text-gray-400">
                      {formatDate(r.created_at)}
                    </p>
                    {r.Room && (
                      <p className="text-xs text-gray-500">
                        Phòng: {r.Room.name || r.Room.room_number}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex mb-2">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <svg
                      key={index}
                      className={`w-5 h-5 ${
                        index < r.rating ? 'text-amber-400' : 'text-gray-500'
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.97a1 1 0 00.95.69h4.173c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.97c.3.921-.755 1.688-1.54 1.118l-3.38-2.455a1 1 0 00-1.176 0l-3.38 2.455c-.785.57-1.84-.197-1.54-1.118l1.287-3.97a1 1 0 00-.364-1.118L2.06 9.397c-.783-.57-.38-1.81.588-1.81h4.173a1 1 0 00.95-.69l1.286-3.97z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-300 text-sm italic leading-relaxed">
                  {r.comment || 'Không có nhận xét'}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Form gửi đánh giá */}
      <section
        className="relative z-10 bg-gradient-to-r from-amber-500/10 to-yellow-500/10 backdrop-blur-md py-20 border-t border-amber-400/30"
        data-aos="fade-up"
      >
        <div className="container mx-auto px-6 text-center max-w-xl">
          <h2 className="text-3xl font-[Playfair_Display] text-amber-400 mb-6">
            Chia sẻ trải nghiệm của bạn
          </h2>

          {!isAuthenticated && (
            <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
              <p className="text-yellow-300 text-sm">
                Vui lòng đăng nhập để gửi đánh giá
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5 text-left">
            <div>
              <label className="block text-sm mb-1 text-gray-300">
                Chọn phòng đã đặt <span className="text-red-400">*</span>
              </label>
              {loadingBookings ? (
                <div className="w-full p-3 rounded-lg bg-white/10 border border-amber-400/20 text-gray-400 text-sm">
                  Đang tải danh sách phòng...
                </div>
              ) : myBookings.length === 0 ? (
                <div className="w-full p-3 rounded-lg bg-white/10 border border-amber-400/20 text-gray-400 text-sm">
                  Bạn chưa có phòng nào để đánh giá
                </div>
              ) : (
                <select
                  className="w-full p-3 rounded-lg bg-white/10 border border-amber-400/20 focus:border-amber-400 focus:ring-amber-400 text-white outline-none"
                  value={newReview.room_id}
                  onChange={(e) =>
                    setNewReview({ ...newReview, room_id: e.target.value })
                  }
                  disabled={!isAuthenticated || submitting}
                >
                  <option value="" className="text-black">
                    -- Chọn phòng --
                  </option>
                  {myBookings.map((booking) => (
                    <option
                      key={booking.booking_id}
                      value={booking.room_id}
                      className="text-black"
                    >
                      {booking.Room?.name || `Phòng ${booking.Room?.room_number}`} -
                      Booking #{booking.booking_id} ({booking.status === 'confirmed' ? 'Đã xác nhận' : 'Hoàn tất'})
                    </option>
                  ))}
                </select>
              )}
              <p className="text-xs text-gray-400 mt-1">
                Chỉ hiển thị phòng đã đặt và xác nhận
              </p>
            </div>
            <div>
              <label className="block text-sm mb-1 text-gray-300">
                Đánh giá
              </label>
              <select
                className="w-full p-3 rounded-lg bg-white/10 border border-amber-400/20 focus:border-amber-400 focus:ring-amber-400 text-white outline-none"
                value={newReview.rating}
                onChange={(e) =>
                  setNewReview({ ...newReview, rating: parseInt(e.target.value) })
                }
                disabled={!isAuthenticated || submitting}
              >
                {[5, 4, 3, 2, 1].map((n) => (
                  <option key={n} value={n} className="text-black">
                    {n} sao
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1 text-gray-300">
                Nhận xét <span className="text-red-400">*</span>
              </label>
              <textarea
                rows={4}
                className="w-full p-3 rounded-lg bg-white/10 border border-amber-400/20 focus:border-amber-400 focus:ring-amber-400 text-white outline-none"
                placeholder="Chia sẻ cảm nhận của bạn..."
                value={newReview.comment}
                onChange={(e) =>
                  setNewReview({ ...newReview, comment: e.target.value })
                }
                disabled={!isAuthenticated || submitting}
                maxLength={1000}
              />
              <p className="text-xs text-gray-400 mt-1">
                {newReview.comment.length}/1000 ký tự
              </p>
            </div>

            {submitMessage && (
              <div
                className={`p-3 rounded-lg text-sm ${
                  submitMessage.includes('thành công')
                    ? 'bg-green-500/10 border border-green-500/30 text-green-300'
                    : 'bg-red-500/10 border border-red-500/30 text-red-300'
                }`}
              >
                {submitMessage}
              </div>
            )}

            <div className="text-center pt-4">
              <button
                type="submit"
                disabled={!isAuthenticated || submitting}
                className="px-10 py-3 bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-semibold rounded-lg hover:scale-105 hover:shadow-[0_0_25px_rgba(251,191,36,0.6)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {submitting ? 'Đang gửi...' : 'Gửi đánh giá'}
              </button>
            </div>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  )
}
