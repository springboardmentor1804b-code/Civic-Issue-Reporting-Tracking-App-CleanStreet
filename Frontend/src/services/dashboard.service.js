import axios from "axios";

export const fetchRecentActivity = () =>
  axios.get("/api/dashboard/recent-activity", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  });
