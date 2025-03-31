import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from "@/AtomicComponents/molecules/Table/Table";

const PlayerList = () => {
  const data = [
    { id: 1, name: "John", age: 25, position: "Forward" },
    { id: 2, name: "Jane", age: 28, position: "Midfielder" },
    { id: 3, name: "Mike", age: 22, position: "Defender" },
    { id: 4, name: "Sara", age: 30, position: "Goalkeeper" },
    { id: 5, name: "Tom", age: 27, position: "Forward" },
    { id: 6, name: "Lucy", age: 24, position: "Midfielder" },
    { id: 7, name: "Jake", age: 29, position: "Defender" },
    { id: 8, name: "Emma", age: 26, position: "Goalkeeper" },
    { id: 9, name: "Liam", age: 23, position: "Forward" },
    { id: 10, name: "Olivia", age: 31, position: "Midfielder" },
  ];

  const columns = ["id", "name", "age", "position"];
  const labels = ["ID", "Name", "Age", "Position"];

  return (
    <Table title="Player List">
      <TableHeader>
        {labels.map((label, index) => (
          <TableCell key={index} className="font-semibold">
            {label}
          </TableCell>
        ))}
      </TableHeader>

      <TableBody>
        {data.map((row, rowIndex) => (
          <TableRow key={rowIndex}>
            {columns.map((col, colIndex) => (
              <TableCell key={colIndex}>{row[col]}</TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default PlayerList;
