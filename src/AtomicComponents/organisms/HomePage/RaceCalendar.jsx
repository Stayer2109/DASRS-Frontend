import { useEffect, useState } from "react";
import InformationCard from "../../molecules/InformationCard/InformationCard";
// import ButtonWithIcon from "@/AtomicComponents/atoms/ButtonWithIcon/ButtonWithIcon";
import Spinner from "@/AtomicComponents/atoms/Spinner/Spinner";
import { apiClient } from "@/config/axios/axios";
import { FormatToISODate } from "@/utils/DateConvert";
import RoundInfoCard from "@/AtomicComponents/molecules/TeamCard/RoundInfoCard";

const RaceCalendar = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null); // Store the active card index
  const [pageIndex, _setPageIndex] = useState(1);
  const [pageSize, _setPageSize] = useState(5);
  const [_totalPages, setTotalPages] = useState(1);
  const [sortByKey, _setSortByKey] = useState("sort_by_id"); // default sort key
  const [sortDirection, _setSortDirection] = useState("ASC"); // "ASC", "DESC", or null
  const [calendarData, setCalendarData] = useState();

  //#region GET START DATE AND END DATE
  const getStartDate = () => {
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
      today.getDate() + 3, // Fetch data from today + 3 days
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

  return (
    <>
      {isLoading && <Spinner />}
      <div className="race-calendar sm:mb-0 mb-5 mt-5">
        <div className="title-navigation flex justify-between items-center sm:mt-0 sm:mb-0 mt-5 mb-5">
          <h1 className="text-h2 sm:text-mega text-white">Race Calendar</h1>
          {/* <div>
            <ButtonWithIcon
              content={"View Race Calendar"}
              bgColor={"#C0F14A"}
            />
          </div> */}
        </div>

        <div
          className={`${
            calendarData && calendarData.length > 0
              ? "flex flex-col sm:flex-row gap-50"
              : ""
          }`}
        >
          <div className="flex-2/12 gap flex flex-col gap-y-5">
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
              <h1 className="text-gray-300 text-h4 sm:text-h1 text-center">
                No races currently avaiable
              </h1>
            )}
          </div>

          {calendarData && calendarData.length > 0 && (
            <div className="flex-1/3 overflow-hidden">
              <InformationCard item={calendarData?.[activeIndex]} />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default RaceCalendar;
