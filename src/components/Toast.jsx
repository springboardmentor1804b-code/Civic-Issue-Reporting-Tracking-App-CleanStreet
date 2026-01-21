import { useEffect } from "react";
import { CheckCircle, XCircle, AlertCircle, Info, X } from "lucide-react";

const Toast = ({ message, type = "success", isVisible, onClose, duration = 4000 }) => {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  const toastStyles = {
    success: {
      bg: "bg-gradient-to-r from-emerald-500 to-green-500",
      icon: CheckCircle,
      shadow: "shadow-emerald-200",
    },
    error: {
      bg: "bg-gradient-to-r from-red-500 to-rose-500",
      icon: XCircle,
      shadow: "shadow-red-200",
    },
    warning: {
      bg: "bg-gradient-to-r from-amber-500 to-orange-500",
      icon: AlertCircle,
      shadow: "shadow-amber-200",
    },
    info: {
      bg: "bg-gradient-to-r from-blue-500 to-indigo-500",
      icon: Info,
      shadow: "shadow-blue-200",
    },
  };

  const style = toastStyles[type] || toastStyles.success;
  const Icon = style.icon;

  return (
    <div className="fixed top-6 right-6 z-[100] animate-fade-in-down">
      <div
        className={`${style.bg} text-white px-6 py-4 rounded-2xl shadow-xl ${style.shadow} flex items-center gap-4 min-w-[300px] max-w-[450px]`}
      >
        {/* Icon */}
        <div className="p-2 bg-white/20 rounded-xl flex-shrink-0">
          <Icon className="w-6 h-6" />
        </div>

        {/* Message */}
        <p className="flex-1 font-medium text-sm md:text-base">{message}</p>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="p-1.5 hover:bg-white/20 rounded-lg transition-colors flex-shrink-0"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Progress Bar */}
      {duration > 0 && (
        <div className="mt-1 mx-2 h-1 bg-white/30 rounded-full overflow-hidden">
          <div
            className="h-full bg-white rounded-full animate-shrink-width"
            style={{ animationDuration: `${duration}ms` }}
          />
        </div>
      )}
    </div>
  );
};

export default Toast;
