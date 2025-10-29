import Image from 'next/image';

const ROOMS = [
  {
    id: 'presidential-suite',
    name: 'Presidential Suite',
    description: 'Phòng suite rộng rãi với view panorama tuyệt đẹp của thành phố',
    price: 5000000,
    size: '120m²',
    capacity: '4 khách',
    amenities: [
      'Phòng khách riêng',
      'Bồn tắm Jacuzzi',
      'Minibar cao cấp',
      'Dịch vụ quản gia',
      'Phòng họp riêng'
    ],
    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304'
  },
  {
    id: 'executive-suite',
    name: 'Executive Suite',
    description: 'Suite sang trọng với không gian làm việc riêng biệt',
    price: 3500000,
    size: '80m²',
    capacity: '3 khách',
    amenities: [
      'Phòng làm việc',
      'Bồn tắm đứng',
      'Minibar',
      'Lounge riêng',
      'Dịch vụ giặt ủi'
    ],
    image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39'
  },
  {
    id: 'deluxe-room',
    name: 'Deluxe Room',
    description: 'Phòng deluxe với thiết kế hiện đại và tiện nghi đầy đủ',
    price: 2500000,
    size: '45m²',
    capacity: '2 khách',
    amenities: [
      'Giường King',
      'Bồn tắm',
      'TV 55 inch',
      'Minibar',
      'Wifi tốc độ cao'
    ],
    image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32'
  },
  {
    id: 'superior-room',
    name: 'Superior Room',
    description: 'Phòng tiêu chuẩn với đầy đủ tiện nghi cơ bản',
    price: 1800000,
    size: '35m²',
    capacity: '2 khách',
    amenities: [
      'Giường Queen',
      'Vòi sen',
      'TV 43 inch',
      'Wifi',
      'Máy pha cà phê'
    ],
    image: 'https://images.unsplash.com/photo-1595576508898-0ad5c879a061'
  }
];

function formatPrice(price) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price);
}

export default function RoomSection() {
  return (
    <section className="bg-gray-50 py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-playfair font-bold text-gray-900 mb-4">
            Phòng & Suite
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Khám phá không gian nghỉ dưỡng sang trọng với nhiều lựa chọn đa dạng
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {ROOMS.map((room) => (
            <div
              key={room.id}
              className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl
                transition-shadow duration-300"
            >
              <div className="relative h-64">
                <img
                  src={room.image}
                  alt={room.name}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>

              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-2xl font-playfair font-bold text-gray-900">
                      {room.name}
                    </h3>
                    <p className="text-gray-600 mt-1">
                      {room.size} • {room.capacity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">
                      {formatPrice(room.price)}
                    </p>
                    <p className="text-gray-500 text-sm">mỗi đêm</p>
                  </div>
                </div>

                <p className="text-gray-600 mb-4">
                  {room.description}
                </p>

                <div className="border-t border-gray-200 pt-4 mb-6">
                  <div className="grid grid-cols-2 gap-2">
                    {room.amenities.map((amenity) => (
                      <div key={amenity} className="flex items-center text-gray-600">
                        <svg className="w-4 h-4 text-primary mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                        </svg>
                        {amenity}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4">
                  <button className="flex-1 bg-primary hover:bg-primary-dark text-white py-2 px-4 rounded
                    transition-colors duration-300">
                    Đặt Ngay
                  </button>
                  <button className="flex-1 border border-primary text-primary hover:bg-primary hover:text-white
                    py-2 px-4 rounded transition-colors duration-300">
                    Chi Tiết
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
