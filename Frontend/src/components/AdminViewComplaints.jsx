import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import axios from 'axios';
import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import {
  FiAlertCircle,
  FiCalendar,
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
  FiChevronUp,
  FiClock,
  FiEdit2,
  FiLoader,
  FiMapPin,
  FiSearch,
  FiTrash2,
  FiUser,
  FiX,
  FiMoreVertical,
} from 'react-icons/fi';
import CustomSelect from '../components/CustomSelect';
import { createPortal } from 'react-dom';

const isValidMongoId = id => typeof id === 'string' && /^[0-9a-fA-F]{24}$/.test(id);

const UserNameDisplay = ({ userId, type, status }) => {
  const [name, setName] = useState('Loading...');
  const BACKEND = import.meta.env.VITE_API_URL || 'http://localhost:4000';
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (type === 'assigned') {
      if (!status) {
        setName('Not Assigned');
        return;
      }

      if (!isValidMongoId(userId)) {
        setName('User not found');
        return;
      }
    }
    if (type === 'reported') {
      if (!isValidMongoId(userId)) {
        setName('User not found');
        return;
      }
    }

    const fetchUser = async () => {
      try {
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const res = await axios.get(`${BACKEND}/api/user/${userId}`, { headers });
        setName(res.data.data.name);
      } catch (err) {
        console.error(`Failed to fetch user ${userId}`, err);
        setName('User not found');
      }
    };

    fetchUser();
  }, [userId, type, status]);

  return (
    <span
      className={
        name === 'Not Assigned'
          ? 'bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium'
          : name === 'User not found'
            ? 'bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium'
            : 'text-gray-900'
      }
    >
      {name}
    </span>
  );
};

const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const getNearbyVolunteers = (complaintLocation, volunteers) => {
  if (!complaintLocation?.lat || !complaintLocation?.lng) {
    return [];
  }

  const complaintLat = complaintLocation.lat;
  const complaintLng = complaintLocation.lng;

  return volunteers.filter(volunteer => {
    if (!volunteer.coordinates?.lat || !volunteer.coordinates?.lng) {
      return false;
    }
    const distance = calculateDistance(
      complaintLat,
      complaintLng,
      volunteer.coordinates.lat,
      volunteer.coordinates.lng
    );
    return distance <= 50;
  });
};

