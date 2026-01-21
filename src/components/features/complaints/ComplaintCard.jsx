import { useState } from "react";
import { MapPin, Calendar, ThumbsUp, ThumbsDown, MessageCircle } from "lucide-react";
import { Avatar, Badge } from "../../common";
import { ISSUE_EMOJIS } from "../../../constants";
import { issueService } from "../../../services/issueService";

const ComplaintCard = ({ complaint, onClick, onUpdate }) => {
  const {
    _id,
    issueTitle,
    issueType,
    description,
    address,
    status,
    images,
    createdAt,
    likes = [],
    dislikes = [],
    comments = [],
    reportedBy,
    offeredTo,
    assignedTo,
  volunteerResponse,
  } = complaint;

  const [isLiking, setIsLiking] = useState(false);
  const [isDisliking, setIsDisliking] = useState(false);

  // Get current user
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const userLiked = likes.some((id) => id === currentUser._id || id._id === currentUser._id);
  const userDisliked = dislikes.some((id) => id === currentUser._id || id._id === currentUser._id);

  const getStatusVariant = (status) => {
    switch (status) {
      case "Resolved":
        return "success";
      case "In Progress":
        return "warning";
      case "Pending":
        return "error";
      default:
        return "info";
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const truncateText = (text, maxLength = 100) => {
    if (!text) return "";
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  };

  const emoji = ISSUE_EMOJIS[issueType] || "📋";

  const handleLikeClick = async (e) => {
    e.stopPropagation();
    if (!currentUser._id) {
      alert("Please login to like");
      return;
    }
    if (isLiking) return;

    setIsLiking(true);
    try {
      const result = await issueService.likeIssue(_id);
      // Update the complaint in parent
      onUpdate?.(_id, {
        likes: result.userLiked
          ? [...likes, currentUser._id]
          : likes.filter((id) => (id._id || id) !== currentUser._id),
        dislikes: dislikes.filter((id) => (id._id || id) !== currentUser._id),
      });
    } catch (error) {
      console.error("Error liking:", error);
    } finally {
      setIsLiking(false);
    }
  };

  const handleDislikeClick = async (e) => {
    e.stopPropagation();
    if (!currentUser._id) {
      alert("Please login to dislike");
      return;
    }
    if (isDisliking) return;

    setIsDisliking(true);
    try {
      const result = await issueService.dislikeIssue(_id);
      // Update the complaint in parent
      onUpdate?.(_id, {
        dislikes: result.userDisliked
          ? [...dislikes, currentUser._id]
          : dislikes.filter((id) => (id._id || id) !== currentUser._id),
        likes: likes.filter((id) => (id._id || id) !== currentUser._id),
      });
    } catch (error) {
      console.error("Error disliking:", error);
    } finally {
      setIsDisliking(false);
    }
  };

    //Volunteer Accept / Reject
  const handleVolunteerResponse = async (e, response) => {
    e.stopPropagation();

    try {
      const res = await issueService.respondToIssue(_id, response);

      onUpdate?.(_id, {
        volunteerResponse: response,
        status: res.issue?.status || status,
      });
    } catch (err) {
      console.error("Volunteer response error:", err);
      alert(err.message || "Failed to respond");
    }
  };


  return (
    <div
      onClick={() => onClick?.(complaint)}
      className="bg-white/90 backdrop-blur rounded-2xl shadow-sm border border-gray-200/80 overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer">
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden">
        {images && images.length > 0 ? (
          <img
            src={images[0]}
            alt={issueTitle}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <span className="text-4xl">{emoji}</span>
          </div>
        )}

        {/* Status Badge Overlay */}
        <div className="absolute top-3 left-3">
          <Badge variant={getStatusVariant(status)} gradient>
            {status}
          </Badge>
        </div>

        {/* Image Count Badge */}
        {images && images.length > 1 && (
          <div className="absolute top-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
            +{images.length - 1} more
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4">
        {/* Issue Type Tag */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg">{emoji}</span>
          <span className="text-sm font-medium text-gray-600">{issueType}</span>
        </div>

        {/* Title */}
        <h3 className="font-bold text-gray-800 mb-2 line-clamp-1 group-hover:text-green-600 transition-colors">
          {issueTitle}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-500 mb-3 line-clamp-2">
          {truncateText(description, 80)}
        </p>

        {/* Location */}
        <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-3">
          <MapPin className="w-4 h-4 text-green-500 flex-shrink-0" />
          <span className="truncate">{address || "Location not specified"}</span>
        </div>
        
        {/*Assigned Volunteer Info (User View) */}
{assignedTo && volunteerResponse === "Accepted" && (
  <div className="mb-3 text-sm text-green-700 font-medium">
    🧑‍🔧 Assigned Volunteer:{" "}
    <span className="font-semibold">
      {assignedTo?.name}
    </span>
  </div>
)}

{volunteerResponse === "Rejected" && (
  <div className="mb-3 text-sm text-red-500 font-medium">
   Volunteer rejected this issue
  </div>
)}

  {/* Footer */}
   <div className="flex items-center justify-between pt-3 border-t border-gray-100">
  {/* User Info */}
  <div className="flex items-center gap-2">
 

  {currentUser?.role === "Volunteer" &&
  (offeredTo?._id || offeredTo)?.toString() === currentUser._id &&
  volunteerResponse === "Pending" && (

    <div className="flex gap-2 mt-2">
      <button
        onClick={(e) => handleVolunteerResponse(e, "Accepted")}
        className="px-3 py-1 text-xs font-semibold rounded-lg bg-green-500 text-white hover:bg-green-600"
      >
        Accept
      </button>

      <button
        onClick={(e) => handleVolunteerResponse(e, "Rejected")}
        className="px-3 py-1 text-xs font-semibold rounded-lg bg-red-500 text-white hover:bg-red-600"
      >
        Reject
      </button>
    </div>
)}

{/* Volunteer Resolve Button */}
{currentUser?.role === "Volunteer" &&
  (assignedTo?._id || assignedTo)?.toString() === currentUser._id &&
  status === "In Progress" && (

    <button
      onClick={async (e) => {
        e.stopPropagation();
        try {
          await issueService.resolveIssue(_id);
          onUpdate?.(_id, {
            status: "Resolved",
          });
        } catch (err) {
          alert(err.message || "Failed to resolve issue");
        }
      }}
      className="mt-2 px-3 py-1 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700"
    >
      Mark Resolved
    </button>
)}


      <Avatar name={reportedBy?.name} size="sm" showRing={false} />
            <div className="flex flex-col">
              <span className="text-xs font-medium text-gray-700 truncate max-w-[100px]">
                {reportedBy?.name || "Anonymous"}
              </span>
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <Calendar className="w-3 h-3" />
                <span>{formatDate(createdAt)}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Like Button */}
            <button
              onClick={handleLikeClick}
              disabled={isLiking}
              className={`flex items-center gap-1 px-2 py-1 rounded-lg transition-all ${
                userLiked
                  ? "text-green-600 bg-green-50"
                  : "text-gray-400 hover:text-green-500 hover:bg-green-50"
              } ${isLiking ? "opacity-50" : ""}`}
            >
              <ThumbsUp className={`w-4 h-4 ${userLiked ? "fill-current" : ""}`} />
              <span className="text-xs font-medium">{likes.length}</span>
            </button>

            {/* Dislike Button */}
            <button
              onClick={handleDislikeClick}
              disabled={isDisliking}
              className={`flex items-center gap-1 px-2 py-1 rounded-lg transition-all ${
                userDisliked
                  ? "text-red-500 bg-red-50"
                  : "text-gray-400 hover:text-red-500 hover:bg-red-50"
              } ${isDisliking ? "opacity-50" : ""}`}
            >
              <ThumbsDown className={`w-4 h-4 ${userDisliked ? "fill-current" : ""}`} />
              <span className="text-xs font-medium">{dislikes.length}</span>
            </button>

            {/* Comments Count */}
            <div className="flex items-center gap-1 px-2 py-1 text-gray-400">
              <MessageCircle className="w-4 h-4" />
              <span className="text-xs font-medium">{comments.length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplaintCard;
