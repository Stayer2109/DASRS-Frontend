// Table.js
import PropTypes from "prop-types";

export const Table = ({ children, title = "" }) => (
  <div className="w-full border border-gray-300 rounded-[10px] shadow-md overflow-auto bg-white">
    {title && (
      <div className="p-4 border-b border-gray-300 text-center">
        <h2 className="text-h2 font-bold">{title}</h2>
      </div>
    )}
    <table className="w-full border-collapse">{children}</table>
  </div>
);

export const TableHeader = ({ columns, sortBy, sortDirection, onSort, sortByKey }) => (
  <thead>
    <tr className="bg-gray-200">
      {columns.map((col) => (
        <th
          key={col.key}
          onClick={() => col.sortable && onSort?.(col.key)}
          className={`px-4 py-2 text-center border-b border-gray-200 font-semibold select-none ${
            col.sortable ? "cursor-pointer" : ""
          } ${sortByKey == col.key ? "text-blue-600" : ""}`}
        >
          {col.label}
          <span className="ml-1 text-gray-500">
            {sortByKey == col.key
              ? sortDirection === "asc"
                ? "🔼"
                : "🔽"
              : col.sortable
              ? "⇅"
              : ""}
          </span>
        </th>
      ))}
    </tr>
  </thead>
);

export const TableBody = ({ children }) => <tbody>{children}</tbody>;

export const TableRow = ({ children }) => (
  <tr className="hover:bg-gray-100">{children}</tr>
);

export const TableCell = ({ children, className = "" }) => (
  <td className={`px-4 py-2 text-center border-b border-gray-200 ${className}`}>
    {children}
  </td>
);

// PropTypes
Table.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node.isRequired,
};

TableHeader.propTypes = {
  columns: PropTypes.array.isRequired,
  sortBy: PropTypes.string,
  sortDirection: PropTypes.string,
  onSort: PropTypes.func,
  sortByKey: PropTypes.string,
};

TableBody.propTypes = {
  children: PropTypes.node.isRequired,
};

TableRow.propTypes = {
  children: PropTypes.node.isRequired,
};

TableCell.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};
