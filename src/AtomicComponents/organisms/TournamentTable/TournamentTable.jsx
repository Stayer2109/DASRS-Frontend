// import React from "react";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/AtomicComponents/atoms/shadcn/table";
// import { StatusBadge } from "@/AtomicComponents/atoms/StatusBadge/StatusBadge";
// import { StatusSelector } from "@/AtomicComponents/molecules/StatusSelector/StatusSelector";
// import { TournamentActions } from "@/AtomicComponents/molecules/TournamentActions/TournamentActions";
// import { LoadingIndicator } from "@/AtomicComponents/atoms/LoadingIndicator/LoadingIndicator";

// export const TournamentTable = ({
//   tournaments,
//   isLoading,
//   editStatus,
//   onStatusChange,
//   onUpdateStatus,
//   onEdit,
//   onDelete,
//   onChangeStatusFromDropdown,
//   formatDate
// }) => {
//   if (isLoading) {
//     return (
//       <div className="h-64">
//         <LoadingIndicator />
//       </div>
//     );
//   }

//   return (
//     <Table>
//       <TableHeader>
//         <TableRow>
//           <TableHead>Name</TableHead>
//           <TableHead>Created Date</TableHead>
//           <TableHead>Start Date</TableHead>
//           <TableHead>End Date</TableHead>
//           <TableHead>Status</TableHead>
//           <TableHead>Total of Teams</TableHead>
//           <TableHead className="text-right">Actions</TableHead>
//         </TableRow>
//       </TableHeader>
//       <TableBody>
//         {tournaments.length === 0 ? (
//           <TableRow>
//             <TableCell colSpan={7} className="text-center py-8">
//               No tournaments found
//             </TableCell>
//           </TableRow>
//         ) : (
//           tournaments.map((tournament) => (
//             <TableRow key={tournament.tournament_id}>
//               <TableCell className="font-medium">
//                 {tournament.tournament_name}
//               </TableCell>
//               <TableCell>{formatDate(tournament.created_date)}</TableCell>
//               <TableCell>{formatDate(tournament.start_date)}</TableCell>
//               <TableCell>{formatDate(tournament.end_date)}</TableCell>
//               <TableCell>
//                 {editStatus.tournamentId === tournament.tournament_id ? (
//                   <StatusSelector
//                     currentStatus={editStatus.status || tournament.status}
//                     onStatusChange={(status) => onStatusChange(tournament.tournament_id, status)}
//                     onSubmit={onUpdateStatus}
//                     isSubmitting={editStatus.isSubmitting}
//                   />
//                 ) : (
//                   <StatusBadge
//                     status={tournament.status}
//                     onClick={() => onStatusChange(tournament.tournament_id, tournament.status || "PENDING")}
//                   />
//                 )}
//               </TableCell>
//               <TableCell>
//                 {tournament.team_list?.length || 0}/{tournament.team_number || 0}
//               </TableCell>
//               <TableCell className="text-right">
//                 <TournamentActions
//                   tournamentId={tournament.tournament_id}
//                   onEdit={onEdit}
//                   onDelete={onDelete}
//                   onChangeStatus={onChangeStatusFromDropdown}
//                 />
//               </TableCell>
//             </TableRow>
//           ))
//         )}
//       </TableBody>
//     </Table>
//   );
// };

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/AtomicComponents/atoms/shadcn/table";
import { StatusBadge } from "@/AtomicComponents/atoms/StatusBadge/StatusBadge";
import { StatusSelector } from "@/AtomicComponents/molecules/StatusSelector/StatusSelector";
import { TournamentActions } from "@/AtomicComponents/molecules/TournamentActions/TournamentActions";
import { LoadingIndicator } from "@/AtomicComponents/atoms/LoadingIndicator/LoadingIndicator";

export const TournamentTable = ({
  tournaments,
  isLoading,
  editStatus,
  onStatusChange,
  onUpdateStatus,
  onEdit,
  onDelete,
  onChangeStatusFromDropdown,
  formatDate,
  onTournamentNameClick, // Add this prop
}) => {
  if (isLoading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <LoadingIndicator />
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Created Date</TableHead>
          <TableHead>Start Date</TableHead>
          <TableHead>End Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Total of Teams</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tournaments.length === 0 ? (
          <TableRow>
            <TableCell colSpan={7} className="text-center py-8">
              No tournaments found
            </TableCell>
          </TableRow>
        ) : (
          tournaments.map((tournament) => (
            <TableRow key={tournament.tournament_id}>
              <TableCell
                className="font-medium cursor-pointer text-primary hover:underline"
                onClick={() => onTournamentNameClick(tournament)}
              >
                {tournament.tournament_name}
              </TableCell>
              <TableCell>{formatDate(tournament.created_date)}</TableCell>
              <TableCell>{formatDate(tournament.start_date)}</TableCell>
              <TableCell>{formatDate(tournament.end_date)}</TableCell>
              <TableCell>
                {editStatus.tournamentId === tournament.tournament_id ? (
                  <StatusSelector
                    currentStatus={editStatus.status || tournament.status}
                    onStatusChange={(status) =>
                      onStatusChange(tournament.tournament_id, status)
                    }
                    onSubmit={onUpdateStatus}
                    isSubmitting={editStatus.isSubmitting}
                  />
                ) : (
                  <StatusBadge
                    status={tournament.status}
                    onClick={() =>
                      onStatusChange(
                        tournament.tournament_id,
                        tournament.status || "PENDING"
                      )
                    }
                  />
                )}
              </TableCell>
              <TableCell>
                {tournament.team_list?.length || 0}/
                {tournament.team_number || 0}
              </TableCell>
              <TableCell className="text-right">
                <TournamentActions
                  tournamentId={tournament.tournament_id}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onChangeStatus={onChangeStatusFromDropdown}
                />
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};
