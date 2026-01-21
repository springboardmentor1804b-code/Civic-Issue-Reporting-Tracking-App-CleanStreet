import React from "react";

const PieChart = ({ data, colors, size = 120 }) => {
  const total = data.reduce((a, b) => a + b.value, 0);
  let cumulative = 0;

  return (
    <svg width={size} height={size} viewBox="0 0 32 32">
      {data.map((item, index) => {
        const startAngle = (cumulative / total) * 360;
        const angle = (item.value / total) * 360;
        cumulative += item.value;

        const largeArc = angle > 180 ? 1 : 0;
        const x1 = 16 + 16 * Math.cos((Math.PI / 180) * startAngle);
        const y1 = 16 + 16 * Math.sin((Math.PI / 180) * startAngle);
        const x2 = 16 + 16 * Math.cos((Math.PI / 180) * (startAngle + angle));
        const y2 = 16 + 16 * Math.sin((Math.PI / 180) * (startAngle + angle));

        const pathData = `
          M16 16
          L${x1} ${y1}
          A16 16 0 ${largeArc} 1 ${x2} ${y2}
          Z
        `;

        return (
          <path
            key={index}
            d={pathData}
            fill={colors[index]}
          />
        );
      })}
    </svg>
  );
};

export default PieChart;
