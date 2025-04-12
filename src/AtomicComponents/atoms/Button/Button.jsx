import { useState } from "react";
import "./Button.scss";
import PropTypes from "prop-types";
import { Tooltip } from "react-tooltip";

const Button = ({
  className = "",
  content = "Button",
  tooltipData = "",
  toolTipPos = "top",
  disabled = false,
  onClick = () => {},
  bgColor = "#4683FF", // Default color is blue
  type = "button",
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // Darkens the background
  const darkenColor = (hex, percent) => {
    let r = parseInt(hex.substring(1, 3), 16);
    let g = parseInt(hex.substring(3, 5), 16);
    let b = parseInt(hex.substring(5, 7), 16);

    r = Math.max(0, Math.floor(r * (1 - percent)));
    g = Math.max(0, Math.floor(g * (1 - percent)));
    b = Math.max(0, Math.floor(b * (1 - percent)));

    return `rgb(${r}, ${g}, ${b})`;
  };

  // Calculates luminance to determine if bg is light or dark
  const getTextColor = (hex) => {
    const r = parseInt(hex.substring(1, 3), 16);
    const g = parseInt(hex.substring(3, 5), 16);
    const b = parseInt(hex.substring(5, 7), 16);
    // Formula based on WCAG guidelines
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? "#000000" : "#ffffff";
  };

  const handleHover = () => setIsHovered(true);
  const handleLeave = () => setIsHovered(false);

  const currentBg = disabled
    ? darkenColor(bgColor, 0.3)
    : isHovered
    ? darkenColor(bgColor, 0.1)
    : bgColor;

  const textColor = getTextColor(currentBg);

  return (
    <>
      <button
        data-tooltip-id="my-tooltip"
        data-tooltip-content={tooltipData}
        data-tooltip-place={toolTipPos}
        className={`${className} px-standard-x py-standard-y rounded-[12px]`}
        onMouseEnter={handleHover}
        onMouseLeave={handleLeave}
        disabled={disabled}
        type={type}
        onClick={onClick}
        style={{
          backgroundColor: currentBg,
          color: textColor,
          cursor: disabled ? "not-allowed" : "pointer",
        }}
      >
        {content}
      </button>
      <Tooltip id="my-tooltip" style={{ borderRadius: "12px" }} />
    </>
  );
};

Button.propTypes = {
  className: PropTypes.string,
  content: PropTypes.string,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  tooltipData: PropTypes.string,
  toolTipPos: PropTypes.string,
  bgColor: PropTypes.string,
  type: PropTypes.string,
};

export default Button;
