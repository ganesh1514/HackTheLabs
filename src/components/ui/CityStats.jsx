import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
const CityStats = ({ stats }) => {
  const cityCnt = stats.reduce((acc, stat) => {
    acc[stat.city] = (acc[stat.city] || 0) + 1;
    return acc;
  }, {});
  // console.log("City Count:", cityCnt);

  const cities = Object.keys(cityCnt).map((city) => ({
    city,
    count: cityCnt[city],
  }));
  // console.log("Cities:", cities);
  return (
    <Card>
      <CardHeader>
        <CardTitle>City Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={cityCnt} className="min-h-[200px] w-full">
          <AreaChart
            accessibilityLayer
            data={cities}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="city"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />

            <ChartTooltip
              cursor={false}
              color="var(--chart-1)"
              content={<ChartTooltipContent />}
            />
            <defs>
              <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--chart-3)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--chart-3)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <Area
              dataKey="count"
              type="monotone"
              fill="url(#fillMobile)"
              fillOpacity={0.4}
              stroke="var(--chart-3)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default CityStats;
