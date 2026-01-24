import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from "recharts";

/* ===== COLORS MATCHING YOUR UI ===== */
const COLORS = [
  "#6366f1", // blue
  "#ec4899", // pink
  "#22c55e", // green
  "#f59e0b", // orange
  "#ef4444"  // red
];

export default function PieBox({ title, data = [] }) {
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

  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition">

      {/* TITLE */}
      <h3 className="text-sm font-semibold text-gray-700 mb-4">
        {title}
      </h3>

      {/* PIE CHART */}
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="label"
            cx="50%"
            cy="50%"
            outerRadius={80}
            paddingAngle={3}
          >
            {data.map((_, i) => (
              <Cell
                key={i}
                fill={COLORS[i % COLORS.length]}
              />
            ))}
          </Pie>

          <Tooltip
            formatter={(value, name) => [`${value}`, name]}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* LEGEND (COLOR + NAME + VALUE) */}
      <div className="mt-4 space-y-2">
        {data.map((item, i) => (
          <div
            key={i}
            className="flex items-center justify-between text-sm"
          >
            <div className="flex items-center gap-2 text-gray-700">
              <span
                className="w-3 h-3 rounded-full"
                style={{
                  backgroundColor: COLORS[i % COLORS.length]
                }}
              />
              {/* ✅ NAME SHOWN */}
              <span>{item.label}</span>
            </div>

            {/* ✅ VALUE + PERCENT */}
            <span className="text-gray-500">
              {item.value} (
              {total > 0
                ? ((item.value / total) * 100).toFixed(1)
                : 0}
              %)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
