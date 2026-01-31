import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Report from './models/Report.js';
import Announcement from './models/Announcement.js';

// Load environment variables
dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing data
    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Report.deleteMany({});
    await Announcement.deleteMany({});

    // Create admin user
    console.log('Creating admin user...');
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin',
      department: 'Management',
      position: 'System Administrator',
      isActive: true,
    });

    // Create employee users
    console.log('Creating employee users...');
    const employee1 = await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      role: 'employee',
      department: 'Engineering',
      position: 'Software Developer',
      isActive: true,
    });

    const employee2 = await User.create({
      name: 'Jane Smith',
      email: 'jane@example.com',
      password: 'password123',
      role: 'employee',
      department: 'Marketing',
      position: 'Marketing Specialist',
      isActive: true,
    });

    // Create sample announcements
    console.log('Creating announcements...');
    await Announcement.create({
      title: 'Welcome to Report Hub',
      content: 'Welcome to our new reporting system. Please submit your daily and weekly reports on time.',
      type: 'general',
      priority: 'medium',
      author: admin._id,
      isPublished: true,
      publishedAt: new Date(),
      targetAudience: ['all'],
    });

    await Announcement.create({
      title: 'Urgent: System Maintenance',
      content: 'The system will undergo maintenance this weekend. Please save your work.',
      type: 'urgent',
      priority: 'high',
      author: admin._id,
      isPublished: true,
      publishedAt: new Date(),
      targetAudience: ['all'],
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });

    // Create sample reports
    console.log('Creating sample reports...');
    await Report.create({
      user: employee1._id,
      type: 'daily',
      date: new Date(),
      year: new Date().getFullYear(),
      tasks: [
        {
          description: 'Implemented user authentication module',
          duration: 4,
          status: 'completed',
          priority: 'high',
        },
        {
          description: 'Code review for backend API',
          duration: 2,
          status: 'completed',
          priority: 'medium',
        },
      ],
      notes: 'Productive day. Authentication module is complete.',
      status: 'submitted',
      submittedAt: new Date(),
    });

    await Report.create({
      user: employee2._id,
      type: 'daily',
      date: new Date(),
      year: new Date().getFullYear(),
      tasks: [
        {
          description: 'Created social media campaign',
          duration: 3,
          status: 'completed',
          priority: 'high',
        },
        {
          description: 'Analyzed market trends',
          duration: 2,
          status: 'completed',
          priority: 'medium',
        },
      ],
      notes: 'Campaign ready for review.',
      status: 'draft',
    });

    console.log('\n✅ Database seeded successfully!\n');
    console.log('Login Credentials:');
    console.log('==================');
    console.log('Admin:');
    console.log('  Email: admin@example.com');
    console.log('  Password: admin123\n');
    console.log('Employee 1:');
    console.log('  Email: john@example.com');
    console.log('  Password: password123\n');
    console.log('Employee 2:');
    console.log('  Email: jane@example.com');
    console.log('  Password: password123\n');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
