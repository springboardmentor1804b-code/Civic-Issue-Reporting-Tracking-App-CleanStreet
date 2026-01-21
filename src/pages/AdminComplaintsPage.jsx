// import { useEffect, useState } from "react";
// import { getAllComplaints } from "../services/adminComplaintService";
// import StatusBadge from "../components/common/StatusBadge";
// import { updateComplaintStatus } from "../services/adminComplaintService";


// const AdminComplaintsPage = () => {
//   const [complaints, setComplaints] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchComplaints();
//   }, []);

//   const fetchComplaints = async () => {
//     try {
//       const data = await getAllComplaints();
//       setComplaints(data);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) return <div className="p-6">Loading complaints...</div>;

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-4">All Complaints</h1>

//       <div className="bg-white rounded-xl shadow overflow-x-auto">
//         <table className="min-w-full text-sm">
//           <thead className="bg-gray-100 text-gray-700">
//             <tr>
//               <th className="px-4 py-3 text-left">Title</th>
//               <th className="px-4 py-3">Reported By</th>
//               <th className="px-4 py-3">Location</th>
//               <th className="px-4 py-3">Type</th>
//               <th className="px-4 py-3">Status</th>
//               <th className="px-4 py-3">Assigned To</th>
//               <th className="px-4 py-3">Date</th>
//               <th className="px-4 py-3">Actions</th>
//             </tr>
//           </thead>

//           <tbody>
//             {complaints.map((c) => (
//               <tr key={c._id} className="border-t hover:bg-gray-50">
//                 {/* <td className="px-4 py-3 font-medium">{c.title}</td> */}
//                 <td className="px-4 py-3 font-medium">
//   {c.description || "—"}
// </td>
//                 <td className="px-4 py-3">{c.reportedBy?.name}</td>
//                 {/* <td className="px-4 py-3">{c.locationText}</td> */}
//                 <td className="px-4 py-3">
//   {c.address || "—"}
// </td>
//                 {/* <td className="px-4 py-3">{c.type}</td> */}
//                 <td className="px-4 py-3">
//   {c.category || "—"}
// </td>
//                 <td className="px-4 py-3">
//                   <StatusBadge status={c.status} />
//                 </td>
//                 <td className="px-4 py-3">
//                   {c.assignedTo?.name || "Unassigned"}
//                 </td>
//                 <td className="px-4 py-3">
//                   {new Date(c.createdAt).toLocaleString()}
//                 </td>
//                 <td className="px-4 py-3 text-purple-600 cursor-pointer">
//                   ✏️
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default AdminComplaintsPage;





import { useEffect, useState } from "react";
import {
  getAllComplaints,
  updateComplaintStatus,
} from "../services/adminComplaintService";
import StatusBadge from "../components/common/StatusBadge";

const AdminComplaintsPage = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const data = await getAllComplaints();
      setComplaints(data);
    } catch (err) {
      console.error("Failed to fetch complaints", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateComplaintStatus(id, newStatus);
      fetchComplaints(); // refresh list
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  if (loading) {
    return <div className="p-6">Loading complaints...</div>;
  }

  if (!complaints.length) {
    return <div className="p-6">No complaints found.</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">All Complaints</h1>

      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-3 text-left">Title</th>
              <th className="px-4 py-3">Reported By</th>
              <th className="px-4 py-3">Location</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Assigned To</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {complaints.map((c) => (
              <tr
                key={c._id}
                className="border-t hover:bg-gray-50 transition"
              >
                {/* Title */}
                <td className="px-4 py-3 font-medium">
                  {c.description || "—"}
                </td>

                {/* Reported By */}
                <td className="px-4 py-3">
                  {c.reportedBy?.name || "—"}
                </td>

                {/* Location */}
                <td className="px-4 py-3">
                  {c.address || "—"}
                </td>

                {/* Type */}
                <td className="px-4 py-3">
                  {c.category || "—"}
                </td>

                {/* Status */}
                <td className="px-4 py-3">
                  <StatusBadge status={c.status} />
                </td>

                {/* Assigned To */}
                <td className="px-4 py-3">
                  {c.assignedTo?.name || "Unassigned"}
                </td>

                {/* Date */}
                <td className="px-4 py-3">
                  {new Date(c.createdAt).toLocaleString()}
                </td>

                {/* Actions */}
                <td className="px-4 py-3 space-x-2">
                  {c.status !== "Resolved" && (
                    <button
                      onClick={() =>
                        handleStatusChange(c._id, "Resolved")
                      }
                      className="px-2 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600"
                    >
                      Resolve
                    </button>
                  )}

                  {c.status === "Resolved" && (
                    <button
                      onClick={() =>
                        handleStatusChange(c._id, "In Progress")
                      }
                      className="px-2 py-1 bg-yellow-500 text-white text-xs rounded hover:bg-yellow-600"
                    >
                      Reopen
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminComplaintsPage;
