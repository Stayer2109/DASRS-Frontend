import "./Select.scss";

import { ChevronDown } from "lucide-react";
import PropTypes from "prop-types";

const Select = ({ placeHolder, value, onChange, options, className }) => {
  return (
    <div className={`relative w-full ${className} group focus-within:z-10`}>
      {/* Chevron on the left */}
      <div
        className={`
          absolute left-3 top-1/2 -translate-y-[55%] pointer-events-none transition-transform duration-200 -rotate-90
          text-gray-500 group-focus-within:rotate-0
        `}
      >
        <ChevronDown className="w-4 h-4" />
      </div>

      <select
        className={`
          select-container
          appearance-none pl-10 pr-4 py-standard-y
          rounded-[8px] border border-border-line focus:border-main-blue focus:outline-none
          text-h6 shadow-md w-full bg-white
        `}
        value={value}
        onChange={onChange}
      >
        <option value="" disabled>
          {placeHolder}
        </option>
        {(options || []).map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

Select.propTypes = {
  className: PropTypes.string,
  placeHolder: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default Select;