const ComplaintModal = ({ complaint, onClose, onDelete, onAssign, volunteers }) => {
  const [selectedVolunteer, setSelectedVolunteer] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);

  const nearbyVolunteers = useMemo(() => {
    return getNearbyVolunteers(complaint.location, volunteers);
  }, [complaint.location, volunteers]);

  const getTimeUnassigned = () => {
    if (complaint.acceptedAt) return null;

    const createdDate = new Date(complaint.createdAt);
    const now = new Date();
    const diffMs = now - createdDate;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ${diffHours} hour${diffHours !== 1 ? 's' : ''}`;
    }
    return `${diffHours} hour${diffHours !== 1 ? 's' : ''}`;
  };

  const handleDelete = async () => {
    if (
      !window.confirm(
        'Are you sure you want to delete this complaint? This action cannot be undone.'
      )
    ) {
      return;
    }

    setIsDeleting(true);
    try {
      await onDelete(complaint._id);
      toast.success('Complaint deleted successfully');
      onClose();
    } catch (err) {
      toast.error('Failed to delete complaint');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleAssign = async () => {
    if (!selectedVolunteer) {
      toast.error('Please select a volunteer');
      return;
    }

    const selectedUser = nearbyVolunteers.find(v => v.name === selectedVolunteer);

    if (!selectedUser) {
      toast.error('Selected volunteer not found');
      return;
    }

    setIsAssigning(true);
    try {
      await onAssign(complaint._id, selectedUser._id);
      toast.success('Complaint assigned successfully');
      onClose();
    } catch (err) {
      toast.error('Failed to assign complaint');
    } finally {
      setIsAssigning(false);
    }
  };

  const timeUnassigned = getTimeUnassigned();
  const reporterId = complaint.createdBy?._id || complaint.createdBy;
  const assigneeId = complaint.assignedTo?._id || complaint.assignedTo;

  const volunteerOptions = nearbyVolunteers.map(v => v.name);

  return createPortal(
    <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-2xl font-bold text-gray-900">Complaint Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            title="Close"
            aria-label="Close modal"
          >
            <FiX className="w-6 h-6 text-gray-500 hover:text-gray-700" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{complaint.title}</h3>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {complaint.description || 'No description provided'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <FiMapPin className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-500">Address</p>
                <p className="text-gray-900 truncate">{complaint.address || 'N/A'}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <FiCalendar className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-500">Reported At</p>
                <p className="text-gray-900">{complaint.createdAt?.split('T')[0] || 'N/A'}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <FiUser className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-500">Reported By</p>
                <UserNameDisplay userId={reporterId} type="reported" />
              </div>
            </div>

            <div className="flex items-start gap-3">
              <FiAlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-500">Status</p>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                    complaint.status === 'Pending' || complaint.status === 'received'
                      ? 'bg-yellow-100 text-yellow-800'
                      : complaint.status === 'In Progress' || complaint.status === 'in-progress'
                        ? 'bg-blue-100 text-blue-800'
                        : complaint.status === 'Resolved' || complaint.status === 'resolved'
                          ? 'bg-green-100 text-green-800'
                          : complaint.status === 'Rejected'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {complaint.status}
                </span>
              </div>
            </div>
          </div>

          {timeUnassigned && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <FiClock className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-yellow-900">Unassigned Duration</p>
                  <p className="text-yellow-700">{timeUnassigned}</p>
                </div>
              </div>
            </div>
          )}

          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Assignment</h3>

            {complaint.acceptedAt && assigneeId ? (
              <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <p className="text-sm font-medium text-gray-500 mb-2">Currently Assigned To</p>
                <UserNameDisplay
                  userId={assigneeId}
                  type="assigned"
                  status={complaint.acceptedAt}
                />
              </div>
            ) : (
              <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <p className="text-sm text-gray-600">
                  This complaint is not yet assigned to any volunteer
                </p>
              </div>
            )}

            <div className="space-y-4">
              {nearbyVolunteers.length > 0 ? (
                <>
                  <CustomSelect
                    label={
                      complaint.acceptedAt
                        ? 'Reassign to Different Volunteer'
                        : 'Assign to Volunteer'
                    }
                    value={selectedVolunteer}
                    options={volunteerOptions}
                    onChange={setSelectedVolunteer}
                    placeholder="Select a volunteer"
                  />

                  <div className="text-sm text-gray-500">
                    {nearbyVolunteers.length} volunteer{nearbyVolunteers.length !== 1 ? 's' : ''}{' '}
                    available within 50km radius
                  </div>

                  <button
                    onClick={handleAssign}
                    disabled={isAssigning || !selectedVolunteer}
                    className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
                  >
                    {isAssigning ? (
                      <>
                        <FiLoader className="w-4 h-4 animate-spin" />
                        Assigning...
                      </>
                    ) : complaint.acceptedAt ? (
                      'Reassign Volunteer'
                    ) : (
                      'Assign Volunteer'
                    )}
                  </button>
                </>
              ) : (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-700 font-medium">No nearby volunteers available</p>
                  <p className="text-red-600 text-sm mt-1">
                    There are no volunteers within 50km radius of this complaint location.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4">
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="w-full px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
          >
            {isDeleting ? (
              <>
                <FiLoader className="w-5 h-5 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <FiTrash2 className="w-5 h-5" />
                Delete Complaint
              </>
            )}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

const MobileComplaintCard = ({ complaint, onClick }) => {
  const reporterId = complaint.createdBy?._id || complaint.createdBy;
  const assigneeId = complaint.assignedTo?._id || complaint.assignedTo;

  return (
    <div
      className="bg-white rounded-lg border border-gray-200 p-4 mb-3 hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 flex-1 mr-2">
          {complaint.title}
        </h3>
        <button className="text-blue-600 hover:text-blue-700 p-1">
          <FiMoreVertical className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-2">
        <div className="flex items-center text-sm text-gray-600">
          <FiUser className="w-4 h-4 mr-2 flex-shrink-0" />
          <span className="truncate">
            <UserNameDisplay userId={reporterId} type="reported" />
          </span>
        </div>

        <div className="flex items-center text-sm text-gray-600">
          <FiMapPin className="w-4 h-4 mr-2 flex-shrink-0" />
          <span className="truncate">{complaint.address || 'N/A'}</span>
        </div>

        <div className="flex items-center justify-between">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              complaint.status === 'Pending' || complaint.status === 'received'
                ? 'bg-yellow-100 text-yellow-800'
                : complaint.status === 'In Progress' || complaint.status === 'in-progress'
                  ? 'bg-blue-100 text-blue-800'
                  : complaint.status === 'Resolved' || complaint.status === 'resolved'
                    ? 'bg-green-100 text-green-800'
                    : complaint.status === 'Rejected'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-gray-100 text-gray-800'
            }`}
          >
            {complaint.status}
          </span>

          <span className="text-xs text-gray-500">
            {complaint.createdAt?.split('T')[0] || 'N/A'}
          </span>
        </div>
      </div>
    </div>
  );
};

