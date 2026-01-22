
const API_URL = "http://localhost:5000/api/admin/complaints";

/**
 * Get all complaints (Admin only)
 * Supports filters: status, issueType
 */
export const getAllComplaints = async (filters = {}) => {
  const token = localStorage.getItem("token");

  const query = new URLSearchParams(filters).toString();
  const url = query ? `${API_URL}?${query}` : API_URL;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch complaints");
  }

  return res.json();
};

/**
 * Update complaint status (Admin only)
 */
export const updateComplaintStatus = async (id, status) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/${id}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });

  if (!res.ok) {
    throw new Error("Failed to update status");
  }

  return res.json();
};

/**
 * Export complaints (Admin only, Filter aware)
 * format: "pdf" | "word"
 * filters: { status, issueType }
 */
export const exportComplaints = async (format, filters = {}) => {
  const token = localStorage.getItem("token");

  const query = new URLSearchParams({
    format,
    ...filters,
  }).toString();

  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/admin/complaints/export?${query}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error("Export failed");
  }

  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `complaints.${format === "pdf" ? "pdf" : "docx"}`;
  document.body.appendChild(a);
  a.click();
  a.remove();

  window.URL.revokeObjectURL(url);
};
