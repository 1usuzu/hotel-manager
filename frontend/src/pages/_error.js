export default function ErrorPage({ statusCode }) {
  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center p-4">
      <div className="luxury-card max-w-md w-full text-center">
        <h1 className="text-2xl font-serif text-white mb-4">
          {statusCode
            ? `Lỗi ${statusCode}`
            : 'Đã xảy ra lỗi không mong muốn'
          }
        </h1>
        <p className="text-gray-400 mb-6">
          {statusCode === 404
            ? 'Trang bạn đang tìm không tồn tại.'
            : 'Vui lòng thử lại sau hoặc liên hệ hỗ trợ.'
          }
        </p>
        <a
          href="/"
          className="luxury-button inline-block"
        >
          Về trang chủ
        </a>
      </div>
    </div>
  )
}

ErrorPage.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404
  return { statusCode }
}
