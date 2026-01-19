import express from 'express';
import authMiddleware from '../middleware/auth.js';
import upload from '../middleware/upload.js';
import { createAdminLog } from '../utils/createAdminLog.js';
import Issue from '../models/Issue.js';
import cloudinary from '../utils/cloudinary.js';
import User from '../models/User.js';

const router = express.Router();

/* ===================================================
   CREATE ISSUE
=================================================== */
router.post('/create', authMiddleware, upload.array('images', 5), async (req, res) => {
  try {
    const { title, description, priority, issueType, address, location } = req.body;

    if (!location) {
      return res.status(400).json({ message: 'Location is required' });
    }

    const parsedLocation = JSON.parse(location);

    const imageUrls = [];
    if (req.files?.length) {
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(
          `data:${file.mimetype};base64,${file.buffer.toString('base64')}`,
          { folder: 'report_issues' }
        );
        imageUrls.push(result.secure_url);
      }
    }

    const issue = await Issue.create({
      title,
      description,
      priority,
      issueType,
      address,
      location: {
        lat: Number(parsedLocation.lat),
        lng: Number(parsedLocation.lng),
      },
      images: imageUrls,
      createdBy: req.userId,
    });

    const creator = await User.findById(req.userId);

    await createAdminLog({
      userId: req.userId,
      message: `${creator.username} created issue "${issue.title}"`,
    });

    res.status(201).json({ success: true, data: issue });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create issue' });
  }
});

/* ===================================================
   GET ALL ISSUES
=================================================== */
router.get('/', async (req, res) => {
  try {
    const issues = await Issue.find()
      .populate('createdBy', '_id name role')
      .populate('assignedTo', '_id name role')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: issues });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch issues' });
  }
});

/* ===================================================
   VOTE ON ISSUE (UPVOTE/DOWNVOTE TOGGLE)
=================================================== */
router.post('/:id/vote', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { voteType } = req.body;

    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated',
      });
    }

    if (!voteType || !['upvote', 'downvote'].includes(voteType)) {
      return res.status(400).json({
        success: false,
        message: 'Vote type must be either "upvote" or "downvote"',
      });
    }

    const issue = await Issue.findById(id);
    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Issue not found',
      });
    }

    issue.upvotes = (issue.upvotes || []).filter(v => v != null);
    issue.downvotes = (issue.downvotes || []).filter(v => v != null);

    const userIdStr = userId.toString();

    const isUpvoted = issue.upvotes.filter(v => v != null).some(v => v.toString() === userIdStr);

    const isDownvoted = issue.downvotes
      .filter(v => v != null)
      .some(v => v.toString() === userIdStr);

    let updateOperations = {};
    let message = '';

    if (voteType === 'upvote') {
      if (isUpvoted) {
        updateOperations = { $pull: { upvotes: userId } };
        message = 'Upvote removed';
      } else {
        updateOperations = {
          $addToSet: { upvotes: userId },
          $pull: { downvotes: userId },
        };
        message = 'Upvote added';
      }
    } else if (voteType === 'downvote') {
      if (isDownvoted) {
        updateOperations = { $pull: { downvotes: userId } };
        message = 'Downvote removed';
      } else {
        updateOperations = {
          $addToSet: { downvotes: userId },
          $pull: { upvotes: userId },
        };
        message = 'Downvote added';
      }
    }

    console.log('Update operations:', updateOperations);

    await Issue.findByIdAndUpdate(id, updateOperations, {
      new: false,
      runValidators: true,
    });

    const updatedIssue = await Issue.findById(id)
      .populate('createdBy', '_id name role')
      .populate('comments.user', '_id name');

    if (!updatedIssue) {
      return res.status(404).json({
        success: false,
        message: 'Issue not found after update',
      });
    }

    res.json({
      success: true,
      message,
      data: updatedIssue,
    });
  } catch (error) {
    console.error('Vote error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

/* ===================================================
   UPDATE STATUS
=================================================== */
router.patch('/:id/status', authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    const issue = await Issue.findById(id);
    if (!issue) {
      return res.status(404).json({ success: false, message: 'Issue not found' });
    }

    const oldStatus = issue.status;

    if (req.userRole === 'Volunteer') {
      if (!issue.assignedTo || issue.assignedTo.toString() !== req.userId) {
        return res.status(403).json({
          success: false,
          message: 'You can only update issues assigned to you',
        });
      }

      if (status === 'received') {
        return res.status(403).json({
          success: false,
          message: 'Volunteers cannot reset issue to received',
        });
      }
    } else if (req.userRole !== 'Admin') {
      return res.status(403).json({
        success: false,
        message: 'You are not allowed to update status',
      });
    }

    issue.status = status;
    await issue.save();
    const actor = await User.findById(req.userId);

    await createAdminLog({
      userId: req.userId,
      message: `${actor.username} changed status from "${oldStatus}" to "${status}" for issue "${issue.title}"`,
    });

    return res.status(200).json({
      success: true,
      message: `Status changed from "${oldStatus}" to "${status}"`,
      data: issue,
    });
  } catch (error) {
    console.error('Status update error:', error);
    return res.status(500).json({ success: false, message: 'Failed to update status' });
  }
});

