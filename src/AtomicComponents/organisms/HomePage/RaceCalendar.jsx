/** @format */

import TeamCard from "@/AtomicComponents/molecules/TeamCard";
import InformationCard from "../../molecules/InformationCard/InformationCard";
import ButtonWithIcon from "@/AtomicComponents/atoms/Button/ButtonWithIcon";
import { LongRightArrowIcon } from "@/assets/icon-svg";

const RaceCalendar = () => {
	return (
		<div className='race-calendar'>
			<div className='title-navigation flex justify-between items-center'>
				<h1 className='text-mega text-white'>Race Calendar</h1>
				<div>
					<ButtonWithIcon
						content={"View Race Calendar"}
						bgColor={"#C0F14A"}
					/>
				</div>
			</div>

			<div className='flex gap-8'>
				<div className={"flex-1/12 gap flex flex-col gap-y-5"}>
					<TeamCard />
					<TeamCard />
					<TeamCard />
					<TeamCard />
					<TeamCard />
				</div>
				<InformationCard className={"flex-1/2"} />
			</div>
		</div>
	);
};

export default RaceCalendar;
