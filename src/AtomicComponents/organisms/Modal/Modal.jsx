/** @format */

import { CancelIcon } from "@/assets/icon-svg";
import PropTypes, { object } from "prop-types";
import { useEffect, useRef } from "react";
import "./Modal.scss";
import CircularButton from "@/AtomicComponents/atoms/CircularButton/CircularButton";

/**
 * @typedef {"sm" | "md" | "lg" | "xl" | "auto"} ModalSize
 */

/**
 *	@param {{size?: ModalSize, show?: boolean, onHide?: () => void, className?: string, children?: object}} props
 */

const Modal = ({
  children = object,
  className = "",
  show = false,
  onHide = () => { },
  size = "xs",
}) => {
  const modalRef = useRef();

  // HANDLE MODAL CLOSE
  const handleClose = (event) => {
    if (
      (!modalRef.current.contains(event.target) &&
        event.target.classList.contains(".MuiPickersDay-root")) ||
      event.target.classList.contains("modal-container")
    ) {
      onHide();
    }

    // Check if the clicked element or its parent contains the 'cancel-mark' class
    if (
      event.target.classList.contains("cancel-mark") ||
      event.target.closest(".cancel-mark")
    ) {
      onHide(); // Call onHide when the cancel button or its parent is clicked
    }
  };

  // HANDLE ESCAPE KEY
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onHide(); // Call onHide when the escape key is pressed
      }
    };

    if (show) {
      document.body.style.overflow = "hidden";
      // Scroll to top when modal is opened

      document.body.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "auto";
      document.body.removeEventListener("keydown", handleKeyDown); // Cleanup event listener
    }

    return () => {
      document.body.style.overflow = "auto";
      document.body.removeEventListener("keydown", handleKeyDown); // Cleanup event listener
    };
  }, [show, onHide]);

  return (
    <>
      <div
        className={`modal-container ${show ? "opened" : "close"}`}
        onClick={handleClose}
        onKeyDown={handleClose}
      >
        <div
          className={`modal ${className} ${show ? "modal-show" : "modal-closed"
            } ${size}`}
          ref={modalRef}
          onClick={handleClose}
        >
          {children}
        </div>
      </div>
    </>
  );
};

const ModalHeader = ({ content, className, icon = <CancelIcon /> }) => {
  return (
    <>
      <div className={`modal-header ${className}`}>
        {content && <h4 className={`modal-title text-h4`}>{content}</h4>}
        <CircularButton icon={icon} className="cancel-mark" noBackground />
      </div>
    </>
  );
};

const ModalBody = ({ children, className }) => {
  return (
    <>
      <div className={`modal-body ${className}`}>{children}</div>
    </>
  );
};

const ModalFooter = ({ children, className }) => {
  return (
    <>
      <div className={`modal-footer flex justify-end gap-4 mt-6 p-[24px] border-t ${className}`}>{children}</div>
    </>
  );
};

ModalHeader.defaultProps = {
  icon: <CancelIcon />,
};

Modal.propTypes = {
  children: PropTypes.object,
  className: PropTypes.string,
  show: PropTypes.bool,
  onHide: PropTypes.func,
  size: PropTypes.string,
};

ModalHeader.propTypes = {
  content: PropTypes.string,
  className: PropTypes.string,
  icon: PropTypes.element,
};

ModalBody.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

ModalFooter.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

Modal.Header = ModalHeader;
Modal.Body = ModalBody;
Modal.Footer = ModalFooter;

export default Modal;
