import React from 'react';

interface StatsDisplayProps {
  currentStreak: number;
  weightLost: number;
  totalDays: number;
}

const StatsDisplay: React.FC<StatsDisplayProps> = ({ currentStreak, weightLost, totalDays }) => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-400">Current Streak</h3>
      <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{currentStreak} days</p>
    </div>
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-green-600 dark:text-green-400">Weight Lost</h3>
      <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
        {weightLost.toFixed(1)} lbs
      </p>
    </div>
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-purple-600 dark:text-purple-400">Total Days</h3>
      <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{totalDays}</p>
    </div>
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-indigo-600 dark:text-indigo-400">Goal</h3>
      <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">75 days</p>
    </div>
  </div>
);

export default StatsDisplay;
