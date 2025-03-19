/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

export const SidebarIcon = ({ className, color, height, width, ...props }) => {
  return (
    <svg
      width={width ? width : "32px"}
      height={height ? height : "32px"}
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
      <g
        id="SVGRepo_tracerCarrier"
        strokeLinecap="round"
        strokeLinejoin="round"></g>
      <g id="SVGRepo_iconCarrier">
        {" "}
        <path
          d="M2 6C2 5.44772 2.44772 5 3 5H21C21.5523 5 22 5.44772 22 6C22 6.55228 21.5523 7 21 7H3C2.44772 7 2 6.55228 2 6Z"
          fill={color ? color : "#000000"}></path>{" "}
        <path
          d="M2 12C2 11.4477 2.44772 11 3 11H21C21.5523 11 22 11.4477 22 12C22 12.5523 21.5523 13 21 13H3C2.44772 13 2 12.5523 2 12Z"
          fill={color ? color : "#000000"}></path>{" "}
        <path
          d="M3 17C2.44772 17 2 17.4477 2 18C2 18.5523 2.44772 19 3 19H21C21.5523 19 22 18.5523 22 18C22 17.4477 21.5523 17 21 17H3Z"
          fill={color ? color : "#000000"}></path>{" "}
      </g>
    </svg>
  );
};

export const LeftArrowIcon = ({
  className,
  color,
  height,
  width,
  onClick,
  ...props
}) => {
  return (
    <svg
      width={width ? width : "32px"}
      height={height ? height : "32px"}
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      onClick={onClick}>
      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
      <g
        id="SVGRepo_tracerCarrier"
        strokeLinecap="round"
        strokeLinejoin="round"></g>
      <g id="SVGRepo_iconCarrier">
        {" "}
        <path
          d="M6 12H18M6 12L11 7M6 12L11 17"
          stroke={color ? color : "#000000"}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"></path>{" "}
      </g>
    </svg>
  );
};

export const RightArrowIcon = ({
  className,
  color,
  height,
  width,
  ...props
}) => {
  return (
    <svg
      width={width ? width : "32px"}
      height={height ? height : "32px"}
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
      <g
        id="SVGRepo_tracerCarrier"
        strokeLinecap="round"
        strokeLinejoin="round"></g>
      <g id="SVGRepo_iconCarrier">
        {" "}
        <path
          d="M6 12H18M18 12L13 7M18 12L13 17"
          stroke={color ? color : "#000000"}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"></path>{" "}
      </g>
    </svg>
  );
};

export const LongRightArrowIcon = ({
  className,
  color,
  height,
  width,
  ...props
}) => {
  return (
    <svg
      width={width ? width : "32px"}
      height={height ? height : "32px"}
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
      <g
        id="SVGRepo_tracerCarrier"
        strokeLinecap="round"
        strokeLinejoin="round"></g>
      <g id="SVGRepo_iconCarrier">
        {" "}
        <path
          d="M5 12H19M19 12L13 6M19 12L13 18"
          stroke={color ? color : "#000000"}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"></path>{" "}
      </g>
    </svg>
  );
};

export const RightConnector = ({
  className,
  color,
  height,
  width,
  style,
  ...props
}) => {
  return (
    <svg
      width={width ? width : "32px"}
      height={height ? height : "32px"}
      className={className}
      viewBox="0 0 69 52"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={style}>
      <path
        id="Vector"
        d="M24.2738 44.0352L19.893 39.2517C15.7224 34.6985 8.55137 34.6985 4.38085 39.2517L0 44.0319L0 7.94179L4.37757 12.722C8.54809 17.2752 15.7191 17.2752 19.8897 12.722L24.2672 7.94179C28.9965 3.03328 35.6351 0 42.9836 0C57.329 0 68.9565 11.6396 68.9565 26C68.9565 40.3604 57.329 52 42.9836 52C35.6351 52 28.9997 48.9437 24.2738 44.0352Z"
        fill={color ? color : "#000000"}
      />
    </svg>
  );
};

