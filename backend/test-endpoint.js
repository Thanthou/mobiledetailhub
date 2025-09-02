const http = require('http');

const req = http.get('http://localhost:3001/api/service_areas/footer', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('✅ Status:', res.statusCode);
    console.log('✅ Response:', data.substring(0, 300));
  });
});

req.on('error', err => {
  console.log('❌ Error:', err.message);
});
