const Card = ({
  children,
  className = "",
  hover = true,
  animate = true,
  delay = "",
  padding = "p-6",
}) => {
  return (
    <div
      className={`bg-white/90 backdrop-blur rounded-3xl shadow-sm border border-gray-200/80 ${padding} ${
        hover ? "hover:shadow-lg transition-all" : ""
      } ${animate ? `animate-fade-in-up ${delay}` : ""} ${className}`}
    >
      {children}
    </div>
  );
};

const CardHeader = ({ children, icon: Icon, iconGradient = "from-green-400 to-emerald-500", action }) => {
  return (
    <div className="flex justify-between items-center mb-5">
      <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
        {Icon && (
          <div className={`p-2 bg-gradient-to-br ${iconGradient} rounded-xl`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
        )}
        {children}
      </h2>
      {action}
    </div>
  );
};

Card.Header = CardHeader;

export default Card;
