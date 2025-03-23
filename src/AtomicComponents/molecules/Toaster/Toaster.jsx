import "./Toaster.scss";
import toast from "react-hot-toast";
import {
  ErrorIcon,
  InfoIcon,
  SuccessIcon,
  WarningIcon,
} from "@/assets/icon-svg";

/**
 * @typedef {"success" | "error" | "warning" | "info"} ToastType
 */

/**
 * @param {{ type?: ToastType, title?: string, message?: string }} props
 */

const Toast = ({ type, title, message }) => {
  type = type || "info";
  message = message || "This is a default message";
  title = title || "This is a default title";

  const customMessage = () => {
    return toast.custom(
      (t) => (
        <div
          className={`toast-content-container cursor-pointer ${
            t.visible ? "animate-enter" : "animate-leave"
          } ${type}`}
          onClick={() => toast.dismiss(t.id)}
        >
          <div className="header-line" />
          {type.toLowerCase() === "success" && (
            <SuccessIcon className={`sm:block hidden`} />
          )}
          {type.toLowerCase() === "error" && (
            <ErrorIcon className={`sm:block hidden`} />
          )}
          {type.toLowerCase() === "warning" && (
            <WarningIcon className={`sm:block hidden`} />
          )}
          {type.toLowerCase() === "info" && (
            <InfoIcon className={`sm:block hidden`} />
          )}
          <div className="toast-text-container">
            <h5 className={"toast-title text-h5"}>{title}</h5>
            <h6 className={"toast-content text-h6"}>{message}</h6>
          </div>
        </div>
      ),
      {
        duration: 2200,
      }
    );
  };

  const showToast = () => {
    return customMessage();
  };

  return showToast();
};

export default Toast;
