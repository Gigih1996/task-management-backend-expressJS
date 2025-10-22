/**
 * Main Database Seeder
 *
 * Seeds all data: 5 users + 40 tasks
 * Run: npm run seed
 */

const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
require('dotenv').config();

// Import models
const User = require('../../src/models/User');
const Task = require('../../src/models/Task');

const seedDatabase = async () => {
  try {
    console.log('╔═══════════════════════════════════════════════════════╗');
    console.log('║                                                       ║');
    console.log('║           🌱 Database Seeding Started                ║');
    console.log('║                                                       ║');
    console.log('╚═══════════════════════════════════════════════════════╝\n');

    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // ========== Seed Users ==========
    console.log('════════════════════════════════════════');
    console.log('           SEEDING USERS');
    console.log('════════════════════════════════════════\n');

    console.log('🗑️  Clearing existing users...');
    await User.deleteMany({});
    console.log('✅ Existing users cleared\n');

    console.log('👥 Creating 5 users...');
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
        isActive: faker.datatype.boolean({ probability: 0.9 }),
      });
    }

    const createdUsers = await User.create(users);

    console.log('✅ Successfully created users:');
    createdUsers.forEach((user, index) => {
      console.log(`   ${index + 1}. ${user.name} (${user.email}) - Role: ${user.role}`);
    });

    // ========== Seed Tasks ==========
    console.log('\n════════════════════════════════════════');
    console.log('           SEEDING TASKS');
    console.log('════════════════════════════════════════\n');

    console.log('🗑️  Clearing existing tasks...');
    await Task.deleteMany({});
    console.log('✅ Existing tasks cleared\n');

    console.log('📋 Creating 40 tasks...');
    const tasks = [];

    const statuses = ['pending', 'in_progress', 'completed'];
    const priorities = ['low', 'medium', 'high'];

    for (let i = 1; i <= 40; i++) {
      tasks.push({
        title: faker.lorem.sentence({ min: 3, max: 8 }),
        description: faker.lorem.paragraph({ min: 2, max: 5 }),
        status: faker.helpers.arrayElement(statuses),
        priority: faker.helpers.arrayElement(priorities),
        due_date: faker.date.between({
          from: new Date(),
          to: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        }),
      });
    }

    const createdTasks = await Task.create(tasks);

    // Count by status
    const statusCounts = statuses.reduce((acc, status) => {
      acc[status] = createdTasks.filter(task => task.status === status).length;
      return acc;
    }, {});

    // Count by priority
    const priorityCounts = priorities.reduce((acc, priority) => {
      acc[priority] = createdTasks.filter(task => task.priority === priority).length;
      return acc;
    }, {});

    console.log('✅ Successfully created 40 tasks\n');

    // ========== Summary ==========
    console.log('\n╔═══════════════════════════════════════════════════════╗');
    console.log('║                                                       ║');
    console.log('║              ✅ SEEDING COMPLETED                     ║');
    console.log('║                                                       ║');
    console.log('╚═══════════════════════════════════════════════════════╝\n');

    console.log('📊 Summary:');
    console.log('─────────────────────────────────────────\n');

    console.log('👥 Users:');
    console.log(`   Total: ${createdUsers.length}`);
    console.log(`   Admin: 1`);
    console.log(`   Regular: 4\n`);

    console.log('📋 Tasks:');
    console.log(`   Total: ${createdTasks.length}\n`);

    console.log('   Status Distribution:');
    console.log(`   - Pending: ${statusCounts.pending}`);
    console.log(`   - In Progress: ${statusCounts.in_progress}`);
    console.log(`   - Completed: ${statusCounts.completed}\n`);

    console.log('   Priority Distribution:');
    console.log(`   - Low: ${priorityCounts.low}`);
    console.log(`   - Medium: ${priorityCounts.medium}`);
    console.log(`   - High: ${priorityCounts.high}\n`);

    console.log('💡 Login Credentials:');
    console.log('   Email: admin@example.com');
    console.log('   Password: password123\n');

  } catch (error) {
    console.error('\n❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Connection closed\n');
    process.exit(0);
  }
};

// Run seeder
seedDatabase();
