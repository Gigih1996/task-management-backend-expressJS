const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters'],
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      minlength: [10, 'Description must be at least 10 characters'],
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    status: {
      type: String,
      enum: {
        values: ['pending', 'in_progress', 'completed'],
        message: '{VALUE} is not a valid status',
      },
      default: 'pending',
      index: true,
    },
    priority: {
      type: String,
      enum: {
        values: ['low', 'medium', 'high'],
        message: '{VALUE} is not a valid priority',
      },
      default: 'medium',
      index: true,
    },
    due_date: {
      type: Date,
      required: [true, 'Due date is required'],
      index: true,
    },
  },
  {
    timestamps: true,
    collection: 'tasks',
  }
);

// Indexes for better query performance
taskSchema.index({ title: 'text', description: 'text' });
taskSchema.index({ status: 1, priority: 1 });
taskSchema.index({ due_date: 1 });
taskSchema.index({ createdAt: -1 });

// Static method to get filtered and paginated tasks
taskSchema.statics.getFilteredTasks = async function (filters = {}, options = {}) {
  const {
    status,
    priority,
    search,
    due_date_from,
    due_date_to,
    sort_by = 'createdAt',
    sort_order = 'desc',
    page = 1,
    per_page = 10,
  } = { ...filters, ...options };

  const query = {};

  // Filter by status
  if (status) {
    query.status = status;
  }

  // Filter by priority
  if (priority) {
    query.priority = priority;
  }

  // Search in title and description
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }

  // Filter by due date range
  if (due_date_from || due_date_to) {
    query.due_date = {};
    if (due_date_from) {
      query.due_date.$gte = new Date(due_date_from);
    }
    if (due_date_to) {
      query.due_date.$lte = new Date(due_date_to);
    }
  }

  // Allowed sort fields
  const allowedSortFields = [
    '_id',
    'title',
    'description',
    'status',
    'priority',
    'due_date',
    'createdAt',
    'updatedAt',
  ];

  const sortField = allowedSortFields.includes(sort_by) ? sort_by : 'createdAt';
  const sortDirection = sort_order.toLowerCase() === 'asc' ? 1 : -1;

  // Pagination
  const pageNum = Math.max(1, parseInt(page));
  const perPage = Math.min(Math.max(1, parseInt(per_page)), 100);
  const skip = (pageNum - 1) * perPage;

  // Execute query
  const [data, total] = await Promise.all([
    this.find(query)
      .sort({ [sortField]: sortDirection })
      .skip(skip)
      .limit(perPage)
      .lean(),
    this.countDocuments(query),
  ]);

  const lastPage = Math.ceil(total / perPage);

  return {
    data,
    meta: {
      current_page: pageNum,
      from: skip + 1,
      last_page: lastPage,
      per_page: perPage,
      to: skip + data.length,
      total,
    },
    links: {
      first: pageNum > 1 ? 1 : null,
      last: lastPage,
      prev: pageNum > 1 ? pageNum - 1 : null,
      next: pageNum < lastPage ? pageNum + 1 : null,
    },
  };
};

module.exports = mongoose.model('Task', taskSchema);
