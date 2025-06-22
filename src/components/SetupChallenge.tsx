import React from 'react';

interface SetupChallengeProps {
  startDate: string;
  setStartDate: (date: string) => void;
  currentWeight: number;
  setCurrentWeight: (weight: number) => void;
  startChallenge: () => void;
}

const SetupChallenge: React.FC<SetupChallengeProps> = ({
  startDate,
  setStartDate,
  currentWeight,
  setCurrentWeight,
  startChallenge
}) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6">
    <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
      Start Your Challenge
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Start Date
        </label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Starting Weight (lbs)
        </label>
        <input
          type="number"
          value={currentWeight || ''}
          onChange={(e) => setCurrentWeight(parseFloat(e.target.value) || 0)}
          placeholder="Enter weight"
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        />
      </div>
      <div className="flex items-end">
        <button
          onClick={startChallenge}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
        >
          Start Challenge
        </button>
      </div>
    </div>
  </div>
);

export default SetupChallenge;
