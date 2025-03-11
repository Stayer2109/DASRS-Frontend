/** @format */

import "./Input.scss";
import PropTypes from "prop-types";

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
	type = "text",
	placeholder = "",
	className = "",
	autoComplete = "off",
	onChange = () => {},
}) => {
	const commonInputClass = `input-container ${className} px-standard-x py-standard-y 
      rounded-xl border-gray-main border-1 focus:border-main-blue focus:outline-none 
      text-h6`;

	return (
		<input
			type={type}
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
	type: PropTypes.oneOf(["text", "password", "email"]),
	placeholder: PropTypes.string,
	className: PropTypes.string,
	autoComplete: PropTypes.oneOf(VALID_AUTOCOMPLETE_VALUES),
	onChange: PropTypes.func,
};

export default Input;
