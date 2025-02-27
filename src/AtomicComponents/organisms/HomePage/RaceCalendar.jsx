import TeamCard from "@/AtomicComponents/molecules/TeamCard";
import InformationCard from "../../molecules/InformationCard/InformationCard";

const RaceCalendar = () => {
  return (
    <div className="race-calendar">
      <h1 className="text-mega text-white">Race Calendar</h1>

      <div className="flex gap-8">
        <div className={"flex-1"}>
          <TeamCard />
        </div>
        <InformationCard className={"flex-1/3"} />
      </div>
    </div>
  );
};

export default RaceCalendar;
