import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  description: {
    type: String,
    required: [true, 'Task description is required'],
    trim: true,
  },
  duration: {
    type: Number,
    required: [true, 'Task duration is required'],
    min: [0, 'Duration cannot be negative'],
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed'],
    default: 'pending',
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium',
  },
});

const reportSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['daily', 'weekly'],
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    weekNumber: {
      type: Number,
    },
    year: {
      type: Number,
      required: true,
    },
    tasks: [taskSchema],
    notes: {
      type: String,
      trim: true,
      maxlength: [1000, 'Notes cannot exceed 1000 characters'],
    },
    status: {
      type: String,
      enum: ['draft', 'submitted', 'approved', 'rejected'],
      default: 'draft',
    },
    submittedAt: {
      type: Date,
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    reviewedAt: {
      type: Date,
    },
    reviewNotes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
reportSchema.index({ user: 1, date: -1 });
reportSchema.index({ user: 1, type: 1, status: 1 });

// Calculate week number before saving
reportSchema.pre('save', function (next) {
  if (this.type === 'weekly' && this.date) {
    const date = new Date(this.date);
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
    this.weekNumber = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  }
  next();
});

const Report = mongoose.model('Report', reportSchema);

export default Report;
