// components/StatCard.jsx
import React from 'react';

const colorStyles = {
  orange: 'bg-[linear-gradient(70deg,theme(colors.orange.600)_20%,theme(colors.orange.500)_60%,theme(colors.orange.300)_100%)]',
  green: 'bg-[linear-gradient(70deg,theme(colors.green.600)_20%,theme(colors.green.500)_60%,theme(colors.green.300)_100%)]',
  red: 'bg-[linear-gradient(70deg,theme(colors.red.600)_20%,theme(colors.red.500)_60%,theme(colors.red.300)_100%)]',
  blue: 'bg-[linear-gradient(70deg,theme(colors.cyan.600)_20%,theme(colors.cyan.500)_60%,theme(colors.cyan.300)_100%)]',
};

export default function StatsCard({ color = 'blue', label, value, icon }) {
  return (
    <div className={`rounded-md p-4 text-white shadow-md w-full sm:w-1/2 lg:w-1/4 ${colorStyles[color]}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm opacity-80">{label}</p>
          <h2 className="text-2xl font-bold">{value}</h2>
        </div>
        <div className="text-4xl opacity-60">
          {icon}
        </div>
      </div>
    </div>
  );
}