/* ===================================================
   ADD COMMENT
=================================================== */
router.post('/:id/comment', authMiddleware, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text?.trim()) {
      return res.status(400).json({ message: 'Comment required' });
    }

    const issue = await Issue.findById(req.params.id);
    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }

    issue.comments.push({
      user: req.userId,
      text,
    });

    await issue.save();
    await issue.populate('comments.user', '_id name');

    res.status(201).json({
      success: true,
      comments: issue.comments,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to add comment' });
  }
});

/* ===================================================
   GET SINGLE ISSUE (FOR MODAL)
=================================================== */
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id)
      .populate('createdBy', '_id name role')
      .populate('assignedTo', '_id name role')
      .populate('comments.user', '_id name');

    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }

    res.json({ success: true, data: issue });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch issue' });
  }
});

/* ===================================================
   UPDATE ISSUE
=================================================== */
router.put('/:id', authMiddleware, upload.array('images', 5), async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }

    if (issue.createdBy.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const { title, description, priority, issueType, address, location, existingImages } = req.body;

    if (title) issue.title = title;
    if (description) issue.description = description;
    if (priority) issue.priority = priority;
    if (issueType) issue.issueType = issueType;
    if (address) issue.address = address;

    if (location) {
      const parsed = typeof location === 'string' ? JSON.parse(location) : location;
      issue.location = {
        lat: Number(parsed.lat),
        lng: Number(parsed.lng),
      };
    }

    if (existingImages) {
      const parsedExisting =
        typeof existingImages === 'string' ? JSON.parse(existingImages) : existingImages;
      issue.images = parsedExisting;
    }

    if (req.files?.length) {
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(
          `data:${file.mimetype};base64,${file.buffer.toString('base64')}`,
          { folder: 'report_issues' }
        );
        issue.images.push(result.secure_url);
      }
    }

    await issue.save();

    const actor = await User.findById(req.userId);

    await createAdminLog({
      userId: req.userId,
      message: `${actor.username} updated issue "${issue.title}"`,
    });

    await issue.populate('createdBy', '_id name role');

    res.json({ success: true, data: issue });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update issue' });
  }
});

/* ===================================================
   DELETE ISSUE
=================================================== */
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const issueId = req.params.id;

    const issue = await Issue.findById(issueId);
    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Issue not found',
      });
    }

    const isOwner = issue.createdBy.toString() === req.userId;
    const isAdmin = req.userRole === 'Admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this complaint',
      });
    }

    await issue.deleteOne();
    const actor = await User.findById(req.userId);

    await createAdminLog({
      userId: req.userId,
      message: `${actor.username} deleted issue "${issue.title}"`,
    });


    res.json({
      success: true,
      message: 'Complaint deleted successfully',
    });
  } catch (err) {
    console.error('Delete issue error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting complaint',
    });
  }
});

