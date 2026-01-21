const variants = {
  success: "bg-green-100 text-green-700",
  warning: "bg-amber-100 text-amber-700",
  error: "bg-red-100 text-red-700",
  info: "bg-blue-100 text-blue-700",
  purple: "bg-purple-100 text-purple-700",
  gradient: {
    success: "bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-emerald-200",
    warning: "bg-gradient-to-r from-amber-400 to-orange-400 text-white shadow-amber-200",
    error: "bg-gradient-to-r from-orange-400 to-red-400 text-white shadow-orange-200",
    info: "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-blue-200",
  },
};

const Badge = ({
  children,
  variant = "success",
  gradient = false,
  icon: Icon,
  className = "",
}) => {
  const variantStyle = gradient ? variants.gradient[variant] : variants[variant];

  return (
    <span
      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
        gradient ? "shadow-sm" : ""
      } ${variantStyle} ${className}`}
    >
      {Icon && <Icon className="w-3 h-3" />}
      {children}
    </span>
  );
};

export default Badge;
