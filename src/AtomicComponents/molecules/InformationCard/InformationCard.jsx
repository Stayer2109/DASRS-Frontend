/** @format */

import { useEffect, useState } from "react";
import { PropTypes } from "prop-types";
import { apiClient } from "@/config/axios/axios";
import { GetDateFromDate, GetTimeFromDate } from "@/utils/DateConvert";
import {
  Card,
  CardContent,
  CardTitle,
} from "@/AtomicComponents/atoms/shadcn/card";
import { Separator } from "@/AtomicComponents/atoms/shadcn/separator";
import {
  CalendarDays,
  Clock,
  Flag,
  Info,
  MapPin,
  Settings2,
  Target,
  Trophy,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Tooltip } from "react-tooltip";

const InfoLine = ({ label, value, Icon }) => (
  <div className="flex items-center gap-3 text-slate-200 text-sm sm:text-base leading-tight">
    {Icon && <Icon className="w-5 h-5 text-slate-400 shrink-0" />}
    <span className="font-semibold whitespace-nowrap">{label}:</span>
    <span className="font-medium text-slate-100 break-words">
      {value ?? "N/A"}
    </span>
  </div>
);

const RoundSection = ({ round, isOpen, onToggle }) => {
  const [map, setMap] = useState({});
  const [scoreMethod, setScoreMethod] = useState({});
  const [environment, setEnvironment] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen || !round) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const [mapRes, scoreRes, envRes] = await Promise.all([
          apiClient.get(`resources/${round.map_id}`),
          apiClient.get(`scored-methods/${round.scored_method_id}`),
          apiClient.get(`environments/${round.environment_id}`),
        ]);
        setMap(mapRes.data.data);
        setScoreMethod(scoreRes.data.data);
        setEnvironment(envRes.data.data);
      } catch (err) {
        console.error("Failed to load round info", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isOpen, round]);

  return (
    <div className="bg-slate-800/50 shadow-sm hover:shadow-lg border border-slate-300/10 rounded-xl overflow-hidden transition-all">
      <button
        onClick={onToggle}
        className="flex justify-between items-center hover:bg-slate-700/40 px-4 py-3 w-full font-bold text-slate-100 text-lg transition-all cursor-pointer"
      >
        <span className="truncate">{round.round_name}</span>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-blue-300" />
        ) : (
          <ChevronDown className="w-5 h-5 text-blue-300" />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-slate-700/40 px-4 pt-2 pb-5 rounded-b-xl overflow-hidden text-slate-200 text-sm"
          >
            <p className="text-slate-400 text-sm italic">{round.description}</p>
            <div className="gap-2 grid grid-cols-2 my-3">
              <div className="flex items-center">
                <span className="text-slate-100 font-medium">Finish Type:</span>
                <span className="ml-2 flex items-center">
                  {round.finish_type}
                  <Info
                    className="ml-1 w-4 h-4 text-blue-500 cursor-help"
                    data-tooltip-id={`tiebreaker-${round.round_id}`}
                    data-tooltip-content={
                      round.finish_type === "LAP"
                        ? "Tiebreaker: If all players have same score, the result will be determined by the fastest lap time."
                        : "Tiebreaker: If all players have same score, the result will be determined by the distance traveled."
                    }
                  />
                  <Tooltip id={`tiebreaker-${round.round_id}`} />
                </span>
              </div>
              <InfoLine
                label="Match Type"
                value={round.match_type_name}
                Icon={Target}
              />
              <InfoLine
                label="Start"
                value={`${GetDateFromDate(
                  round.start_date
                )} - ${GetTimeFromDate(round.start_date)}`}
                Icon={CalendarDays}
              />
              <InfoLine
                label="End"
                value={`${GetDateFromDate(round.end_date)} - ${GetTimeFromDate(
                  round.end_date
                )}`}
                Icon={Clock}
              />
              <InfoLine
                label="Qualification Spots"
                value={round.team_limit}
                Icon={Flag}
              />
            </div>
            <Separator className="bg-slate-500/40 my-2" />
            <h5 className="mb-2 font-semibold text-base">Round Resources</h5>
            {loading ? (
              <p className="text-slate-400 text-sm italic">
                Loading round resources...
              </p>
            ) : (
              <>
                <InfoLine
                  label="Map"
                  value={map?.resource_name}
                  Icon={MapPin}
                />
                <InfoLine
                  label="Environment"
                  value={environment?.environment_name}
                  Icon={Settings2}
                />
                {scoreMethod && (
                  <div className="space-y-1 mt-4">
                    <h5 className="mb-1 font-semibold text-slate-100 text-base">
                      Scoring
                    </h5>
                    <ul className="space-y-1 pl-2 text-slate-100 text-sm list-disc list-inside">
                      <li>Assist usage: {scoreMethod.assist_usage} pts</li>
                      <li>Average speed: {scoreMethod.average_speed} pts</li>
                      <li>Collision: {scoreMethod.collision} pts</li>
                      <li>Top speed: {scoreMethod.top_speed} pts</li>
                      <li>Total distance: {scoreMethod.total_distance} pts</li>
                      <li>
                        Total race time: {scoreMethod.total_race_time} pts
                      </li>
                    </ul>
                  </div>
                )}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const InformationCard = ({ className, item }) => {
  const [openRoundId, setOpenRoundId] = useState(null);
  if (!item) return null;
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={item.tournament_id}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <Card
          className={`${className} bg-gradient-to-br from-blue-600 to-blue-800 text-white shadow-2xl rounded-2xl border border-blue-400/10 transition-all`}
        >
          <CardTitle className="px-6 pt-6 font-bold text-white text-3xl tracking-tight">
            {item.tournament_name}
          </CardTitle>
          <CardContent className="space-y-5 px-6 pb-6">
            <Separator className="bg-blue-500/60" />
            <div className="gap-3 grid grid-cols-2">
              <InfoLine label="Status" value={item.status} Icon={Settings2} />
              <InfoLine
                label="Is Started"
                value={item.is_started ? "In Progress" : "Not Started Yet"}
                Icon={Flag}
              />
              <InfoLine
                label="Start"
                value={item.start_date}
                Icon={CalendarDays}
              />
              <InfoLine label="End" value={item.end_date} Icon={Clock} />
              <InfoLine
                label="Team Count"
                value={item.team_number}
                Icon={Trophy}
              />
            </div>
            <Separator className="bg-blue-500/60" />
            <h4 className="flex items-center gap-2 mt-4 font-semibold text-blue-100 text-xl">
              <Info className="w-5 h-5 text-blue-300" /> Tournament Info
            </h4>
            <InfoLine
              label="Tournament Context"
              value={item.tournament_context}
              Icon={Info}
            />
            <Separator className="bg-blue-500/60" />
            <h4 className="flex items-center gap-2 mt-4 font-semibold text-blue-100 text-xl">
              <Target className="w-5 h-5 text-blue-300" /> Rounds
            </h4>
            {item.round_list && item.round_list.length > 0 ? (
              <div className="space-y-3">
                {item.round_list.map((round) => (
                  <RoundSection
                    key={round.round_id}
                    round={round}
                    isOpen={openRoundId === round.round_id}
                    onToggle={() =>
                      setOpenRoundId((prev) =>
                        prev === round.round_id ? null : round.round_id
                      )
                    }
                  />
                ))}
              </div>
            ) : (
              <p className="text-slate-300 italic">
                No rounds in tournament yet
              </p>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};

export default InformationCard;

InformationCard.propTypes = {
  className: PropTypes.string,
  item: PropTypes.shape({
    tournament_id: PropTypes.number,
    tournament_name: PropTypes.string,
    status: PropTypes.string,
    is_started: PropTypes.bool,
    start_date: PropTypes.string,
    end_date: PropTypes.string,
    team_number: PropTypes.number,
    tournament_context: PropTypes.string,
    round_list: PropTypes.arrayOf(
      PropTypes.shape({
        round_id: PropTypes.number,
        round_name: PropTypes.string,
        description: PropTypes.string,
        finish_type: PropTypes.string,
        match_type_name: PropTypes.string,
        start_date: PropTypes.string,
        end_date: PropTypes.string,
        team_limit: PropTypes.number,
        map_id: PropTypes.number,
        scored_method_id: PropTypes.number,
        environment_id: PropTypes.number,
      })
    ),
  }),
};

InfoLine.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string,
  Icon: PropTypes.elementType,
};

RoundSection.propTypes = {
  round: PropTypes.object.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
};
