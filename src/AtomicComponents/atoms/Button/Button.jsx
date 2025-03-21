/** @format */

import { useState } from "react";
import "./Button.scss";
import PropTypes from "prop-types";
import { Tooltip } from "react-tooltip";

const Button = ({
  className = "",
  content = "Button",
  tooltipData = "",
  disabled = false,
  onClick = () => {},
  bgColor = "#4683FF", // Default color is blue
  type = "button",
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const darkenColor = (hex, percent) => {
    let r = parseInt(hex.substring(1, 3), 16);
    let g = parseInt(hex.substring(3, 5), 16);
    let b = parseInt(hex.substring(5, 7), 16);

    r = Math.floor(r * (1 - percent));
    g = Math.floor(g * (1 - percent));
    b = Math.floor(b * (1 - percent));

    return `rgb(${r}, ${g}, ${b})`;
  };

  // HANDLE HOVER EVENTS
  const handleHover = () => setIsHovered(true);
  const handleLeave = () => setIsHovered(false);

  return (
    <>
      {disabled ? (
        <>
          <button
            data-tooltip-id="my-tooltip"
            data-tooltip-content={tooltipData}
            data-tooltip-place="top"
            className={`${className} px-standard-x py-standard-y rounded-[12px] cursor-pointer transition-all duration-300 ease-linear`}
            onMouseEnter={handleHover}
            onMouseLeave={handleLeave}
            disabled={true}
            type={type}
            onClick={onClick}
            style={{
              backgroundColor: darkenColor(bgColor, 0.3), // Darkens background on hover
              color: "#ffffff", // Keep text color white
              cursor: "not-allowed",
            }}>
            {content}
          </button>
          <Tooltip id="my-tooltip" style={{ borderRadius: "12px" }} />
        </>
      ) : (
        <button
          className={`${className} px-standard-x py-standard-y rounded-[12px] cursor-pointer transition-all duration-300 ease-linear`}
          onMouseEnter={handleHover}
          onMouseLeave={handleLeave}
          disabled={false}
          type={type}
          onClick={onClick}
          style={{
            backgroundColor: isHovered ? darkenColor(bgColor, 0.2) : bgColor, // Darkens background on hover
            color: "#ffffff", // Keep text color white
          }}>
          {content}
        </button>
      )}
    </>
  );
};

Button.propTypes = {
  className: PropTypes.string,
  content: PropTypes.string,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  tooltipData: PropTypes.string,
  bgColor: PropTypes.string,
  type: PropTypes.string,
};

export default Button;
