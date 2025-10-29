export default function Custom404() {
  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center p-4">
      <div className="luxury-card max-w-md w-full text-center">
        <h1 className="text-2xl font-serif text-white mb-4">
          404 - Không tìm thấy trang
        </h1>
        <p className="text-gray-400 mb-6">
          Trang bạn đang tìm không tồn tại hoặc đã được di chuyển.
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => window.history.back()}
            className="luxury-button-outline"
          >
            Quay lại
          </button>
          <a
            href="/"
            className="luxury-button"
          >
            Về trang chủ
          </a>
        </div>
      </div>
    </div>
  )
}
