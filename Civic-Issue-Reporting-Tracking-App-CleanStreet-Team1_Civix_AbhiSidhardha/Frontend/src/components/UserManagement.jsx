import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';

import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
} from '@tanstack/react-table';
import {
  FiSearch,
  FiChevronUp,
  FiChevronDown,
  FiUsers,
  FiLoader,
  FiTrash2,
  FiEdit2,
  FiChevronLeft,
  FiChevronRight,
  FiX,
} from 'react-icons/fi';
import { createPortal } from 'react-dom';
import CustomSelect from '../components/CustomSelect';
import toast from 'react-hot-toast';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [globalFilter, setGlobalFilter] = useState(
    () => localStorage.getItem('userManagement_globalFilter') || ''
  );
  const [roleFilter, setRoleFilter] = useState(
    () => localStorage.getItem('userManagement_roleFilter') || 'ALL'
  );
  const [cityFilter, setCityFilter] = useState(
    () => localStorage.getItem('userManagement_cityFilter') || 'ALL'
  );
  const [loading, setLoading] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (editingUserId && !users.some(u => u._id === editingUserId)) {
      setEditingUserId(null);
    }
  }, [users]);

  useEffect(() => {
    localStorage.setItem('userManagement_globalFilter', globalFilter);
  }, [globalFilter]);

  useEffect(() => {
    localStorage.setItem('userManagement_roleFilter', roleFilter);

    const availableCities = users
      .filter(u => roleFilter === 'ALL' || u.role === roleFilter)
      .map(u => u.location)
      .filter(Boolean);

    if (cityFilter !== 'ALL' && !availableCities.includes(cityFilter)) {
      setCityFilter('ALL');
    }
  }, [roleFilter]);

  useEffect(() => {
    localStorage.setItem('userManagement_cityFilter', cityFilter);
  }, [cityFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data || []);
    } catch (err) {
      console.error('Fetch users error', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredData = useMemo(() => {
    let data = [...users];

    if (globalFilter) {
      const s = globalFilter.toLowerCase();
      data = data.filter(
        u =>
          u.name?.toLowerCase().includes(s) ||
          u.email?.toLowerCase().includes(s) ||
          u.location?.toLowerCase().includes(s)
      );
    }

    if (roleFilter !== 'ALL') {
      data = data.filter(u => u.role === roleFilter);
    }

    if (cityFilter !== 'ALL') {
      data = data.filter(u => u.location === cityFilter);
    }

    return data;
  }, [users, globalFilter, roleFilter, cityFilter]);

  const handleRoleChange = (user, newRole) => {
    if (user.role === newRole) return;

    setConfirmAction({
      type: 'role',
      user,
      value: newRole,
    });
  };

  const handleDeleteUser = user => {
    setConfirmAction({
      type: 'delete',
      user,
    });
  };

  const confirmActionHandler = async () => {
    if (!confirmAction) return;

    const { type, user, value } = confirmAction;

    try {
      if (type === 'role') {
        await axios.put(
          `/api/admin/users/${user._id}/role`,
          { role: value },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setUsers(prevUsers => prevUsers.map(u => (u._id === user._id ? { ...u, role: value } : u)));
      }

      if (type === 'delete') {
        await axios.delete(`/api/admin/users/${user._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUsers(prevUsers => prevUsers.filter(u => u._id !== user._id));
      }
    } catch (err) {
      console.error(err);
      toast.error('Action failed');
    } finally {
      setConfirmAction(null);
      setEditingUserId(null);
    }
  };

  const cityOptions = useMemo(() => {
    let filteredUsers = users;

    if (roleFilter !== 'ALL') {
      filteredUsers = users.filter(u => u.role === roleFilter);
    }

    const cities = filteredUsers
      .map(u => u.location)
      .filter(Boolean)
      .map(c => c.trim())
      .filter(c => c.length > 0);

    return ['ALL', ...Array.from(new Set(cities))];
  }, [users, roleFilter]);

  const columns = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'Name',
      },
      {
        accessorKey: 'email',
        header: 'Email',
      },
      {
        accessorKey: 'location',
        header: 'City',
        cell: info => info.getValue() || 'Unassigned',
      },
      {
        accessorKey: 'role',
        header: 'Role',
        cell: info => {
          const role = info.getValue();
          const roleColors = {
            Admin: 'bg-purple-100 text-purple-800',
            Volunteer: 'bg-blue-100 text-blue-800',
            User: 'bg-gray-100 text-gray-800',
          };
          return (
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                roleColors[role] || 'bg-gray-100 text-gray-800'
              }`}
            >
              {role}
            </span>
          );
        },
      },
      {
        header: 'Actions',
        cell: ({ row }) => {
          const user = row.original;
          const isAdmin = user.role === 'Admin';
          const isEditing = editingUserId === user._id;

          if (isAdmin) return null;

          return (
            <div className="flex items-center gap-2">
              {!isEditing ? (
                <button
                  onClick={() => setEditingUserId(user._id)}
                  className="p-2 rounded-md hover:bg-blue-50 transition text-blue-600 hover:text-blue-700"
                  title="Edit user"
                >
                  <FiEdit2 className="w-4 h-4" />
                </button>
              ) : (
                <>
                  <CustomSelect
                    value={user.role}
                    options={['Volunteer', 'User']}
                    onChange={newRole => handleRoleChange(user, newRole)}
                  />

                  <button
                    onClick={() => handleDeleteUser(user)}
                    className="p-1.5 rounded-md hover:bg-red-50 transition text-red-600 hover:text-red-700 border-2 border-red-600/50 flex items-center gap-1"
                    title="Delete user"
                  >
                    <FiTrash2 className="w-4 h-4" />
                    <p>Delete User</p>
                  </button>

                  <button
                    onClick={() => setEditingUserId(null)}
                    className="p-1.5 rounded-md hover:bg-gray-100 transition text-gray-500 hover:text-gray-700"
                    title="Close"
                  >
                    <FiX className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          );
        },
      },
    ],
    [editingUserId]
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
        pageSize: 10,
      },
    },
  });

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <FiUsers className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          </div>
          <p className="text-gray-600">Manage and filter user accounts</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Search Users</label>
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, email, or location..."
                  value={globalFilter}
                  onChange={e => setGlobalFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
              </div>
            </div>
            <div className="md:w-60">
              <CustomSelect
                label="Filter by Role"
                value={roleFilter}
                options={['ALL', 'Admin', 'Volunteer', 'User']}
                onChange={setRoleFilter}
              />
            </div>

            <div className="md:w-60">
              <CustomSelect
                label="Filter by City"
                value={cityFilter}
                options={cityOptions}
                onChange={setCityFilter}
              />
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            Showing <span className="font-semibold text-gray-900">{filteredData.length}</span> of{' '}
            <span className="font-semibold text-gray-900">{users.length}</span> users
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <FiLoader className="w-8 h-8 text-blue-600 animate-spin" />
              <span className="ml-3 text-gray-600 font-medium">Loading users...</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  {table.getHeaderGroups().map(headerGroup => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map(header => (
                        <th
                          key={header.id}
                          className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
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
                      <td colSpan={columns.length} className="px-6 py-12 text-center text-gray-500">
                        No users found matching your criteria
                      </td>
                    </tr>
                  ) : (
                    table.getRowModel().rows.map(row => (
                      <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                        {row.getVisibleCells().map(cell => (
                          <td key={cell.id} className="px-6 py-4 text-sm text-gray-900">
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </td>
                        ))}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
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
                  ({table.getRowModel().rows.length} users on this page)
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

      {confirmAction &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6 animate-scaleIn">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Confirm Action</h2>

              <p className="text-sm text-gray-600 mb-6">
                {confirmAction.type === 'role'
                  ? `Change role of ${confirmAction.user.name} to "${confirmAction.value}"?`
                  : `Delete user "${confirmAction.user.name}"? This cannot be undone.`}
              </p>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setConfirmAction(null)}
                  className="px-4 py-2 text-sm rounded-lg border hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  onClick={confirmActionHandler}
                  className={`px-4 py-2 text-sm rounded-lg text-white ${
                    confirmAction.type === 'delete'
                      ? 'bg-red-600 hover:bg-red-700'
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

export default UserManagement;
