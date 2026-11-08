
import {
  Pie,
  PieChart,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const RADIAN = Math.PI / 180;

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}) => {
  if (
    cx == null ||
    cy == null ||
    innerRadius == null ||
    outerRadius == null
  ) {
    return null;
  }

  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = Number(cx) + radius * Math.cos(-(midAngle ?? 0) * RADIAN);
  const y = Number(cy) + radius * Math.sin(-(midAngle ?? 0) * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > Number(cx) ? "start" : "end"}
      dominantBaseline="central"
    >
      {`${((percent ?? 0) * 100).toFixed(0)}%`}
    </text>
  );
};

export default function DeviceStats({ stats = [] }) {
  if (!Array.isArray(stats)) {
    return <p>Invalid device data.</p>;
  }

  // Count clicks by device
  const deviceCount = stats.reduce((acc, item) => {
    const device = item.device?.trim().toLowerCase() || "unknown";

    const formattedDevice =
      device.charAt(0).toUpperCase() + device.slice(1);

    acc[formattedDevice] = (acc[formattedDevice] || 0) + 1;

    return acc;
  }, {});

  const deviceData = Object.entries(deviceCount).map(
    ([name, value]) => ({
      name,
      value,
    })
  );

  if (!deviceData.length) {
    return <p>No device statistics available.</p>;
  }

  return (
    <div className="w-full h-[350px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={deviceData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius="80%"
            labelLine={false}
            label={renderCustomizedLabel}
            stroke="none"
          >
            {deviceData.map((entry, index) => (
              <Cell
                key={entry.name}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>

          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
