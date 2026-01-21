import { useEffect, useState } from "react";
import { getAllUsers, updateUserRole } from "../services/adminService";
import UserRoleBadge from "../components/common/UserRoleBadge";

const ManageUsersPage = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const data = await getAllUsers();
    setUsers(data);
  };

  const handleRoleChange = async (userId, role) => {
    await updateUserRole(userId, role);
    fetchUsers(); // refresh list
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Manage Users</h1>

      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Joined On</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-t">
                <td className="px-4 py-3 font-medium">{u.name}</td>
                <td className="px-4 py-3">{u.email}</td>
                <td className="px-4 py-3">
                  {new Date(u.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <UserRoleBadge role={u.role} />
                </td>
                <td className="px-4 py-3">
                    {u.role === "User" && ( 
                    <button
                      onClick={() => handleRoleChange(u._id, "Volunteer")}
                      className="px-3 py-1 bg-emerald-500 text-white rounded text-xs"
                    >
                      Make Volunteer
                    </button>
                  )}
                  {u.role === "Volunteer" && (
                    <button
                      onClick={() => handleRoleChange(u._id, "User")}
                      className="px-3 py-1 bg-gray-500 text-white rounded text-xs"
                    >
                      Remove Volunteer
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

export default ManageUsersPage;

// import { useEffect, useState } from "react";
// import { getAllUsers, updateUserRole } from "../services/adminService";
// import UserRoleBadge from "../components/common/UserRoleBadge";

// const ManageUsersPage = () => {
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   const fetchUsers = async () => {
//     try {
//       const data = await getAllUsers();
//       setUsers(data);
//     } catch (err) {
//       console.error("Failed to fetch users", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleRoleChange = async (userId, role) => {
//     try {
//       await updateUserRole(userId, role);
//       fetchUsers(); // refresh list
//     } catch (err) {
//       console.error("Role update failed", err);
//     }
//   };

//   if (loading) return <div className="p-4">Loading users...</div>;

//   return (
//     <div className="p-4">
//       <h1 className="text-2xl font-bold mb-4">Manage Users</h1>

//       <div className="bg-white rounded-xl shadow overflow-x-auto">
//         <table className="min-w-full text-sm">
//           <thead className="bg-gray-100 text-gray-700">
//             <tr>
//               <th className="px-4 py-3 text-left">Name</th>
//               <th className="px-4 py-3">Email</th>
//               <th className="px-4 py-3">Joined On</th>
//               <th className="px-4 py-3">Role</th>
//               <th className="px-4 py-3">Action</th>
//             </tr>
//           </thead>

//           <tbody>
//             {users.map((u) => (
//               <tr key={u._id} className="border-t">
//                 <td className="px-4 py-3 font-medium">{u.name}</td>
//                 <td className="px-4 py-3">{u.email}</td>
//                 <td className="px-4 py-3">
//                   {u.createdAt
//                     ? new Date(u.createdAt).toLocaleDateString()
//                     : "—"}
//                 </td>
//                 <td className="px-4 py-3">
//                   <UserRoleBadge role={u.role} />
//                 </td>

//                 <td className="px-4 py-3">
//                   {u.role === "User" && (
//                     <button
//                       onClick={() =>
//                         handleRoleChange(u._id, "Volunteer")
//                       }
//                       className="px-3 py-1 bg-emerald-500 text-white rounded text-xs"
//                     >
//                       Make Volunteer
//                     </button>
//                   )}

//                   {u.role === "Volunteer" && (
//                     <button
//                       onClick={() =>
//                         handleRoleChange(u._id, "User")
//                       }
//                       className="px-3 py-1 bg-gray-500 text-white rounded text-xs"
//                     >
//                       Remove Volunteer
//                     </button>
//                   )}

//                   {u.role === "Admin" && (
//                     <span className="text-gray-400 text-xs">—</span>
//                   )}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default ManageUsersPage;

