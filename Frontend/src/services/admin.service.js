import api from "./api";

/* ================= DASHBOARD ================= */
export const fetchAdminDashboard = () => {
  return api.get("/admin/dashboard");
};

/* ================= USERS ================= */
export const fetchAllUsers = () => {
  return api.get("/admin/users");
};

/* ================= REPORTS ================= */
export const fetchAllReports = () => {
  return api.get("/admin/reports");
};

/* ================= EXPORTS ================= */
export const exportAdminPDF = () =>
  api.get("/admin/export/pdf", {
    responseType: "blob",
  });

export const exportAdminExcel = () =>
  api.get("/admin/export/excel", {
    responseType: "blob",
  });
