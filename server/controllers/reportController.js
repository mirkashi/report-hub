import Report from '../models/Report.js';
import AppError from '../utils/AppError.js';

// @desc    Create a new report
// @route   POST /api/reports
// @access  Private
export const createReport = async (req, res, next) => {
  try {
    const { type, date, tasks, notes } = req.body;

    // Check if report already exists for this date
    const existingReport = await Report.findOne({
      user: req.user.id,
      type,
      date: new Date(date).setHours(0, 0, 0, 0),
    });

    if (existingReport) {
      return next(new AppError('Report already exists for this date', 400));
    }

    const year = new Date(date).getFullYear();

    const report = await Report.create({
      user: req.user.id,
      type,
      date,
      year,
      tasks,
      notes,
    });

    res.status(201).json({
      success: true,
      report,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all reports
// @route   GET /api/reports
// @access  Private
export const getReports = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      type,
      status,
      date,
      startDate,
      endDate,
      userId,
    } = req.query;

    const query = {};

    // If not admin, only show own reports
    if (req.user.role !== 'admin') {
      query.user = req.user.id;
    } else {
      // Admin should only see submitted/approved/rejected reports, not drafts
      if (!status) {
        query.status = { $ne: 'draft' };
      }
      if (userId) {
        query.user = userId;
      }
    }

    if (type) {
      query.type = type;
    }

    if (status) {
      query.status = status;
    }

    // Handle exact date match
    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      query.date = {
        $gte: startOfDay,
        $lte: endOfDay,
      };
    } else if (startDate || endDate) {
      query.date = {};
      if (startDate) {
        query.date.$gte = new Date(startDate);
      }
      if (endDate) {
        query.date.$lte = new Date(endDate);
      }
    }

    const reports = await Report.find(query)
      .populate('user', 'name email department')
      .populate('reviewedBy', 'name email')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ date: -1 });

    const count = await Report.countDocuments(query);

    res.status(200).json({
      success: true,
      count: reports.length,
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      reports,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single report
// @route   GET /api/reports/:id
// @access  Private
export const getReport = async (req, res, next) => {
  try {
    const report = await Report.findById(req.params.id)
      .populate('user', 'name email department')
      .populate('reviewedBy', 'name email');

    if (!report) {
      return next(new AppError('Report not found', 404));
    }

    // Check if user owns the report or is admin
    if (report.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(new AppError('Not authorized to access this report', 403));
    }

    res.status(200).json({
      success: true,
      report,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update report
// @route   PUT /api/reports/:id
// @access  Private
export const updateReport = async (req, res, next) => {
  try {
    let report = await Report.findById(req.params.id);

    if (!report) {
      return next(new AppError('Report not found', 404));
    }

    // Check if user owns the report
    if (report.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(new AppError('Not authorized to update this report', 403));
    }

    // Don't allow updates to submitted reports unless admin
    if (report.status !== 'draft' && req.user.role !== 'admin') {
      return next(new AppError('Cannot update submitted report', 400));
    }

    const { tasks, notes, status } = req.body;

    if (tasks) report.tasks = tasks;
    if (notes !== undefined) report.notes = notes;
    if (status) report.status = status;

    if (status === 'submitted' && !report.submittedAt) {
      report.submittedAt = Date.now();
    }

    await report.save();

    res.status(200).json({
      success: true,
      report,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete report
// @route   DELETE /api/reports/:id
// @access  Private
export const deleteReport = async (req, res, next) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return next(new AppError('Report not found', 404));
    }

    // Check if user owns the report or is admin
    if (report.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(new AppError('Not authorized to delete this report', 403));
    }

    await report.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Report deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit report
// @route   PUT /api/reports/:id/submit
// @access  Private
export const submitReport = async (req, res, next) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return next(new AppError('Report not found', 404));
    }

    // Check if user owns the report
    if (report.user.toString() !== req.user.id) {
      return next(new AppError('Not authorized to submit this report', 403));
    }

    if (report.status !== 'draft') {
      return next(new AppError('Report has already been submitted', 400));
    }

    report.status = 'submitted';
    report.submittedAt = Date.now();

    await report.save();

    res.status(200).json({
      success: true,
      report,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Review report (approve/reject)
// @route   PUT /api/reports/:id/review
// @access  Private/Admin
export const reviewReport = async (req, res, next) => {
  try {
    const { status, reviewNotes } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return next(new AppError('Invalid review status', 400));
    }

    const report = await Report.findById(req.params.id).populate('user', 'name email');

    if (!report) {
      return next(new AppError('Report not found', 404));
    }

    if (report.status !== 'submitted') {
      return next(new AppError('Only submitted reports can be reviewed', 400));
    }

    report.status = status;
    report.reviewedBy = req.user.id;
    report.reviewedAt = Date.now();
    report.reviewNotes = reviewNotes;

    await report.save();

    // Create notification for the user
    const Notification = (await import('../models/Notification.js')).default;
    await Notification.create({
      user: report.user._id,
      type: status === 'approved' ? 'report_approved' : 'report_rejected',
      title: `Report ${status === 'approved' ? 'Approved' : 'Rejected'}`,
      message: `Your report for ${new Date(report.date).toLocaleDateString()} has been ${status}.${reviewNotes ? ` Feedback: ${reviewNotes}` : ''}`,
      relatedReport: report._id,
    });

    res.status(200).json({
      success: true,
      report,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get report statistics
// @route   GET /api/reports/stats
// @access  Private
export const getReportStats = async (req, res, next) => {
  try {
    const userId = req.user.role === 'admin' ? req.query.userId : req.user.id;

    const query = userId ? { user: userId } : {};

    // Get report status stats
    const statusStats = await Report.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    // Get task stats
    const taskStats = await Report.aggregate([
      { $match: query },
      { $unwind: '$tasks' },
      {
        $group: {
          _id: '$tasks.status',
          count: { $sum: 1 },
        },
      },
    ]);

    // Get recent reports (for weekly overview)
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const weeklyReports = await Report.find({
      ...query,
      date: { $gte: oneWeekAgo }
    }).sort({ date: -1 });

    const totalReports = await Report.countDocuments(query);
    
    // Calculate task counts
    const totalTasks = taskStats.reduce((sum, stat) => sum + stat.count, 0);
    const completedTasks = taskStats.find(s => s._id === 'completed')?.count || 0;
    // Pending includes both 'pending' and 'in-progress' tasks
    const pendingCount = taskStats.find(s => s._id === 'pending')?.count || 0;
    const inProgressCount = taskStats.find(s => s._id === 'in-progress')?.count || 0;
    const pendingTasks = pendingCount + inProgressCount;

    res.status(200).json({
      success: true,
      totalReports,
      statusStats,
      taskStats: {
        total: totalTasks,
        completed: completedTasks,
        pending: pendingTasks
      },
      weeklyReports
    });
  } catch (error) {
    next(error);
  }
};