export const CancelIcon = ({
  className,
  color,
  height,
  width,
  style,
  ...props
}) => {
  return (
    <svg
      fill={color ? color : "#000000"}
      width={width ? width : "32px"}
      height={height ? height : "32px"}
      className={className}
      viewBox="0 0 32 32"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg">
      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
      <g
        id="SVGRepo_tracerCarrier"
        strokeLinecap="round"
        strokeLinejoin="round"></g>
      <g id="SVGRepo_iconCarrier">
        {" "}
        <title>cancel2</title>{" "}
        <path d="M19.587 16.001l6.096 6.096c0.396 0.396 0.396 1.039 0 1.435l-2.151 2.151c-0.396 0.396-1.038 0.396-1.435 0l-6.097-6.096-6.097 6.096c-0.396 0.396-1.038 0.396-1.434 0l-2.152-2.151c-0.396-0.396-0.396-1.038 0-1.435l6.097-6.096-6.097-6.097c-0.396-0.396-0.396-1.039 0-1.435l2.153-2.151c0.396-0.396 1.038-0.396 1.434 0l6.096 6.097 6.097-6.097c0.396-0.396 1.038-0.396 1.435 0l2.151 2.152c0.396 0.396 0.396 1.038 0 1.435l-6.096 6.096z"></path>{" "}
      </g>
    </svg>
  );
};

export const LoginIcon = ({
  className,
  color,
  height,
  width,
  style,
  ...props
}) => {
  return (
    <svg
      width={width ? width : "32px"}
      height={height ? height : "32px"}
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
      <g
        id="SVGRepo_tracerCarrier"
        strokeLinecap="round"
        strokeLinejoin="round"></g>
      <g id="SVGRepo_iconCarrier">
        {" "}
        <path
          d="M8 16C8 18.8284 8 20.2426 8.87868 21.1213C9.75736 22 11.1716 22 14 22H15C17.8284 22 19.2426 22 20.1213 21.1213C21 20.2426 21 18.8284 21 16V8C21 5.17157 21 3.75736 20.1213 2.87868C19.2426 2 17.8284 2 15 2H14C11.1716 2 9.75736 2 8.87868 2.87868C8 3.75736 8 5.17157 8 8"
          stroke="#1C274C"
          strokeWidth="1.5"
          strokeLinecap="round"></path>{" "}
        <path
          opacity="0.5"
          d="M8 19.5C5.64298 19.5 4.46447 19.5 3.73223 18.7678C3 18.0355 3 16.857 3 14.5V9.5C3 7.14298 3 5.96447 3.73223 5.23223C4.46447 4.5 5.64298 4.5 8 4.5"
          stroke="#1C274C"
          strokeWidth="1.5"></path>{" "}
        <path
          d="M6 12L15 12M15 12L12.5 14.5M15 12L12.5 9.5"
          stroke="#1C274C"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"></path>{" "}
      </g>
    </svg>
  );
};

