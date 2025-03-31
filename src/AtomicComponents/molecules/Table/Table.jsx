import PropTypes from "prop-types";

// Outer Table container with title
export const Table = ({ children, title = "" }) => (
  <div className="w-full border border-gray-300 rounded-[10px] shadow-md overflow-hidden bg-white">
    {title && (
      <div className="p-4 border-b border-gray-300 text-center">
        <h2 className="text-h2 font-bold">{title}</h2>
      </div>
    )}
    <table className="w-full border-collapse">{children}</table>
  </div>
);

Table.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node.isRequired,
};

// Header
export const TableHeader = ({ children }) => (
  <thead>
    <tr className="bg-gray-200">{children}</tr>
  </thead>
);

TableHeader.propTypes = {
  children: PropTypes.node.isRequired,
};

// Body
export const TableBody = ({ children }) => <tbody>{children}</tbody>;

TableBody.propTypes = {
  children: PropTypes.node.isRequired,
};

// Row
export const TableRow = ({ children }) => (
  <tr className="hover:bg-gray-100">{children}</tr>
);

TableRow.propTypes = {
  children: PropTypes.node.isRequired,
};

// Cell (td only, use in both header and body)
export const TableCell = ({ children, className = "" }) => (
  <td className={`px-4 py-2 text-center border-b border-gray-200 ${className}`}>
    {children}
  </td>
);

TableCell.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};
