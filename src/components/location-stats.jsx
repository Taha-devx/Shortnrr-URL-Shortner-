
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const LocationStats = ({ stats = [] }) => {
  // Make sure stats is an array
  if (!Array.isArray(stats)) {
    console.error("Expected stats to be an array:", stats);
    return <p>Invalid location data.</p>;
  }

  // Count clicks from each city
  const cityCount = stats.reduce((acc, item) => {
    const city = item.city || "Unknown";

    acc[city] = (acc[city] || 0) + 1;

    return acc;
  }, {});

  // Convert object into array
  const cities = Object.entries(cityCount).map(([city, count]) => ({
    city,
    count,
  }));

  return (
    <div style={{ width: "100%", height: 300 }}>
      {cities.length === 0 ? (
        <p>No location data available.</p>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={cities.slice(0, 5)}
            margin={{
              top: 10,
              right: 20,
              left: 0,
              bottom: 10,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />

            <XAxis dataKey="city" stroke="#999" tickLine={false} />

            <YAxis stroke="#999" tickLine={false} axisLine={false} />

            <Tooltip
              contentStyle={{
                backgroundColor: "#171717",
                border: "1px solid #333",
                borderRadius: "8px",
                color: "#fff",
              }}
            />

            <Legend />

            <Line
              type="monotone"
              dataKey="count"
              name="Clicks"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default LocationStats;
