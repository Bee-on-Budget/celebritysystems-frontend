import React from 'react';

const colorStyles = {
  orange: 'bg-[linear-gradient(70deg,#ea580c_20%,#f97316_60%,#fdba74_100%)]',
  green: 'bg-[linear-gradient(70deg,#16a34a_20%,#22c55e_60%,#86efac_100%)]',
  red: 'bg-[linear-gradient(70deg,#dc2626_20%,#ef4444_60%,#fca5a5_100%)]',
  blue: 'bg-[linear-gradient(70deg,#06b6d4_20%,#22d3ee_60%,#67e8f9_100%)]',
};

export default function StatsCard({ color = 'blue', label, value, icon }) {
  return (
    <div className={`rounded-xl p-4 text-white shadow-md w-full h-full ${colorStyles[color]}`}>
      <div className="flex items-center justify-between space-x-4">
        <div className="flex flex-col">
          <span className="text-sm opacity-90">{label}</span>
          <span className="text-2xl font-bold">{value}</span>
        </div>
        <div className="text-3xl opacity-30 flex-shrink-0">
          {icon}
        </div>
      </div>
    </div>
  );
}
