/**
 * User Seeder
 *
 * Seeds 5 users to the database
 * Run: npm run seed:users
 */

const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
require('dotenv').config();

// Import User model
const User = require('../../src/models/User');

const seedUsers = async () => {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing users
    console.log('\n🗑️  Clearing existing users...');
    await User.deleteMany({});
    console.log('✅ Existing users cleared');

    // Create 5 users
    console.log('\n👥 Creating 5 users...');
    const users = [];

    // Create 1 admin user
    users.push({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'password123',
      role: 'admin',
      isActive: true,
    });

    // Create 4 regular users
    for (let i = 1; i <= 4; i++) {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();

      users.push({
        name: `${firstName} ${lastName}`,
        email: faker.internet.email({ firstName, lastName }).toLowerCase(),
        password: 'password123',
        role: 'user',
        isActive: faker.datatype.boolean({ probability: 0.9 }), // 90% active
      });
    }

    // Insert users
    const createdUsers = await User.create(users);

    console.log('\n✅ Successfully created users:');
    createdUsers.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name} (${user.email}) - Role: ${user.role}`);
    });

    console.log(`\n📊 Total users created: ${createdUsers.length}`);
    console.log('\n💡 Default password for all users: password123');

  } catch (error) {
    console.error('❌ Error seeding users:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Connection closed');
    process.exit(0);
  }
};

// Run seeder
seedUsers();
