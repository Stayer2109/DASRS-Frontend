import { MenuItem, Pagination as PaginationMui, Select } from "@mui/material";
import "./Pagination.scss";
import { useEffect } from "react";
import React from "react";

export default function DasrsPagination({
  pageSize,
  pageIndex,
  handlePagination,
  handleChangePageSize,
  page,
  count,
  ...props
}) {
  useEffect(() => {
    console.log("pageSize", pageSize);
  }, [pageSize]);

  return (
    <div className="pagination-container">
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
        className="pagination-items"
      />

      {/* <div className="items-per-page-container">
        <p className="text-sm font-semibold">Rows per page:</p>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={pageSize || 10}
          onChange={(event) => handleChangePageSize(event.target.value, pageIndex)} // Pass event.target.value directly
          label="Rows per page"
          sx={{
            "& .css-1d3z3hw-MuiOutlinedInput-notchedOutline": {
              border: "none !important",
              padding: "1px !important",
            },
          }}
          className="select-box"
        >
          <MenuItem value={10}>10</MenuItem>
          <MenuItem value={20}>20</MenuItem>
          <MenuItem value={50}>50</MenuItem>
          <MenuItem value={100}>100</MenuItem>
        </Select>
      </div> */}
    </div>
  );
}
