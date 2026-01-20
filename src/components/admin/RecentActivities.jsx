// import { useEffect, useState } from "react";
// import { getRecentActivities } from "../../services/adminActivityService";

// const RecentActivities = () => {
//   const [activities, setActivities] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchActivities();
//   }, []);

//   const fetchActivities = async () => {
//     try {
//       const data = await getRecentActivities();
//       setActivities(data || []);
//     } catch (err) {
//       console.error("Failed to load activities", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="bg-white rounded-2xl p-5 shadow-sm">
//       <h2 className="text-sm font-bold text-gray-800 mb-3">
//         Recent Activities
//       </h2>

//       {/* Loading */}
//       {loading && (
//         <p className="text-xs text-gray-500">Loading activities...</p>
//       )}

//       {/* Empty state */}
//       {!loading && activities.length === 0 && (
//         <p className="text-xs text-gray-500">
//           No recent admin activities
//         </p>
//       )}

//       {/* Activity list */}
//       <div className="space-y-3">
//         {activities.map((a) => (
//           <div key={a._id} className="text-xs border-b pb-2">
//             <p className="font-semibold text-gray-700">
//               {a.admin?.name || "Admin"}
//             </p>

//             <p className="text-gray-600">
//               {a.action}
//             </p>

//             <p className="text-[10px] text-gray-400">
//               {new Date(a.createdAt).toLocaleString()}
//             </p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default RecentActivities;

// import { useEffect, useState } from "react";
// import { getRecentActivities } from "../../services/adminActivityService";
// import { Clock, ShieldCheck, UserCog } from "lucide-react";

// const RecentAdminActivities = () => {
//   const [activities, setActivities] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchActivities();
//   }, []);

//   const fetchActivities = async () => {
//     try {
//       const data = await getRecentActivities();
//       setActivities(data);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return <div className="p-6 text-sm text-gray-500">Loading activities...</div>;
//   }

//   return (
//     <div className="p-6 max-w-5xl mx-auto">
//       {/* Page Title */}
//       {/* <div className="mb-6">
//         <h1 className="text-3xl font-bold text-gray-800">
//           Recent Admin Activities
//         </h1>
//         <p className="text-gray-500 text-sm">
//           Track all recent actions performed by administrators
//         </p>
//       </div> */}
//       {/* <div className="mb-6 border-b border-gray-200 pb-4">
//   <h1 className="text-2xl font-semibold text-gray-900">
//     Recent Admin Activities
//   </h1>
//   <p className="text-sm text-gray-500 mt-1">
//     Monitor recent actions performed by administrators across the system
//   </p>
// </div> */}

//       {/* Activity Card */}
//       <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
//         <div className="p-5 border-b bg-gray-50 rounded-t-2xl">
//           <h2 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
//             <Clock className="w-4 h-4 text-emerald-600" />
//             Activity Timeline
//           </h2>
//         </div>

//         {/* Activity List */}
//         <div className="divide-y">
//           {activities.map((a) => (
//             <div
//               key={a._id}
//               className="p-5 flex gap-4 hover:bg-gray-50 transition"
//             >
//               {/* Icon */}
//               <div className="flex-shrink-0">
//                 <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
//                   {a.targetType === "User" ? (
//                     <UserCog className="w-5 h-5 text-emerald-600" />
//                   ) : (
//                     <ShieldCheck className="w-5 h-5 text-emerald-600" />
//                   )}
//                 </div>
//               </div>

//               {/* Content */}
//               <div className="flex-1">
//                 <div className="flex items-center justify-between">
//                   <p className="font-semibold text-gray-800">
//                     {a.admin?.name || "Admin"}
//                   </p>
//                   <span className="text-xs text-gray-400">
//                     {new Date(a.createdAt).toLocaleString()}
//                   </span>
//                 </div>

//                 <p className="text-sm text-gray-600 mt-1">
//                   {a.action}
//                 </p>

//                 {a.details && (
//                   <p className="text-xs text-gray-400 mt-1">
//                     {a.details}
//                   </p>
//                 )}

//                 {/* Badge */}
//                 <div className="mt-2">
//                   <span className="inline-block px-2 py-0.5 text-xs rounded-full bg-emerald-50 text-emerald-700 font-medium">
//                     {a.targetType}
//                   </span>
//                 </div>
//               </div>
//             </div>
//           ))}

//           {activities.length === 0 && (
//             <div className="p-6 text-center text-sm text-gray-500">
//               No recent admin activities found.
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default RecentAdminActivities;



import { useEffect, useState } from "react";
import { getRecentActivities } from "../../services/adminActivityService";
import { ShieldCheck, UserCog } from "lucide-react";

const RecentAdminActivities = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const data = await getRecentActivities();
      setActivities(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-sm text-gray-500">
        Loading recent activities...
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="p-2 max-w-9xl mx-auto">
        {/* Page Header */}
        {/* <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">
            Recent Admin Activities
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Complete log of actions performed by administrators
          </p>
        </div> */}

        {/* Activity Feed */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          {activities.map((a, index) => (
            <div
              key={a._id}
              className={`flex items-start gap-4 px-6 py-4 ${
                index !== activities.length - 1
                  ? "border-b border-gray-200"
                  : ""
              } hover:bg-gray-50 transition`}
            >
              {/* Icon */}
              <div className="mt-1">
                <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center">
                  {a.targetType === "User" ? (
                    <UserCog className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-gray-900">
                    {a.admin?.name || "Admin"}
                  </p>
                  <span className="text-xs text-gray-400">
                    {new Date(a.createdAt).toLocaleString()}
                  </span>
                </div>

                <p className="text-sm text-gray-700 mt-1">
                  {a.action}
                </p>

                {a.details && (
                  <p className="text-xs text-gray-500 mt-1">
                    {a.details}
                  </p>
                )}

                <div className="mt-2">
                  <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded bg-emerald-50 text-emerald-700">
                    {a.targetType}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {activities.length === 0 && (
            <div className="px-6 py-10 text-center text-sm text-gray-500">
              No admin activities recorded yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecentAdminActivities;
