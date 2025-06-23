import React, { useState } from 'react';

interface EndWeightFormProps {
  onSetEndWeight: (endWeight: number) => void;
  isVisible: boolean;
}

const EndWeightForm: React.FC<EndWeightFormProps> = ({ onSetEndWeight, isVisible }) => {
  const [endWeight, setEndWeight] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const weight = parseFloat(endWeight);
    if (weight > 0) {
      onSetEndWeight(weight);
      setEndWeight('');
    } else {
      alert('Please enter a valid weight.');
    }
  };

  if (!isVisible) return null;

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6 border-2 border-green-500">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
        🎉 Congratulations! You&apos;ve completed 75 days!
      </h2>
      <p className="text-gray-600 dark:text-gray-300 mb-4">
        Enter your final weight to see your total weight loss.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="endWeight"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Final Weight (lbs)
          </label>
          <input
            type="number"
            id="endWeight"
            value={endWeight}
            onChange={(e) => setEndWeight(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 dark:border-gray-600"
            required
            min="1"
            step="0.1"
            placeholder="Enter your final weight"
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 bg-green-600 text-white font-semibold rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          Set Final Weight
        </button>
      </form>
    </div>
  );
};

export default EndWeightForm;
