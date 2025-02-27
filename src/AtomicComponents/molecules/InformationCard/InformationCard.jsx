import RaceImage from "../../../assets/img/racing-cinematic1.jpg";
import { RightArrowIcon } from "@/assets/icon-svg";
import "./InformationCard.scss";
import { PropTypes } from "prop-types";

const InformationCard = ({ className, teamName, team }) => {
  const H2Style = "text-h2";

  return (
    <div
      className={`${className} w-9 bg-blue-500 rounded-[8px] p-1 grid grid-cols-2 gap-5`}
    >
      <img
        src={RaceImage}
        alt="Team represent image"
        className="columns-1 rounded-[8px]"
      />

      <div className="team-information">
        {/* Team Name */}
        <h1 className="text-h1 pushdown-class">
          a{teamName ? teamName : "Team name"}
        </h1>

        <DevineLine />

        {/* Finished Date */}
        <div className="finished-date pushdown-class">
          <p className="paragraph-bold">Status</p>
          <h2 className={H2Style}>25 Jan</h2>
        </div>

        <DevineLine />

        {/* Team Competition Record */}
        <div className="team-competition-record-contanier">
          <div className="pushdown-class">
            <p className="paragraph-bold">Qualifying: 1st day</p>
            <div className="status flex items-center">
              <RightArrowIcon width={50} height={50} />
              <h2 className={H2Style}>Competitor&apos;s name</h2>
            </div>

            <div className="status flex items-center">
              <RightArrowIcon width={50} height={50} />
              <h2 className={H2Style}>Competitor&apos;s name</h2>
            </div>

            <div className="status flex items-center">
              <RightArrowIcon width={50} height={50} />
              <h2 className={H2Style}>Competitor&apos;s name</h2>
            </div>
          </div>

          <DevineLine />

          <div className="pushdown-class">
            <p className="paragraph-bold">Final Winner: 2nd day</p>
            <div className="status flex items-center">
              <RightArrowIcon width={50} height={50} />
              <h2 className={H2Style}>Competitor&apos;s name</h2>
            </div>

            <div className="status flex items-center">
              <RightArrowIcon width={50} height={50} />
              <h2 className={H2Style}>Competitor&apos;s name</h2>
            </div>

            <div className="status flex items-center">
              <RightArrowIcon width={50} height={50} />
              <h2 className={H2Style}>Competitor&apos;s name</h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

InformationCard.propTypes = {
  className: PropTypes.string,
  teamName: PropTypes.string,
  team: PropTypes.array,
};

export default InformationCard;

const DevineLine = () => {
  return (
    <>
      <div className="w-full h-[1px] bg-[#2650FF]" />
    </>
  );
};
