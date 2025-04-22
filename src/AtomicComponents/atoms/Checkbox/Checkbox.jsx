import PropTypes from "prop-types";

const Checkbox = ({ id, label, checked, onChange, disabled = false }) => {
  return (
    <label
      htmlFor={id}
      className={`relative inline-flex items-center gap-3 cursor-pointer select-none ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="peer hidden"
      />
      <div
        className={`w-5 h-5 rounded-md border-2 flex items-center justify-center
        transition-all duration-200 ease-in-out
        peer-focus-visible:ring-2 peer-focus-visible:ring-blue-400
        peer-checked:bg-blue-600 peer-checked:border-blue-600
        ${
          disabled
            ? "bg-gray-200 border-gray-300"
            : "border-gray-400 hover:border-blue-500"
        }`}
      >
        <svg
          className={`w-4 h-4 text-white transition-all duration-300 ${
            checked ? "opacity-100" : "opacity-0"
          }`}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path
            d="M5 13l4 4L19 7"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="18"
            strokeDashoffset={checked ? 0 : 16}
            className="transition-all duration-300 ease-in-out"
          />
        </svg>
      </div>
      <span className="text-gray-800 text-sm">{label}</span>
    </label>
  );
};

Checkbox.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

export default Checkbox;
