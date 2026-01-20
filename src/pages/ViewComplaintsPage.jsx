import { useState, useEffect } from "react";
import { Search, Filter, ChevronDown, RefreshCw } from "lucide-react";

// Layout Components
import { Header, PageWrapper } from "../components/layout";

// Common Components
import { Loader } from "../components/common";

// Feature Components
import { ComplaintCard, ComplaintModal } from "../components/features/complaints";

// Services
import { issueService } from "../services/issueService";

// Constants
import { ISSUE_TYPES } from "../constants";

export default function ViewComplaintsPage() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [complaints, setComplaints] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch complaints
  const fetchComplaints = async (reset = false) => {
    try {
      if (reset) {
        setIsLoading(true);
        setPage(1);
      } else {
        setIsLoadingMore(true);
      }

      const params = {
        page: reset ? 1 : page,
        limit: 8,
      };

      if (statusFilter) params.status = statusFilter;
      if (typeFilter) params.issueType = typeFilter;
      if (searchQuery) params.search = searchQuery;

let newIssues = [];
let total = 0;
 

if (user?.role === "Volunteer") {
  // Offered issues (Accept / Reject ke liye)
  const offeredRes = await issueService.getOfferedIssues();
  const offeredIssues = offeredRes.issues || [];

  // Assigned issues (Accepted ke baad)
  const assignedRes = await issueService.getAssignedIssues();
  const assignedIssues = assignedRes.issues || [];

  // Combine both
  newIssues = [...offeredIssues, ...assignedIssues];
  total = newIssues.length;

  setHasMore(false);
} else {
  const response = await issueService.getIssues(params);

  newIssues = response.issues || [];
  total = response.total || newIssues.length;

  setHasMore(newIssues.length === 8);
}


      if (reset) {
        setComplaints(newIssues);
      } else {
        setComplaints((prev) => [...prev, ...newIssues]);
      }

      setTotalCount(total);

      setHasMore(user?.role !== "Volunteer" && newIssues.length === 8);

    } catch (error) {
      console.error("Error fetching complaints:", error);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchComplaints(true);
  }, [statusFilter, typeFilter]);

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchComplaints(true);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Load more
  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
  };

  useEffect(() => {
    if (page > 1) {
      fetchComplaints();
    }
  }, [page]);

  // Handle like/dislike update from card
  const handleComplaintUpdate = (id, updates) => {
    if (user?.role === "Volunteer" && updates.volunteerResponse === "Rejected") {
    setComplaints((prev) => prev.filter((c) => c._id !== id));
    return;
  }
    setComplaints((prev) =>
      prev.map((complaint) =>
        complaint._id === id ? { ...complaint, ...updates } : complaint
      )
    );
    // Also update selected complaint if it's the same
    if (selectedComplaint?._id === id) {
      setSelectedComplaint((prev) => (prev ? { ...prev, ...updates } : null));
    }
  };

  const handleCardClick = (complaint) => {
    setSelectedComplaint(complaint);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedComplaint(null);
  };

  const handleSaveComplaint = async (id, updateData) => {
    try {
      const updatedIssue = await issueService.updateIssue(id, updateData);
      // Update the complaint in the list
      setComplaints((prev) =>
        prev.map((complaint) =>
          complaint._id === id ? { ...complaint, ...updatedIssue } : complaint
        )
      );
      // Update selected complaint for modal
      setSelectedComplaint((prev) => (prev ? { ...prev, ...updatedIssue } : null));
    } catch (error) {
      console.error("Error updating complaint:", error);
      throw error;
    }
  };

  // Handle delete from modal
  const handleDeleteComplaint = (id) => {
    // Remove the complaint from the list
    setComplaints((prev) => prev.filter((complaint) => complaint._id !== id));
    setTotalCount((prev) => prev - 1);
  };

  // Filter options
  const statusOptions = [
    { value: "", label: "All Status" },
    { value: "Pending", label: "Pending" },
    { value: "In Progress", label: "In Progress" },
    { value: "Resolved", label: "Resolved" },
  ];

  const typeOptions = [
    { value: "", label: "All Types" },
    ...ISSUE_TYPES.map((type) => ({ value: type, label: type })),
  ];

  if (isLoading) {
    return <Loader message="Loading community reports..." />;
  }

  return (
    <PageWrapper>
      {/* Header */}
      <Header activeNav="/complaints" />

      {/* Main Content */}
      <div className="relative px-4 md:px-6 py-6 md:py-8 max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8 animate-fade-in-up">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Community Reports
          </h1>
          <p className="text-gray-500">
            View and engage with civic issues reported by your community
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 animate-fade-in-up delay-100">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search complaints..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all bg-white/80 backdrop-blur hover:bg-white"
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-3">
            {/* Status Filter */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none bg-white/80 backdrop-blur hover:bg-white border border-gray-200 rounded-xl px-4 py-3 pr-10 text-sm font-medium text-gray-700 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all cursor-pointer"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            {/* Type Filter */}
            <div className="relative">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="appearance-none bg-white/80 backdrop-blur hover:bg-white border border-gray-200 rounded-xl px-4 py-3 pr-10 text-sm font-medium text-gray-700 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all cursor-pointer"
              >
                {typeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6 animate-fade-in-up delay-200">
          <p className="text-sm text-gray-500">
            Showing <span className="font-semibold text-gray-700">{complaints.length}</span>
            {totalCount > complaints.length && (
              <> of <span className="font-semibold text-gray-700">{totalCount}</span></>
            )} reports
          </p>
          <button
            onClick={() => fetchComplaints(true)}
            className="flex items-center gap-2 text-sm text-green-600 hover:text-green-700 font-medium transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        {/* Complaints Grid */}
        {complaints.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in-up delay-300">
              {complaints.map((complaint) => (
                <ComplaintCard
                  key={complaint._id}
                  complaint={complaint}
                  onClick={handleCardClick}
                  onUpdate={handleComplaintUpdate}
                />
              ))}
            </div>

            {/* Load More Button */}
            {hasMore && (
              <div className="flex justify-center mt-10">
                <button
                  onClick={handleLoadMore}
                  disabled={isLoadingMore}
                  className="flex items-center gap-2 px-8 py-3 bg-white border-2 border-green-500 text-green-600 font-semibold rounded-full hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md"
                >
                  {isLoadingMore ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    "Load More Reports"
                  )}
                </button>
              </div>
            )}
          </>
        ) : (
          /* Empty State */
          <div className="text-center py-16 animate-fade-in-up">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Filter className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No reports found
            </h3>
            <p className="text-gray-500 mb-6">
              {searchQuery || statusFilter || typeFilter
                ? "Try adjusting your filters or search query"
                : "Be the first to report an issue in your community"}
            </p>
            {(searchQuery || statusFilter || typeFilter) && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("");
                  setTypeFilter("");
                }}
                className="px-6 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-full hover:shadow-lg transition-all"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Complaint Detail Modal */}
      <ComplaintModal
        complaint={selectedComplaint}
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSave={handleSaveComplaint}
        onDelete={handleDeleteComplaint}
      />
    </PageWrapper>
  );
}
