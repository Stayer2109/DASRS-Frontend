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

export const Overview = ({ todayData, weeklyData }) => {
  // Calculate percentage changes (mock values - you can implement real calculation)
  const percentageChanges = {
    tournaments: "+5%",
    teams: "+12%",
    players: "+8%",
    rounds: "+15%",
    matches: "+10%",
  };

  const overviewCards = [
    {
      title: "Tournaments",
      value: todayData.todayTournamentCount,
      total: weeklyData.totalTournamentCount,
      change: percentageChanges.tournaments,
      description: "Total tournaments this week",
    },
    {
      title: "Teams",
      value: todayData.todayTeamCount,
      total: weeklyData.totalTeamCount,
      change: percentageChanges.teams,
      description: "Active teams participating",
    },
    {
      title: "Players",
      value: todayData.todayPlayerCount,
      total: weeklyData.totalPlayerCount,
      change: percentageChanges.players,
      description: "Registered players",
    },
    {
      title: "Rounds",
      value: todayData.todayRoundCount,
      total: weeklyData.totalRoundCount,
      change: percentageChanges.rounds,
      description: "Completed rounds",
    },
    {
      title: "Matches",
      value: todayData.todayMatchCount,
      total: weeklyData.totalMatchCount,
      change: percentageChanges.matches,
      description: "Total matches played",
    },
  ];

  const chartConfig = {
    tournamentCount: {
      label: "Tournaments",
      theme: {
        light: "hsl(12 76% 61%)",
        dark: "hsl(220 70% 50%)",
      },
    },
    teamCount: {
      label: "Teams",
      theme: {
        light: "hsl(173 58% 39%)",
        dark: "hsl(160 60% 45%)",
      },
    },
    playerCount: {
      label: "Players",
      theme: {
        light: "hsl(197 37% 24%)",
        dark: "hsl(30 80% 55%)",
      },
    },
    roundCount: {
      label: "Rounds",
      theme: {
        light: "hsl(43 74% 66%)",
        dark: "hsl(280 65% 60%)",
      },
    },
    matchCount: {
      label: "Matches",
      theme: {
        light: "hsl(27 87% 67%)",
        dark: "hsl(340 75% 55%)",
      },
    },
  };

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
              <span
                className={`text-xs font-medium ${
                  card.change.startsWith("+")
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {card.change}
              </span>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-1.5">
                <div className="text-2xl font-bold">{card.value}</div>
                <CardDescription>{card.description}</CardDescription>
                <div className="text-xs text-muted-foreground">
                  Total this week: {card.total}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Chart and Summary Section */}
      <div className="grid gap-4 md:grid-cols-7">
        {/* Weekly Trends Chart - Takes 4 columns */}
        <Card className="md:col-span-4">
          <CardHeader>
            <CardTitle>Weekly Statistics</CardTitle>
            <CardDescription>
              Analytical breakdown of tournament activities over the past weeks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer className="h-[450px]" config={chartConfig}>
              <AreaChart
                data={weeklyData.weeks}
                margin={{
                  top: 20,
                  right: 20,
                  bottom: 20,
                  left: 20,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="week"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                <ChartTooltip
                  content={<ChartTooltipContent indicator="line" />}
                />
                <ChartLegend content={<ChartLegendContent />} />
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

        {/* Summary Cards Stack - Takes 3 columns */}
        <div className="md:col-span-3 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Activity Summary</CardTitle>
              <CardDescription>
                Quick overview of today's activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Active Tournaments</span>
                  <span className="font-bold">
                    {todayData.todayTournamentCount}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Average Players per Team</span>
                  <span className="font-bold">
                    {Math.round(
                      todayData.todayPlayerCount / todayData.todayTeamCount
                    )}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Matches per Tournament</span>
                  <span className="font-bold">
                    {Math.round(
                      todayData.todayMatchCount / todayData.todayTournamentCount
                    )}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Weekly Progress</CardTitle>
              <CardDescription>Comparison with previous week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Total Tournaments</span>
                  <span className="font-bold">
                    {weeklyData.totalTournamentCount}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Total Teams</span>
                  <span className="font-bold">{weeklyData.totalTeamCount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Total Matches</span>
                  <span className="font-bold">
                    {weeklyData.totalMatchCount}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
