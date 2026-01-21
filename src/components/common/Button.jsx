import { Loader2 } from "lucide-react";

const variants = {
  primary: "bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 hover:from-green-600 hover:via-emerald-600 hover:to-teal-600 text-white shadow-lg shadow-green-200 hover:shadow-xl hover:shadow-green-300",
  secondary: "border-2 border-green-500 text-green-600 hover:bg-green-50",
  danger: "bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white shadow-md shadow-red-200 hover:shadow-lg",
  ghost: "bg-white/80 hover:bg-white text-gray-700 shadow-sm hover:shadow-md",
  outline: "border border-gray-200 text-gray-700 hover:bg-gray-50",
};

const sizes = {
  sm: "px-4 py-2 text-sm",
  md: "px-5 py-2.5",
  lg: "px-6 py-3 text-lg",
  xl: "px-8 py-4 text-lg",
};

const Button = ({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  disabled = false,
  className = "",
  icon: Icon,
  iconPosition = "left",
  rounded = "full",
  ...props
}) => {
  const baseStyles = "inline-flex items-center justify-center gap-2 font-semibold transition-all btn-press disabled:opacity-50 disabled:cursor-not-allowed";
  const roundedStyles = rounded === "full" ? "rounded-full" : rounded === "xl" ? "rounded-xl" : "rounded-2xl";

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${roundedStyles} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <>
          {Icon && iconPosition === "left" && <Icon className="w-4 h-4" />}
          {children}
          {Icon && iconPosition === "right" && <Icon className="w-4 h-4" />}
        </>
      )}
    </button>
  );
};

export default Button;
