import { MenuItem, Pagination as PaginationMui, Select } from "@mui/material";
import PropTypes from "prop-types";
import { useEffect } from "react";

export default function DasrsPagination({
  pageSize,
  pageIndex,
  handlePagination,
  handleChangePageSize,
  page,
  count,
  ...props
}) {

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full gap-4 mt-4">
      <PaginationMui
        {...props}
        showFirstButton
        showLastButton
        page={pageIndex}
        pageSize={pageSize}
        siblingCount={0}
        boundaryCount={2}
        count={count}
        onChange={(_e, value) => handlePagination(pageSize, value)}
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 2,
          "& .css-yuzg60-MuiButtonBase-root-MuiPaginationItem-root": {
            borderRadius: "50%",
            color: "#2D3748",
            fontWeight: "bold",
            backgroundColor: "#E2E8F0",
            "&.Mui-selected": {
              backgroundColor: "#2D3748",
              color: "white",
            },
          },
          "& .MuiPaginationItem-previousNext": {
            // borderRadius: "50%",
            // color: "#2D3748",
            fontWeight: "bold",
            backgroundColor: "transparent",
            "&.Mui-selected": {
              backgroundColor: "#2D3748",
              color: "white",
            },
          },
          "& .MuiPaginationItem-firstLast": {
            // borderRadius: "50%",
            // color: "#2D3748",
            fontWeight: "bold",
            backgroundColor: "transparent",
            "&.Mui-selected": {
              backgroundColor: "#2D3748",
              color: "white",
            },
          },
        }}
        className="flex-1 ml-50"
      />

      <div className="flex items-center gap-2 text-sm">
        <span className="font-semibold">Rows per page:</span>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={pageSize || 10}
          onChange={(event) =>
            handleChangePageSize(event.target.value, pageIndex)
          } // Pass event.target.value directly
          label="Rows per page"
          sx={{
            "& .css-1d3z3hw-MuiOutlinedInput-notchedOutline": {
              border: "none !important",
              padding: "1px !important",
            },
          }}
          className="min-w-[80px] text-sm bg-white rounded border border-gray-300"
        >
          <MenuItem value={10}>10</MenuItem>
          <MenuItem value={20}>20</MenuItem>
          <MenuItem value={50}>50</MenuItem>
          <MenuItem value={100}>100</MenuItem>
        </Select>
      </div>
    </div>
  );
}

DasrsPagination.propTypes = {
  pageSize: PropTypes.number.isRequired,
  pageIndex: PropTypes.number.isRequired,
  handlePagination: PropTypes.func.isRequired,
  handleChangePageSize: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  count: PropTypes.number.isRequired,
};