const AdminViewComplaints = () => {
  const [issuesList, setIssuesList] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [globalFilter, setGlobalFilter] = useState(
    () => localStorage.getItem('complaints_globalFilter') || ''
  );
  const [statusFilter, setStatusFilter] = useState(
    () => localStorage.getItem('complaints_statusFilter') || 'ALL'
  );
  const [loading, setLoading] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  const BACKEND = import.meta.env.VITE_API_URL || 'http://localhost:4000';
  const token = localStorage.getItem('token');
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  useEffect(() => {
    getIssuesList();
    getVolunteers();
  }, []);

  useEffect(() => {
    localStorage.setItem('complaints_globalFilter', globalFilter);
  }, [globalFilter]);

  useEffect(() => {
    localStorage.setItem('complaints_statusFilter', statusFilter);
  }, [statusFilter]);

  const getIssuesList = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BACKEND}/api/issues`, { headers });
      const issues = res.data.data;
      if (Array.isArray(issues)) setIssuesList(issues);
    } catch (err) {
      console.log('Error while fetching issues ', err);
      toast.error('Server Error');
    } finally {
      setLoading(false);
    }
  };

  const getVolunteers = async () => {
    try {
      const res = await axios.get(`${BACKEND}/api/admin/users`, { headers });
      if (Array.isArray(res.data)) {
        const volunteersList = res.data.filter(user => user.role === 'Volunteer');
        setVolunteers(volunteersList);
      }
    } catch (err) {
      console.log('Error fetching users', err);
      toast.error('Failed to load volunteers');
    }
  };

  const handleDeleteComplaint = async complaintId => {
    await axios.delete(`${BACKEND}/api/issues/${complaintId}`, { headers });
    setIssuesList(prev => prev.filter(issue => issue._id !== complaintId));
  };

  const handleAssignComplaint = async (complaintId, volunteerId) => {
    try {
      const issue = issuesList.find(i => i._id === complaintId);
      await axios.patch(
        `${BACKEND}/api/issues/${complaintId}/assign`,
        { volunteerId },
        { headers }
      );
      await getIssuesList();
    } catch (err) {
      console.error('Error assigning complaint:', err);
      throw err;
    }
  };

  const filteredData = useMemo(() => {
    let data = [...issuesList];

    if (globalFilter) {
      const s = globalFilter.toLowerCase();
      data = data.filter(
        issue =>
          issue.title?.toLowerCase().includes(s) ||
          issue.address?.toLowerCase().includes(s) ||
          issue.status?.toLowerCase().includes(s)
      );
    }

    if (statusFilter !== 'ALL') {
      data = data.filter(issue => issue.status === statusFilter);
    }

    return data;
  }, [issuesList, globalFilter, statusFilter]);

  const statusOptions = useMemo(() => {
    const statuses = issuesList.map(issue => issue.status).filter(Boolean);
    return ['ALL', ...Array.from(new Set(statuses))];
  }, [issuesList]);

  const columns = useMemo(
    () => [
      {
        accessorKey: 'title',
        header: 'Title',
        cell: info => (
          <div className="font-medium text-gray-900 line-clamp-2 max-w-[200px]">
            {info.getValue()}
          </div>
        ),
      },
      {
        accessorKey: 'createdBy',
        header: 'Reported By',
        cell: ({ row }) => {
          const reporterId = row.original.createdBy?._id || row.original.createdBy;
          return (
            <div className="min-w-[120px]">
              <UserNameDisplay userId={reporterId} type="reported" />
            </div>
          );
        },
      },
      {
        accessorKey: 'address',
        header: 'Address',
        cell: info => (
          <div className="max-w-[180px] truncate text-gray-700">{info.getValue() || 'N/A'}</div>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: info => {
          const status = info.getValue();
          const statusColors = {
            Pending: 'bg-yellow-100 text-yellow-800',
            received: 'bg-yellow-100 text-yellow-800',
            'In Progress': 'bg-blue-100 text-blue-800',
            'in-progress': 'bg-blue-100 text-blue-800',
            Resolved: 'bg-green-100 text-green-800',
            resolved: 'bg-green-100 text-green-800',
            Rejected: 'bg-red-100 text-red-800',
          };
          return (
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                statusColors[status] || 'bg-gray-100 text-gray-800'
              }`}
            >
              {status}
            </span>
          );
        },
      },
      {
        accessorKey: 'assignedTo',
        header: 'Assigned To',
        cell: ({ row }) => {
          const assigneeId = row.original.assignedTo?._id || row.original.assignedTo;
          return (
            <div className="min-w-[120px]">
              <UserNameDisplay
                userId={assigneeId}
                type="assigned"
                status={row.original.acceptedAt}
              />
            </div>
          );
        },
      },
      {
        accessorKey: 'createdAt',
        header: 'Reported At',
        cell: info => (
          <span className="text-gray-700 whitespace-nowrap">
            {info.getValue()?.split('T')[0] || 'N/A'}
          </span>
        ),
      },
      {
        header: 'Action',
        cell: ({ row }) => (
          <button
            onClick={() => setSelectedComplaint(row.original)}
            className="p-2 rounded-md hover:bg-blue-50 transition text-blue-600 hover:text-blue-700 whitespace-nowrap"
            title="View and manage complaint"
          >
            <FiEdit2 className="w-4 h-4" />
          </button>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 50,
      },
    },
  });

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <FiAlertCircle className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Complaints Management</h1>
          </div>
          <p className="text-gray-600">View and manage reported issues</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Complaints
              </label>
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by title, address, or status..."
                  value={globalFilter}
                  onChange={e => setGlobalFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
              </div>
            </div>
            <div className="md:w-60">
              <CustomSelect
                label="Filter by Status"
                value={statusFilter}
                options={statusOptions}
                onChange={setStatusFilter}
              />
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            Showing <span className="font-semibold text-gray-900">{filteredData.length}</span> of{' '}
            <span className="font-semibold text-gray-900">{issuesList.length}</span> complaints
            {filteredData.length > 50 && (
              <span className="ml-2">
                (displaying {table.getState().pagination.pageSize} per page)
              </span>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <FiLoader className="w-8 h-8 text-blue-600 animate-spin" />
              <span className="ml-3 text-gray-600 font-medium">Loading complaints...</span>
            </div>
          ) : (
            <>
              {/* Mobile View */}
              <div className="lg:hidden">
                {filteredData.length === 0 ? (
                  <div className="px-6 py-12 text-center text-gray-500">
                    No complaints found matching your criteria
                  </div>
                ) : (
                  <div className="p-4">
                    {filteredData.map(complaint => (
                      <MobileComplaintCard
                        key={complaint._id}
                        complaint={complaint}
                        onClick={() => setSelectedComplaint(complaint)}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Desktop View */}
              <div className="hidden lg:block">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      {table.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id}>
                          {headerGroup.headers.map(header => (
                            <th
                              key={header.id}
                              className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors whitespace-nowrap"
                              onClick={header.column.getToggleSortingHandler()}
                            >
                              <div className="flex items-center gap-2">
                                {flexRender(header.column.columnDef.header, header.getContext())}
                                <span className="text-gray-400">
                                  {header.column.getIsSorted() === 'asc' && (
                                    <FiChevronUp className="w-4 h-4" />
                                  )}
                                  {header.column.getIsSorted() === 'desc' && (
                                    <FiChevronDown className="w-4 h-4" />
                                  )}
                                </span>
                              </div>
                            </th>
                          ))}
                        </tr>
                      ))}
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {table.getRowModel().rows.length === 0 ? (
                        <tr>
                          <td
                            colSpan={columns.length}
                            className="px-6 py-12 text-center text-gray-500"
                          >
                            No complaints found matching your criteria
                          </td>
                        </tr>
                      ) : (
                        table.getRowModel().rows.map(row => (
                          <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                            {row.getVisibleCells().map(cell => (
                              <td key={cell.id} className="px-4 py-3 text-sm">
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                              </td>
                            ))}
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {filteredData.length > 10 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700">
                  Page{' '}
                  <span className="font-semibold">{table.getState().pagination.pageIndex + 1}</span>{' '}
                  of <span className="font-semibold">{table.getPageCount()}</span>
                </span>
                <span className="text-sm text-gray-500">
                  ({table.getRowModel().rows.length} complaints on this page)
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                  className="p-2 rounded-lg border border-gray-300 hover:bg-white transition disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-50"
                  title="Previous page"
                >
                  <FiChevronLeft className="w-5 h-5 text-gray-600" />
                </button>

                <button
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                  className="p-2 rounded-lg border border-gray-300 hover:bg-white transition disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-50"
                  title="Next page"
                >
                  <FiChevronRight className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      {selectedComplaint && (
        <ComplaintModal
          complaint={selectedComplaint}
          volunteers={volunteers}
          onClose={() => setSelectedComplaint(null)}
          onDelete={handleDeleteComplaint}
          onAssign={handleAssignComplaint}
        />
      )}
    </div>
  );
};

export default AdminViewComplaints;
