import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";

/* ===== MATCH DASHBOARD THEME ===== */
const BAR_COLOR = "#6366f1"; // same blue as Line chart

export default function BarBox({ title, data = [] }) {
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

      {/* TITLE */}
      <h3 className="text-sm font-semibold text-gray-700 mb-4">
        {title}
      </h3>

      {/* BAR CHART */}
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data}>
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
            cursor={{ fill: "#f3f4f6" }}
            formatter={(value) => [`${value}`, "Count"]}
          />

          <Bar
            dataKey="value"
            fill={BAR_COLOR}
            radius={[6, 6, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
