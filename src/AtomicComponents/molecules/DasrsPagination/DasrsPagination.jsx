import { MenuItem, Pagination as PaginationMui, Select } from "@mui/material";
import PropTypes from "prop-types";

export default function DasrsPagination({
  pageSize,
  pageIndex,
  handlePagination,
  handleChangePageSize,
  count,
  displayedValues,
  ...props
}) {
  return (
    <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between w-full gap-4 mt-4">
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
        className="flex-1"
      />

      <div className="flex items-center gap-2 text-sm absolute right-0">
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
          {displayedValues && displayedValues.length > 0 ? (
            displayedValues.map((value) => (
              <MenuItem key={value} value={value}>
                {value}
              </MenuItem>
            ))
          ) : (
            <>
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={15}>15</MenuItem>
              <MenuItem value={20}>20</MenuItem>
              <MenuItem value={25}>25</MenuItem>
            </>
          )}
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
  displayedValues: PropTypes.array.isRequired,
};
