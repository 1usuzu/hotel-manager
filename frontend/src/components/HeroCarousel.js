import { useState, useEffect } from 'react';
import Image from 'next/image';

const DEFAULTS = [
  '/images/luxury-hotel-1.jpg',
  '/images/luxury-hotel-2.jpg',
  '/images/luxury-hotel-3.jpg'
];

export default function HeroCarousel({ images = DEFAULTS, interval = 5000 }) {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, interval);
    return () => clearInterval(timer);
  }, [images.length, interval]);

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black/50 z-10" />

      {/* Carousel images */}
      {images.map((image, index) => (
        <div
          key={image}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentImage ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Image
            src={image}
            alt={`Luxury Hotel Image ${index + 1}`}
            layout="fill"
            objectFit="cover"
            quality={100}
            priority={index === 0}
          />
        </div>
      ))}

      {/* Hotel name and info overlay */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-white text-center">
        <h1 className="text-6xl font-serif mb-4 tracking-wider animate-fade-in">
          LUXURY HOTEL
        </h1>
        <p className="text-xl font-light mb-8 tracking-wide animate-fade-in-delay">
          18A Cộng Hòa, Tân Bình, TP. Hồ Chí Minh
        </p>
        <button className="px-8 py-3 border-2 border-white hover:bg-white hover:text-black transition-colors duration-300 text-lg animate-fade-in-delay-2">
          Khám Phá Ngay
        </button>
      </div>

      {/* Carousel indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-30">
        {images.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-colors duration-300 ${
              index === currentImage ? 'bg-white' : 'bg-white/50'
            }`}
            onClick={() => setCurrentImage(index)}
          />
        ))}
      </div>
    </div>
  );
}
