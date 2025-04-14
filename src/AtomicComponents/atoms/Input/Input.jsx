import "./Input.scss";
import "@/styles/react-calendar.css";
import "react-datetime-picker/dist/DateTimePicker.css";
import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";
import "react-clock/dist/Clock.css";

import { CalendarIcon } from "lucide-react";
import DatePicker from "react-date-picker";
import DateTimePicker from "react-datetime-picker";
import PropTypes from "prop-types";
import { format } from "date-fns";

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
  timeInput = false,
  min,
  disabled = false,
  max,
  step,
  value = "",
  placeholder = "",
  className = "",
  autoComplete = "off",
  onChange = () => { },
}) => {
  const commonInputClass = `input-container ${className} px-standard-x py-standard-y bg-white
      rounded-xl border-solid border-1 focus:border-main-blue focus:outline-none border-border-line
      text-h6 shadow-md w-full`;

  return type === "file" ? (
    <input
      id={id}
      ref={ref}
      type="file"
      accept={accept}
      disabled={disabled}
      placeholder={placeholder}
      value={value}
      className={commonInputClass}
      onChange={onChange}
      autoComplete={
        VALID_AUTOCOMPLETE_VALUES.includes(autoComplete) ? autoComplete : "off"
      }
    />
  ) : type === "date" ? (
    <div className={`relative w-full`}>
      {timeInput ? (
        <DateTimePicker
          id={id}
          ref={ref}
          value={value instanceof Date ? value : value ? new Date(value) : null}
          onChange={(date) =>
            onChange({
              target: {
                value: date || null,
              },
            })
          }
          minDate={min ? new Date(min) : undefined}
          maxDate={max ? new Date(max) : undefined}
          format="dd-MM-y HH:mm"
          disabled={disabled}
          className={`react-datetime-picker w-full ${commonInputClass}`}
          calendarClassName="react-calendar"
          clearIcon={null}
          calendarIcon={
            <CalendarIcon className="w-4 h-4 text-muted-foreground" />
          }
        />
      ) : (
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
          minDate={min ? new Date(min) : undefined}
          maxDate={max ? new Date(max) : undefined}
          format="dd-MM-y"
          disabled={disabled}
          className={`react-date-picker w-full ${commonInputClass}`}
          calendarClassName="react-calendar"
          clearIcon={null}
          calendarIcon={
            <CalendarIcon className="w-4 h-4 text-muted-foreground" />
          }
        />
      )}
    </div>
  ) : type === "number" ? (
    <input
      id={id}
      type="number"
      ref={ref}
      value={value}
      disabled={disabled}
      min={min}
      max={max}
      step={step}
      placeholder={placeholder}
      className={commonInputClass}
      onChange={onChange}
      autoComplete={
        VALID_AUTOCOMPLETE_VALUES.includes(autoComplete) ? autoComplete : "off"
      }
    />
  ) : (
    <input
      id={id}
      type={type}
      ref={ref}
      value={value}
      disabled={disabled}
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
  timeInput: PropTypes.bool,
  placeholder: PropTypes.string,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  min: PropTypes.number,
  max: PropTypes.number,
  step: PropTypes.number,
  autoComplete: PropTypes.oneOf(VALID_AUTOCOMPLETE_VALUES),
  onChange: PropTypes.func,
};

export default Input;
