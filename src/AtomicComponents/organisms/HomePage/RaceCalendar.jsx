import { useEffect, useState } from "react";
import InformationCard from "../../molecules/InformationCard/InformationCard";
// import ButtonWithIcon from "@/AtomicComponents/atoms/ButtonWithIcon/ButtonWithIcon";
import Spinner from "@/AtomicComponents/atoms/Spinner/Spinner";
import { apiClient } from "@/config/axios/axios";
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
  // const getStartDate = () => {
  //   const today = new Date();
  //   const startDate = new Date(
  //     today.getFullYear(),
  //     today.getMonth(),
  //     today.getDate()
  //   );
  //   return FormatToISODate(startDate);
  // };

  // const getEndDate = () => {
  //   const today = new Date();
  //   const endDate = new Date(
  //     today.getFullYear(),
  //     today.getMonth(),
  //     today.getDate() + 3 // Fetch data from today + 3 days
  //   );
  //   return FormatToISODate(endDate);
  // };
  //#endregion

  // GET RACE CALENDAR
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await apiClient.get(`tournaments`, {
          params: {
            pageNo: pageIndex - 1,
            pageSize,
            sortBy: sortByKey.toUpperCase() + "_" + sortDirection,
            keyword: undefined,
            status: "ACTIVE",
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
      <div className="mt-5 mb-5 sm:mb-0 race-calendar">
        <div className="flex justify-between items-center mt-5 sm:mt-0 mb-5 sm:mb-0 title-navigation">
          <h1 className="text-h2 text-white sm:text-mega">Race Calendar</h1>
        </div>

        <div
          className={`${
            calendarData && calendarData.length > 0
              ? "flex flex-col sm:flex-row gap-30"
              : ""
          }`}
        >
          <div className="flex flex-col flex-2/12 gap-y-5 mb-5 gap">
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
              <h1 className="mx-auto p-5 px-50 border-2 border-gray-300 rounded-2xl w-auto text-gray-300 text-h4 sm:text-h1 text-center">
                No races currently available
              </h1>
            )}
          </div>

          {calendarData && calendarData.length > 0 && (
            <div className="flex-1/2 overflow-hidden">
              <InformationCard item={calendarData?.[activeIndex]} />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default RaceCalendar;
