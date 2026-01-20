const API_URL = "http://localhost:5000/api/admin";

export const getAllUsers = async () => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/users`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.json();
};

export const updateUserRole = async (userId, role) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/users/${userId}/role`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ role }),
  });

  return res.json();
};
