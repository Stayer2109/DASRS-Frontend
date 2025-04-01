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

const PlayerList = () => {
  const [playerList, setPlayerList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedColumn, setSelectedColumn] = useState("all");
  const [sortBy, setSortBy] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");

  const columns = [
    { key: "accountId", label: "ID", sortable: false },
    { key: "lastName", label: "Last Name", sortable: true },
    { key: "firstName", label: "First Name", sortable: true },
    { key: "email", label: "Email", sortable: true },
    { key: "phone", label: "Phone", sortable: false },
    { key: "teamName", label: "Team Name", sortable: true },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const res = await apiClient.get("accounts/players");
        if (res.data.http_status === 200) {
          setPlayerList(res.data.data);
        }
      } catch (err) {
        console.error("Error fetching players:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredPlayers = playerList.filter((player) => {
    if (!searchTerm) return true;
    if (selectedColumn === "all") {
      return columns.some((col) =>
        String(player[col.key] ?? "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
    }
    return String(player[selectedColumn] ?? "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
  });

  const sortedPlayers = sortBy
    ? [...filteredPlayers].sort((a, b) => {
        const valA = String(a[sortBy] ?? "").toLowerCase();
        const valB = String(b[sortBy] ?? "").toLowerCase();
        if (valA < valB) return sortDirection === "asc" ? -1 : 1;
        if (valA > valB) return sortDirection === "asc" ? 1 : -1;
        return 0;
      })
    : filteredPlayers;

  const handleSort = (key) => {
    if (sortBy === key) {
      if (sortDirection === "asc") {
        setSortDirection("desc");
      } else if (sortDirection === "desc") {
        setSortBy(null);
        setSortDirection("asc");
      }
    } else {
      setSortBy(key);
      setSortDirection("asc");
    }
  };

  return (
    <>
      {isLoading && <Spinner />}
      <div className="mb-4 flex gap-2 items-center">
        <div className="relative">
          <select
            value={selectedColumn}
            onChange={(e) => setSelectedColumn(e.target.value)}
            className="appearance-none border border-gray-300 rounded px-3 py-2 pr-10"
          >
            <option value="all">All Fields</option>
            {columns.map((col, index) => (
              <option key={index} value={col.key}>
                {col.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-gray-500">
            ▼
          </div>
        </div>

        <Input
          type="text"
          placeholder="Search players..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Table title="Player List">
        <TableHeader
          columns={columns}
          sortBy={sortBy}
          sortDirection={sortDirection}
          onSort={handleSort}
        />
        <TableBody>
          {sortedPlayers.map((row, idx) => (
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
    </>
  );
};

export default PlayerList;
