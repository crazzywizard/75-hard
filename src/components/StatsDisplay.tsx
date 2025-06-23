import React from 'react';

interface StatsDisplayProps {
  currentStreak: number;
  startWeight?: number | null;
  endWeight?: number | null;
  totalDays: number;
  daysPassed: number;
}

const StatsDisplay: React.FC<StatsDisplayProps> = ({
  currentStreak,
  startWeight,
  endWeight,
  totalDays,
  daysPassed
}) => {
  const weightLost = startWeight && endWeight ? startWeight - endWeight : 0;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-400">Current Streak</h3>
        <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{currentStreak} days</p>
      </div>
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-green-600 dark:text-green-400">
          {endWeight ? 'Weight Lost' : 'Starting Weight'}
        </h3>
        <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          {endWeight
            ? `${weightLost.toFixed(1)} lbs`
            : startWeight
            ? `${startWeight.toFixed(1)} lbs`
            : 'Not set'}
        </p>
        {endWeight && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {startWeight?.toFixed(1)} → {endWeight.toFixed(1)} lbs
          </p>
        )}
      </div>
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">Total Days Logged</p>
        <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{totalDays}</p>
      </div>
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">Days Passed</p>
        <p className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">{daysPassed}</p>
      </div>
    </div>
  );
};

export default StatsDisplay;
