import Image from 'next/image';

const ROOMS = [
  {
    id: 1,
    name: 'Presidential Suite',
    description: 'Phòng Suite sang trọng bậc nhất với tầm nhìn panorama',
    price: '5,000,000',
    image: '/images/presidential-suite.jpg',
    amenities: ['King Size Bed', 'Jacuzzi', 'Mini Bar', 'City View', '80m²']
  },
  {
    id: 2,
    name: 'Deluxe Suite',
    description: 'Không gian rộng rãi với thiết kế hiện đại',
    price: '3,500,000',
    image: '/images/deluxe-suite.jpg',
    amenities: ['Queen Size Bed', 'Bathtub', 'Mini Bar', 'City View', '60m²']
  },
  {
    id: 3,
    name: 'Executive Room',
    description: 'Phòng cao cấp dành cho doanh nhân',
    price: '2,800,000',
    image: '/images/executive-room.jpg',
    amenities: ['Queen Size Bed', 'Work Desk', 'City View', '45m²']
  },
  {
    id: 4,
    name: 'Deluxe Room',
    description: 'Phòng tiêu chuẩn với đầy đủ tiện nghi',
    price: '2,200,000',
    image: '/images/deluxe-room.jpg',
    amenities: ['Double Bed', 'City View', '35m²']
  }
];

export default function RoomSection() {
  return (
    <section className="room-section">
      <div className="section-content">
        <h2 className="section-title">Phòng & Suite</h2>
        <p className="section-subtitle">
          Khám phá không gian sống đẳng cấp tại 18A Cộng Hòa
        </p>

        <div className="room-grid">
          {ROOMS.map((room) => (
            <div key={room.id} className="room-card">
              <div className="room-image">
                <Image
                  src={room.image}
                  alt={room.name}
                  width={400}
                  height={300}
                  className="room-img"
                />
              </div>
              <div className="room-info">
                <h3 className="room-name">{room.name}</h3>
                <p className="room-description">{room.description}</p>
                <div className="room-amenities">
                  {room.amenities.map((amenity, index) => (
                    <span key={index} className="amenity">{amenity}</span>
                  ))}
                </div>
                <div className="room-price">
                  <span className="price">₫{room.price}</span>
                  <span className="per-night">/ đêm</span>
                </div>
                <button className="btn btn-primary">Đặt Ngay</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
