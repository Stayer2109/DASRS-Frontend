import { useEffect, useState } from "react";
import InformationCard from "../../molecules/InformationCard/InformationCard";
import Spinner from "@/AtomicComponents/atoms/Spinner/Spinner";
import { apiClient } from "@/config/axios/axios";
import RoundInfoCard from "@/AtomicComponents/molecules/TeamCard/RoundInfoCard";

const RaceCalendar = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);
  const [pageIndex, _setPageIndex] = useState(1);
  const [pageSize, _setPageSize] = useState(5);
  const [_totalPages, setTotalPages] = useState(1);
  const [sortByKey, _setSortByKey] = useState("sort_by_id");
  const [sortDirection, _setSortDirection] = useState("ASC");
  const [calendarData, setCalendarData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await apiClient.get(`tournaments`, {
          params: {
            pageNo: pageIndex - 1,
            pageSize,
            sortBy: `${sortByKey.toUpperCase()}_${sortDirection}`,
            keyword: undefined,
            status: "ACTIVE",
          },
        });

        if (response.data.http_status === 200) {
          const data = response.data.data.content || [];
          setCalendarData(data);
          setTotalPages(response.data.data.total_pages || 1);

          if (data.length > 0) {
            setActiveIndex(0);
          }
        }
      } catch (error) {
        console.error(error);
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

      <div className="my-10 px-4 sm:px-10">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 shadow-xl p-6 sm:p-10 rounded-2xl transition-all duration-300">
          <div className="flex sm:flex-row flex-col gap-8">
            {/* Sidebar list */}
            <div className="flex flex-col gap-4 w-full sm:w-5/12">
              {calendarData.length > 0 ? (
                calendarData.map((item, index) => (
                  <RoundInfoCard
                    key={item.round_id}
                    item={item}
                    isActive={activeIndex === index}
                    onClick={() => setActiveIndex(index)}
                    className={`transition-all duration-300 shadow-sm ${
                      activeIndex === index
                        ? "border border-blue-500 ring-2 ring-blue-500"
                        : "border border-gray-300"
                    }`}
                  />
                ))
              ) : (
                <div className="p-8 border-2 border-gray-200 rounded-xl font-medium text-gray-400 text-lg text-center">
                  No races currently available.
                </div>
              )}
            </div>

            {/* Main info content */}
            {calendarData.length > 0 && (
              <div className="w-full sm:w-7/12">
                <InformationCard item={calendarData[activeIndex]} />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default RaceCalendar;
