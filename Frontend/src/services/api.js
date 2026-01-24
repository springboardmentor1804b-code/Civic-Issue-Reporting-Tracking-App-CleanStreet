// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Authentication APIs
export const authAPI = {
  login: async (email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Login failed');
      return data;
    } catch (error) {
      throw error;
    }
  },

  signup: async (userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Signup failed');
      return data;
    } catch (error) {
      throw error;
    }
  },

  logout: async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Logout failed');
      return data;
    } catch (error) {
      throw error;
    }
  }
};

// Comment APIs (separate endpoint used by backend: /api/comment/:complaintId)
export const commentAPI = {
  getByComplaintId: async (complaintId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/comment/${complaintId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to fetch comments');
      return data;
    } catch (error) {
      throw error;
    }
  },

  add: async (complaintId, text) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/comment/${complaintId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ text })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to add comment');
      return data;
    } catch (error) {
      throw error;
    }
  }
};

// Complaints/Issues APIs
export const complaintsAPI = {
  // Get all complaints
  getAll: async (filters = {}) => {
    try {
      const queryParams = new URLSearchParams(filters);
      const response = await fetch(`${API_BASE_URL}/complaints?${queryParams}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to fetch complaints');
      return data;
    } catch (error) {
      throw error;
    }
  },

  // Get single complaint by ID
  getById: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/complaints/${id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to fetch complaint');
      return data;
    } catch (error) {
      throw error;
    }
  },

  // Create new complaint
  create: async (complaintData) => {
    try {
      const token = localStorage.getItem('token');
      const isFormData = typeof FormData !== 'undefined' && complaintData instanceof FormData;

      const response = await fetch(`${API_BASE_URL}${isFormData ? '/complaint/submit' : '/complaints'}`, {
        method: 'POST',
        headers: isFormData
          ? { 'Authorization': `Bearer ${token}` }
          : {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
        body: isFormData ? complaintData : JSON.stringify(complaintData)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to create complaint');
      return data;
    } catch (error) {
      throw error;
    }
  },

  // Update complaint
  update: async (id, complaintData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/complaints/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(complaintData)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to update complaint');
      return data;
    } catch (error) {
      throw error;
    }
  },

  // Delete complaint
  delete: async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/complaints/${id}`, {
        method: 'DELETE',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to delete complaint');
      return data;
    } catch (error) {
      throw error;
    }
  },

  // Add comment/discussion to complaint
  addComment: async (id, comment) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/complaints/${id}/comments`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ comment })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to add comment');
      return data;
    } catch (error) {
      throw error;
    }
  },

  // Like complaint
  like: async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/complaints/${id}/like`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to like complaint');
      return data;
    } catch (error) {
      throw error;
    }
  },

  // Dislike complaint
  dislike: async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/complaints/${id}/dislike`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to dislike complaint');
      return data;
    } catch (error) {
      throw error;
    }
  }
};

// User Profile APIs
export const profileAPI = {
  // Get user profile
  getProfile: async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/users/profile`, {
        method: 'GET',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to fetch profile');
      return data;
    } catch (error) {
      throw error;
    }
  },

  // Update user profile
  updateProfile: async (userData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/users/profile`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(userData)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to update profile');
      return data;
    } catch (error) {
      throw error;
    }
  },

  // Upload profile image
  uploadProfileImage: async (formData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/users/profile/image`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to upload image');
      return data;
    } catch (error) {
      throw error;
    }
  },

  // Get user complaints
  getUserComplaints: async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/users/complaints`, {
        method: 'GET',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to fetch user complaints');
      return data;
    } catch (error) {
      throw error;
    }
  }
};

// Image Upload APIs
export const imageAPI = {
  upload: async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/images/upload`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to upload image');
      return data;
    } catch (error) {
      throw error;
    }
  },

  uploadMultiple: async (files) => {
    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append('files', file);
      });

      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/images/upload-multiple`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to upload images');
      return data;
    } catch (error) {
      throw error;
    }
  }
};

// Location/Geolocation APIs
export const locationAPI = {
  getAddressFromCoordinates: async (latitude, longitude) => {
    try {
      // Using reverse geocoding (you can use Google Maps API or OpenStreetMap Nominatim)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
      );
      const data = await response.json();
      if (!response.ok) throw new Error('Failed to fetch address');
      return data;
    } catch (error) {
      throw error;
    }
  },

  getCoordinatesFromAddress: async (address) => {
    try {
      // Using forward geocoding (OpenStreetMap Nominatim)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
      );
      const data = await response.json();
      if (!response.ok) throw new Error('Failed to fetch coordinates');
      return data;
    } catch (error) {
      throw error;
    }
  }
};

// Statistics/Dashboard APIs
export const dashboardAPI = {
  getStats: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/dashboard/stats`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to fetch stats');
      return data;
    } catch (error) {
      throw error;
    }
  },

  getComplaintsOverTime: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/dashboard/complaints-over-time`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to fetch data');
      return data;
    } catch (error) {
      throw error;
    }
  }
};

export default {
  authAPI,
  complaintsAPI,
  profileAPI,
  imageAPI,
  locationAPI,
  dashboardAPI
};
