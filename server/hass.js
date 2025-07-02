
import bcrypt from 'bcryptjs';

const hashPassword = async () => {
  const plain = 'admin123';
  const hashed = await bcrypt.hash(plain, 10);
  console.log('Hashed password:', hashed);
};

hashPassword();
