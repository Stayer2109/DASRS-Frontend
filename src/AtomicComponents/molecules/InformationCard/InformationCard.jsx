import { useEffect, useState } from "react";
import { PropTypes } from "prop-types";
import { apiClient } from "@/config/axios/axios";
import { GetDateFromDate, GetTimeFromDate } from "@/utils/DateConvert";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/AtomicComponents/atoms/shadcn/card";
import { Separator } from "@/AtomicComponents/atoms/shadcn/separator";
import { Skeleton } from "@/AtomicComponents/atoms/shadcn/skeleton";
import {
  CalendarDays,
  Clock,
  Flag,
  Info,
  MapPin,
  Settings2,
  Target,
  Trophy,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const InformationCard = ({ className, item }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [map, setMap] = useState({});
  const [scoreMethod, setScoreMethod] = useState({});
  const [environment, setEnvironment] = useState({});

  useEffect(() => {
    if (!item) return;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [mapResponse, scoreMethodResponse, environmentResponse] =
          await Promise.all([
            apiClient.get(`resources/${item.map_id}`),
            apiClient.get(`scored-methods/${item.scored_method_id}`),
            apiClient.get(`environments/${item.environment_id}`),
          ]);

        setMap(mapResponse.data.data);
        setScoreMethod(scoreMethodResponse.data.data);
        setEnvironment(environmentResponse.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [item]);

  if (isLoading) {
    return (
      <Card className={`${className} bg-blue-100 p-4`}>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-6 w-2/3" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-1/2" />
        </CardContent>
      </Card>
    );
  }

  if (!item) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={item.round_id} // this is important to trigger animation on change
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <Card className={`${className} bg-blue-500 text-white rounded-xl`}>
          <CardTitle className="text-white text-h1 font-bold px-6">
            {item.round_name}
          </CardTitle>

          <CardContent className="space-y-4 text-sm">
            <Separator className="bg-blue-600" />

            <div className="grid grid-cols-2 gap-2">
              <InfoLine
                label="Finish type"
                value={item.finish_type}
                Icon={Trophy}
              />
              <InfoLine
                label="Match type"
                value={item.match_type_name}
                Icon={Target}
              />
              <InfoLine
                label="Start"
                value={`${GetDateFromDate(item.start_date)} - ${GetTimeFromDate(
                  item.start_date
                )}`}
                Icon={CalendarDays}
              />
              <InfoLine
                label="Qualification spots"
                value={item.team_limit}
                Icon={Flag}
              />
              <InfoLine
                label="End"
                value={`${GetDateFromDate(item.end_date)} - ${GetTimeFromDate(
                  item.end_date
                )}`}
                Icon={Clock}
              />
            </div>

            <Separator className="bg-blue-600" />
            <h4 className="text-xl font-semibold mt-4 flex items-center gap-2">
              <Info className="w-5 h-5" /> Information
            </h4>

            <div className="space-y-1">
              <InfoLine label="Map" value={map.resource_name} Icon={MapPin} />
              <InfoLine
                label="Environment"
                value={environment.environment_name}
                Icon={Settings2}
              />

              {scoreMethod && (
                <div className="mt-2 space-y-1">
                  <h5 className="text-lg font-semibold">Score Method</h5>
                  <ul className="list-disc list-inside space-y-1 text-white/90 pl-4 text-base">
                    <li>Assist usage: {scoreMethod.assist_usage} pts</li>
                    <li>Average speed: {scoreMethod.average_speed} pts</li>
                    <li>Collision: {scoreMethod.collision} pts</li>
                    <li>Top speed: {scoreMethod.top_speed} pts</li>
                    <li>Total distance: {scoreMethod.total_distance} pts</li>
                    <li>Total race time: {scoreMethod.total_race_time} pts</li>
                  </ul>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};

const InfoLine = ({ label, value, Icon }) => (
  <div className="flex items-center gap-3 text-white text-base">
    {Icon && <Icon className="w-5 h-5 text-white/80" />}
    <span className="font-semibold">{label}:</span>
    <span className="text-white/90 font-medium">{value ?? "N/A"}</span>
  </div>
);

InformationCard.propTypes = {
  className: PropTypes.string,
  item: PropTypes.object,
};

InfoLine.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  Icon: PropTypes.elementType,
};

export default InformationCard;
