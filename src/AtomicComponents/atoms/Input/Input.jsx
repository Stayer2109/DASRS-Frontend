/** @format */

import "./Input.scss";
import { CalendarIcon } from "lucide-react";
import "@/styles/react-calendar.css"; // now safe
import "react-date-picker/dist/DatePicker.css"; // this one usually works fine
import { format } from "date-fns";
import PropTypes from "prop-types";
import DatePicker from "react-date-picker";

const VALID_AUTOCOMPLETE_VALUES = [
  "on",
  "off",
  "name",
  "email",
  "username",
  "new-password",
  "current-password",
  "organization",
  "street-address",
  "address-line1",
  "address-line2",
  "address-line3",
  "country",
  "country-name",
  "postal-code",
  "cc-name",
  "cc-number",
  "cc-exp",
  "cc-csc",
  "bday",
  "bday-day",
  "bday-month",
  "bday-year",
  "tel",
  "tel-country-code",
  "tel-national",
  "tel-area-code",
  "tel-local",
  "tel-extension",
  "transaction-currency",
  "language",
];

const Input = ({
  ref = null,
  id = "",
  accept = "",
  type = "text",
  value = "",
  placeholder = "",
  className = "",
  autoComplete = "off",
  onChange = () => {},
}) => {
  const commonInputClass = `input-container ${className} px-standard-x py-standard-y 
      rounded-xl border-border-line border-1 focus:border-main-blue focus:outline-none 
      text-h6 shadow-md w-full`;

  return type === "file" ? (
    <input
      id={id}
      ref={ref}
      type="file"
      accept={accept}
      placeholder={placeholder}
      value={value}
      className={commonInputClass}
      onChange={onChange}
      autoComplete={
        VALID_AUTOCOMPLETE_VALUES.includes(autoComplete) ? autoComplete : "off"
      }
    />
  ) : type === "date" ? (
    <div className={`relative w-full ${commonInputClass}`}>
      <DatePicker
        id={id}
        ref={ref}
        onChange={(date) =>
          onChange({
            target: {
              value: date ? format(date, "yyyy-MM-dd") : "",
            },
          })
        }
        value={value ? new Date(value) : null}
        format="dd-MM-y"
        className="react-date-picker w-full"
        calendarClassName="react-calendar"
        clearIcon={null}
        calendarIcon={
          <CalendarIcon className="w-4 h-4 text-muted-foreground" />
        }
      />
    </div>
  ) : (
    <input
      id={id}
      type={type}
      ref={ref}
      value={value}
      placeholder={placeholder}
      className={commonInputClass}
      onChange={onChange}
      autoComplete={
        VALID_AUTOCOMPLETE_VALUES.includes(autoComplete) ? autoComplete : "off"
      }
    />
  );
};

Input.propTypes = {
  ref: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  id: PropTypes.string,
  value: PropTypes.string || PropTypes.number || PropTypes.bool,
  accept: PropTypes.string,
  type: PropTypes.oneOf(["text", "password", "email"]),
  placeholder: PropTypes.string,
  className: PropTypes.string,
  autoComplete: PropTypes.oneOf(VALID_AUTOCOMPLETE_VALUES),
  onChange: PropTypes.func,
};

export default Input;
