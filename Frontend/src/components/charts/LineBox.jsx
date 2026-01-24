import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";

/* ===== THEME COLOR (MATCHES PIE CHART) ===== */
const LINE_COLOR = "#6366f1"; // blue

export default function LineBox({ title, data = [] }) {
  /* ================= EMPTY STATE ================= */
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">
          {title}
        </h3>
        <p className="text-sm text-gray-400 mt-10 text-center">
          No data available
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition">

      {/* ================= TITLE ================= */}
      <h3 className="text-sm font-semibold text-gray-700 mb-4">
        {title}
      </h3>

      {/* ================= LINE CHART ================= */}
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#e5e7eb"
          />

          <XAxis
            dataKey="label"
            tick={{ fontSize: 12, fill: "#4b5563" }}
            axisLine={false}
            tickLine={false}
          />

          <YAxis
            allowDecimals={false}
            tick={{ fontSize: 12, fill: "#4b5563" }}
            axisLine={false}
            tickLine={false}
          />

          <Tooltip
            cursor={{ stroke: "#d1d5db", strokeWidth: 1 }}
            formatter={(value) => [`${value}`, "Count"]}
          />

          <Line
            type="monotone"
            dataKey="value"
            stroke={LINE_COLOR}
            strokeWidth={3}
            dot={{
              r: 4,
              fill: LINE_COLOR,
              strokeWidth: 2,
              stroke: "#ffffff"
            }}
            activeDot={{
              r: 6,
              fill: LINE_COLOR
            }}
          />
        </LineChart>
      </ResponsiveContainer>

      {/* ================= FOOTER ================= */}
      <p className="text-xs text-gray-400 text-center mt-2">
        Trend over selected period
      </p>
    </div>
  );
}
