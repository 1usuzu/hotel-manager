const axios = require('axios');

async function test() {
  try {
    console.log('Testing GET /api/rooms/number/201 ...');
    const res = await axios.get('http://localhost:4000/api/rooms/number/201');
    console.log('Success!');
    console.log('Room ID:', res.data.room_id);
    console.log('Room Number:', res.data.room_number);
  } catch (err) {
    console.error('Error:', err.response ? err.response.data : err.message);
  }
}

test();
