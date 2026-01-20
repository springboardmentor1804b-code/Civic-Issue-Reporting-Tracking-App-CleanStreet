import React, { useState, useEffect, useCallback, useMemo, useRef, lazy, Suspense } from 'react';
import { createPortal } from 'react-dom';
import toast from 'react-hot-toast';
import AuroraBackground from '../components/AuroraBackground';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CustomSelect from '../components/CustomSelect';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import {
  FaMapMarkerAlt,
  FaClock,
  FaTimes,
  FaTrash,
  FaThumbsUp,
  FaThumbsDown,
  FaRoad,
  FaTint,
  FaLightbulb,
  FaExclamationTriangle,
  FaLocationArrow,
} from 'react-icons/fa';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const BACKEND = 'http://localhost:4000';

const StatusProgressBar = lazy(() => import('../components/StatusProgressBar'));

const ISSUE_TYPE_META = {
  Garbage: { icon: FaTrash, color: 'text-green-600', bg: 'bg-green-100' },
  'Road Damage': { icon: FaRoad, color: 'text-gray-700', bg: 'bg-gray-200' },
  'Water Leakage': { icon: FaTint, color: 'text-blue-600', bg: 'bg-blue-100' },
  'Street Light': { icon: FaLightbulb, color: 'text-yellow-600', bg: 'bg-yellow-100' },
  Other: { icon: FaExclamationTriangle, color: 'text-red-600', bg: 'bg-red-100' },
};

const STATUS_STYLES = {
  received: { bg: 'bg-gray-100', text: 'text-gray-600', label: 'Pending' },
  assigned: { bg: 'bg-blue-100', text: 'text-blue-600', label: 'Assigned' },
  'in-progress': { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'In Progress' },
  resolved: { bg: 'bg-green-100', text: 'text-green-700', label: 'Resolved' },
};

const PRIORITY_STYLES = {
  Low: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-300' },
  Medium: { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-300' },
  High: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-300' },
};

const PRIORITY_OPTIONS = ['Low', 'Medium', 'High'];
const ISSUE_TYPE_OPTIONS = ['Garbage', 'Road Damage', 'Water Leakage', 'Street Light', 'Other'];

function MapUpdater({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.setView(position, 15);
    }
  }, [position, map]);
  return null;
}

function LocationPicker({ location, setLocation }) {
  useMapEvents({
    click(e) {
      setLocation(e.latlng);
    },
  });
  return location ? <Marker position={location} /> : null;
}

const DeleteConfirmModal = React.memo(({ isOpen, onClose, onConfirm, title }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (isOpen) setMounted(true);
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-9999 p-4">
      <div
        className={`bg-white rounded-xl shadow-2xl max-w-md w-full p-6 ${
          mounted ? 'animate-in fade-in zoom-in duration-200' : ''
        }`}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
            <FaTrash className="text-red-600 text-xl" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Delete Complaint</h3>
            <p className="text-sm text-gray-500">This action cannot be undone</p>
          </div>
        </div>

        <p className="text-gray-700 mb-6">
          Are you sure you want to delete "<span className="font-semibold">{title}</span>"?
        </p>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
});

DeleteConfirmModal.displayName = 'DeleteConfirmModal';

