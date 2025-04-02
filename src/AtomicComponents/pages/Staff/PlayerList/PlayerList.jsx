import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from "@/AtomicComponents/molecules/Table/Table";
import { useState, useEffect } from "react";
import Spinner from "@/AtomicComponents/atoms/Spinner/Spinner";
import Input from "@/AtomicComponents/atoms/Input/Input";
import { apiClient } from "@/config/axios/axios";
import { Tooltip } from "react-tooltip";
import { useDebounce } from "@/hooks/useDebounce";
import DasrsPagination from "@/AtomicComponents/molecules/DasrsPagination/DasrsPagination";

const sortKeyMap = {
  account_id: "SORT_BY_ID",
  last_name: "SORT_BY_LASTNAME",
  first_name: "SORT_BY_FIRSTNAME",
  email: "SORT_BY_EMAIL",
  team_name: "SORT_BY_TEAMNAME",
};

const PlayerList = () => {
  const [playerList, setPlayerList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [pageIndex, setPageIndex] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortByKey, setSortByKey] = useState("account_id"); // default sort key
  const [sortDirection, setSortDirection] = useState("ASC"); // "ASC", "DESC", or null

  const columns = [
    { key: "account_id", label: "ID", sortable: true },
    { key: "last_name", label: "Last Name", sortable: true },
    { key: "first_name", label: "First Name", sortable: true },
    { key: "email", label: "Email", sortable: true },
    { key: "phone", label: "Phone", sortable: false },
    { key: "team_name", label: "Team Name", sortable: true },
  ];

  // GET SORT PARAMS
  const getSortByParam = () => {
    if (!sortByKey || !sortDirection) return null;
    const baseKey = sortKeyMap[sortByKey];
    return baseKey ? `${baseKey}_${sortDirection}` : null;
  };

  // HANDLE SORT
  const handleSort = (columnKey) => {
    const isSameColumn = sortByKey === columnKey;
    let newDirection = "ASC";

    // Check if the same column is clicked and change sort direction
    if (isSameColumn && sortDirection === "ASC") {
      newDirection = "DESC";
    }

    setSortByKey(columnKey);
    setSortDirection(newDirection);
    setPageIndex(1);
  };

  //#region PAGINATION
  const handlePagination = (_pageSize, newPageIndex) => {
    setPageIndex(newPageIndex);
  };

  const handleChangePageSize = (newSize) => {
    setPageSize(newSize);
    setPageIndex(1);
  };
  //#endregion

  useEffect(() => {
    const fetchData = async () => {
      const sortByParam = getSortByParam();
      try {
        setIsLoading(true);
        const response = await apiClient.get("accounts/players", {
          params: {
            pageNo: pageIndex - 1,
            pageSize,
            sortBy: sortByParam,
            keyword: debouncedSearchTerm || undefined, // ← pass search param
          },
        });

        if (response.data.http_status === 200) {
          const data = response.data.data;
          setPlayerList(response.data.data.players);
          setTotalPages(data.total_pages || 1);
        }
      } catch (err) {
        console.error("Error fetching players:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageSize, pageIndex, sortByKey, sortDirection, debouncedSearchTerm]);

  return (
    <>
      {isLoading && <Spinner />}
      <div className="p-4">
        <div className="mb-4 flex justify-between flex-wrap gap-2">
          <Input
            type="text"
            placeholder="Search players by team name..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPageIndex(1); // Reset to page 1 on search
            }}
            className="border border-gray-300 rounded px-4 py-2 w-full sm:max-w-xs"
          />
        </div>
      </div>

      <div className="p-4">
        <Table title="Player List">
          <TableHeader
            columns={columns}
            sortBy={sortByKey}
            sortDirection={sortDirection?.toLowerCase()}
            onSort={handleSort}
          />
          <TableBody>
            {playerList.map((row, idx) => (
              <TableRow key={idx}>
                {columns.map((col) => (
                  <TableCell key={col.key}>
                    {col.key === "email" ? (
                      <a
                        href={`mailto:${row[col.key]}`}
                        className="text-blue-600 underline hover:text-blue-800"
                        data-tooltip-id="my-tooltip"
                        data-tooltip-content={`Send email to ${row[col.key]}`}
                        data-tooltip-place="top"
                      >
                        {row[col.key]}
                        <Tooltip
                          id="my-tooltip"
                          style={{ borderRadius: "12px" }}
                        />
                      </a>
                    ) : (
                      row[col.key]
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between mt-4 flex-wrap gap-4">
        <DasrsPagination
          pageSize={pageSize}
          pageIndex={pageIndex}
          page={pageIndex}
          count={totalPages}
          handlePagination={handlePagination}
          handleChangePageSize={handleChangePageSize}
        />
      </div>
    </>
  );
};

export default PlayerList;
