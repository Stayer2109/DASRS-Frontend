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

export const TableHeader = ({ columns, sortBy, sortDirection, onSort }) => (
  <thead>
    <tr className="bg-gray-100 text-gray-700 text-sm uppercase tracking-wide text-h5">
      {columns.map((col) => {
        const isSorted = sortBy === col.key;
        const sortIcon = isSorted
          ? sortDirection === "asc"
            ? "▲"
            : "▼"
          : col.sortable
          ? "⇅"
          : "";

        return (
          <th
            key={col.key}
            onClick={() => col.sortable && onSort?.(col.key)}
            className={`px-6 py-3 border-b border-gray-300 text-center font-semibold select-none whitespace-nowrap transition-colors duration-150 ${
              col.sortable ? "cursor-pointer hover:text-blue-600" : ""
            } ${isSorted ? "text-blue-600" : ""}`}
          >
            <div className="flex items-center justify-center gap-1">
              <span>{col.label}</span>
              {sortIcon && <span className="text-xs">{sortIcon}</span>}
            </div>
          </th>
        );
      })}
    </tr>
  </thead>
);

export const TableBody = ({ children }) => <tbody>{children}</tbody>;

export const TableRow = ({ children }) => (
  <tr className="hover:bg-gray-100">{children}</tr>
);

export const TableCell = ({ children, className = "", onClick = () => {} }) => (
  <td className={`px-4 py-4 text-center border-b border-gray-200 ${className}`} onClick={onClick}>
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
  onClick: PropTypes.func,
};
