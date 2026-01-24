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
const BAR_COLOR = "#ec4899"; // pink (same as pie)

export default function HorizontalBarBox({ title, data = [] }) {
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

      {/* ================= CHART ================= */}
      <ResponsiveContainer width="100%" height={260}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ left: 40 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#e5e7eb"
          />

          <XAxis
            type="number"
            tick={{ fontSize: 12, fill: "#4b5563" }}
            axisLine={false}
            tickLine={false}
          />

          <YAxis
            dataKey="label"
            type="category"
            tick={{ fontSize: 12, fill: "#374151" }}
            axisLine={false}
            tickLine={false}
            width={120}
          />

          <Tooltip
            cursor={{ fill: "#f3f4f6" }}
            formatter={(value) => [`${value}`, "Complaints"]}
          />

          <Bar
            dataKey="value"
            fill={BAR_COLOR}
            radius={[0, 6, 6, 0]}
          />
        </BarChart>
      </ResponsiveContainer>

      {/* ================= FOOTER NOTE ================= */}
      <p className="text-xs text-gray-400 text-center mt-2">
        Top 5 complaint categories
      </p>
    </div>
  );
}
