/** @format */

import CurrentRaces from "@/AtomicComponents/organisms/HomePage/CurrentRaces/CurrentRaces";
import RaceCalendar from "@/AtomicComponents/organisms/HomePage/RaceCalendar";
import Leaderboard from "@/AtomicComponents/pages/Organizer/Leaderboard/Leaderboard";

const HomepageTemplate = () => {
  return (
    <>
      <CurrentRaces />
      <RaceCalendar />
      <div className="bg-slate-200 mt-10 rounded-md">
        <h1 className="pt-2 font-semibold text-2xl text-center uppercase">
          Leaderboards
        </h1>
        <Leaderboard />
      </div>
    </>
  );
};

export default HomepageTemplate;
