export const hotels = [
  {
    id: '1',
    name: 'Ocean View Resort',
    location: 'Nha Trang, Vietnam',
    price: 120,
    star: 5,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1505691723518-36a0f0a1b0a8?auto=format&fit=crop&w=1400&q=80',
    rooms: [
      { id: 'r1', name: 'Deluxe Sea View (VIP)', price: 250, beds: '1 King', size: '45 m²', images: ['https://images.unsplash.com/photo-1505691723518-36a0f0a1b0a8'], description: 'Phòng VIP hướng biển, ban công lớn.' },
      { id: 'r2', name: 'Executive Room', price: 180, beds: '1 King', size: '38 m²', images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2'], description: 'Phòng hạng thượng, view biển.' },
      { id: 'r6', name: 'Standard Sea', price: 120, beds: '2 Single', size: '28 m²', images: ['https://images.unsplash.com/photo-1542314831-068cd1dbfeeb'], description: 'Phòng tiêu chuẩn thoải mái.' },

      // Additional rooms (auto-generated placeholders)
      { id: 'r11', name: 'Family Sea View', price: 320, beds: '2 Queen', size: '65 m²', images: ['/images/hotel1_img1.svg','/images/hotel1_img2.svg','/images/hotel1_img3.svg'], description: 'Phòng gia đình rộng, ban công nhìn ra biển.' },
      { id: 'r12', name: 'Honeymoon Suite', price: 450, beds: '1 King', size: '55 m²', images: ['/images/hotel1_img4.svg','/images/hotel1_img5.svg','/images/hotel1_img6.svg'], description: 'Suite dành cho cặp đôi, view lãng mạn.' },
      { id: 'r13', name: 'Ocean Panorama', price: 280, beds: '1 King', size: '48 m²', images: ['/images/hotel1_img7.svg','/images/hotel1_img8.svg','/images/hotel1_img9.svg'], description: 'Phòng với tầm nhìn panorama ra đại dương.' },
      { id: 'r14', name: 'Penthouse Loft', price: 600, beds: '2 King', size: '140 m²', images: ['/images/hotel1_img10.svg','/images/hotel1_img11.svg','/images/hotel1_img12.svg'], description: 'Penthouse cao cấp với sân thượng riêng.' },
      { id: 'r15', name: 'Budget Twin', price: 95, beds: '2 Single', size: '26 m²', images: ['/images/hotel1_img2.svg','/images/hotel1_img3.svg','/images/hotel1_img1.svg'], description: 'Phòng giá rẻ cho 2 người, tiện nghi cơ bản.' },
      { id: 'r16', name: 'Club Room', price: 210, beds: '1 King', size: '40 m²', images: ['/images/hotel1_img5.svg','/images/hotel1_img6.svg','/images/hotel1_img7.svg'], description: 'Phòng Club với quyền truy cập lounge.' },
      { id: 'r17', name: 'Accessible Room', price: 130, beds: '1 Queen', size: '36 m²', images: ['/images/hotel1_img8.svg','/images/hotel1_img9.svg','/images/hotel1_img10.svg'], description: 'Phòng tiện nghi cho người khuyết tật.' },
      { id: 'r18', name: 'Studio Suite', price: 260, beds: '1 King', size: '52 m²', images: ['/images/hotel1_img3.svg','/images/hotel1_img4.svg','/images/hotel1_img5.svg'], description: 'Studio tiện nghi với khu vực bếp nhỏ.' },
      { id: 'r19', name: 'Corner Deluxe', price: 230, beds: '1 King', size: '46 m²', images: ['/images/hotel1_img6.svg','/images/hotel1_img7.svg','/images/hotel1_img8.svg'], description: 'Phòng góc rộng rãi, nhiều ánh sáng tự nhiên.' },
      { id: 'r20', name: 'Single Cozy', price: 85, beds: '1 Single', size: '20 m²', images: ['/images/hotel1_img9.svg','/images/hotel1_img10.svg','/images/hotel1_img11.svg'], description: 'Phòng nhỏ gọn cho 1 khách, sạch sẽ và ấm cúng.' }
    ]
  },
  {
    id: '2',
    name: 'City Center Hotel',
    location: 'Hanoi, Vietnam',
    price: 100,
    star: 4,
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1400&q=80',
    rooms: [
      { id: 'r3', name: 'Executive Suite (VIP)', price: 220, beds: '1 King', size: '48 m²', images: ['/images/hotel1_img4.svg','/images/hotel1_img5.svg','https://images.unsplash.com/photo-1505691723518-36a0f0a1b0a8'], description: 'Suite cao cấp với phòng khách riêng.' },
      { id: 'r4', name: 'Comfort Room', price: 95, beds: '1 Queen', size: '30 m²', images: ['/images/hotel1_img6.svg','/images/hotel1_img7.svg','https://images.unsplash.com/photo-1560448204-e02f11c3d0e2'], description: 'Phòng thoải mái, gần trung tâm.' }
    ]
  },
  {
    id: '3',
    name: 'Mountain Lodge',
    location: 'Sapa, Vietnam',
    price: 110,
    star: 4,
    rating: 4.4,
    image: 'https://images.unsplash.com/photo-1501117716987-2b2d9d3c9a1b?auto=format&fit=crop&w=1400&q=80',
    rooms: [
      { id: 'r5', name: 'Mountain View Room', price: 130, beds: '1 Queen', size: '32 m²', images: ['/images/hotel1_img8.svg','https://images.unsplash.com/photo-1501117716987-2b2d9d3c9a1b'], description: 'Phòng có tầm nhìn ra núi.' }
    ]
  },
  {
    id: '4',
    name: 'Luxury Palace',
    location: 'Da Nang, Vietnam',
    price: 300,
    star: 5,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1400&q=80',
    rooms: [
      { id: 'r7', name: 'Royal Suite (5 sao)', price: 520, beds: '2 King', size: '120 m²', images: ['/images/hotel1_img10.svg','/images/hotel1_img11.svg','https://images.unsplash.com/photo-1560448204-e02f11c3d0e2'], description: 'Suite hoàng gia, tiện nghi tối tân.' },
      { id: 'r8', name: 'Premium Deluxe', price: 320, beds: '1 King', size: '50 m²', images: ['/images/hotel1_img12.svg','/images/hotel1_img9.svg','https://images.unsplash.com/photo-1505691723518-36a0f0a1b0a8'], description: 'Deluxe cao cấp với ban công.' }
    ]
  },
  {
    id: '5',
    name: 'Comfort Inn',
    location: 'Hue, Vietnam',
    price: 70,
    star: 3,
    rating: 4.1,
    image: 'https://images.unsplash.com/photo-1501117716987-c8e9d6c4d042?auto=format&fit=crop&w=1400&q=80',
    rooms: [
      { id: 'r9', name: 'Budget Room', price: 60, beds: '1 Queen', size: '22 m²', images: ['/images/hotel1_img1.svg','https://images.unsplash.com/photo-1501117716987-c8e9d6c4d042'], description: 'Phòng tiết kiệm, sạch sẽ.' },
      { id: 'r10', name: 'Family Room', price: 95, beds: '2 Queen', size: '45 m²', images: ['/images/hotel1_img2.svg','https://images.unsplash.com/photo-1542314831-068cd1dbfeeb'], description: 'Phòng cho gia đình.' }
    ]
  }
]

export function findHotelById(id){
  return hotels.find(h=>h.id===String(id))
}

export function findRoomById(roomId){
  for(const h of hotels){
    const r = h.rooms.find(rr=>rr.id===String(roomId))
    if(r) return { room: r, hotel: h }
  }
  return null
}
