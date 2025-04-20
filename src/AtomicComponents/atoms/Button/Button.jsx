import { useState } from "react";
import "./Button.scss";
import PropTypes from "prop-types";
import { Tooltip } from "react-tooltip";

export const Button = ({
  className = "",
  content = "Button",
  tooltipData = "",
  toolTipPos = "top",
  borderColor = "#000",
  disabled = false,
  onClick = () => {},
  bgColor = "#4683FF", // Default color is blue
  type = "button",
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const expandShortHex = (hex) => {
    if (hex.length === 4) {
      return "#" + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
    }
    return hex;
  };

  const adjustColorBrightness = (hex, percent) => {
    hex = expandShortHex(hex);

    let r = parseInt(hex.substring(1, 3), 16);
    let g = parseInt(hex.substring(3, 5), 16);
    let b = parseInt(hex.substring(5, 7), 16);

    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    const isDark = luminance < 0.5;

    const boost = Math.round(255 * percent);

    r = isDark ? Math.min(255, r + boost + 30) : Math.max(0, r - boost - 30);
    g = isDark ? Math.min(255, g + boost + 30) : Math.max(0, g - boost - 30);
    b = isDark ? Math.min(255, b + boost + 30) : Math.max(0, b - boost - 30);

    return `rgb(${r}, ${g}, ${b})`;
  };

  // Calculates luminance to determine if bg is light or dark
  const getTextColor = (color) => {
    let r, g, b;

    if (color.startsWith("#")) {
      const hex = expandShortHex(color);
      r = parseInt(hex.substring(1, 3), 16);
      g = parseInt(hex.substring(3, 5), 16);
      b = parseInt(hex.substring(5, 7), 16);
    } else if (color.startsWith("rgb")) {
      const values = color.match(/\d+/g);
      if (!values || values.length < 3) return "#000000";
      [r, g, b] = values.map(Number);
    } else {
      // fallback for unknown color formats
      return "#000000";
    }

    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? "#000000" : "#ffffff";
  };

  const handleHover = () => setIsHovered(true);
  const handleLeave = () => setIsHovered(false);

  const currentBg = disabled
    ? adjustColorBrightness(bgColor, 0.3)
    : isHovered
    ? adjustColorBrightness(bgColor, 0.1)
    : bgColor;

  const textColor = getTextColor(currentBg);

  return (
    <>
      <button
        data-tooltip-id="my-tooltip"
        data-tooltip-content={tooltipData}
        data-tooltip-place={toolTipPos}
        className={`${className} px-standard-x py-standard-y rounded-[2px]`}
        onMouseEnter={handleHover}
        onMouseLeave={handleLeave}
        disabled={disabled}
        type={type}
        onClick={onClick}
        style={{
          backgroundColor: currentBg,
          color: textColor,
          cursor: disabled ? "not-allowed" : "pointer",
          borderColor: borderColor,
          borderWidth: "1px",
        }}
      >
        {content}
      </button>
      <Tooltip id="my-tooltip" style={{ borderRadius: "8px" }} />
    </>
  );
};

Button.propTypes = {
  className: PropTypes.string,
  content: PropTypes.string,
  onClick: PropTypes.func,
  borderColor: PropTypes.string,
  disabled: PropTypes.bool,
  tooltipData: PropTypes.string,
  toolTipPos: PropTypes.string,
  bgColor: PropTypes.string,
  type: PropTypes.string,
};