/* ===================================================
   ACCEPT ISSUE (VOLUNTEER ONLY)
=================================================== */
router.patch('/:id/accept', authMiddleware, async (req, res) => {
  try {
    const volunteerId = req.userId || (req.user && req.user._id);

    console.log('Attempting to assign to Volunteer ID:', volunteerId);

    if (req.userRole !== 'Volunteer') {
      return res.status(403).json({
        success: false,
        message: 'Only volunteers can accept issues',
      });
    }

    const issue = await Issue.findById(req.params.id);
    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Issue not found',
      });
    }

    if (issue.assignedTo) {
      return res.status(400).json({
        success: false,
        message: 'Issue already accepted',
      });
    }

    issue.assignedTo = req.userId;
    issue.status = 'in-progress';
    issue.acceptedAt = new Date();

    await issue.save();

    const volunteer = await User.findById(req.userId);

    await createAdminLog({
      userId: req.userId,
      message: `${volunteer.username} accepted issue "${issue.title}"`,
    });

    const updatedIssue = await Issue.findById(issue._id)
      .populate('createdBy', '_id name role')
      .populate('assignedTo', '_id name role');

    res.json({
      success: true,
      message: 'Issue accepted successfully',
      data: updatedIssue,
    });
  } catch (error) {
    console.error('Accept issue error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while accepting issue',
    });
  }
});

/* ===================================================
   DECLINE ISSUE (VOLUNTEER ONLY)
=================================================== */
router.patch('/:id/decline', authMiddleware, async (req, res) => {
  try {
    if (req.userRole !== 'Volunteer') {
      return res.status(403).json({
        success: false,
        message: 'Only volunteers can decline issues',
      });
    }

    const issue = await Issue.findById(req.params.id);
    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Issue not found',
      });
    }

    if (!issue.assignedTo || issue.assignedTo.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only decline issues assigned to you',
      });
    }

    issue.assignedTo = null;
    issue.status = 'received';
    issue.acceptedAt = null;

    await issue.save();

    const volunteer = await User.findById(req.userId);

    await createAdminLog({
      userId: req.userId,
      message: `${volunteer.username} declined issue "${issue.title}"`,
    });

    const updatedIssue = await Issue.findById(issue._id)
      .populate('createdBy', '_id name role')
      .populate('assignedTo', '_id name role');

    res.json({
      success: true,
      message: 'Issue declined successfully',
      data: updatedIssue,
    });
  } catch (error) {
    console.error('Decline issue error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while declining issue',
    });
  }
});

/* ===================================================
   ASSIGN VOLUNTEER (ADMIN ONLY)
=================================================== */
router.patch('/:id/assign', authMiddleware, async (req, res) => {
  try {
    if (req.userRole !== 'Admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can assign volunteers',
      });
    }

    const { volunteerId } = req.body;

    if (!volunteerId) {
      return res.status(400).json({
        success: false,
        message: 'Volunteer ID is required',
      });
    }

    const issue = await Issue.findById(req.params.id);
    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Issue not found',
      });
    }

    const oldVolunteerId = issue.assignedTo;

    issue.assignedTo = volunteerId;
    issue.status = 'in-progress';
    issue.acceptedAt = new Date();

    await issue.save();

    const admin = await User.findById(req.userId);
    const newVolunteer = await User.findById(volunteerId);

    if (!newVolunteer) {
      return res.status(404).json({ message: 'New volunteer not found' });
    }

    let logMessage = '';

    if (oldVolunteerId && oldVolunteerId.toString() !== volunteerId) {
      const oldVolunteer = await User.findById(oldVolunteerId);
      const oldVolunteerName = oldVolunteer ? oldVolunteer.username : 'Unknown/Deleted User';

      logMessage = `${admin.username} changed assignment of issue "${issue.title}" from ${oldVolunteerName} to ${newVolunteer.username}`;
    } else {
      logMessage = `${admin.username} assigned issue "${issue.title}" to ${newVolunteer.username}`;
    }

    await createAdminLog({
      userId: req.userId,
      message: logMessage,
    });

    const updatedIssue = await Issue.findById(issue._id)
      .populate('createdBy', '_id name role')
      .populate('assignedTo', '_id name role');

    res.json({
      success: true,
      message: 'Volunteer assigned successfully',
      data: updatedIssue,
    });
    } catch (err) {
      console.error('Assign volunteer error:', err);
      res.status(500).json({
        success: false,
        message: 'Failed to assign volunteer',
      });
    }
});

export default router;