const ReportCard = React.memo(({ report, userId, onViewDetails, onVote, isLoading }) => {
  const issueMeta = ISSUE_TYPE_META[report.issueType] || ISSUE_TYPE_META.Other;
  const priorityStyle = PRIORITY_STYLES[report.priority] || PRIORITY_STYLES.Low;
  const statusStyle = STATUS_STYLES[report.status] || STATUS_STYLES.received;
  const IssueIcon = issueMeta.icon;

  const isUpvoted = useMemo(
    () => Array.isArray(report.upvotes) && report.upvotes.includes(userId),
    [report.upvotes, userId]
  );

  const isDownvoted = useMemo(
    () => Array.isArray(report.downvotes) && report.downvotes.includes(userId),
    [report.downvotes, userId]
  );

  const upvoteCount = Array.isArray(report.upvotes) ? report.upvotes.length : 0;
  const downvoteCount = Array.isArray(report.downvotes) ? report.downvotes.length : 0;

  const handleViewClick = useCallback(() => {
    onViewDetails(report);
  }, [report, onViewDetails]);

  const handleUpvote = useCallback(() => {
    onVote(report._id, 'upvote');
  }, [report._id, onVote]);

  const handleDownvote = useCallback(() => {
    onVote(report._id, 'downvote');
  }, [report._id, onVote]);

  const assignedName = report.assignedTo?.name || report.assignedTo?.username || null;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
      <div className="flex justify-between items-center mb-3">
        <div className="flex gap-4 items-center">
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${issueMeta.bg}`}>
            <IssueIcon className={`text-xl ${issueMeta.color}`} />
          </div>
        <div>
            <h3 className="font-semibold text-lg leading-tight">{report.title}</h3>
            {assignedName && (
              <p className="text-xs text-gray-500 mt-1">
                <span className="font-bold text-blue-600">Assigned to:</span> {assignedName}
              </p>
            )}
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
            <span className={`px-3 py-1 text-xs rounded-full font-semibold border ${priorityStyle.bg} ${priorityStyle.text} ${priorityStyle.border}`}>
            {report.priority}
            </span>
            <span className={`px-3 py-1 text-xs rounded-full font-bold uppercase tracking-wider ${statusStyle.bg} ${statusStyle.text}`}>
            {statusStyle.label}
            </span>
        </div>
      </div>


      <p className="text-gray-600 text-sm line-clamp-3 break-words">{report.description}</p>

      <div className="pt-4 mt-auto">
        <div className="flex flex-wrap gap-4 justify-between text-sm text-gray-500 mb-3">
          <div className="flex items-center gap-1">
            <FaMapMarkerAlt />
            <span className="truncate max-w-[10rem] sm:max-w-[14rem] md:max-w-[18rem]">
              {report.address}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <FaClock />
            {new Date(report.createdAt).toLocaleDateString()}
          </div>
        </div>

        <div className="border-t pt-3 flex justify-between items-center">
          <button
            onClick={handleViewClick}
            className="text-sm font-medium text-blue-600 hover:underline"
          >
            View Details
          </button>

          <div className="flex gap-2 ml-auto">
            <button
              onClick={handleUpvote}
              disabled={isLoading}
              className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-bold transition-colors border
                ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
                ${
                  isUpvoted
                    ? 'bg-green-600 text-white border-green-700'
                    : 'bg-white text-gray-600 border-gray-300 hover:bg-green-50 hover:text-green-600'
                }
              `}
            >
              <FaThumbsUp />
              {upvoteCount}
            </button>

            <button
              onClick={handleDownvote}
              disabled={isLoading}
              className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-bold transition-colors border
                ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
                ${
                  isDownvoted
                    ? 'bg-red-600 text-white border-red-700'
                    : 'bg-white text-gray-600 border-gray-300 hover:bg-red-50 hover:text-red-600'
                }
              `}
            >
              <FaThumbsDown />
              {downvoteCount}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

ReportCard.displayName = 'ReportCard';

const ReportModal = React.memo(
  ({
    selectedReport,
    isEditing,
    editForm,
    comments,
    newComment,
    userRole,
    userId,
    canEdit,
    canDelete,
    canAcceptIssue,
    canDeclineIssue,
    onDeclineIssue,
    isUpvoted,
    isDownvoted,
    votingLoading,
    loadingGPS,
    onClose,
    onEditStart,
    onEditSave,
    onEditCancel,
    onDelete,
    onAcceptIssue,
    onStatusChange,
    onVote,
    onEditFormChange,
    onLocationChange,
    onImageUpload,
    onRemoveExistingImage,
    onRemoveNewImage,
    onGetCurrentLocation,
    onCommentChange,
    onCommentSubmit,
  }) => {
    const [mounted, setMounted] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
      if (selectedReport) {
        requestAnimationFrame(() => setMounted(true));
      }
      return () => {
        if (editForm.newImages) {
          editForm.newImages.forEach(img => {
            if (img instanceof File) {
              try {
                URL.revokeObjectURL(URL.createObjectURL(img));
              } catch (e) {}
            }
          });
        }
      };
    }, [selectedReport, editForm.newImages]);

    if (!selectedReport) return null;

    return createPortal(
      <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-2 md:p-4">
        <div
          className={`bg-white w-full max-w-6xl rounded-lg md:rounded-xl overflow-hidden flex flex-col shadow-2xl max-h-[95vh] md:max-h-[90vh] ${
            mounted ? 'animate-in fade-in zoom-in duration-200' : ''
          }`}
        >
          <div className="flex justify-between items-center p-3 md:p-4 border-b bg-white shrink-0">
            <div className="flex flex-col gap-2 mb-2">
              {isEditing ? (
                <div className="flex flex-col gap-4">
                  <label>Edit Title</label>
                  <input
                    value={editForm.title}
                    onChange={e => onEditFormChange('title', e.target.value)}
                    className="text-lg md:text-xl font-bold border-b-3 border-blue-400 focus:outline-none"
                  />
                </div>
              ) : (
                <h2 className="text-lg md:text-xl font-bold truncate pr-4">
                  {selectedReport.title}
                </h2>
              )}

              {isEditing ? (
                <div className="flex flex-col gap-2">
                  <label>Edit Priority</label>
                  <CustomSelect
                    options={PRIORITY_OPTIONS}
                    value={editForm.priority}
                    onChange={value => onEditFormChange('priority', value)}
                  />
                </div>
              ) : (
                <span
                  className={`inline-block w-fit px-3 py-1 text-xs rounded-full font-semibold
                  ${PRIORITY_STYLES[selectedReport.priority]?.bg}
                  ${PRIORITY_STYLES[selectedReport.priority]?.text}
                  ${PRIORITY_STYLES[selectedReport.priority]?.border}
                `}
                >
                  {selectedReport.priority}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {isEditing ? (
                <>
                  <button
                    onClick={onEditSave}
                    className="px-3 py-1 md:px-4 md:py-1.5 rounded-md bg-green-600 text-white text-xs md:text-sm font-semibold hover:bg-green-700"
                  >
                    Save
                  </button>

                  <button
                    onClick={onEditCancel}
                    className="px-3 py-1 md:px-4 md:py-1.5 rounded-md bg-gray-400 text-white text-xs md:text-sm font-semibold hover:bg-gray-500"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  {canEdit && (
                    <button
                      onClick={onEditStart}
                      className="px-3 py-1 md:px-4 md:py-1.5 rounded-md bg-blue-600 text-white text-xs md:text-sm font-semibold hover:bg-blue-700"
                    >
                      Edit
                    </button>
                  )}

                  {canAcceptIssue && (
                    <button
                      onClick={onAcceptIssue}
                      className="px-3 py-1 md:px-4 md:py-1.5 rounded-md bg-green-600 text-white text-xs md:text-sm font-semibold hover:bg-green-700 transition"
                    >
                      Accept Issue
                    </button>
                  )}

                  {canDeclineIssue && (
                    <button
                      onClick={onDeclineIssue}
                      className="px-3 py-1 md:px-4 md:py-1.5 rounded-md bg-orange-600 text-white text-xs md:text-sm font-semibold hover:bg-orange-700 transition"
                    >
                      Decline Issue
                    </button>
                  )}

                  {canDelete && (
                    <button
                      onClick={onDelete}
                      className="px-3 py-1 md:px-4 md:py-1.5 rounded-md bg-red-600 text-white text-xs md:text-sm font-semibold hover:bg-red-700"
                    >
                      Delete
                    </button>
                  )}
                </>
              )}

              <button onClick={onClose} className="p-1.5 md:p-2 hover:bg-gray-100 rounded-full">
                <FaTimes className="text-gray-600 text-lg" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-3 md:p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              <div className="space-y-4 md:space-y-6">
                <div className="bg-gray-50 border border-gray-400 rounded-xl p-3 md:p-4">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-semibold text-sm md:text-base">Progress Status</h3>
                    <Suspense fallback={<div className="text-xs">Loading...</div>}>
                      <StatusProgressBar
                        status={selectedReport.status}
                        isAdmin={userRole === 'Admin' || userRole === 'Volunteer'}
                        onStatusChange={onStatusChange}
                      />
                    </Suspense>
                  </div>
                </div>

                <div className="flex gap-2 md:gap-4">
                  <button
                    onClick={() => onVote(selectedReport._id, 'upvote')}
                    disabled={votingLoading[selectedReport._id]}
                    className={`flex-1 flex justify-center gap-1 md:gap-2 items-center px-2 py-2 md:px-6 rounded-lg font-bold text-xs md:text-sm border border-gray-400
                    ${votingLoading[selectedReport._id] ? 'opacity-50 cursor-not-allowed' : ''}
                    ${
                      isUpvoted
                        ? 'bg-green-600 text-white border-green-700'
                        : 'bg-white text-gray-700 hover:border-green-400 hover:text-green-600'
                    }`}
                  >
                    <FaThumbsUp />
                    <span>Up ({selectedReport.upvotes?.length || 0})</span>
                  </button>

                  <button
                    onClick={() => onVote(selectedReport._id, 'downvote')}
                    disabled={votingLoading[selectedReport._id]}
                    className={`flex-1 flex justify-center gap-1 md:gap-2 items-center px-2 py-2 md:px-6 rounded-lg font-bold text-xs md:text-sm border border-gray-400
                    ${votingLoading[selectedReport._id] ? 'opacity-50 cursor-not-allowed' : ''}
                    ${
                      isDownvoted
                        ? 'bg-red-600 text-white border-red-700'
                        : 'bg-white text-gray-700 hover:border-red-400 hover:text-red-600'
                    }`}
                  >
                    <FaThumbsDown />
                    <span>Down ({selectedReport.downvotes?.length || 0})</span>
                  </button>
                </div>

                <div className="bg-gray-50 p-3 rounded-lg border border-gray-400">
                  {isEditing ? (
                    <div className="space-y-3">
                      <label className="mb-2">Edit Description</label>
                      <textarea
                        value={editForm.description}
                        onChange={e => onEditFormChange('description', e.target.value)}
                        className="w-full border-3 border-blue-400 p-2 rounded-lg"
                        rows={4}
                      />
                    </div>
                  ) : (
                    <p className="text-sm md:text-base text-gray-700 leading-relaxed break-words">
                      {selectedReport.description}
                    </p>
                  )}
                </div>

                {isEditing && (
                  <>
                    <div className="space-y-2">
                      <label>Edit Issue Type</label>
                      <CustomSelect
                        options={ISSUE_TYPE_OPTIONS}
                        value={editForm.issueType}
                        onChange={value => onEditFormChange('issueType', value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <label>Edit Address</label>
                      <input
                        value={editForm.address}
                        onChange={e => onEditFormChange('address', e.target.value)}
                        className="w-full border-2 border-blue-400 p-2 rounded-lg focus:outline-none"
                      />
                    </div>
                  </>
                )}

                {isEditing ? (
                  <div>
                    <label className="block text-sm font-medium mb-2">Edit Images</label>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={onImageUpload}
                      className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 shadow rounded-lg border-2 w-full mb-3"
                    />
                    <div className="grid grid-cols-2 gap-2 md:gap-4">
                      {editForm.existingImages.map((img, i) => (
                        <div key={`existing-${i}`} className="relative">
                          <img
                            src={img}
                            className="h-32 md:h-48 w-full object-cover rounded-lg border border-gray-400"
                            alt="Evidence"
                            loading="lazy"
                            decoding="async"
                          />
                          <button
                            type="button"
                            onClick={() => onRemoveExistingImage(i)}
                            className="absolute top-1 right-1 bg-black/60 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-black"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                      {editForm.newImages.map((img, i) => (
                        <div key={`new-${i}`} className="relative">
                          <img
                            src={URL.createObjectURL(img)}
                            className="h-32 md:h-48 w-full object-cover rounded-lg border border-gray-400"
                            alt="New"
                            loading="lazy"
                            decoding="async"
                          />
                          <button
                            type="button"
                            onClick={() => onRemoveNewImage(i)}
                            className="absolute top-1 right-1 bg-black/60 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-black"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  selectedReport.images?.length > 0 && (
                    <div className="grid grid-cols-2 gap-2 md:gap-4">
                      {selectedReport.images.map((img, i) => (
                        <img
                          key={i}
                          src={img}
                          className="h-32 md:h-48 w-full object-cover rounded-lg border border-gray-400"
                          alt="Evidence"
                          loading="lazy"
                          decoding="async"
                        />
                      ))}
                    </div>
                  )
                )}
              </div>

              <div className="space-y-4 md:space-y-6">
                {isEditing ? (
                  <div>
                    <label className="block text-sm font-medium mb-2">Edit Location on Map</label>
                    <div className="relative h-48 md:h-64 rounded-xl overflow-hidden border border-gray-400">
                      <MapContainer
                        center={[
                          editForm.location?.lat || 17.385,
                          editForm.location?.lng || 78.4867,
                        ]}
                        zoom={13}
                        className="h-full w-full"
                      >
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <MapUpdater position={editForm.location} />
                        <LocationPicker
                          location={editForm.location}
                          setLocation={onLocationChange}
                        />
                      </MapContainer>

                      <button
                        type="button"
                        onClick={onGetCurrentLocation}
                        disabled={loadingGPS}
                        className="absolute top-4 right-4 z-[1000] bg-white text-gray-800 px-4 py-2 rounded-xl shadow-md font-semibold hover:bg-blue-50 hover:text-blue-600 flex items-center gap-2 border border-gray-200 transition-all active:scale-95"
                      >
                        {loadingGPS ? (
                          <span className="animate-spin text-blue-600">⌛</span>
                        ) : (
                          <FaLocationArrow className="text-blue-500" />
                        )}
                        {loadingGPS ? 'Locating...' : 'Use My GPS'}
                      </button>

                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[1000] bg-black/75 text-white text-xs px-4 py-1.5 rounded-full pointer-events-none font-medium">
                        Tap map to set location manually
                      </div>
                    </div>
                  </div>
                ) : (
                  selectedReport.location && (
                    <div className="rounded-xl overflow-hidden border border-gray-400 h-48 md:h-64 relative z-0">
                      <MapContainer
                        center={[
                          Number(selectedReport.location.lat),
                          Number(selectedReport.location.lng),
                        ]}
                        zoom={15}
                        className="h-full w-full"
                        scrollWheelZoom={false}
                      >
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <Marker
                          position={[
                            Number(selectedReport.location.lat),
                            Number(selectedReport.location.lng),
                          ]}
                        />
                      </MapContainer>
                    </div>
                  )
                )}

                <div className="bg-gray-50 rounded-xl p-3 md:p-4 border border-gray-400 flex flex-col h-64 md:h-auto">
                  <h3 className="font-semibold mb-2 md:mb-4 border-b pb-2 text-sm md:text-base">
                    Discussion
                  </h3>

                  <div className="flex-1 overflow-y-auto space-y-3 mb-3 pr-1 custom-scrollbar">
                    {comments.length > 0 ? (
                      comments.map(c => (
                        <div
                          key={c._id}
                          className="bg-white p-2 md:p-3 rounded-lg border border-gray-400 text-xs md:text-sm break-words"
                        >
                          <div className="font-bold text-xs mb-0.5 text-blue-600">
                            {c.user?.name || 'Anonymous'}
                          </div>
                          <p className="text-gray-700">{c.text}</p>
                        </div>
                      ))
                    ) : (
                      <div className="h-full flex items-center justify-center">
                        <p className="text-gray-400 text-xs md:text-sm italic">No comments yet</p>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 w-full items-center">
                    <input
                      value={newComment}
                      onChange={onCommentChange}
                      onKeyPress={e => e.key === 'Enter' && onCommentSubmit()}
                      className="flex-1 min-w-0 border border-gray-400 p-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Type a comment..."
                    />
                    <button
                      onClick={onCommentSubmit}
                      className="shrink-0 bg-blue-600 hover:bg-blue-700 text-white px-3 md:px-4 py-2 rounded-lg text-sm font-semibold"
                    >
                      Send
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>,
      document.body
    );
  }
);

ReportModal.displayName = 'ReportModal';

export default function CommunityReports() {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [userId, setUserId] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  const [viewMode, setViewMode] = useState(() => {
    return localStorage.getItem('preferredViewMode') || 'all';
  });

  const [showResolveModal, setShowResolveModal] = useState(false);
  const [pendingStatus, setPendingStatus] = useState(null);

  const [votingLoading, setVotingLoading] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loadingGPS, setLoadingGPS] = useState(false);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    priority: '',
    issueType: '',
    address: '',
    location: null,
    existingImages: [],
    newImages: [],
  });


  useEffect(() => {
    localStorage.setItem('preferredViewMode', viewMode);
  }, [viewMode]);

  useEffect(() => {
    if (userRole === 'Volunteer' && !localStorage.getItem('preferredViewMode')) {
      setViewMode('all'); 
    } else if (userRole !== 'Volunteer' && !localStorage.getItem('preferredViewMode')) {
      setViewMode('global');
    }
  }, [userRole]);

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const res = await fetch(`${BACKEND}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const { user } = await res.json();
          if (user?._id) {
            setUserId(user._id);
            setUserRole(user.role);
          }
          if (user.coordinates?.lat && user.coordinates?.lng) {
            setUserLocation({
              lat: Number(user.coordinates.lat),
              lng: Number(user.coordinates.lng),
            });
          }
        }
      } catch (err) {
        console.error('User fetch error:', err);
        toast.error('Failed to load user information');
      }
    };
    loadUser();
  }, []);

  useEffect(() => {
    const loadReports = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const res = await fetch(`${BACKEND}/api/issues`, { headers });
        const data = await res.json();
        setReports(Array.isArray(data.data) ? data.data : []);
      } catch (err) {
        console.error('Reports fetch error:', err);
        toast.error('Failed to load reports');
      }
    };
    loadReports();
  }, []);

  useEffect(() => {
    if (!selectedReport?._id) return;

    const loadComments = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const res = await fetch(`${BACKEND}/api/issues/${selectedReport._id}`, { headers });
        const data = await res.json();
        setComments(data.data?.comments || []);
      } catch (err) {
        console.error('Comments fetch error:', err);
        toast.error('Failed to load comments');
      }
    };

    loadComments();
  }, [selectedReport?._id]);

  const getCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }

    setLoadingGPS(true);
    toast.loading('Locating...', { id: 'gps' });

    const success = pos => {
      const { latitude, longitude } = pos.coords;
      setEditForm(prev => ({ ...prev, location: { lat: latitude, lng: longitude } }));
      setLoadingGPS(false);
      toast.success('Location found!', { id: 'gps' });
    };

    const error = err => {
      console.warn('High accuracy error, trying low accuracy...', err);
      navigator.geolocation.getCurrentPosition(
        success,
        finalErr => {
          console.error(finalErr);
          setLoadingGPS(false);
          toast.error('Could not find location. Please tap map manually.', { id: 'gps' });
        },
        { enableHighAccuracy: false, timeout: 10000 }
      );
    };

    navigator.geolocation.getCurrentPosition(success, error, {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 0,
    });
  }, []);

  const updateStatus = async status => {
    const toastId = toast.loading('Updating status...');

    try {
      const res = await fetch(`${BACKEND}/api/issues/${selectedReport._id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ status }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || 'Failed to update status', { id: toastId });
        return;
      }

      setSelectedReport(data.data);
      setReports(prev => prev.map(r => (r._id === data.data._id ? data.data : r)));

      toast.success('Status updated successfully', { id: toastId });
    } catch (err) {
      console.error(err);
      toast.error('Failed to update status', { id: toastId });
    }
  };


  const handleStatusUpdate = useCallback(

    async newStatus => {
      if (newStatus === selectedReport?.status) {
         return;
      }

      if (
        userRole === 'Volunteer' &&
        selectedReport?.assignedTo?._id !== userId &&
        selectedReport?.assignedTo !== userId
      ) {
        toast.error('You can only update issues assigned to you');
        return;
      }

      if (userRole === 'Volunteer' && newStatus === 'received') {
        toast.error('You cannot reset an issue to received');
        return;
      }

      if (userRole !== 'Admin' && userRole !== 'Volunteer') {
        toast.error('You cannot edit the progress');
        return;
      }

      if (newStatus === 'resolved') {
        setPendingStatus(newStatus);
        setShowResolveModal(true);
        return;
      }

      await updateStatus(newStatus);
    },
    [selectedReport, userRole]
  );

  const handleAcceptIssue = useCallback(async () => {
    if (userRole !== 'Volunteer') {
      toast.error('Only volunteers can accept issues');
      return;
    }

    const toastId = toast.loading('Accepting issue...');

    try {
      const res = await fetch(`${BACKEND}/api/issues/${selectedReport._id}/accept`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!res.ok) {
        toast.error('Failed to accept issue', { id: toastId });
        return;
      }

      const updated = await res.json();

      setSelectedReport(updated.data);
      setReports(prev => prev.map(r => (r._id === updated.data._id ? updated.data : r)));

      toast.success('Issue accepted successfully', { id: toastId });
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong', { id: toastId });
    }
  }, [selectedReport, userRole]);

  const handleDeclineIssue = useCallback(async () => {
    if (userRole !== 'Volunteer') {
      toast.error('Only volunteers can decline issues');
      return;
    }

    const toastId = toast.loading('Declining issue...');

    try {
      const res = await fetch(`${BACKEND}/api/issues/${selectedReport._id}/decline`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        toast.error(errorData.message || 'Failed to decline issue', { id: toastId });
        return;
      }

      const updated = await res.json();

      setSelectedReport(updated.data);
      setReports(prev => prev.map(r => (r._id === updated.data._id ? updated.data : r)));

      toast.success('Issue declined successfully', { id: toastId });
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong', { id: toastId });
    }
  }, [selectedReport, userRole]);

  const handleEditStart = useCallback(() => {
    setEditForm({
      title: selectedReport.title,
      description: selectedReport.description,
      priority: selectedReport.priority,
      issueType: selectedReport.issueType,
      address: selectedReport.address,
      location: selectedReport.location,
      existingImages: [...selectedReport.images],
      newImages: [],
    });
    setIsEditing(true);
  }, [selectedReport]);

  const handleEditFormChange = useCallback((field, value) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleImageUpload = useCallback(e => {
    const files = Array.from(e.target.files);
    setEditForm(prev => ({ ...prev, newImages: [...prev.newImages, ...files] }));
  }, []);

  const removeExistingImage = useCallback(index => {
    setEditForm(prev => ({
      ...prev,
      existingImages: prev.existingImages.filter((_, i) => i !== index),
    }));
  }, []);

  const removeNewImage = useCallback(index => {
    setEditForm(prev => ({
      ...prev,
      newImages: prev.newImages.filter((_, i) => i !== index),
    }));
  }, []);

  const handleEditSave = useCallback(async () => {
    const toastId = toast.loading('Updating complaint...');

    try {
      const formData = new FormData();
      formData.append('title', editForm.title);
      formData.append('description', editForm.description);
      formData.append('priority', editForm.priority);
      formData.append('issueType', editForm.issueType);
      formData.append('address', editForm.address);
      formData.append('location', JSON.stringify(editForm.location));
      formData.append('existingImages', JSON.stringify(editForm.existingImages));

      editForm.newImages.forEach(img => {
        formData.append('images', img);
      });

      const res = await fetch(`${BACKEND}/api/issues/${selectedReport._id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });

      if (!res.ok) {
        toast.error('Failed to update complaint', { id: toastId });
        return;
      }

      const updated = await res.json();

      setReports(prev => prev.map(r => (r._id === updated.data._id ? updated.data : r)));
      setSelectedReport(updated.data);
      setIsEditing(false);
      toast.success('Complaint updated', { id: toastId });
    } catch (err) {
      console.error(err);
      toast.error('Failed to update complaint', { id: toastId });
    }
  }, [editForm, selectedReport]);

  const addComment = useCallback(async () => {
    if (!newComment.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }

    const toastId = toast.loading('Posting comment...');

    try {
      const res = await fetch(`${BACKEND}/api/issues/${selectedReport._id}/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ text: newComment }),
      });

      if (res.ok) {
        const data = await res.json();
        setComments(data.comments);
        setNewComment('');
        toast.success('Comment posted successfully', { id: toastId });
      } else {
        toast.error('Failed to post comment', { id: toastId });
      }
    } catch (err) {
      console.error('Comment error:', err);
      toast.error('Failed to post comment', { id: toastId });
    }
  }, [newComment, selectedReport]);

  const handleVote = useCallback(
    async (reportId, voteType) => {
      if (!userId) {
        toast.error('Please login to vote');
        return;
      }
      if (votingLoading[reportId]) return;

      setVotingLoading(prev => ({ ...prev, [reportId]: true }));

      try {
        const res = await fetch(`${BACKEND}/api/issues/${reportId}/vote`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({ voteType }),
        });

        if (!res.ok) {
          toast.error('Failed to register vote');
          return;
        }

        const updated = await res.json();
        setReports(prev => prev.map(r => (r._id === reportId ? updated.data : r)));

        if (selectedReport?._id === reportId) {
          setSelectedReport(updated.data);
        }

        toast.success(voteType === 'upvote' ? 'Upvoted!' : 'Downvoted!');
      } catch (err) {
        console.error('Vote error:', err);
        toast.error('Failed to register vote');
      } finally {
        setVotingLoading(prev => ({ ...prev, [reportId]: false }));
      }
    },
    [userId, votingLoading, selectedReport]
  );

  const confirmDelete = useCallback(async () => {
    setShowDeleteModal(false);
    const toastId = toast.loading('Deleting complaint...');

    try {
      const res = await fetch(`${BACKEND}/api/issues/${selectedReport._id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      if (res.ok) {
        setReports(prev => prev.filter(r => r._id !== selectedReport._id));
        setSelectedReport(null);
        toast.success('Complaint deleted successfully', { id: toastId });
      } else {
        toast.error('Failed to delete complaint', { id: toastId });
      }
    } catch (err) {
      console.error('Delete error:', err);
      toast.error('Failed to delete complaint', { id: toastId });
    }
  }, [selectedReport]);

  const canEdit = selectedReport && selectedReport.createdBy?._id === userId;
  const canDelete = selectedReport && selectedReport.createdBy?._id === userId;

  const isAssigned =
    selectedReport?.assignedTo &&
    (typeof selectedReport.assignedTo === 'string' ||
      selectedReport.assignedTo?._id ||
      selectedReport.assignedTo?.$oid);

  const isResolved = selectedReport?.status === 'resolved';

  const canAcceptIssue = selectedReport && userRole === 'Volunteer' && !isAssigned && !isResolved;

  const isAssignedToCurrentVolunteer =
    selectedReport?.assignedTo &&
    (selectedReport.assignedTo._id === userId || selectedReport.assignedTo === userId) &&
    userRole === 'Volunteer';

  const canDeclineIssue = selectedReport && isAssignedToCurrentVolunteer && !isResolved;

  const isUpvoted = useMemo(
    () =>
      selectedReport &&
      Array.isArray(selectedReport.upvotes) &&
      selectedReport.upvotes.includes(userId),
    [selectedReport, userId]
  );

  const isDownvoted = useMemo(
    () =>
      selectedReport &&
      Array.isArray(selectedReport.downvotes) &&
      selectedReport.downvotes.includes(userId),
    [selectedReport, userId]
  );

  const getDistanceInKm = useCallback((lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }, []);

  const isWithinRadius = useCallback(
    (report, radiusKm = 50) => {
      if (!userLocation || !report.location?.lat || !report.location?.lng) return false;

      const distance = getDistanceInKm(
        userLocation.lat,
        userLocation.lng,
        Number(report.location.lat),
        Number(report.location.lng)
      );

      return distance <= radiusKm;
    },
    [userLocation, getDistanceInKm]
  );

  const filteredReports = useMemo(() => {
    if (!userId) return [];

    if (viewMode === 'global') {
        return reports;
    }
    if (viewMode === 'all') {
      if (userRole === 'Volunteer') {
        if (!userLocation) return [];
        return reports.filter(r => isWithinRadius(r, 50));
      }
      return reports;
    }

    if (viewMode === 'mine') {
      if (userRole === 'Volunteer') {
        if (!userLocation) return [];

        return reports.filter(r => {
          const assignedId = r.assignedTo?._id || r.assignedTo;
          return assignedId === userId && isWithinRadius(r, 50);
        });
      }

      return reports.filter(r => {
        const createdId = r.createdBy?._id || r.createdBy;
        return createdId === userId;
      });
    }

    return reports;
  }, [reports, viewMode, userId, userRole, userLocation, isWithinRadius]);

  const handleModalClose = useCallback(() => {
    setSelectedReport(null);
    setIsEditing(false);
  }, []);

  const handleViewDetails = useCallback(report => {
    setSelectedReport(report);
  }, []);

  return (
    <div>
      <AuroraBackground />
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-10 relative">
        <div className="flex items-center justify-between mb-8 px-6">
          <h2 className="text-3xl font-bold">Community Reports</h2>

          <div className="flex gap-2">
            {userRole === 'Volunteer' && (
              <button
                onClick={() => setViewMode('all')}
                className={`px-4 py-1.5 rounded-md text-sm font-semibold border
                ${
                  viewMode === 'all'
                    ? 'bg-blue-600 text-white  border-blue-700'
                    : 'bg-white text-gray-700 border-2 border-gray-300 hover:bg-gray-100'
                }`}
              >
                Nearby
              </button>
            )}
            <button
              onClick={() => setViewMode('global')}
              className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all
                  ${
                    viewMode === 'global'
                      ? 'bg-blue-600 text-white  border-blue-700'
                      : 'bg-white text-gray-700 border-2 border-gray-300 hover:bg-gray-100'
                  }`}
            >
              {userRole === 'Volunteer' ? 'All Locations' : 'All Reports'}
            </button>
            <button
              onClick={() => setViewMode('mine')}
              className={`px-4 py-1.5 rounded-md text-sm font-semibold border
                  ${
                    viewMode === 'mine'
                      ? 'bg-blue-600 text-white border-blue-700'
                      : 'bg-white text-gray-700 border-2 border-gray-300 hover:bg-gray-100'
                  }`}
            >
              My Reports
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 px-6">
          {filteredReports.map(report => (
            <ReportCard
              key={report._id}
              report={report}
              userId={userId}
              onViewDetails={handleViewDetails}
              onVote={handleVote}
              isLoading={votingLoading[report._id]}
            />
          ))}
        </div>
      </main>

      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title={selectedReport?.title}
      />

      {showResolveModal && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-9999"
          onClick={() => {
            setShowResolveModal(false);
            setPendingStatus(null);
          }}
        >
          <div
            className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl"
            onClick={e => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold mb-3 text-red-600">Resolve Issue</h3>

            <p className="text-gray-700 mb-6">
              This issue will be marked as <b>resolved</b>.
              <br />
              This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowResolveModal(false);
                  setPendingStatus(null);
                }}
                className="px-4 py-2 rounded-md border"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  setShowResolveModal(false);
                  updateStatus(pendingStatus);
                  setPendingStatus(null);
                }}
                className="px-4 py-2 rounded-md bg-red-600 text-white"
              >
                Yes, Resolve
              </button>
            </div>
          </div>
        </div>
      )}

      <ReportModal
        selectedReport={selectedReport}
        isEditing={isEditing}
        editForm={editForm}
        comments={comments}
        newComment={newComment}
        userRole={userRole}
        userId={userId}
        canEdit={canEdit}
        canDelete={canDelete}
        canAcceptIssue={canAcceptIssue}
        canDeclineIssue={canDeclineIssue}
        isUpvoted={isUpvoted}
        isDownvoted={isDownvoted}
        votingLoading={votingLoading}
        loadingGPS={loadingGPS}
        onClose={handleModalClose}
        onEditStart={handleEditStart}
        onEditSave={handleEditSave}
        onEditCancel={() => setIsEditing(false)}
        onDelete={() => setShowDeleteModal(true)}
        onAcceptIssue={handleAcceptIssue}
        onDeclineIssue={handleDeclineIssue}
        onStatusChange={handleStatusUpdate}
        onVote={handleVote}
        onEditFormChange={handleEditFormChange}
        onLocationChange={loc => setEditForm(prev => ({ ...prev, location: loc }))}
        onImageUpload={handleImageUpload}
        onRemoveExistingImage={removeExistingImage}
        onRemoveNewImage={removeNewImage}
        onGetCurrentLocation={getCurrentLocation}
        onCommentChange={e => setNewComment(e.target.value)}
        onCommentSubmit={addComment}
      />
      <Footer />
    </div>
  );
}
