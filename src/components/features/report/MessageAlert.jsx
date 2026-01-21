import { AlertCircle } from "lucide-react";

const MessageAlert = ({ message, type = "success" }) => {
  if (!message) return null;

  const styles = {
    success: "bg-gradient-to-r from-green-500 to-emerald-500 shadow-green-200",
    error: "bg-gradient-to-r from-red-500 to-rose-500 shadow-red-200",
    warning: "bg-gradient-to-r from-amber-500 to-orange-500 shadow-amber-200",
    info: "bg-gradient-to-r from-blue-500 to-indigo-500 shadow-blue-200",
  };

  return (
    <div className={`mb-6 p-4 ${styles[type]} text-white rounded-2xl shadow-lg flex items-center gap-3 animate-fade-in-up`}>
      <div className="p-2 bg-white/20 rounded-xl">
        <AlertCircle className="w-5 h-5" />
      </div>
      <span className="font-semibold">{message}</span>
    </div>
  );
};

export default MessageAlert;
