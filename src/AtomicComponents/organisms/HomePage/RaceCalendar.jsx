import { useEffect, useState } from "react";
import InformationCard from "../../molecules/InformationCard/InformationCard";
import ButtonWithIcon from "@/AtomicComponents/atoms/ButtonWithIcon/ButtonWithIcon";
import Spinner from "@/AtomicComponents/atoms/Spinner/Spinner";
import { apiClient } from "@/config/axios/axios";
import { FormatToISODate } from "@/utils/DateConvert";
import RoundInfoCard from "@/AtomicComponents/molecules/TeamCard/RoundInfoCard";

const RaceCalendar = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null); // Store the active card index
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [sortByKey, setSortByKey] = useState("sort_by_id"); // default sort key
  const [sortDirection, setSortDirection] = useState("ASC"); // "ASC", "DESC", or null
  const [calendarData, setCalendarData] = useState();

  //#region GET START DATE AND END DATE
  const getStartDate = () => {
    // get from 07/04/2025
    // const today = new Date();
    // const startDate = new Date(
    //   today.getFullYear(),
    //   today.getMonth(),
    //   today.getDate()
    // );

    const day = new Date(2025, 0, 31); // Month is 0-indexed, so 3 is April
    const startDate = new Date(
      day.getFullYear(),
      day.getMonth(),
      day.getDate()
    );
    return FormatToISODate(startDate);
  };

  const getEndDate = () => {
    const today = new Date();
    const endDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 6
    );
    return FormatToISODate(endDate);
  };
  //#endregion

  // GET RACE CALENDAR
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await apiClient.get(`rounds/landing`, {
          params: {
            pageNo: pageIndex - 1,
            pageSize,
            sortBy: sortByKey.toUpperCase() + "_" + sortDirection,
            keyword: undefined,
            startDate: getStartDate(),
            endDate: getEndDate(),
          },
        });

        if (response.data.http_status === 200) {
          const data = response.data.data.content;
          setCalendarData(data);
          setTotalPages(response.data.data.total_pages || 1);

          if (data && data.length > 0) {
            setActiveIndex(0); // 🔥 Select first item by default
          }
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // const mockApiResponse = {
  //   data: {
  //     content: [
  //       {
  //         round_id: 105,
  //         round_name: "Vòng chung kết thể thức solo play đua thời gian",
  //         description: "Vòng chung kết đua xe giả lập",
  //         status: "ACTIVE",
  //         created_date: "03/16/2025 17:32:11",
  //         start_date: "04/07/2025 12:20:00",
  //         end_date: "04/07/2025 18:00:00",
  //         finish_type: "TIME",
  //         team_limit: 8,
  //         is_last: false,
  //         map_id: 9,
  //         environment_id: 1,
  //         match_type_id: 2,
  //         match_type_name: "Off-road solo",
  //         scored_method_id: 1,
  //         tournament_id: 8,
  //       },
  //       {
  //         round_id: 106,
  //         round_name: "Vòng bán kết tốc độ tổ đội",
  //         description: "Đua đội hình tốc độ cao",
  //         status: "COMPLETED",
  //         created_date: "03/18/2025 10:15:00",
  //         start_date: "04/05/2025 10:00:00",
  //         end_date: "04/05/2025 14:00:00",
  //         finish_type: "LAP",
  //         team_limit: 6,
  //         is_last: false,
  //         map_id: 5,
  //         environment_id: 2,
  //         match_type_id: 1,
  //         match_type_name: "Team circuit",
  //         scored_method_id: 2,
  //         tournament_id: 8,
  //       },
  //       {
  //         round_id: 107,
  //         round_name: "Vòng loại kỹ năng drift",
  //         description: "Kiểm tra kỹ năng drift cá nhân",
  //         status: "PENDING",
  //         created_date: "03/20/2025 08:45:00",
  //         start_date: "04/09/2025 09:00:00",
  //         end_date: "04/09/2025 11:30:00",
  //         finish_type: "POINT",
  //         team_limit: 12,
  //         is_last: true,
  //         map_id: 6,
  //         environment_id: 3,
  //         match_type_id: 3,
  //         match_type_name: "Drift solo",
  //         scored_method_id: 3,
  //         tournament_id: 9,
  //       },
  //     ],
  //     last: true,
  //     page_no: 0,
  //     page_size: 5,
  //     total_elements: 3,
  //     total_pages: 1,
  //   },
  //   http_status: 200,
  //   message: "Successfully retrieved data",
  //   time_stamp: "04/09/2025 08:12:00",
  // };

  return (
    <>
      {isLoading && <Spinner />}
      <div className="race-calendar sm:mb-0 mb-5">
        <div className="title-navigation flex justify-between items-center sm:mt-0 sm:mb-0 mt-5 mb-5">
          <h1 className="text-h2 sm:text-mega text-white">Race Calendar</h1>
          <div>
            <ButtonWithIcon
              content={"View Race Calendar"}
              bgColor={"#C0F14A"}
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-50">
          <div className={"flex-2/12 gap flex flex-col gap-y-5"}>
            {calendarData && calendarData.length > 0 ? (
              calendarData.map((item, index) => (
                <RoundInfoCard
                  key={item.round_id} // if `id` is unique
                  item={item}
                  isActive={activeIndex === index}
                  onClick={() => setActiveIndex(index)}
                />
              ))
            ) : (
              <h1>No races currently avaiable</h1>
            )}
          </div>

          <div className="flex-1/3 overflow-hidden">
            <InformationCard item={calendarData?.[activeIndex]} />
          </div>
        </div>
      </div>
    </>
  );
};

export default RaceCalendar;
