import React from "react";
import { Link } from "react-router-dom";

export const Breadcrumb = ({ items = [] }) => {
  return (
    <div className="flex items-center text-sm text-gray-500 mb-4">
      <Link to="/" className="hover:text-gray-700">
        Home
      </Link>

      {items.map((item, index) => (
        <React.Fragment key={index}>
          <span className="mx-2">›</span>
          {item.href ? (
            <Link
              to={item.href}
              className={
                index === items.length - 1
                  ? "text-gray-900"
                  : "hover:text-gray-700"
              }
            >
              {item.label}
            </Link>
          ) : (
            <span className={index === items.length - 1 ? "text-gray-900" : ""}>
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};
