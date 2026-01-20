const colors = {
  Admin: "bg-red-100 text-red-700",
  Volunteer: "bg-emerald-100 text-emerald-700",
  User: "bg-gray-200 text-gray-700",
};

const UserRoleBadge = ({ role }) => {
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${colors[role]}`}>
      {role}
    </span>
  );
};

export default UserRoleBadge;
