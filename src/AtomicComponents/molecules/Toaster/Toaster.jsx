import React from "react";
import "./Toaster.scss";
import toast from "react-hot-toast";
import {
  ErrorIcon,
  InfoIcon,
  SuccessIcon,
  WarningIcon,
} from "@/assets/icon-svg";

function Toast({ type, title, message }) {
  type = type || "info";
  message = message || "This is a default message";
  title = title || "";

  const customMessage = () => {
    return toast.custom(
      (t) => (
        <div
          className={`toast-content-container cursor-pointer ${
            t.visible ? "animate-enter" : "animate-leave"
          } ${type}`}
          onClick={() => toast.dismiss(t.id)}>
          <div className="header-line" />
          {type.toLowerCase() === "success" && <SuccessIcon />}
          {type.toLowerCase() === "error" && <ErrorIcon />}
          {type.toLowerCase() === "warning" && <WarningIcon />}
          {type.toLowerCase() === "info" && <InfoIcon />}
          <div className="toast-text-container">
            <h5 className={"toast-title text-h5"}>{title}</h5>
            <h6 className={"toast-content text-h6"}>{message}</h6>
          </div>
        </div>
      ),
      {
        duration: 2500,
      }
    );
  };

  const showToast = () => {
    return customMessage();
  };

  return showToast();
}

export default Toast;
