import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/AtomicComponents/atoms/shadcn/card";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/AtomicComponents/atoms/shadcn/chart";
import { Button } from "@/AtomicComponents/atoms/shadcn/button";
import { RefreshCw } from "lucide-react";
import { DatePicker } from "@/AtomicComponents/atoms/shadcn/date-picker";

export const Overview = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [monthlyData, setMonthlyData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setDate(new Date().getDate() - 30)), // Default to last 30 days
    endDate: new Date(),
  });

  // Format date for API
  const formatDate = (date) => {
    return date.toISOString().split(".")[0];
  };

  const fetchDashboardData = async (start, end) => {
    try {
      setIsLoading(true);
      const [dashboardResponse, monthlyResponse] = await Promise.all([
        fetch(
          `https://capstone-project-dasrs.onrender.com/api/v1/tournaments/dashboard?startDate=${formatDate(
            start
          )}&endDate=${formatDate(end)}`
        ),
        fetch(
          `https://capstone-project-dasrs.onrender.com/api/v1/tournaments/dashboard/monthly?startDate=${formatDate(
            start
          )}&endDate=${formatDate(end)}`
        ),
      ]);

      const dashboardResult = await dashboardResponse.json();
      const monthlyResult = await monthlyResponse.json();

      setDashboardData(dashboardResult.data);
      setMonthlyData(monthlyResult.data.weekly_dashboard);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchDashboardData(dateRange.startDate, dateRange.endDate);
  }, []);

  // Handle date changes
  const handleStartDateChange = (date) => {
    if (date > dateRange.endDate) {
      // If start date is after end date, adjust end date
      setDateRange({
        startDate: date,
        endDate: new Date(date.getTime() + 24 * 60 * 60 * 1000), // Next day
      });
    } else {
      setDateRange((prev) => ({ ...prev, startDate: date }));
    }
  };

  const handleEndDateChange = (date) => {
    if (date < dateRange.startDate) {
      // If end date is before start date, adjust start date
      setDateRange({
        startDate: new Date(date.getTime() - 24 * 60 * 60 * 1000), // Previous day
        endDate: date,
      });
    } else {
      setDateRange((prev) => ({ ...prev, endDate: date }));
    }
  };

  // Handle refresh
  const handleRefresh = () => {
    fetchDashboardData(dateRange.startDate, dateRange.endDate);
  };

  if (isLoading || !dashboardData) {
    return <div>Loading...</div>;
  }

  const chartConfig = {
    tournament_count: {
      label: "Tournaments",
      theme: {
        light: "hsl(12 76% 61%)",
        dark: "hsl(220 70% 50%)",
      },
    },
    team_count: {
      label: "Teams",
      theme: {
        light: "hsl(173 58% 39%)",
        dark: "hsl(160 60% 45%)",
      },
    },
    player_count: {
      label: "Players",
      theme: {
        light: "hsl(197 37% 24%)",
        dark: "hsl(30 80% 55%)",
      },
    },
    round_count: {
      label: "Rounds",
      theme: {
        light: "hsl(43 74% 66%)",
        dark: "hsl(280 65% 60%)",
      },
    },
    match_count: {
      label: "Matches",
      theme: {
        light: "hsl(27 87% 67%)",
        dark: "hsl(340 75% 55%)",
      },
    },
  };

  const overviewCards = [
    {
      title: "Tournaments",
      value: dashboardData.tournament_count,
      description: "Total tournaments",
    },
    {
      title: "Teams",
      value: dashboardData.team_count,
      description: "Active teams participating",
    },
    {
      title: "Players",
      value: dashboardData.player_count,
      description: "Registered players",
    },
    {
      title: "Rounds",
      value: dashboardData.round_count,
      description: "Completed rounds",
    },
    {
      title: "Matches",
      value: dashboardData.match_count,
      description: "Total matches played",
    },
  ];

  // Transform weekly data for the chart
  const chartData = monthlyData.map((week, index) => ({
    ...week,
    week: `Week ${index + 1}`,
  }));

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {overviewCards.map((card) => (
          <Card key={card.title} className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {card.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-1.5">
                <div className="text-2xl font-bold">{card.value}</div>
                <CardDescription>{card.description}</CardDescription>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Chart and Summary Section */}
      <div className="grid gap-4 md:grid-cols-7">
        {/* Weekly Trends Chart */}
        <Card className="md:col-span-4">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Weekly Statistics</CardTitle>
                <CardDescription>
                  Analytical breakdown of tournament activities
                </CardDescription>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm">From:</span>
                  <DatePicker
                    value={dateRange.startDate}
                    onChange={handleStartDateChange}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm">To:</span>
                  <DatePicker
                    value={dateRange.endDate}
                    onChange={handleEndDateChange}
                  />
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleRefresh}
                  disabled={isLoading}
                >
                  <RefreshCw
                    className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
                  />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ChartContainer className="h-[400px]" config={chartConfig}>
              <AreaChart
                data={chartData}
                margin={{
                  top: 32,
                  right: 32,
                  bottom: 32,
                  left: 32,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="week"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  fontSize={12}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  fontSize={12}
                  width={40}
                />
                <ChartTooltip
                  content={<ChartTooltipContent indicator="line" />}
                />
                <ChartLegend
                  content={<ChartLegendContent />}
                  verticalAlign="top"
                  height={36}
                />
                {Object.keys(chartConfig).map((key) => (
                  <Area
                    key={key}
                    type="monotone"
                    dataKey={key}
                    fill={`var(--color-${key})`}
                    fillOpacity={0.2}
                    stroke={`var(--color-${key})`}
                    strokeWidth={2}
                  />
                ))}
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Summary Cards Stack */}
        <div className="md:col-span-3 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Activity Summary</CardTitle>
              <CardDescription>
                Overview from {dashboardData.start_date} to{" "}
                {dashboardData.end_date}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Average Teams per Tournament</span>
                  <span className="font-bold">
                    {Math.round(
                      dashboardData.team_count /
                        dashboardData.tournament_count || 0
                    )}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Average Players per Team</span>
                  <span className="font-bold">
                    {Math.round(
                      dashboardData.player_count / dashboardData.team_count || 0
                    )}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Matches per Tournament</span>
                  <span className="font-bold">
                    {Math.round(
                      dashboardData.match_count /
                        dashboardData.tournament_count || 0
                    )}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Weekly Progress</CardTitle>
              <CardDescription>Latest week statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(monthlyData[monthlyData.length - 1] || {})
                  .filter(([key]) => key !== "start_date" && key !== "end_date")
                  .map(([key, value]) => (
                    <div
                      key={key}
                      className="flex justify-between items-center"
                    >
                      <span>
                        {key
                          .split("_")
                          .map(
                            (word) =>
                              word.charAt(0).toUpperCase() + word.slice(1)
                          )
                          .join(" ")}
                      </span>
                      <span className="font-bold">{value}</span>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
