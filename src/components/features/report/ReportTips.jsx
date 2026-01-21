const ReportTips = () => {
  const tips = [
    "Include clear photos from multiple angles",
    "Provide accurate location details and landmarks",
    "Describe the severity and impact of the issue",
    "Mention how long the issue has been present",
  ];

  return (
    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-5 sm:p-6">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xl">💡</span>
        <h4 className="font-bold text-gray-800">Tips for better reporting</h4>
      </div>
      <ul className="space-y-2 text-sm text-gray-600">
        {tips.map((tip, index) => (
          <li key={index} className="flex items-start gap-2">
            <span className="text-green-500 mt-0.5">•</span>
            {tip}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ReportTips;
