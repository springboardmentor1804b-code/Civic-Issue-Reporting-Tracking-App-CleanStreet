const Issue = require("../models/issueModel");
const User = require("../models/userModel");

// CREATE ISSUE
exports.createIssue = async (req, res) => {
  try {
    const {
      issueTitle,
      issueType,
      priorityLevel,
      address,
      landmark,
      description,
      location,
      images, 
    } = req.body;

    // Parse location if it's a string
    let parsedLocation = location;
    if (typeof location === "string" && location) {
      parsedLocation = JSON.parse(location);
    }

    

    // 🔍 Find nearest volunteer
const nearestVolunteer = await User.findOne({
  role: "Volunteer",
  location: {
    $near: {
      $geometry: {
        type: "Point",
        coordinates: parsedLocation.coordinates, // [lng, lat]
      },
      $maxDistance: 5000000, // 500 KM
    },
  },
});

const newIssue = new Issue({
  issueTitle,
  issueType,
  priorityLevel,
  address,
  landmark,
  description,
  location: parsedLocation,
  images: images || [],
  reportedBy: req.user.userId,
  assignedTo: null,
  offeredTo: nearestVolunteer ? nearestVolunteer._id : null,
  volunteerResponse: "Pending",
  status: "Pending",
});

await newIssue.save();

  res.status(201).json({
  message: nearestVolunteer
  ? "Issue reported & sent to nearest volunteer for approval"
  : "Issue reported successfully (no volunteer nearby)",

  issue: newIssue,
});

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET ALL ISSUES (with filters and search)
exports.getAllIssues = async (req, res) => {
  try {
    const { status, issueType, priorityLevel, search, page = 1, limit = 10 } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (issueType) filter.issueType = issueType;
    if (priorityLevel) filter.priorityLevel = priorityLevel;

    // Add search functionality
    if (search) {
      filter.$or = [
        { issueTitle: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { address: { $regex: search, $options: "i" } },
        { issueType: { $regex: search, $options: "i" } },
      ];
    }

    const issues = await Issue.find(filter)
      .populate("reportedBy", "name username email")
      .populate("assignedTo", "name username email")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Issue.countDocuments(filter);

    res.json({
      issues,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      totalIssues: total,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET SINGLE ISSUE
exports.getIssueById = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id)
      .populate("reportedBy", "name username email")
      .populate("assignedTo", "name username email");

    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    res.json(issue);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET USER'S ISSUES
exports.getMyIssues = async (req, res) => {
  try {
    const issues = await Issue.find({ reportedBy: req.user.userId })
      .populate("assignedTo", "name username email")
      .sort({ createdAt: -1 });

    res.json(issues);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE ISSUE (role-based access)
// - Owner: can edit all details except status
// - Admin: can only change status
// - Others: no edit access
exports.updateIssue = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    const isOwner = issue.reportedBy.toString() === req.user.userId;
    const isAdmin = req.user.role === "Admin";

    // Check if user has any edit permission
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "Not authorized to update this issue" });
    }

    const {
      issueTitle,
      issueType,
      priorityLevel,
      address,
      landmark,
      description,
      location,
      images,
      status,
    } = req.body;

    // Owner can edit issue details (but not status)
    if (isOwner) {
      // Parse location if it's a string
      let parsedLocation = location;
      if (typeof location === "string" && location) {
        parsedLocation = JSON.parse(location);
      }

      if (issueTitle) issue.issueTitle = issueTitle;
      if (issueType) issue.issueType = issueType;
      if (priorityLevel) issue.priorityLevel = priorityLevel;
      if (address !== undefined) issue.address = address;
      if (landmark !== undefined) issue.landmark = landmark;
      if (description !== undefined) issue.description = description;
      if (parsedLocation) issue.location = parsedLocation;
      if (images) issue.images = images;
    }

    // Only Admin can change status
    if (isAdmin && status) {
      issue.status = status;
    }

    await issue.save();

    // Return populated issue with user details
    const updatedIssue = await Issue.findById(req.params.id)
      .populate("reportedBy", "name username email");

    res.json(updatedIssue);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE ISSUE STATUS (Admin/Volunteer)
exports.updateIssueStatus = async (req, res) => {
  try {
    const { status, assignedTo } = req.body;
    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    if (status) issue.status = status;
    if (assignedTo) issue.assignedTo = assignedTo;

    await issue.save();

    const updatedIssue = await Issue.findById(req.params.id)
      .populate("reportedBy", "name username email")
      .populate("assignedTo", "name username email");

    res.json({ message: "Issue status updated", issue: updatedIssue });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE ISSUE
exports.deleteIssue = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    // Only allow the reporter or admin to delete
    if (issue.reportedBy.toString() !== req.user.userId && req.user.role !== "Admin") {
      return res.status(403).json({ message: "Not authorized to delete this issue" });
    }

    await Issue.findByIdAndDelete(req.params.id);

    res.json({ message: "Issue deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET ISSUE STATS (for dashboard)
exports.getIssueStats = async (req, res) => {
  try {
    const totalIssues = await Issue.countDocuments();
    const pendingIssues = await Issue.countDocuments({ status: "Pending" });
    const inProgressIssues = await Issue.countDocuments({ status: "In Progress" });
    const resolvedIssues = await Issue.countDocuments({ status: "Resolved" });

    const issuesByType = await Issue.aggregate([
      { $group: { _id: "$issueType", count: { $sum: 1 } } },
    ]);

    const issuesByPriority = await Issue.aggregate([
      { $group: { _id: "$priorityLevel", count: { $sum: 1 } } },
    ]);

    res.json({
      totalIssues,
      pendingIssues,
      inProgressIssues,
      resolvedIssues,
      issuesByType,
      issuesByPriority,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// LIKE ISSUE
exports.likeIssue = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    const userId = req.user.userId;

    // Check if user already liked
    const alreadyLiked = issue.likes.includes(userId);

    if (alreadyLiked) {
      // Remove like (toggle off)
      issue.likes = issue.likes.filter((id) => id.toString() !== userId);
    } else {
      // Add like and remove from dislikes if present
      issue.likes.push(userId);
      issue.dislikes = issue.dislikes.filter((id) => id.toString() !== userId);
    }

    await issue.save();

    res.json({
      likes: issue.likes.length,
      dislikes: issue.dislikes.length,
      userLiked: !alreadyLiked,
      userDisliked: false,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DISLIKE ISSUE
exports.dislikeIssue = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    const userId = req.user.userId;

    const alreadyDisliked = issue.dislikes.includes(userId);

    if (alreadyDisliked) {
      issue.dislikes = issue.dislikes.filter((id) => id.toString() !== userId);
    } else {
      // Add dislike and remove from likes if present
      issue.dislikes.push(userId);
      issue.likes = issue.likes.filter((id) => id.toString() !== userId);
    }

    await issue.save();

    res.json({
      likes: issue.likes.length,
      dislikes: issue.dislikes.length,
      userLiked: false,
      userDisliked: !alreadyDisliked,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ADD COMMENT
exports.addComment = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim() === "") {
      return res.status(400).json({ message: "Comment text is required" });
    }

    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    const newComment = {
      user: req.user.userId,
      text: text.trim(),
    };

    issue.comments.push(newComment);
    await issue.save();

    // Get the populated issue with comments
    const updatedIssue = await Issue.findById(req.params.id)
      .populate("comments.user", "name username");

    res.status(201).json({
      message: "Comment added successfully",
      comments: updatedIssue.comments,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET COMMENTS
exports.getComments = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id)
      .populate("comments.user", "name username");

    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    res.json({ comments: issue.comments });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE COMMENT
exports.deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    const comment = issue.comments.id(commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Only comment author or admin can delete
    if (comment.user.toString() !== req.user.userId && req.user.role !== "Admin") {
      return res.status(403).json({ message: "Not authorized to delete this comment" });
    }

    issue.comments.pull(commentId);
    await issue.save();

    res.json({ message: "Comment deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }

};

// GET ISSUES OFFERED TO LOGGED-IN VOLUNTEER
exports.getOfferedIssues = async (req, res) => {
  try {
    if (req.user.role !== "Volunteer") {
      return res.status(403).json({ message: "Access denied" });
    }

    const issues = await Issue.find({
      offeredTo: req.user.userId,
      volunteerResponse: "Pending",
    })
      .populate("reportedBy", "name username phone")
      .sort({ createdAt: -1 });

    res.json({ issues });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// GET ISSUES ASSIGNED TO LOGGED-IN VOLUNTEER
exports.getAssignedIssues = async (req, res) => {
  try {
    if (req.user.role !== "Volunteer") {
      return res.status(403).json({ message: "Access denied" });
    }

    const issues = await Issue.find({
      assignedTo: req.user.userId,
        volunteerResponse: "Accepted",
    })
      .populate("reportedBy", "name username phone")
      .sort({ createdAt: -1 });

    res.json({ issues });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// VOLUNTEER ACCEPT / REJECT ISSUE
exports.respondToIssue = async (req, res) => {
  try {
    const { response } = req.body; 
    const issueId = req.params.id;

    if (!["Accepted", "Rejected"].includes(response)) {
      return res.status(400).json({ message: "Invalid response" });
    }

    const issue = await Issue.findById(issueId);

    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }


    // Only OFFERED volunteer can respond
if (issue.offeredTo?.toString() !== req.user.userId) {
  return res.status(403).json({ message: "Not authorized to respond" });
}


issue.volunteerResponse = response;

if (response === "Accepted") {
  issue.assignedTo = req.user.userId; 
  issue.status = "In Progress";
}

if (response === "Rejected") {
  // store who rejected
  issue.rejectedBy = issue.rejectedBy || [];
  issue.rejectedBy.push(req.user.userId);

  // 🔍 find NEXT nearest volunteer (excluding rejected ones)
  const nextVolunteer = await User.findOne({
    role: "Volunteer",
    _id: { $nin: issue.rejectedBy },
    location: {
      $near: {
        $geometry: issue.location,
        $maxDistance: 5000000, // 500 KM
      },
    },
  });

  issue.assignedTo = null;
  issue.volunteerResponse = "Pending";
  issue.status = "Pending";

  if (nextVolunteer) {
    issue.offeredTo = nextVolunteer._id; 
  } else {
    issue.offeredTo = null; 
  }
}

    await issue.save();

    res.json({
      message: `Issue ${response.toLowerCase()} successfully`,
      issue,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// VOLUNTEER MARK ISSUE AS RESOLVED
exports.resolveIssueByVolunteer = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    if (
      req.user.role !== "Volunteer" ||
      issue.assignedTo?.toString() !== req.user.userId
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Only In Progress issues can be resolved
    if (issue.status !== "In Progress") {
      return res.status(400).json({
        message: "Only In Progress issues can be resolved",
      });
    }

    issue.status = "Resolved";
    await issue.save();

    const updatedIssue = await Issue.findById(issue._id)
      .populate("reportedBy", "name email")
      .populate("assignedTo", "name email");

    res.json({
      message: "Issue marked as resolved",
      issue: updatedIssue,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

