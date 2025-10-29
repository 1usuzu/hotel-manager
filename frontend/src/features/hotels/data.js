export const hotels = [
  {
    id: '1',
    name: 'Ocean View Resort',
    location: 'Nha Trang, Vietnam',
    price: 120,
    star: 5,
    rating: 4.9,
    image: '/images/hotels/1.jpg',
    rooms: [
      { id: 'r1', name: 'Deluxe Sea View (VIP)', price: 250, beds: '1 King', size: '45 m²', images: ['/images/rooms/r1-1.jpg', '/images/rooms/r1-2.jpg'], description: 'Phòng VIP hướng biển, ban công lớn.' },
      { id: 'r2', name: 'Executive Room', price: 180, beds: '1 King', size: '38 m²', images: ['/images/rooms/r2-1.jpg'], description: 'Phòng hạng thượng, view biển.' }
    ]
  },
  {
    id: '2',
    name: 'City Center Hotel',
    location: 'Hanoi, Vietnam',
    price: 100,
    star: 4,
    rating: 4.5,
    image: '/images/hotels/2.jpg',
    rooms: [
      { id: 'r3', name: 'Executive Suite', price: 220, beds: '1 King', size: '48 m²', images: ['/images/rooms/r3-1.jpg'], description: 'Suite cao cấp với phòng khách riêng.' },
      { id: 'r4', name: 'Comfort Room', price: 95, beds: '1 Queen', size: '30 m²', images: ['/images/rooms/r4-1.jpg'], description: 'Phòng thoải mái, gần trung tâm.' }
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
