import "./Input.scss";
import PropTypes from "prop-types";

const Input = ({ type = "text", placeholder = "", className = "" }) => {
  const commonInputClass = `input-container ${className} px-standard-x py-standard-y 
      rounded-xl border-gray-main border-1 focus:border-main-blue focus:outline-none 
      text-h6 block`;

  return (
    <>
      {
        // Type not provided or type is text
        type === "text" || type == null ? (
          <input
            type="text"
            placeholder={placeholder}
            className={commonInputClass}
          />
        ) : type === "password" ? (
          <input
            type="password"
            placeholder={placeholder}
            className={commonInputClass}
          />
        ) : null
      }
    </>
  );
};

Input.propTypes = {
  type: PropTypes.string,
  placeholder: PropTypes.string,
  className: PropTypes.string,
};

export default Input;
