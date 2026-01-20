const styles = {
  Pending: "bg-yellow-100 text-yellow-800",
  Resolved: "bg-green-100 text-green-800",
  Rejected: "bg-red-100 text-red-800",
};

const StatusBadge = ({ status }) => {
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${styles[status]}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
