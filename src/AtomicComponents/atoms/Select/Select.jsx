import PropTypes from "prop-types";

const Select = ({ placeHolder, value, onChange, options, className }) => {
  const commonSelectClassname = `input-container ${className} px-standard-x py-standard-y 
      rounded-xl border-border-line border-1 focus:border-main-blue focus:outline-none 
      text-h6 shadow-md w-full`;

  return (
    <select className={commonSelectClassname} value={value} onChange={onChange}>
      <option value="" disabled selected>
        {placeHolder}
      </option>
      {options.map((option, index) => (
        <option key={index} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
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
