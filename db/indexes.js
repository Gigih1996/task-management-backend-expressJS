/**
 * MongoDB Index Creation Script
 *
 * This script creates optimized indexes for the task_manage_express database
 * to improve query performance based on common query patterns.
 *
 * Run this script using:
 * node db/indexes.js
 */

const mongoose = require('mongoose');
require('dotenv').config();

const createIndexes = async () => {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const db = mongoose.connection.db;

    // Users Collection Indexes
    console.log('\n📊 Creating indexes for users collection...');
    const usersCollection = db.collection('users');

    await usersCollection.createIndex(
      { email: 1 },
      { unique: true, name: 'idx_users_email_unique' }
    );
    console.log('✅ Created unique index on email');

    await usersCollection.createIndex(
      { role: 1 },
      { name: 'idx_users_role' }
    );
    console.log('✅ Created index on role');

    await usersCollection.createIndex(
      { isActive: 1 },
      { name: 'idx_users_is_active' }
    );
    console.log('✅ Created index on isActive');

    await usersCollection.createIndex(
      { createdAt: -1 },
      { name: 'idx_users_created_at' }
    );
    console.log('✅ Created index on createdAt (descending)');

    // Tasks Collection Indexes
    console.log('\n📊 Creating indexes for tasks collection...');
    const tasksCollection = db.collection('tasks');

    // Single field indexes for filtering
    await tasksCollection.createIndex(
      { status: 1 },
      { name: 'idx_tasks_status' }
    );
    console.log('✅ Created index on status');

    await tasksCollection.createIndex(
      { priority: 1 },
      { name: 'idx_tasks_priority' }
    );
    console.log('✅ Created index on priority');

    await tasksCollection.createIndex(
      { due_date: 1 },
      { name: 'idx_tasks_due_date' }
    );
    console.log('✅ Created index on due_date');

    await tasksCollection.createIndex(
      { createdAt: -1 },
      { name: 'idx_tasks_created_at' }
    );
    console.log('✅ Created index on createdAt (descending)');

    await tasksCollection.createIndex(
      { updatedAt: -1 },
      { name: 'idx_tasks_updated_at' }
    );
    console.log('✅ Created index on updatedAt (descending)');

    // Compound indexes for common query patterns
    await tasksCollection.createIndex(
      { status: 1, priority: 1 },
      { name: 'idx_tasks_status_priority' }
    );
    console.log('✅ Created compound index on status + priority');

    await tasksCollection.createIndex(
      { status: 1, due_date: 1 },
      { name: 'idx_tasks_status_due_date' }
    );
    console.log('✅ Created compound index on status + due_date');

    await tasksCollection.createIndex(
      { priority: 1, due_date: 1 },
      { name: 'idx_tasks_priority_due_date' }
    );
    console.log('✅ Created compound index on priority + due_date');

    // Text index for search functionality
    await tasksCollection.createIndex(
      { title: 'text', description: 'text' },
      {
        name: 'idx_tasks_text_search',
        weights: { title: 10, description: 5 }
      }
    );
    console.log('✅ Created text index on title + description');

    // List all indexes
    console.log('\n📋 Listing all indexes:');
    console.log('\n=== Users Collection ===');
    const userIndexes = await usersCollection.indexes();
    userIndexes.forEach(index => {
      console.log(`- ${index.name}: ${JSON.stringify(index.key)}`);
    });

    console.log('\n=== Tasks Collection ===');
    const taskIndexes = await tasksCollection.indexes();
    taskIndexes.forEach(index => {
      console.log(`- ${index.name}: ${JSON.stringify(index.key)}`);
    });

    console.log('\n✅ All indexes created successfully!');
    console.log('\n📌 Index Summary:');
    console.log(`   Users: ${userIndexes.length} indexes`);
    console.log(`   Tasks: ${taskIndexes.length} indexes`);

  } catch (error) {
    console.error('❌ Error creating indexes:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Connection closed');
    process.exit(0);
  }
};

// Run the script
createIndexes();
