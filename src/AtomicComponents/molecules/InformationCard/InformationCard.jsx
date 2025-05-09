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

// ✅ reusable InfoLine component
const InfoLine = ({ label, value, Icon }) => (
  <div className="flex items-center gap-3 text-white text-sm sm:text-base">
    {Icon && <Icon className="w-5 h-5 text-white/70 shrink-0" />}
    <span className="font-semibold whitespace-nowrap">{label}:</span>
    <span className="font-medium text-white/90 break-all">
      {value ?? "N/A"}
    </span>
  </div>
);

// ✅ round accordion component with open state controlled by parent
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
    <div className="bg-white/10 shadow-md hover:shadow-lg border border-white/10 rounded-xl transition-all">
      <button
        onClick={onToggle}
        className="flex justify-between items-center hover:bg-white/5 px-4 py-3 w-full font-bold text-white text-lg transition-all cursor-pointer"
      >
        {round.round_name}
        {isOpen ? (
          <ChevronUp className="w-5 h-5" />
        ) : (
          <ChevronDown className="w-5 h-5" />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="px-4 pb-4 overflow-hidden"
          >
            <p className="text-white/80 text-sm sm:text-base italic">
              {round.description}
            </p>

            <div className="gap-2 grid grid-cols-2 my-2">
              <InfoLine
                label="Finish Type"
                value={round.finish_type}
                Icon={Trophy}
              />
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

            <Separator className="bg-white/20 my-2" />

            <h5 className="font-semibold text-base">Round Resources</h5>

            {loading ? (
              <p className="text-white/70 text-sm italic">
                Loading round resources...
              </p>
            ) : (
              <div className="space-y-1">
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
                  <div className="space-y-1 mt-2">
                    <h5 className="mt-4 font-semibold text-white text-lg">
                      Score Method
                    </h5>

                    <ul className="pl-4 text-white/90 text-sm list-disc list-inside">
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
              </div>
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
          className={`${className} bg-gradient-to-br from-blue-600 to-blue-800 text-white shadow-xl rounded-2xl border border-white/10`}
        >
          <CardTitle className="px-6 pt-6 font-bold text-white text-3xl tracking-tight">
            {item.tournament_name}
          </CardTitle>

          <CardContent className="space-y-4 text-sm">
            <Separator className="bg-blue-600" />
            <div className="gap-2 grid grid-cols-2">
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

            <Separator className="bg-blue-600" />
            <h4 className="flex items-center gap-2 mt-6 mb-2 font-semibold text-white text-xl">
              <Info className="w-5 h-5" /> Tournament Information
            </h4>
            <InfoLine
              label="Tournament Context"
              value={item.tournament_context}
              Icon={Info}
            />

            <Separator className="bg-blue-600" />
            <h4 className="flex items-center gap-2 mt-6 mb-2 font-semibold text-white text-xl">
              <Target className="w-5 h-5" /> Rounds
            </h4>

            {item.round_list && item.round_list.length > 0 ? (
              <div className="space-y-2">
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
              <p className="text-white/80 italic">
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
