import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../.env') });

import User from '../models/User.js';
import connectDB from '../config/db.js';

const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing users
    await User.deleteMany({});
    console.log('Cleared existing users');

    // ✅ DO NOT hash manually — User model pre-save hook does it automatically
    const defaultAdmin = new User({
      name: 'Admin',
      email: 'admin@akrdevi.college',
      password: 'admin123',
      role: 'admin',
    });

    await defaultAdmin.save();
    console.log('✅ Default admin user created successfully');
    console.log('📧 Email: admin@akrdevi.college');
    console.log('🔐 Password: admin123');
    console.log('⚠️  Please change the password after first login!');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();