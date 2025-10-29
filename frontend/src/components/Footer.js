export default function Footer(){
  return (
    <footer className="bg-white border-t mt-12">
      <div className="container py-8 flex flex-col md:flex-row items-center justify-between">
        <div className="text-sm text-gray-600">© {new Date().getFullYear()} HotelMate. All rights reserved.</div>
        <div className="mt-3 md:mt-0 flex gap-4">
          <a className="text-sm text-sky-600">Privacy</a>
          <a className="text-sm text-sky-600">Terms</a>
        </div>
      </div>
    </footer>
  )
}
