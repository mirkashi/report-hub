import Notification from '../models/Notification.js';
import AppError from '../utils/AppError.js';

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
export const getNotifications = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, unreadOnly = false } = req.query;

    const query = { user: req.user.id };
    
    if (unreadOnly === 'true') {
      query.isRead = false;
    }

    const notifications = await Notification.find(query)
      .populate('relatedReport', 'date type status')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await Notification.countDocuments(query);
    const unreadCount = await Notification.countDocuments({ user: req.user.id, isRead: false });

    res.status(200).json({
      success: true,
      count: notifications.length,
      total: count,
      unreadCount,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      notifications,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
export const markAsRead = async (req, res, next) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return next(new AppError('Notification not found', 404));
    }

    if (notification.user.toString() !== req.user.id) {
      return next(new AppError('Not authorized to update this notification', 403));
    }

    notification.isRead = true;
    notification.readAt = Date.now();

    await notification.save();

    res.status(200).json({
      success: true,
      notification,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/mark-all-read
// @access  Private
export const markAllAsRead = async (req, res, next) => {
  try {
    await Notification.updateMany(
      { user: req.user.id, isRead: false },
      { isRead: true, readAt: Date.now() }
    );

    res.status(200).json({
      success: true,
      message: 'All notifications marked as read',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete notification
// @route   DELETE /api/notifications/:id
// @access  Private
export const deleteNotification = async (req, res, next) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return next(new AppError('Notification not found', 404));
    }

    if (notification.user.toString() !== req.user.id) {
      return next(new AppError('Not authorized to delete this notification', 403));
    }

    await notification.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Notification deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
