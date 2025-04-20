import PropTypes from "prop-types";

export const Table = ({ children, title = "" }) => (
  <div className="bg-white shadow-md border border-gray-300 rounded-[4px] w-full overflow-auto">
    {title && (
      <div className="p-4 border-gray-300 border-b text-center">
        <h2 className="font-bold text-h2">{title}</h2>
      </div>
    )}
    <table className="w-full border-collapse">{children}</table>
  </div>
);

export const TableHeader = ({ columns, sortBy, sortDirection, onSort }) => (
  <thead>
    <tr className="bg-gray-100 text-gray-700 text-h5 text-sm uppercase tracking-wide">
      {/* Add No column at the beginning */}
      <th className="px-6 py-3 border-gray-300 border-b font-semibold text-center whitespace-nowrap select-none">
        No
      </th>
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
            <div className="flex justify-center items-center gap-1">
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

export const TableRow = ({ children, index, pageIndex = 1, pageSize = 10 }) => {
  // Default values if pageIndex and pageSize are not provided
  const currentPageIndex = pageIndex || 1;
  const currentPageSize = pageSize || 10;

  // Calculate the row index, adjust from 0-based to 1-based
  const rowIndex = (currentPageIndex - 1) * currentPageSize + index + 1;

  return (
    <tr className="hover:bg-gray-100">
      {/* Display row number as the first column */}
      {rowIndex > 0 ? (
        <td className="px-4 py-4 border-gray-200 border-b font-semibold text-center">
          #{rowIndex}
        </td>
      ) : null}
      {children}
    </tr>
  );
};

export const TableCell = ({
  children,
  className = "",
  onClick = () => {},
  colSpan,
}) => (
  <td
    className={`px-4 py-4 text-center border-b border-gray-200 ${className}`}
    onClick={onClick}
    colSpan={colSpan}
  >
    {children ? children : "-"}
  </td>
);

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
  index: PropTypes.number,
  pageIndex: PropTypes.number,
  pageSize: PropTypes.number,
};

TableCell.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  onClick: PropTypes.func,
  colSpan: PropTypes.number,
};
