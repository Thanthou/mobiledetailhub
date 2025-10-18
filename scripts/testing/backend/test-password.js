import bcrypt from 'bcryptjs';

const hash = '$2a$10$EAY3D9OdVXpYgby.ATOmheJwqrlTZ423Yg2a.qLzN1Ku1/oj2/LzS';

// Test common passwords
const passwords = ['admin123', 'admin', 'password', '123456', 'thatsmartsite', 'brandan', 'coleman'];

for (const password of passwords) {
  const isValid = await bcrypt.compare(password, hash);
  console.log(`Password "${password}": ${isValid ? '✅ MATCH' : '❌ No match'}`);
}
