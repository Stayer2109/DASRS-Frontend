import { MenuItem, Pagination as PaginationMui, Select } from "@mui/material";
import PropTypes from "prop-types";
import { useState } from "react";

export default function DasrsPagination({
  pageSize,
  pageIndex,
  handlePagination,
  handleChangePageSize,
  count,
  displayedValues = [10, 15, 20, 25],
  ...props
}) {
  const [goToPage, setGoToPage] = useState("");

  return (
    <div className="flex flex-col justify-center items-center gap-4 mt-4 w-full">
      {/* Pagination Buttons */}
      <PaginationMui
        {...props}
        showFirstButton
        showLastButton
        page={pageIndex}
        pageSize={pageSize}
        siblingCount={1}
        boundaryCount={1}
        count={count}
        onChange={(_e, value) => handlePagination(pageSize, value)}
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 2,
          "& .MuiPaginationItem-root": {
            borderRadius: "50%",
            color: "#2D3748",
            fontWeight: "bold",
            backgroundColor: "#E2E8F0",
            "&.Mui-selected": {
              backgroundColor: "#2D3748",
              color: "white",
            },
          },
        }}
      />

      {/* Rows per page & Go to page */}
      <div className="flex flex-wrap justify-center items-center gap-4 text-sm">
        <span className="font-semibold">Rows per page:</span>
        <Select
          labelId="rows-select-label"
          id="rows-select"
          value={pageSize}
          onChange={(event) =>
            handleChangePageSize(event.target.value, pageIndex)
          }
          label="Rows per page"
          sx={{
            "& .MuiOutlinedInput-notchedOutline": {
              border: "none !important",
              padding: "1px !important",
            },
            "& .MuiSelect-select": {
              paddingTop: "4px",
              paddingBottom: "4px",
            },
          }}
          className="bg-white border border-gray-300 rounded min-w-[80px] text-sm"
        >
          {displayedValues.map((value) => (
            <MenuItem key={value} value={value}>
              {value}
            </MenuItem>
          ))}
        </Select>

        <div className="flex items-center gap-2">
          <span className="font-semibold">Go to page:</span>
          <input
            type="number"
            min={1}
            max={count}
            value={goToPage || 1}
            onChange={(e) => setGoToPage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const value = parseInt(goToPage, 10);
                if (!isNaN(value) && value >= 1 && value <= count) {
                  handlePagination(pageSize, value);
                }
              }
            }}
            className="px-2 py-1 border border-gray-300 rounded w-16"
          />
        </div>
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
  displayedValues: PropTypes.array.isRequired,
};
