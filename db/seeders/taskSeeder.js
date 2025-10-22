/**
 * Task Seeder
 *
 * Seeds 40 tasks to the database
 * Run: npm run seed:tasks
 */

const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
require('dotenv').config();

// Import Task model
const Task = require('../../src/models/Task');

const seedTasks = async () => {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing tasks
    console.log('\n🗑️  Clearing existing tasks...');
    await Task.deleteMany({});
    console.log('✅ Existing tasks cleared');

    // Create 40 tasks
    console.log('\n📋 Creating 40 tasks...');
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
          to: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Next 30 days
        }),
      });
    }

    // Insert tasks
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

    console.log('\n✅ Successfully created 40 tasks');
    console.log('\n📊 Status Distribution:');
    console.log(`   - Pending: ${statusCounts.pending}`);
    console.log(`   - In Progress: ${statusCounts.in_progress}`);
    console.log(`   - Completed: ${statusCounts.completed}`);

    console.log('\n🎯 Priority Distribution:');
    console.log(`   - Low: ${priorityCounts.low}`);
    console.log(`   - Medium: ${priorityCounts.medium}`);
    console.log(`   - High: ${priorityCounts.high}`);

    console.log(`\n📊 Total tasks created: ${createdTasks.length}`);

  } catch (error) {
    console.error('❌ Error seeding tasks:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Connection closed');
    process.exit(0);
  }
};

// Run seeder
seedTasks();
