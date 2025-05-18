import React from "react";

const StatsCard = ({ title, value, color = "text-blue-600" }) => {
  return (
    <div className="bg-white p-4 shadow rounded-xl">
      <h3 className="text-lg font-bold text-gray-700">{title}</h3>
      <p className={`text-2xl mt-2 font-semibold ${color}`}>{value}</p>
    </div>
  );
};

export default StatsCard;
