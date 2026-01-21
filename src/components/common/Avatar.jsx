const sizes = {
  sm: "w-8 h-8 text-xs",
  md: "w-9 h-9 text-sm",
  lg: "w-14 h-14 text-lg",
  xl: "w-28 h-28 text-4xl",
};

const Avatar = ({
  name,
  imageUrl,
  size = "md",
  className = "",
  showRing = true,
}) => {
  const getInitials = (name) => {
    if (!name) return "U";
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  };

  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={name || "Avatar"}
        className={`${sizes[size]} rounded-full object-cover shadow-md ${
          showRing ? "ring-2 ring-white" : ""
        } ${className}`}
      />
    );
  }

  return (
    <div
      className={`${sizes[size]} bg-gradient-to-br from-green-400 to-emerald-600 text-white rounded-full flex items-center justify-center font-bold shadow-md ${
        showRing ? "ring-2 ring-white" : ""
      } ${className}`}
    >
      {getInitials(name)}
    </div>
  );
};

export default Avatar;