export const EyeOpenIcon = ({
  className,
  color,
  height,
  width,
  style,
  ...props
}) => {
  return (
    <svg
      width={width ? width : "32px"}
      height={height ? height : "32px"}
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
      <g
        id="SVGRepo_tracerCarrier"
        strokeLinecap="round"
        strokeLinejoin="round"></g>
      <g id="SVGRepo_iconCarrier">
        {" "}
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12 8.25C9.92893 8.25 8.25 9.92893 8.25 12C8.25 14.0711 9.92893 15.75 12 15.75C14.0711 15.75 15.75 14.0711 15.75 12C15.75 9.92893 14.0711 8.25 12 8.25ZM9.75 12C9.75 10.7574 10.7574 9.75 12 9.75C13.2426 9.75 14.25 10.7574 14.25 12C14.25 13.2426 13.2426 14.25 12 14.25C10.7574 14.25 9.75 13.2426 9.75 12Z"
          fill={color ? color : "#1C274C"}></path>{" "}
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12 3.25C7.48587 3.25 4.44529 5.9542 2.68057 8.24686L2.64874 8.2882C2.24964 8.80653 1.88206 9.28392 1.63269 9.8484C1.36564 10.4529 1.25 11.1117 1.25 12C1.25 12.8883 1.36564 13.5471 1.63269 14.1516C1.88206 14.7161 2.24964 15.1935 2.64875 15.7118L2.68057 15.7531C4.44529 18.0458 7.48587 20.75 12 20.75C16.5141 20.75 19.5547 18.0458 21.3194 15.7531L21.3512 15.7118C21.7504 15.1935 22.1179 14.7161 22.3673 14.1516C22.6344 13.5471 22.75 12.8883 22.75 12C22.75 11.1117 22.6344 10.4529 22.3673 9.8484C22.1179 9.28391 21.7504 8.80652 21.3512 8.28818L21.3194 8.24686C19.5547 5.9542 16.5141 3.25 12 3.25ZM3.86922 9.1618C5.49864 7.04492 8.15036 4.75 12 4.75C15.8496 4.75 18.5014 7.04492 20.1308 9.1618C20.5694 9.73159 20.8263 10.0721 20.9952 10.4545C21.1532 10.812 21.25 11.2489 21.25 12C21.25 12.7511 21.1532 13.188 20.9952 13.5455C20.8263 13.9279 20.5694 14.2684 20.1308 14.8382C18.5014 16.9551 15.8496 19.25 12 19.25C8.15036 19.25 5.49864 16.9551 3.86922 14.8382C3.43064 14.2684 3.17374 13.9279 3.00476 13.5455C2.84684 13.188 2.75 12.7511 2.75 12C2.75 11.2489 2.84684 10.812 3.00476 10.4545C3.17374 10.0721 3.43063 9.73159 3.86922 9.1618Z"
          fill={color ? color : "#1C274C"}></path>{" "}
      </g>
    </svg>
  );
};

