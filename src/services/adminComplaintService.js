const API_URL = "http://localhost:5000/api/admin/complaints";

export const getAllComplaints = async () => {
  const token = localStorage.getItem("token");

  const res = await fetch(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch complaints");
  }

  return res.json();
};

export const updateComplaintStatus = async (id, status) => {
  const token = localStorage.getItem("token");

  const res = await fetch(
    `http://localhost:5000/api/admin/complaints/${id}/status`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    }
  );

  return res.json();
};

