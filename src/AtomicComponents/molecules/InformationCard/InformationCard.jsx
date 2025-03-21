/** @format */

import RaceImage from "../../../assets/img/racing-cinematic1.jpg";
import { RightArrowIcon } from "@/assets/icon-svg";
import "./InformationCard.scss";
import { PropTypes } from "prop-types";

const InformationCard = ({ className, teamName, team }) => {
	const H2Style = "text-h2";

	// Example competition data - you can pass it via props if needed
	const competitionData = [
		{
			dayType: "Qualifying: 1st day",
			competitors: ["Goku", "Vegeta", "Piccolo"],
		},
		{
			dayType: "Final Winner: 2nd day",
			competitors: ["Goku", "Frieza", "Cell"],
		},
	];

	return (
		<div
			className={`${className} team-racing-schedule-information-container sm:w-auto bg-blue-500 rounded-[8px] p-1 sm:grid grid-cols-2 gap-5`}
		>
			<img
				src={RaceImage}
				alt='Team represent image'
				className='columns-1 rounded-[8px]'
			/>

			<div className='team-information sm:p-0 px-4'>
				{/* Team Name */}
				<h1 className='text-h1 pushdown-class'>
					{teamName || "Team name"}
				</h1>

				<DevineLine />

				{/* Finished Date */}
				<div className='finished-date pushdown-class'>
					<p className='paragraph-bold'>Status</p>
					<h2 className={H2Style}>25 Jan</h2>
				</div>

				<DevineLine />

				{/* Competition Info Loop */}
				{competitionData.map((stage, idx) => (
					<div key={idx}>
						<div className='pushdown-class'>
							<p className='paragraph-bold'>{stage.dayType}</p>
							{stage.competitors.map((name, i) => (
								<div className='status flex items-center' key={i}>
									<RightArrowIcon className={"right-arrow-icon"} width={30} height={30} />
									<h2 className={`${H2Style} ml-1`}>{name}</h2>
								</div>
							))}
						</div>
						{/* Only add divider between blocks */}
						{idx < competitionData.length - 1 && <DevineLine />}
					</div>
				))}
			</div>
		</div>
	);
};

InformationCard.propTypes = {
	className: PropTypes.string,
	teamName: PropTypes.string,
	team: PropTypes.object,
};

export default InformationCard;

const DevineLine = () => (
	<div className='w-full h-[1px] bg-[#2650FF]' />
);
