import React, { useState, useEffect } from 'react';

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
}) => {
  // Local state for the input value to allow typing
  const [weightInput, setWeightInput] = useState<string>('');

  // Initialize local input state when currentWeight changes from parent
  useEffect(() => {
    if (currentWeight > 0) {
      setWeightInput(currentWeight.toString());
    } else {
      setWeightInput('');
    }
  }, [currentWeight]);

  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setWeightInput(value); // Always update the displayed value

    // Update parent state with parsed value
    if (value.trim() === '') {
      setCurrentWeight(0);
    } else {
      const weight = parseFloat(value);
      if (!isNaN(weight) && weight > 0) {
        setCurrentWeight(weight);
      } else if (value.trim() !== '') {
        // If there's input but it's not a valid positive number, set to 0
        setCurrentWeight(0);
      }
    }
  };

  // Button should be enabled when we have both start date and a valid weight
  const isButtonDisabled = !startDate || !currentWeight || currentWeight <= 0;

  return (
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
            value={weightInput}
            onChange={handleWeightChange}
            placeholder="Enter weight"
            min="1"
            step="0.1"
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
        </div>
        <div className="flex items-end">
          <button
            onClick={startChallenge}
            className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white py-2 px-4 rounded-md transition-colors disabled:bg-blue-300 dark:disabled:bg-blue-500 disabled:cursor-not-allowed"
            disabled={isButtonDisabled}
          >
            Start Challenge
          </button>
        </div>
      </div>
      {isButtonDisabled && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          {!startDate && !currentWeight ? 'Please enter a start date and starting weight.' : 
           !startDate ? 'Please select a start date.' : 
           'Please enter a valid starting weight (greater than 0).'}
        </p>
      )}
    </div>
  );
};

export default SetupChallenge;
