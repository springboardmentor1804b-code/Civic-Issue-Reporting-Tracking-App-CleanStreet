const AuthFormCard = ({ children, badge, badgeIcon: BadgeIcon, title, subtitle }) => {
  return (
    <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-6 md:p-8 border border-gray-200/80">
      {/* Badge */}
      {badge && (
        <div className="mb-5">
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-sm font-medium text-emerald-700">
            {BadgeIcon && <BadgeIcon className="w-4 h-4" />}
            {badge}
          </span>
        </div>
      )}

      {/* Title */}
      {title && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
          {subtitle && <p className="mt-2 text-gray-500 text-sm">{subtitle}</p>}
        </div>
      )}

      {children}
    </div>
  );
};

export default AuthFormCard;
