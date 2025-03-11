/** @format */

import { useState } from "react";
import TeamCard from "@/AtomicComponents/molecules/TeamCard/TeamCard";
import InformationCard from "../../molecules/InformationCard/InformationCard";
import ButtonWithIcon from "@/AtomicComponents/atoms/ButtonWithIcon/ButtonWithIcon";

const RaceCalendar = () => {
  const [activeIndex, setActiveIndex] = useState(null); // Store the active card index

  return (
    <div className="race-calendar">
      <div className="title-navigation flex justify-between items-center">
        <h1 className="text-mega text-white">Race Calendar</h1>
        <div>
          <ButtonWithIcon content={"View Race Calendar"} bgColor={"#C0F14A"} />
        </div>
      </div>

      <div className="flex gap-8">
        <div className={"flex-1/12 gap flex flex-col gap-y-5"}>
          {Array.from({ length: 5 }).map((_, index) => (
            <TeamCard
              key={index}
              isActive={activeIndex === index} // Pass isActive state
              onClick={() => setActiveIndex(index)} // Set active card
            />
          ))}
        </div>
        <InformationCard className={"flex-1/2"} />
      </div>
    </div>
  );
};

export default RaceCalendar;
