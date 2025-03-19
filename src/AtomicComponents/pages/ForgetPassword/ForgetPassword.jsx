import { EyeCloseIcon, EyeOpenIcon, KeyIcon } from "@/assets/icon-svg";
import Input from "@/AtomicComponents/atoms/Input/Input";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";

const ForgetPassword = () => {
  const passwordCriteria = {
    minLength: 8,
    hasNumber: /[0-9]/,
    hasUpperCase: /[A-Z]/,
    hasLowerCase: /[a-z]/,
  };

  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordValid, setPasswordValid] = useState({
    minLength: false,
    hasNumber: false,
    hasUpperCase: false,
    hasLowerCase: false,
  });

  useEffect(() => {
    validatePassword(newPassword);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newPassword]);

  const validatePassword = (password) => {
    setPasswordValid({
      minLength: password.length >= passwordCriteria.minLength,
      hasNumber: passwordCriteria.hasNumber.test(password),
      hasUpperCase: passwordCriteria.hasUpperCase.test(password),
      hasLowerCase: passwordCriteria.hasLowerCase.test(password),
    });
  };

  return (
    <div className="reset-password-container h-dvh flex justify-center items-center">
      <form className="bg-[#FAF9F6] w-[40%] h-[50%] rounded-2xl px-standard-x py-standard-y">
        <h1 className="text-h1 text-center text-main-blue">Reset Password</h1>
        <h5 className="text-h5 mt-2 mb-6 text-center">
          Enter your password below to reset your password
        </h5>
        <div className="bg-[#d9d9d9] h-[1.5px]" />

        <div className="w-[90%] m-auto">
          <h6 className="text-h6 mt-6 mb-3">New Password</h6>
          <div className="relative">
            <div className="absolute top-0 left-0 translate-x-2 translate-y-[6px]">
              <KeyIcon width={25} height={25} />
            </div>

            <Input
              className="pr-15 pl-12"
              placeholder="Password"
              type={showPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <div
              className="absolute top-0 right-0 -translate-x-2 translate-y-[3px] cursor-pointer active:scale-92 active:translate-y-[4px]"
              onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? (
                <EyeOpenIcon width={24} />
              ) : (
                <EyeCloseIcon width={24} />
              )}
            </div>

            {/* Password Condition Text */}
            <div className="password-condition-container flex flex-col gap-2 px-1 mt-2">
              <ConditionText
                isValid={passwordValid.minLength}
                text={`At least ${passwordCriteria.minLength} characters`}
              />
              <ConditionText
                isValid={passwordValid.hasUpperCase}
                text="At least 1 uppercase letter"
              />
              <ConditionText
                isValid={passwordValid.hasLowerCase}
                text="At least 1 lowercase letter"
              />
              <ConditionText
                isValid={passwordValid.hasNumber}
                text="At least 1 number"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

// Reusable component for password conditions
const ConditionText = ({ isValid, text }) => {
  return (
    <div
      className={`password-condition ${
        isValid ? "text-green-600" : "text-gray-500"
      }`}>
      {isValid ? (
        <span>
          {"\u{2714}"} {text}
        </span>
      ) : (
        <span>
          {"\u{10102}"} {text}
        </span>
      )}
    </div>
  );
};

ConditionText.propTypes = {
  isValid: PropTypes.bool,
  text: PropTypes.string,
};

export default ForgetPassword;
