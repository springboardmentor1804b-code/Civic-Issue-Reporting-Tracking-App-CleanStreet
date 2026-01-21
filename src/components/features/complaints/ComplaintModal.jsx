import { useState, useEffect } from "react";
import {
  X,
  MapPin,
  Calendar,
  Save,
  AlertCircle,
  CheckCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  FileText,
  Tag,
  Flag,
  Navigation,
  Eye,
  Edit3,
  Shield,
  MessageCircle,
  Send,
  Trash2,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
import { Avatar } from "../../common";
import { ISSUE_TYPES, PRIORITY_LEVELS, ISSUE_EMOJIS } from "../../../constants";
import { issueService } from "../../../services/issueService";

const ComplaintModal = ({ complaint, isOpen, onClose, onSave, onDelete }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [hasChanges, setHasChanges] = useState(false);
  const [activeTab, setActiveTab] = useState("details"); // "details" or "comments"
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [isAddingComment, setIsAddingComment] = useState(false);
  const [formData, setFormData] = useState({
    issueTitle: "",
    issueType: "",
    priorityLevel: "",
    address: "",
    landmark: "",
    description: "",
    status: "",
  });

  // Store original data to detect changes
  const [originalData, setOriginalData] = useState({});

  // Get current user info
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const isOwner = currentUser._id === complaint?.reportedBy?._id;
  const isAdmin = currentUser.role === "Admin";
  const canEditDetails = isOwner;
  const canChangeStatus = isAdmin;
  const canEdit = canEditDetails || canChangeStatus;

  // Initialize form data when complaint changes
  useEffect(() => {
    if (complaint) {
      const data = {
        issueTitle: complaint.issueTitle || "",
        issueType: complaint.issueType || "",
        priorityLevel: complaint.priorityLevel || "",
        address: complaint.address || "",
        landmark: complaint.landmark || "",
        description: complaint.description || "",
        status: complaint.status || "Pending",
      };
      setFormData(data);
      setOriginalData(data);
      setCurrentImageIndex(0);
      setHasChanges(false);
      setActiveTab("details");
      // Set initial comments from complaint
      setComments(complaint.comments || []);
    }
  }, [complaint]);

  // Fetch comments when switching to comments tab
  useEffect(() => {
    if (activeTab === "comments" && complaint?._id) {
      fetchComments();
    }
  }, [activeTab, complaint?._id]);

  const fetchComments = async () => {
    setIsLoadingComments(true);
    try {
      const result = await issueService.getComments(complaint._id);
      setComments(result.comments || []);
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setIsLoadingComments(false);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !currentUser._id) return;

    setIsAddingComment(true);
    try {
      const result = await issueService.addComment(complaint._id, newComment.trim());
      setComments(result.comments || []);
      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
      alert(error.message);
    } finally {
      setIsAddingComment(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;

    try {
      await issueService.deleteComment(complaint._id, commentId);
      setComments((prev) => prev.filter((c) => c._id !== commentId));
    } catch (error) {
      console.error("Error deleting comment:", error);
      alert(error.message);
    }
  };

  if (!isOpen || !complaint) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const newFormData = { ...formData, [name]: value };
    setFormData(newFormData);

    const changed = Object.keys(newFormData).some(
      (key) => newFormData[key] !== originalData[key]
    );
    setHasChanges(changed);
  };

  const handleSave = async () => {
    if (!hasChanges) return;

    setIsSaving(true);
    try {
      let updateData = {};

      if (canEditDetails) {
        updateData = {
          issueTitle: formData.issueTitle,
          issueType: formData.issueType,
          priorityLevel: formData.priorityLevel,
          address: formData.address,
          landmark: formData.landmark,
          description: formData.description,
        };
      }

      if (canChangeStatus) {
        updateData.status = formData.status;
      }

      await onSave(complaint._id, updateData);
      setOriginalData(formData);
      setHasChanges(false);
    } catch (error) {
      console.error("Error saving:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    if (hasChanges) {
      if (window.confirm("You have unsaved changes. Are you sure you want to close?")) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this issue? This action cannot be undone.")) {
      return;
    }

    setIsDeleting(true);
    try {
      await issueService.deleteIssue(complaint._id);
      if (onDelete) {
        onDelete(complaint._id);
      }
      onClose();
    } catch (error) {
      console.error("Error deleting issue:", error);
      alert(error.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Resolved":
        return CheckCircle;
      case "In Progress":
        return Clock;
      default:
        return AlertCircle;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCommentDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const images = complaint.images || [];
  const emoji = ISSUE_EMOJIS[formData.issueType] || "📋";
  const StatusIcon = getStatusIcon(formData.status);
  const likes = complaint.likes || [];
  const dislikes = complaint.dislikes || [];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const getRoleBadge = () => {
    if (isOwner && isAdmin) {
      return { text: "Owner & Admin", icon: Shield, color: "from-purple-500 to-indigo-500" };
    }
    if (isOwner) {
      return { text: "Your Report", icon: Edit3, color: "from-green-500 to-emerald-500" };
    }
    if (isAdmin) {
      return { text: "Admin Mode", icon: Shield, color: "from-blue-500 to-indigo-500" };
    }
    return { text: "View Only", icon: Eye, color: "from-gray-400 to-gray-500" };
  };

  const roleBadge = getRoleBadge();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-green-50 to-emerald-50">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{emoji}</span>
            <div>
              <h2 className="font-bold text-gray-800">
                {canEdit ? "Edit Issue Report" : "View Issue Report"}
              </h2>
              <p className="text-xs text-gray-500">
                {canEditDetails && canChangeStatus
                  ? "You can edit all details and status"
                  : canEditDetails
                  ? "You can edit issue details"
                  : canChangeStatus
                  ? "You can change the status"
                  : "You are viewing this report"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r ${roleBadge.color} text-white text-xs font-medium`}>
              <roleBadge.icon className="w-3.5 h-3.5" />
              {roleBadge.text}
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-white rounded-full transition-all"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100">
          <button
            onClick={() => setActiveTab("details")}
            className={`flex-1 py-3 text-sm font-medium transition-all ${
              activeTab === "details"
                ? "text-green-600 border-b-2 border-green-500 bg-green-50/50"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <FileText className="w-4 h-4" />
              Details
            </div>
          </button>
          <button
            onClick={() => setActiveTab("comments")}
            className={`flex-1 py-3 text-sm font-medium transition-all ${
              activeTab === "comments"
                ? "text-green-600 border-b-2 border-green-500 bg-green-50/50"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <MessageCircle className="w-4 h-4" />
              Comments ({comments.length})
            </div>
          </button>
        </div>

        <div className="flex flex-col md:flex-row max-h-[calc(90vh-200px)] overflow-hidden">
          {/* Image Section */}
          <div className="relative w-full md:w-2/5 h-56 md:h-auto bg-gray-100 flex-shrink-0">
            {images.length > 0 ? (
              <>
                <img
                  src={images[currentImageIndex]}
                  alt={complaint.issueTitle}
                  className="w-full h-full object-cover"
                />
                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-all"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-all"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                    <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-2">
                      {images.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentImageIndex(idx)}
                          className={`w-2 h-2 rounded-full transition-all ${
                            idx === currentImageIndex ? "bg-white w-6" : "bg-white/50"
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                <span className="text-6xl">{emoji}</span>
              </div>
            )}

            {/* Reporter Info & Stats Overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar name={complaint.reportedBy?.name} size="sm" showRing={false} />
                  <div>
                    <p className="text-sm font-medium text-white">
                      {complaint.reportedBy?.name || "Anonymous"}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-gray-300">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(complaint.createdAt)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 text-green-400">
                    <ThumbsUp className="w-4 h-4" />
                    <span className="text-sm font-medium">{likes.length}</span>
                  </div>
                  <div className="flex items-center gap-1 text-red-400">
                    <ThumbsDown className="w-4 h-4" />
                    <span className="text-sm font-medium">{dislikes.length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="w-full md:w-3/5 overflow-y-auto">
            {activeTab === "details" ? (
              /* Details Tab */
              <div className="p-6 space-y-5">
                {/* Issue Title */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <FileText className="w-4 h-4 text-green-500" />
                    Issue Title
                  </label>
                  <input
                    type="text"
                    name="issueTitle"
                    value={formData.issueTitle}
                    onChange={handleInputChange}
                    disabled={!canEditDetails}
                    placeholder="Enter issue title"
                    className={`w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-800 outline-none transition-all ${
                      canEditDetails
                        ? "focus:border-green-500 focus:ring-2 focus:ring-green-200 bg-gray-50/50 hover:bg-white"
                        : "bg-gray-100 cursor-not-allowed"
                    }`}
                  />
                </div>

                {/* Issue Type & Priority */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                      <Tag className="w-4 h-4 text-green-500" />
                      Issue Type
                    </label>
                    <select
                      name="issueType"
                      value={formData.issueType}
                      onChange={handleInputChange}
                      disabled={!canEditDetails}
                      className={`w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-800 outline-none transition-all ${
                        canEditDetails
                          ? "focus:border-green-500 focus:ring-2 focus:ring-green-200 bg-gray-50/50 hover:bg-white cursor-pointer"
                          : "bg-gray-100 cursor-not-allowed"
                      }`}
                    >
                      {ISSUE_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {ISSUE_EMOJIS[type]} {type}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                      <Flag className="w-4 h-4 text-green-500" />
                      Priority Level
                    </label>
                    <select
                      name="priorityLevel"
                      value={formData.priorityLevel}
                      onChange={handleInputChange}
                      disabled={!canEditDetails}
                      className={`w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-800 outline-none transition-all ${
                        canEditDetails
                          ? "focus:border-green-500 focus:ring-2 focus:ring-green-200 bg-gray-50/50 hover:bg-white cursor-pointer"
                          : "bg-gray-100 cursor-not-allowed"
                      }`}
                    >
                      {PRIORITY_LEVELS.map((level) => (
                        <option key={level} value={level}>
                          {level}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Status */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <StatusIcon className="w-4 h-4 text-green-500" />
                    Status
                    {!canChangeStatus && (
                      <span className="text-xs text-gray-400 font-normal">(Admin only)</span>
                    )}
                  </label>
                  <div className="flex gap-3">
                    {["Pending", "In Progress", "Resolved"].map((status) => (
                      <button
                        key={status}
                        type="button"
                        onClick={() => canChangeStatus && handleInputChange({ target: { name: "status", value: status } })}
                        disabled={!canChangeStatus}
                        className={`flex-1 py-2.5 px-4 rounded-xl font-medium text-sm transition-all ${
                          formData.status === status
                            ? status === "Resolved"
                              ? "bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-md"
                              : status === "In Progress"
                              ? "bg-gradient-to-r from-amber-400 to-orange-400 text-white shadow-md"
                              : "bg-gradient-to-r from-orange-400 to-red-400 text-white shadow-md"
                            : canChangeStatus
                            ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            : "bg-gray-100 text-gray-400 cursor-not-allowed"
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <MapPin className="w-4 h-4 text-green-500" />
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    disabled={!canEditDetails}
                    placeholder="Enter street address"
                    className={`w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-800 outline-none transition-all ${
                      canEditDetails
                        ? "focus:border-green-500 focus:ring-2 focus:ring-green-200 bg-gray-50/50 hover:bg-white"
                        : "bg-gray-100 cursor-not-allowed"
                    }`}
                  />
                </div>

                {/* Landmark */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <Navigation className="w-4 h-4 text-green-500" />
                    Landmark (Optional)
                  </label>
                  <input
                    type="text"
                    name="landmark"
                    value={formData.landmark}
                    onChange={handleInputChange}
                    disabled={!canEditDetails}
                    placeholder="Near any landmark?"
                    className={`w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-800 outline-none transition-all ${
                      canEditDetails
                        ? "focus:border-green-500 focus:ring-2 focus:ring-green-200 bg-gray-50/50 hover:bg-white"
                        : "bg-gray-100 cursor-not-allowed"
                    }`}
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <AlertCircle className="w-4 h-4 text-green-500" />
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    disabled={!canEditDetails}
                    rows={3}
                    placeholder="Describe the issue in detail..."
                    className={`w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-800 outline-none transition-all resize-none ${
                      canEditDetails
                        ? "focus:border-green-500 focus:ring-2 focus:ring-green-200 bg-gray-50/50 hover:bg-white"
                        : "bg-gray-100 cursor-not-allowed"
                    }`}
                  />
                </div>
              </div>
            ) : (
              /* Comments Tab */
              <div className="flex flex-col h-full">
                {/* Comments List */}
                <div className="flex-1 p-4 overflow-y-auto space-y-4">
                  {isLoadingComments ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                  ) : comments.length === 0 ? (
                    <div className="text-center py-8">
                      <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">No comments yet</p>
                      <p className="text-sm text-gray-400">Be the first to comment!</p>
                    </div>
                  ) : (
                    comments.map((comment) => (
                      <div key={comment._id} className="flex gap-3 group">
                        <Avatar name={comment.user?.name} size="sm" showRing={false} />
                        <div className="flex-1">
                          <div className="bg-gray-50 rounded-xl p-3">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-medium text-gray-800">
                                {comment.user?.name || "Anonymous"}
                              </span>
                              <span className="text-xs text-gray-400">
                                {formatCommentDate(comment.createdAt)}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">{comment.text}</p>
                          </div>
                          {(comment.user?._id === currentUser._id || isAdmin) && (
                            <button
                              onClick={() => handleDeleteComment(comment._id)}
                              className="mt-1 text-xs text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1"
                            >
                              <Trash2 className="w-3 h-3" />
                              Delete
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Add Comment Input */}
                {currentUser._id && (
                  <div className="p-4 border-t border-gray-100">
                    <div className="flex gap-3">
                      <Avatar name={currentUser.name} size="sm" showRing={false} />
                      <div className="flex-1 flex gap-2">
                        <input
                          type="text"
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          onKeyPress={(e) => e.key === "Enter" && handleAddComment()}
                          placeholder="Write a comment..."
                          className="flex-1 px-4 py-2 border border-gray-200 rounded-xl text-sm focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none"
                        />
                        <button
                          onClick={handleAddComment}
                          disabled={!newComment.trim() || isAddingComment}
                          className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                          {isAddingComment ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          ) : (
                            <Send className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer - Only show for details tab */}
        {activeTab === "details" && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50">
            <div className="flex items-center gap-2">
              {hasChanges && canEdit && (
                <span className="text-sm text-amber-600 font-medium flex items-center gap-1">
                  <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></span>
                  Unsaved changes
                </span>
              )}
              {!canEdit && (
                <span className="text-sm text-gray-500 flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  View only mode
                </span>
              )}
              {/* Delete button - Only show for owner or admin */}
              {(isOwner || isAdmin) && (
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-xl font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDeleting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-red-300 border-t-red-600 rounded-full animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      Delete Issue
                    </>
                  )}
                </button>
              )}
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleClose}
                className="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-100 transition-colors"
              >
                {canEdit ? "Cancel" : "Close"}
              </button>
              {canEdit && (
                <button
                  onClick={handleSave}
                  disabled={isSaving || !hasChanges}
                  className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-green-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {isSaving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save Changes
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ComplaintModal;
