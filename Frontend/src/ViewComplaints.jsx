import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Home, 
  ClipboardList, 
  Eye, 
  LogIn, 
  UserPlus,
  Phone, 
  Mail, 
  Facebook, 
  Twitter, 
  Instagram,
  ChevronLeft,
  Filter,
  Search,
  Calendar,
  MapPin,
  AlertTriangle,
  MessageSquare,
  User,
  ThumbsUp,
  ThumbsDown,
  Send,
  X,
  Clock,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  Share2,
  Flag,
  Camera
} from 'lucide-react';
import { complaintsAPI, profileAPI, commentAPI } from './services/api';

// Import your images from assets folder
import garbageImage from './Assets/garbage-dumping.jpg';
import streetLightImage from './Assets/broken-street-light.jpg';
import waterLoggingImage from './Assets/water-logging.jpg';
import illegalParkingImage from './Assets/illegal-parking.jpg';
import garbageDetail1 from './Assets/garbage-detail1.jpg';
import garbageDetail2 from './Assets/garbage-detail2.jpg';
import waterLoggingDetail from './Assets/water-logging-detail.jpg';

const ViewComplaints = () => {
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [userLikes, setUserLikes] = useState({});
  const [userDislikes, setUserDislikes] = useState({});
  const [commentLikes, setCommentLikes] = useState({});
  const [commentDislikes, setCommentDislikes] = useState({});
  const [volunteerLocation, setVolunteerLocation] = useState('');
  
  // Default mock complaints
  const defaultComplaints = [
    {
      id: 1,
      title: "Dumping garbage beside roads",
      type: "Garbage",
      priority: "High",
      reportedOn: "Nov 25, 2025",
      address: "Opposite Nandi Hardwares, Mogarahalli, KRS main road, Mysore",
      landmark: "Opposite to Nandi Hardwares",
      description: "Smells bad and foul while going on the roadside. Increase in Mosquitoes and decease.",
      fullDescription: "Large pile of mixed waste including plastic, organic waste, and construction debris has been dumped illegally beside the main road. The waste has been accumulating for over a week and is causing severe odor issues. There is visible increase in mosquito population and rodents in the area. Local residents have reported health concerns.",
      discussion: [],
      imageUrl: garbageImage, // Imported image
      status: "pending",
      location: "Mysore",
      statusHistory: [
        { status: "Reported", date: "Nov 25, 2025", time: "10:30 AM" },
        { status: "Under Review", date: "Nov 26, 2025", time: "2:15 PM" }
      ],
      likes: 0,
      dislikes: 0,
      severity: "High",
      affectedArea: "500m radius",
      reporter: {
        name: "Rajesh Kumar",
        contact: "rajesh.k@email.com",
        anonymous: false
      },
      additionalImages: [
        garbageDetail1, // Imported image
        garbageDetail2  // Imported image
      ],
      assignedTo: "Mysore City Corporation",
      estimatedResolution: "Dec 2, 2025",
      category: "Public Health Hazard",
      tags: ["illegal-dumping", "mosquito-breeding", "health-risk"]
    },
    {
      id: 2,
      title: "Broken street light",
      type: "Infrastructure",
      priority: "Medium",
      reportedOn: "Nov 24, 2025",
      address: "Near Gandhi Circle, Mysore",
      landmark: "Next to Central Library",
      description: "Street light not working for past 3 days. Safety concern for pedestrians.",
      fullDescription: "Pole number #SL-245 near Gandhi Circle has been non-functional for 72 hours. The light flickers occasionally but mostly remains off. This is a major safety concern for evening walkers and students returning from library. Two minor accidents have been reported due to poor visibility.",
      discussion: [],
      imageUrl: streetLightImage, // Imported image
      status: "in-progress",
      location: "Mysore",
      statusHistory: [
        { status: "Reported", date: "Nov 24, 2025", time: "9:15 AM" },
        { status: "Assigned", date: "Nov 25, 2025", time: "11:00 AM" },
        { status: "Technician Dispatched", date: "Nov 26, 2025", time: "3:30 PM" }
      ],
      likes: 0,
      dislikes: 0,
      severity: "Medium",
      affectedArea: "Gandhi Circle area",
      reporter: {
        name: "Priya Sharma",
        contact: "priya.s@email.com",
        anonymous: true
      },
      additionalImages: [],
      assignedTo: "Mysore Electricity Board",
      estimatedResolution: "Nov 28, 2025",
      category: "Public Safety",
      tags: ["street-light", "safety", "infrastructure"]
    },
    {
      id: 3,
      title: "Water logging on main road",
      type: "Drainage",
      priority: "High",
      reportedOn: "Nov 23, 2025",
      address: "Vijayanagar 2nd stage, Mysore",
      landmark: "Near Metro station",
      description: "Severe water logging after rain. Vehicles getting stuck.",
      fullDescription: "During monsoon, 2-3 feet water accumulates on the main road blocking traffic completely. Drainage system appears clogged with plastic waste and silt. Several vehicles have been stuck in the water, causing traffic jams. Pedestrians cannot use the footpaths.",
      discussion: [],
      imageUrl: waterLoggingImage, // Imported image
      status: "solved",
      statusHistory: [
        { status: "Reported", date: "Nov 23, 2025", time: "2:45 PM" },
        { status: "Emergency Team Dispatched", date: "Nov 24, 2025", time: "10:00 AM" },
        { status: "Drains Cleaned", date: "Nov 24, 2025", time: "6:30 PM" },
        { status: "Resolved", date: "Nov 25, 2025", time: "11:00 AM" }
      ],
      likes: 0,
      dislikes: 0,
      severity: "Critical",
      affectedArea: "200m stretch",
      reporter: {
        name: "Anil Verma",
        contact: "anil.v@email.com",
        anonymous: false
      },
      additionalImages: [
        waterLoggingDetail // Imported image
      ],
      assignedTo: "Drainage Department",
      estimatedResolution: "Completed",
      category: "Water Management",
      tags: ["water-logging", "drainage", "monsoon"]
    },
    {
      id: 4,
      title: "Illegal parking on footpath",
      type: "Traffic",
      priority: "Medium",
      reportedOn: "Nov 22, 2025",
      address: "Kalidas Road, Mysore",
      landmark: "Near City Market",
      description: "Cars parked on footpath causing obstruction to pedestrians.",
      fullDescription: "Daily illegal parking by shop owners and customers blocks the entire footpath. Elderly and disabled persons cannot use the pathway. Several complaints to local traffic police have gone unaddressed. Need permanent solution with bollards or regular patrolling.",
      discussion: [],
      imageUrl: illegalParkingImage, // Imported image
      status: "pending",
      statusHistory: [
        { status: "Reported", date: "Nov 22, 2025", time: "8:30 AM" }
      ],
      likes: 0,
      dislikes: 0,
      severity: "Medium",
      affectedArea: "Kalidas Road footpath",
      reporter: {
        name: "Suresh Patel",
        contact: "suresh.p@email.com",
        anonymous: true
      },
      additionalImages: [],
      assignedTo: "Traffic Police",
      estimatedResolution: "Under discussion",
      category: "Traffic Violation",
      tags: ["illegal-parking", "footpath", "traffic"]
    }
  ];
  
  // Initialize state with complaints from API or localStorage
  const [complaints, setComplaints] = useState(defaultComplaints);
  const [isLoadingComplaints, setIsLoadingComplaints] = useState(true);

  const mapApiComplaintToUi = (c) => {
    const rawStatus = c?.status;
    const status = rawStatus === 'received'
      ? 'pending'
      : rawStatus === 'in_review'
        ? 'in-progress'
        : rawStatus === 'resolved'
          ? 'solved'
          : (rawStatus || 'pending');

    const createdAt = c?.createdAt ? new Date(c.createdAt) : null;
    const reportedOn = createdAt
      ? createdAt.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' })
      : '';

    const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    const backendOrigin = apiBaseUrl.replace(/\/?api\/?$/, '');
    const photoPath = c?.photo;
    const photoUrl = typeof photoPath === 'string'
      ? (photoPath.startsWith('http') ? photoPath : `${backendOrigin}${photoPath.startsWith('/') ? '' : '/'}${photoPath}`)
      : null;

    return {
      id: c?._id || c?.id,
      title: c?.title || '',
      type: c?.issueType || c?.type || '',
      priority: c?.priority || '',
      reportedOn,
      address: c?.address || '',
      landmark: c?.landmark || '',
      description: c?.description || '',
      fullDescription: c?.fullDescription || c?.description || '',
      discussion: Array.isArray(c?.discussion) ? c.discussion : [],
      imageUrl: photoUrl,
      status,
      location: c?.location || '',
      statusHistory: Array.isArray(c?.statusHistory) ? c.statusHistory : [],
      likes: typeof c?.likes === 'number' ? c.likes : 0,
      dislikes: typeof c?.dislikes === 'number' ? c.dislikes : 0,
      severity: c?.severity || (c?.priority || ''),
      affectedArea: c?.affectedArea || '',
      reporter: c?.reporter || { name: '', contact: '', anonymous: false },
      additionalImages: Array.isArray(c?.additionalImages) ? c.additionalImages : [],
      assignedTo: c?.assigned_to || c?.assignedTo || '',
      estimatedResolution: c?.estimatedResolution || '',
      category: c?.category || '',
      tags: Array.isArray(c?.tags) ? c.tags : []
    };
  };

  const mapApiCommentToUi = (c) => {
    const createdAt = c?.createdAt ? new Date(c.createdAt) : null;
    const userName = c?.userId?.firstName
      ? `${c.userId.firstName || ''} ${c.userId.lastName || ''}`.trim()
      : (c?.userId?.name || 'User');

    return {
      id: c?._id || c?.id || Date.now(),
      user: userName || 'User',
      comment: c?.content || '',
      time: createdAt ? createdAt.toLocaleString() : 'Just now',
      likes: 0,
      dislikes: 0,
      userAvatar: (userName || 'U').charAt(0).toUpperCase()
    };
  };

  // Effect to fetch complaints from API
  useEffect(() => {
    setIsLoadingComplaints(true);

    // Community feed should show all complaints (not only the logged-in user's complaints).
    complaintsAPI.getAll()
      .then((data) => {
        if (Array.isArray(data)) {
          setComplaints(data.map(mapApiComplaintToUi));
        } else {
          setComplaints(defaultComplaints);
        }
        setIsLoadingComplaints(false);
      })
      .catch((error) => {
        console.error('Error fetching complaints:', error);
        setComplaints(defaultComplaints);
        setIsLoadingComplaints(false);
      });
  }, []);

  // Detect volunteer's location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          // For demo purposes, mock the location as 'Mysore'
          // In real app, use reverse geocoding API to get city
          setVolunteerLocation('Mysore');
        },
        (error) => {
          console.error('Error getting location:', error);
          // Fallback to default location
          setVolunteerLocation('Mysore');
        }
      );
    } else {
      setVolunteerLocation('Mysore');
    }
  }, []);

  const openComplaintDetails = async (complaint) => {
    const base = {
      ...complaint,
      likes: complaint.likes || 0,
      dislikes: complaint.dislikes || 0,
      discussion: []
    };

    setSelectedComplaint(base);
    setIsModalOpen(true);
    setCommentText('');

    try {
      const apiComments = await commentAPI.getByComplaintId(base.id);
      const discussion = Array.isArray(apiComments) ? apiComments.map(mapApiCommentToUi).reverse() : [];
      setSelectedComplaint(prev => prev ? ({ ...prev, discussion }) : prev);
    } catch (err) {
      // keep modal open even if comments fail
      console.error('Failed to load comments:', err);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedComplaint(null);
    setCommentText('');
  };

  const handleAddComment = async () => {
    if (!commentText.trim() || !selectedComplaint) return;

    try {
      await commentAPI.add(selectedComplaint.id, commentText.trim());
      const apiComments = await commentAPI.getByComplaintId(selectedComplaint.id);
      const discussion = Array.isArray(apiComments) ? apiComments.map(mapApiCommentToUi).reverse() : [];

      setSelectedComplaint(prev => prev ? ({ ...prev, discussion }) : prev);
      setCommentText('');
    } catch (err) {
      console.error('Failed to add comment:', err);
    }
  };

  const handleLikeComment = (commentId) => {
    if (!selectedComplaint) return;
    
    const hasLiked = commentLikes[commentId];
    const hasDisliked = commentDislikes[commentId];
    
    if (!hasLiked) {
      setCommentLikes(prev => ({ ...prev, [commentId]: true }));
      if (hasDisliked) {
        setCommentDislikes(prev => ({ ...prev, [commentId]: false }));
      }
      
      setSelectedComplaint(prev => ({
        ...prev,
        discussion: prev.discussion.map(comment => 
          comment.id === commentId 
            ? { 
                ...comment, 
                likes: comment.likes + 1,
                dislikes: hasDisliked ? comment.dislikes - 1 : comment.dislikes
              }
            : comment
        )
      }));
    }
  };

  const handleDislikeComment = (commentId) => {
    if (!selectedComplaint) return;
    
    const hasDisliked = commentDislikes[commentId];
    const hasLiked = commentLikes[commentId];
    
    if (!hasDisliked) {
      setCommentDislikes(prev => ({ ...prev, [commentId]: true }));
      if (hasLiked) {
        setCommentLikes(prev => ({ ...prev, [commentId]: false }));
      }
      
      setSelectedComplaint(prev => ({
        ...prev,
        discussion: prev.discussion.map(comment => 
          comment.id === commentId 
            ? { 
                ...comment, 
                dislikes: comment.dislikes + 1,
                likes: hasLiked ? comment.likes - 1 : comment.likes
              }
            : comment
        )
      }));
    }
  };

  const handleLikeComplaint = () => {
    if (!selectedComplaint) return;
    
    const complaintId = selectedComplaint.id;
    const hasLiked = userLikes[complaintId];
    const hasDisliked = userDislikes[complaintId];
    
    if (!hasLiked) {
      setUserLikes(prev => ({ ...prev, [complaintId]: true }));
      if (hasDisliked) {
        setUserDislikes(prev => ({ ...prev, [complaintId]: false }));
      }
      
      const updatedComplaint = {
        ...selectedComplaint,
        likes: selectedComplaint.likes + 1,
        dislikes: hasDisliked ? selectedComplaint.dislikes - 1 : selectedComplaint.dislikes
      };
      
      setSelectedComplaint(updatedComplaint);
      
      setComplaints(prev => prev.map(complaint => 
        complaint.id === complaintId
          ? updatedComplaint
          : complaint
      ));
    }
  };

  const handleDislikeComplaint = () => {
    if (!selectedComplaint) return;
    
    const complaintId = selectedComplaint.id;
    const hasDisliked = userDislikes[complaintId];
    const hasLiked = userLikes[complaintId];
    
    if (!hasDisliked) {
      setUserDislikes(prev => ({ ...prev, [complaintId]: true }));
      if (hasLiked) {
        setUserLikes(prev => ({ ...prev, [complaintId]: false }));
      }
      
      const updatedComplaint = {
        ...selectedComplaint,
        dislikes: selectedComplaint.dislikes + 1,
        likes: hasLiked ? selectedComplaint.likes - 1 : selectedComplaint.likes
      };
      
      setSelectedComplaint(updatedComplaint);
      
      setComplaints(prev => prev.map(complaint => 
        complaint.id === complaintId
          ? updatedComplaint
          : complaint
      ));
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'pending': return <Clock className="text-yellow-500" size={20} />;
      case 'in-progress': return <AlertCircle className="text-blue-500" size={20} />;
      case 'solved': return <CheckCircle className="text-green-500" size={20} />;
      default: return <Clock className="text-gray-500" size={20} />;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'in-progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'solved': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'High': return 'bg-red-100 text-red-700';
      case 'Medium': return 'bg-yellow-100 text-yellow-700';
      case 'Low': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  // Filter complaints based on status, search, and location
  const filteredComplaints = complaints.filter(complaint => {
    const matchesStatus = activeFilter === 'all' || complaint.status === activeFilter;
    const matchesSearch = searchTerm === '' || 
      complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = !volunteerLocation || !complaint.location || complaint.location === volunteerLocation;
    return matchesStatus && matchesSearch && matchesLocation;
  });

  // Calculate status counts for filtered complaints
  const statusCounts = {
    all: complaints.length,
    pending: complaints.filter(c => c.status === 'pending').length,
    'in-progress': complaints.filter(c => c.status === 'in-progress').length,
    solved: complaints.filter(c => c.status === 'solved').length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Link to="/" className="flex items-center space-x-2 no-underline">
                <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-lg flex items-center justify-center shadow-md">
                  <span className="text-black font-bold text-lg">CS</span>
                </div>
                <span className="text-2xl font-bold text-gray-900">
                  Clean<span className="text-amber-600">Street</span>
                </span>
              </Link>
            </div>

            <nav className="hidden md:flex items-center space-x-2">
              <Link to="/" className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 text-gray-700 no-underline">
                <Home size={20} />
                <span className="font-medium">Home</span>
              </Link>
              <Link to="/report" className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 text-gray-700 no-underline">
                <ClipboardList size={20} />
                <span className="font-medium">Report Issue</span>
              </Link>
              <Link to="/complaints" className="flex items-center space-x-2 px-4 py-2 bg-amber-100 text-amber-700 rounded-lg no-underline">
                <Eye size={20} />
                <span className="font-medium">View Complaints</span>
              </Link>
            </nav>

            <Link to="/dashboard" className="md:hidden flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 no-underline">
              <ChevronLeft size={20} />
              <span>Back</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Community Complaints</h1>
              <p className="text-gray-600">Track, discuss, and engage with reported issues</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search complaints..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Status Filters */}
          <div className="flex flex-wrap gap-2 mb-8">
            {['all', 'pending', 'in-progress', 'solved'].map((status) => (
              <button
                key={status}
                onClick={() => setActiveFilter(status)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeFilter === status
                    ? 'bg-amber-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
              >
                {status === 'all' ? 'All Complaints' : 
                 status === 'in-progress' ? 'In Progress' : 
                 status.charAt(0).toUpperCase() + status.slice(1)}
                <span className="ml-2 bg-white/20 px-2 py-1 rounded-full text-sm">
                  {statusCounts[status]}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Complaints Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredComplaints.map((complaint) => (
            <div 
              key={complaint.id} 
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-200 cursor-pointer group"
              onClick={() => openComplaintDetails(complaint)}
            >
              {/* Image Section */}
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={complaint.imageUrl}
                  alt={complaint.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute top-3 left-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(complaint.priority)}`}>
                    {complaint.priority} Priority
                  </span>
                </div>
                <div className="absolute top-3 right-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(complaint.status)}`}>
                    {getStatusIcon(complaint.status)}
                    {complaint.status === 'in-progress' ? 'In Progress' : 
                     complaint.status.charAt(0).toUpperCase() + complaint.status.slice(1)}
                  </span>
                </div>
                
                {/* LIKE COUNT ON IMAGE - POSITIONED AT BOTTOM LEFT */}
                <div className="absolute bottom-3 left-3 flex items-center bg-black/60 backdrop-blur-sm rounded-full px-3 py-1">
                  <ThumbsUp size={14} className="text-white mr-1" />
                  <span className="text-white font-medium text-sm">{complaint.likes}</span>
                </div>
                
                <div className="absolute bottom-3 right-3">
                  <div className="flex items-center text-white/90 text-sm">
                    <Calendar size={14} className="mr-1" />
                    <span>{complaint.reportedOn}</span>
                  </div>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-5">
                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">{complaint.title}</h3>
                <div className="flex items-center text-gray-600 mb-3 text-sm">
                  <MapPin size={14} className="mr-1 flex-shrink-0" />
                  <span className="truncate">{complaint.address}</span>
                </div>
                
                <p className="text-gray-700 mb-4 line-clamp-2 text-sm">{complaint.description}</p>
                
                {/* Bottom Bar with Like/Dislike Counts */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center text-gray-600 hover:text-green-600 transition-colors">
                      <ThumbsUp size={16} className="mr-1" />
                      <span className="text-sm font-medium">{complaint.likes}</span>
                    </div>
                    <div className="flex items-center text-gray-600 hover:text-red-600 transition-colors">
                      <ThumbsDown size={16} className="mr-1" />
                      <span className="text-sm font-medium">{complaint.dislikes}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <MessageSquare size={16} className="mr-1" />
                      <span className="text-sm font-medium">{complaint.discussion.length}</span>
                    </div>
                  </div>
                  <div className="text-amber-600 font-medium text-sm flex items-center">
                    View Details
                    <ChevronRight size={16} className="ml-1" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State for No Complaints */}
        {filteredComplaints.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle className="text-gray-400" size={48} />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No complaints found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-gray-500">
            <p>© 2025 CleanStreet | Making Communities Cleaner Together</p>
          </div>
        </div>
      </footer>

      {/* Modal for Detailed View */}
      {isModalOpen && selectedComplaint && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-4xl my-8 max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(selectedComplaint.priority)}`}>
                      {selectedComplaint.priority} Priority
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${getStatusColor(selectedComplaint.status)}`}>
                      {getStatusIcon(selectedComplaint.status)}
                      {selectedComplaint.status === 'in-progress' ? 'In Progress' : 
                       selectedComplaint.status.charAt(0).toUpperCase() + selectedComplaint.status.slice(1)}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedComplaint.title}</h2>
                  <div className="flex items-center text-gray-600 mt-2">
                    <Calendar size={16} className="mr-2" />
                    Reported: {selectedComplaint.reportedOn}
                  </div>
                </div>
                <button 
                  onClick={closeModal}
                  className="ml-4 p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="overflow-y-auto max-h-[calc(90vh-200px)]">
              {/* Main Content */}
              <div className="p-6">
                {/* Images Section */}
                <div className="mb-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                      <img 
                        src={selectedComplaint.imageUrl}
                        alt="Main issue"
                        className="w-full h-64 object-cover rounded-lg"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {selectedComplaint.additionalImages.map((img, index) => (
                        <img 
                          key={index}
                          src={img}
                          alt={`Additional view ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Detailed Information Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                  {/* Left Column - Issue Details */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <AlertTriangle size={20} className="mr-2 text-amber-600" />
                      Issue Details
                    </h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Full Description</label>
                        <p className="text-gray-900 mt-1 bg-gray-50 p-4 rounded-lg">
                          {selectedComplaint.fullDescription}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-500">Category</label>
                          <p className="text-gray-900 font-medium">{selectedComplaint.category}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Severity</label>
                          <p className="text-gray-900 font-medium">{selectedComplaint.severity}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Affected Area</label>
                          <p className="text-gray-900 font-medium">{selectedComplaint.affectedArea}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Assigned To</label>
                          <p className="text-gray-900 font-medium">{selectedComplaint.assignedTo}</p>
                        </div>
                      </div>

                      {/* Tags */}
                      <div>
                        <label className="text-sm font-medium text-gray-500">Tags</label>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {selectedComplaint.tags.map((tag, index) => (
                            <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Location & Status */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <MapPin size={20} className="mr-2 text-red-600" />
                      Location & Status
                    </h3>

                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Address</label>
                        <p className="text-gray-900 mt-1 bg-gray-50 p-4 rounded-lg">
                          {selectedComplaint.address}
                        </p>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-500">Landmark</label>
                        <p className="text-gray-900 font-medium">{selectedComplaint.landmark}</p>
                      </div>

                      {/* Status Timeline */}
                      <div>
                        <label className="text-sm font-medium text-gray-500 mb-3 block">Status Timeline</label>
                        <div className="space-y-3">
                          {selectedComplaint.statusHistory.map((history, index) => (
                            <div key={index} className="flex items-center">
                              <div className={`w-3 h-3 rounded-full mr-3 ${
                                index === selectedComplaint.statusHistory.length - 1 
                                  ? 'bg-green-500' 
                                  : 'bg-blue-500'
                              }`} />
                              <div className="flex-1">
                                <div className="font-medium">{history.status}</div>
                                <div className="text-sm text-gray-500">
                                  {history.date} at {history.time}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Estimated Resolution */}
                      {selectedComplaint.estimatedResolution && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <div className="flex items-center">
                            <Clock size={20} className="text-blue-600 mr-3" />
                            <div>
                              <div className="font-medium text-blue-900">Estimated Resolution</div>
                              <div className="text-blue-700">{selectedComplaint.estimatedResolution}</div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Like/Dislike Section */}
                <div className="bg-gray-50 rounded-lg p-6 mb-8">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                      <button 
                        onClick={handleLikeComplaint}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                          userLikes[selectedComplaint.id]
                            ? 'bg-green-100 text-green-700 border border-green-300'
                            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <ThumbsUp size={20} />
                        <span>{selectedComplaint.likes}</span>
                      </button>
                      <button 
                        onClick={handleDislikeComplaint}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                          userDislikes[selectedComplaint.id]
                            ? 'bg-red-100 text-red-700 border border-red-300'
                            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <ThumbsDown size={20} />
                        <span>{selectedComplaint.dislikes}</span>
                      </button>
                    </div>
                    <div className="flex items-center space-x-4">
                      <button className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        <Share2 size={20} />
                        <span>Share</span>
                      </button>
                      <button className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        <Flag size={20} />
                        <span>Flag</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Discussion Section */}
                <div className="border-t pt-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">
                    Discussion ({selectedComplaint.discussion.length})
                  </h3>

                  {/* Add Comment */}
                  <div className="mb-8">
                    <textarea
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Add your comment or suggestion..."
                      className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                      rows="3"
                    />
                    <div className="flex justify-end mt-3">
                      <button
                        onClick={handleAddComment}
                        disabled={!commentText.trim()}
                        className={`px-6 py-2 rounded-lg font-medium flex items-center space-x-2 ${
                          commentText.trim()
                            ? 'bg-amber-600 text-white hover:bg-amber-700'
                            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        <Send size={18} />
                        <span>Add Comment</span>
                      </button>
                    </div>
                  </div>

                  {/* Comments List */}
                  <div className="space-y-6">
                    {selectedComplaint.discussion.length === 0 ? (
                      <div className="text-center py-8 bg-gray-50 rounded-lg">
                        <MessageSquare size={48} className="mx-auto text-gray-400 mb-3" />
                        <p className="text-gray-600">No comments yet. Be the first to comment!</p>
                      </div>
                    ) : (
                      selectedComplaint.discussion.map((comment) => (
                        <div key={comment.id} className="border border-gray-200 rounded-lg p-5">
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center mr-3">
                                <span className="font-medium text-amber-700">{comment.userAvatar}</span>
                              </div>
                              <div>
                                <div className="font-medium text-gray-900">{comment.user}</div>
                                <div className="text-sm text-gray-500">{comment.time}</div>
                              </div>
                            </div>
                          </div>
                          
                          <p className="text-gray-700 mb-4">{comment.comment}</p>
                          
                          <div className="flex items-center space-x-4">
                            <button 
                              onClick={() => handleLikeComment(comment.id)}
                              className={`flex items-center space-x-1 transition-colors ${
                                commentLikes[comment.id]
                                  ? 'text-green-600'
                                  : 'text-gray-600 hover:text-green-600'
                              }`}
                            >
                              <ThumbsUp size={16} />
                              <span>{comment.likes}</span>
                            </button>
                            <button 
                              onClick={() => handleDislikeComment(comment.id)}
                              className={`flex items-center space-x-1 transition-colors ${
                                commentDislikes[comment.id]
                                  ? 'text-red-600'
                                  : 'text-gray-600 hover:text-red-600'
                              }`}
                            >
                              <ThumbsDown size={16} />
                              <span>{comment.dislikes}</span>
                            </button>
                            <button className="text-gray-600 hover:text-amber-600 text-sm">
                              Reply
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewComplaints;