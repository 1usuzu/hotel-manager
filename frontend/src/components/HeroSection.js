import { useState, useEffect } from 'react';
import Image from 'next/image';

const HOTEL_IMAGES = [
  '/images/hotel-facade.jpg',     // Mặt tiền khách sạn
  '/images/luxury-suite.jpg',     // Phòng Suite sang trọng
  '/images/deluxe-room.jpg',      // Phòng Deluxe
  '/images/pool.jpg',             // Hồ bơi
  '/images/restaurant.jpg',        // Nhà hàng
  '/images/spa.jpg'               // Spa
];

export default function HeroSection() {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % HOTEL_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="hero-section">
      {/* Carousel */}
      {HOTEL_IMAGES.map((src, index) => (
        <div
          key={src}
          className={`carousel-slide ${index === currentImage ? 'active' : ''}`}
        >
          <Image
            src={src}
            alt={`Luxury Hotel View ${index + 1}`}
            fill
            priority={index === 0}
            quality={100}
            style={{ objectFit: 'cover' }}
          />
        </div>
      ))}

      {/* Overlay */}
      <div className="hero-overlay" />

      {/* Content */}
      <div className="hero-content">
        <h1 className="hero-title">
          Luxury Experience
        </h1>
        <p className="hero-subtitle">
          Discover unparalleled luxury at 18A Cộng Hòa, Tân Bình, TP. Hồ Chí Minh
        </p>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn btn-primary">
            Đặt Phòng Ngay
          </button>
          <button className="btn btn-outline">
            Xem Thêm
          </button>
        </div>
      </div>

      {/* Carousel Indicators */}
      <div style={{
        position: 'absolute',
        bottom: '2rem',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '0.75rem',
        zIndex: 30
      }}>
        {HOTEL_IMAGES.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImage(index)}
            className={`carousel-indicator ${index === currentImage ? 'active' : ''}`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
}