export const EyeCloseIcon = ({
  className,
  color,
  height,
  width,
  style,
  ...props
}) => {
  return (
    <svg
      width={width ? width : "32px"}
      height={height ? height : "32px"}
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
      <g
        id="SVGRepo_tracerCarrier"
        strokeLinecap="round"
        strokeLinejoin="round"></g>
      <g id="SVGRepo_iconCarrier">
        {" "}
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M22.2954 6.31083C22.6761 6.474 22.8524 6.91491 22.6893 7.29563L21.9999 7.00019C22.6893 7.29563 22.6894 7.29546 22.6893 7.29563L22.6886 7.29731L22.6875 7.2998L22.6843 7.30716L22.6736 7.33123C22.6646 7.35137 22.6518 7.37958 22.6352 7.41527C22.6019 7.48662 22.5533 7.58794 22.4888 7.71435C22.3599 7.967 22.1675 8.32087 21.9084 8.73666C21.4828 9.4197 20.8724 10.2778 20.0619 11.1304L21.0303 12.0987C21.3231 12.3916 21.3231 12.8665 21.0303 13.1594C20.7374 13.4523 20.2625 13.4523 19.9696 13.1594L18.969 12.1588C18.3093 12.7115 17.5528 13.2302 16.695 13.6564L17.6286 15.0912C17.8545 15.4383 17.7562 15.9029 17.409 16.1288C17.0618 16.3547 16.5972 16.2564 16.3713 15.9092L15.2821 14.2353C14.5028 14.4898 13.659 14.6628 12.7499 14.7248V16.5002C12.7499 16.9144 12.4141 17.2502 11.9999 17.2502C11.5857 17.2502 11.2499 16.9144 11.2499 16.5002V14.7248C10.3689 14.6647 9.54909 14.5004 8.78982 14.2586L7.71575 15.9093C7.48984 16.2565 7.02526 16.3548 6.67807 16.1289C6.33089 15.903 6.23257 15.4384 6.45847 15.0912L7.37089 13.689C6.5065 13.2668 5.74381 12.7504 5.07842 12.1984L4.11744 13.1594C3.82455 13.4523 3.34968 13.4523 3.05678 13.1594C2.76389 12.8665 2.76389 12.3917 3.05678 12.0988L3.98055 11.175C3.15599 10.3153 2.53525 9.44675 2.10277 8.75486C1.83984 8.33423 1.6446 7.97584 1.51388 7.71988C1.44848 7.59182 1.3991 7.48914 1.36537 7.41683C1.3485 7.38067 1.33553 7.35207 1.32641 7.33167L1.31562 7.30729L1.31238 7.29984L1.31129 7.29733L1.31088 7.29638C1.31081 7.2962 1.31056 7.29563 1.99992 7.00019L1.31088 7.29638C1.14772 6.91565 1.32376 6.474 1.70448 6.31083C2.08489 6.1478 2.52539 6.32374 2.68888 6.70381C2.68882 6.70368 2.68894 6.70394 2.68888 6.70381L2.68983 6.706L2.69591 6.71972C2.7018 6.73291 2.7114 6.7541 2.72472 6.78267C2.75139 6.83983 2.79296 6.92644 2.84976 7.03767C2.96345 7.26029 3.13762 7.58046 3.37472 7.95979C3.85033 8.72067 4.57157 9.70728 5.55561 10.6218C6.42151 11.4265 7.48259 12.1678 8.75165 12.656C9.70614 13.0232 10.7854 13.2502 11.9999 13.2502C13.2416 13.2502 14.342 13.013 15.3124 12.631C16.5738 12.1345 17.6277 11.3884 18.4866 10.5822C19.4562 9.67216 20.1668 8.69535 20.6354 7.9434C20.869 7.5685 21.0405 7.25246 21.1525 7.03286C21.2085 6.92315 21.2494 6.83776 21.2757 6.78144C21.2888 6.75328 21.2983 6.73242 21.3041 6.71943L21.31 6.70595L21.3106 6.70475C21.3105 6.70485 21.3106 6.70466 21.3106 6.70475M22.2954 6.31083C21.9147 6.14771 21.4738 6.32423 21.3106 6.70475L22.2954 6.31083ZM2.68888 6.70381C2.68882 6.70368 2.68894 6.70394 2.68888 6.70381V6.70381Z"
          fill={color ? color : "#1C274C"}></path>{" "}
      </g>
    </svg>
  );
};

export const KeyIcon = ({
  className,
  color,
  height,
  width,
  style,
  ...props
}) => {
  return (
    <svg
      fill="#000000"
      width={width || "32px"}
      height={height || "32px"}
      className={`${className || ""} icon line-color`}
      viewBox="0 0 24 24"
      id="key-3"
      data-name="Line Color"
      xmlns="http://www.w3.org/2000/svg"
      transform="matrix(1, 0, 0, -1, 0, 0)"
      style={style} // Thêm style prop nếu cần truyền từ ngoài vào
      {...props} // Để đảm bảo truyền các prop còn lại
    >
      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
      <g
        id="SVGRepo_tracerCarrier"
        strokeLinecap="round"
        strokeLinejoin="round"></g>
      <g id="SVGRepo_iconCarrier">
        <path
          id="secondary"
          d="M9,12H21m-1,0V10m-4,2V10"
          style={{
            fill: "none",
            stroke: "#2ca9bc",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeWidth: 2,
          }}></path>
        <ellipse
          id="primary"
          cx="6"
          cy="12"
          rx="3"
          ry="4"
          style={{
            fill: "none",
            stroke: "#000000",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeWidth: 2,
          }}></ellipse>
      </g>
    </svg>
  );
};
