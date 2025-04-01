import DasrsPagination from "@/AtomicComponents/molecules/DasrsPagination/DasrsPagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/AtomicComponents/molecules/Table/Table";
import { apiClient } from "@/config/axios/axios";
import { useEffect, useState } from "react";

const sortKeyMap = {
  id: "SORT_BY_ID",
  team_number: "SORT_BY_TEAM",
  created_date: "SORT_BY_CREATED",
  start_date: "SORT_BY_START",
  end_date: "SORT_BY_END",
};

export const RoundnMatches = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [tournamentList, setTournamentList] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(1); // 1-based indexing for MUI
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState("SORT_BY_ID_ASC");
  const [sortByKey, setSortByKey] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc"); // asc | desc

  const columns = [
    { key: "tournament_name", label: "Name", sortable: false },
    { key: "created_date", label: "Created Date", sortable: true },
    { key: "start_date", label: "Start Date", sortable: true },
    { key: "end_date", label: "End Date", sortable: true },
    { key: "team_number", label: "Total of Teams", sortable: true },
  ];

  const fetchTournamentList = async (pageSizeVal, pageIndexVal, sortVal) => {
    try {
      setIsLoading(true);
      const response = await apiClient.get(
        `tournaments?pageNo=${
          pageIndexVal - 1
        }&pageSize=${pageSizeVal}&sortBy=${sortVal}`
      );
      if (response.data.http_status === 200) {
        setTournamentList(response.data.data.content || []);
        setTotalPages(response.data.data.totalPages || 1);
      }
    } catch (error) {
      console.error("Error fetching tournament list:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSort = (columnKey) => {
    const baseKey = sortKeyMap[columnKey];
    if (!baseKey) return;

    

    // const newDirection = sortBy.includes("ASC") ? " desc" : "asc";
    // const sortColumn = columns.find((col) => col.key === columnKey);
    // const newSortBy = `${baseKey}_${newDirection.toUpperCase()}`;

    // setSortBy(newSortBy);
    // setSortByKey(sortColumn.key);
    // setPageIndex(1); // Reset to page 1 on sort
  };

  useEffect(() => {
    fetchTournamentList(pageSize, pageIndex, sortBy);
  }, [pageSize, pageIndex, sortBy]);

  const handlePagination = (_pageSize, newPageIndex) => {
    setPageIndex(newPageIndex);
  };

  const handleChangePageSize = (newSize) => {
    setPageSize(newSize);
    setPageIndex(1); // Reset to first page
  };

  return (
    <div className="p-4">
      <Table title="Tournament List">
        <TableHeader
          columns={columns}
          sortBy={sortBy}
          sortByKey={sortByKey}
          sortDirection={sortDirection}
          onSort={handleSort}
        />
        <TableBody>
          {tournamentList.map((row, idx) => (
            <TableRow key={idx}>
              {columns.map((col) => (
                <TableCell key={col.key}>{row[col.key]}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

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
    </div>
  );
};
