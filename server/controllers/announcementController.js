import Announcement from '../models/Announcement.js';
import AppError from '../utils/AppError.js';

// @desc    Create announcement
// @route   POST /api/announcements
// @access  Private/Admin
export const createAnnouncement = async (req, res, next) => {
  try {
    const { title, content, type, priority, isPublished, expiresAt, targetAudience } = req.body;

    const announcement = await Announcement.create({
      title,
      content,
      type,
      priority,
      author: req.user.id,
      isPublished,
      publishedAt: isPublished ? Date.now() : undefined,
      expiresAt,
      targetAudience,
    });

    res.status(201).json({
      success: true,
      announcement,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all announcements
// @route   GET /api/announcements
// @access  Private
export const getAnnouncements = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, type, priority, isPublished } = req.query;

    const query = {};

    // Only show published announcements to non-admin users
    if (req.user.role !== 'admin') {
      query.isPublished = true;
      query.$or = [
        { expiresAt: { $gte: new Date() } },
        { expiresAt: null },
      ];
      query.targetAudience = { $in: ['all', req.user.role] };
    } else {
      if (isPublished !== undefined) {
        query.isPublished = isPublished === 'true';
      }
    }

    if (type) {
      query.type = type;
    }

    if (priority) {
      query.priority = priority;
    }

    const announcements = await Announcement.find(query)
      .populate('author', 'name email')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await Announcement.countDocuments(query);

    res.status(200).json({
      success: true,
      count: announcements.length,
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      announcements,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single announcement
// @route   GET /api/announcements/:id
// @access  Private
export const getAnnouncement = async (req, res, next) => {
  try {
    const announcement = await Announcement.findById(req.params.id)
      .populate('author', 'name email')
      .populate('readBy.user', 'name email');

    if (!announcement) {
      return next(new AppError('Announcement not found', 404));
    }

    // Check if non-admin can access
    if (req.user.role !== 'admin') {
      if (!announcement.isPublished) {
        return next(new AppError('Announcement not found', 404));
      }
      if (!announcement.targetAudience.includes('all') && 
          !announcement.targetAudience.includes(req.user.role)) {
        return next(new AppError('Not authorized to view this announcement', 403));
      }
    }

    res.status(200).json({
      success: true,
      announcement,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update announcement
// @route   PUT /api/announcements/:id
// @access  Private/Admin
export const updateAnnouncement = async (req, res, next) => {
  try {
    let announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
      return next(new AppError('Announcement not found', 404));
    }

    const {
      title,
      content,
      type,
      priority,
      isPublished,
      expiresAt,
      targetAudience,
    } = req.body;

    if (title) announcement.title = title;
    if (content) announcement.content = content;
    if (type) announcement.type = type;
    if (priority) announcement.priority = priority;
    if (expiresAt !== undefined) announcement.expiresAt = expiresAt;
    if (targetAudience) announcement.targetAudience = targetAudience;

    if (isPublished !== undefined) {
      announcement.isPublished = isPublished;
      if (isPublished && !announcement.publishedAt) {
        announcement.publishedAt = Date.now();
      }
    }

    await announcement.save();

    res.status(200).json({
      success: true,
      announcement,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete announcement
// @route   DELETE /api/announcements/:id
// @access  Private/Admin
export const deleteAnnouncement = async (req, res, next) => {
  try {
    const announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
      return next(new AppError('Announcement not found', 404));
    }

    await announcement.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Announcement deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark announcement as read
// @route   PUT /api/announcements/:id/read
// @access  Private
export const markAsRead = async (req, res, next) => {
  try {
    const announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
      return next(new AppError('Announcement not found', 404));
    }

    // Check if already marked as read
    const alreadyRead = announcement.readBy.some(
      (read) => read.user.toString() === req.user.id
    );

    if (!alreadyRead) {
      announcement.readBy.push({
        user: req.user.id,
        readAt: Date.now(),
      });
      await announcement.save();
    }

    res.status(200).json({
      success: true,
      message: 'Announcement marked as read',
    });
  } catch (error) {
    next(error);
  }
};
