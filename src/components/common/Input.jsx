const Input = ({
  label,
  id,
  type = "text",
  placeholder,
  value,
  onChange,
  required = false,
  icon: Icon,
  rightIcon: RightIcon,
  onRightIconClick,
  error,
  className = "",
  ...props
}) => {
  return (
    <div className="flex flex-col">
      {label && (
        <label htmlFor={id} className="mb-2 font-semibold text-gray-700 text-sm">
          {label} {required && "*"}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        )}
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          className={`w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all bg-gray-50/50 hover:bg-white ${
            Icon ? "pl-12" : ""
          } ${RightIcon ? "pr-12" : ""} ${error ? "border-red-500" : ""} ${className}`}
          {...props}
        />
        {RightIcon && (
          <button
            type="button"
            onClick={onRightIconClick}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <RightIcon className="w-5 h-5" />
          </button>
        )}
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default Input;
