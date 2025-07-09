import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "./chart";
import { Card, CardContent, CardHeader, CardTitle } from "./card";

const colors = {
  mobile: "var(--chart-1)",
  desktop: "var(--chart-2)",
  tablet: "var(--chart-3)",
};
const DeviceStats = ({ stats }) => {
  const deviceCnt = stats.reduce((acc, stat) => {
    acc[stat.device] = (acc[stat.device] || 0) + 1;
    return acc;
  }, {});

  const data = Object.keys(deviceCnt).map((device) => ({
    device,
    count: deviceCnt[device],
  }));
  return (
    <Card>
      <CardHeader>
        <CardTitle>Device Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={deviceCnt} className="min-h-[200px] w-full">
          <ResponsiveContainer>
            <PieChart width={700} height={400}>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent nameKey="device" hideLabel />}
              />
              <Pie
                data={data}
                labelLine={false}
                label={({ percent, device }) =>
                  `${device} ${(percent * 100).toFixed(0)}%`
                }
                dataKey="count"
                nameKey="device"
                innerRadius={60}
              >
                {data.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={colors[data[index].device] || "var(--chart-4"}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default DeviceStats;
