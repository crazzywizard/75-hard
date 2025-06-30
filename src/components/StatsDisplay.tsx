import React, { useState } from 'react';

interface StatsDisplayProps {
  currentStreak: number;
  startWeight?: number | null;
  endWeight?: number | null;
  totalDays: number;
  daysPassed: number;
  onStartWeightChange?: (weight: number) => void;
}

const StatsDisplay: React.FC<StatsDisplayProps> = ({
  currentStreak,
  startWeight,
  endWeight,
  totalDays,
  daysPassed,
  onStartWeightChange
}) => {
  const [isEditingStartWeight, setIsEditingStartWeight] = useState(false);
  const [editingStartWeight, setEditingStartWeight] = useState('');
  
  const weightLost = startWeight && endWeight ? startWeight - endWeight : 0;

  const handleStartWeightEdit = () => {
    setEditingStartWeight(startWeight?.toString() || '');
    setIsEditingStartWeight(true);
  };

  const handleStartWeightSave = () => {
    const weight = parseFloat(editingStartWeight);
    if (weight > 0 && onStartWeightChange) {
      onStartWeightChange(weight);
    }
    setIsEditingStartWeight(false);
  };

  const handleStartWeightCancel = () => {
    setIsEditingStartWeight(false);
    setEditingStartWeight('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleStartWeightSave();
    } else if (e.key === 'Escape') {
      handleStartWeightCancel();
    }
  };

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
        {isEditingStartWeight && !endWeight ? (
          <div className="flex flex-col gap-2">
            <input
              type="number"
              value={editingStartWeight}
              onChange={(e) => setEditingStartWeight(e.target.value)}
              onKeyDown={handleKeyPress}
              className="text-xl font-bold p-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100"
              placeholder="Weight in lbs"
              min="0"
              step="0.1"
              autoFocus
            />
            <div className="flex gap-1">
              <button
                onClick={handleStartWeightSave}
                className="text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
              >
                Save
              </button>
              <button
                onClick={handleStartWeightCancel}
                className="text-xs bg-gray-600 text-white px-2 py-1 rounded hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              {endWeight
                ? `${weightLost.toFixed(1)} lbs`
                : startWeight
                ? `${startWeight.toFixed(1)} lbs`
                : 'Not set'}
            </p>
            {!endWeight && onStartWeightChange && (
              <button
                onClick={handleStartWeightEdit}
                className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 ml-1"
                title="Click to edit starting weight"
              >
                ✏️
              </button>
            )}
          </div>
        )}
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
