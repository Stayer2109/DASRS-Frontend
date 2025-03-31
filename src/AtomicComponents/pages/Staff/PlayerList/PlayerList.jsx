import Spinner from "@/AtomicComponents/atoms/Spinner/Spinner";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from "@/AtomicComponents/molecules/Table/Table";
import { apiClient } from "@/config/axios/axios";
import { useEffect, useState } from "react";

const PlayerList = () => {
  const [playerList, setPlayerList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const columns = [
    "accountId",
    "lastName",
    "firstName",
    "email",
    "phone",
    "teamName",
  ];
  const labels = [
    "ID",
    "Last Name",
    "First Name",
    "Email",
    "Phone",
    "Team Name",
  ];

  // USE EFFECT
  useEffect(() => {
    const getPlayerListData = async () => {
      try {
        setIsLoading(true);
        const response = await apiClient.get("accounts/players");
        console.log(response.data);

        if (response.data.http_status === 200) {
          setPlayerList(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching player list data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    getPlayerListData();
  }, []);

  return (
    <>
      {isLoading && <Spinner />}
      <Table title="Player List">
        <TableHeader>
          {labels.map((label, index) => (
            <TableCell key={index} className="font-semibold">
              {label}
            </TableCell>
          ))}
        </TableHeader>

        <TableBody>
          {playerList.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              {columns.map((col, colIndex) => (
                <TableCell key={colIndex}>{row[col]}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default PlayerList;
