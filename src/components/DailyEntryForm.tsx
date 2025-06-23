import React, { useState } from 'react';

interface DailyEntryFormProps {
  onAddEntry: (entry: {
    noSugar: boolean;
    noEatingOut: boolean;
    caloriesBurned: number;
    steps: number;
    notes: string;
  }) => void;
}

const DailyEntryForm: React.FC<DailyEntryFormProps> = ({ onAddEntry }) => {
  const [noSugar, setNoSugar] = useState(false);
  const [noEatingOut, setNoEatingOut] = useState(false);
  const [caloriesBurned, setCaloriesBurned] = useState(0);
  const [steps, setSteps] = useState(0);
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddEntry({
      noSugar,
      noEatingOut,
      caloriesBurned,
      steps,
      notes
    });
    // Reset fields after submission if needed
    setNoSugar(false);
    setNoEatingOut(false);
    setCaloriesBurned(0);
    setSteps(0);
    setNotes('');
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
        Add Today&apos;s Entry
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Checkboxes row: stacked on mobile, row on sm+ */}
        <div className="flex flex-col sm:flex-row gap-4 w-full">
          <label className="flex items-center gap-2 w-full sm:flex-1 min-w-[120px] text-sm font-medium text-gray-700 dark:text-gray-300">
            <input
              type="checkbox"
              checked={noSugar}
              onChange={(e) => setNoSugar(e.target.checked)}
              className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500 dark:focus:ring-red-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            No Sugar
          </label>
          <label className="flex items-center gap-2 w-full sm:flex-1 min-w-[140px] text-sm font-medium text-gray-700 dark:text-gray-300">
            <input
              type="checkbox"
              checked={noEatingOut}
              onChange={(e) => setNoEatingOut(e.target.checked)}
              className="w-4 h-4 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500 dark:focus:ring-orange-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            No Eating Out
          </label>
        </div>
        {/* Calories/Steps row: always side by side */}
        <div className="flex flex-row gap-4 w-full">
          <div className="flex items-center gap-2 w-full sm:flex-1 min-w-[160px]">
            <label
              htmlFor="caloriesBurned"
              className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-0"
            >
              Calories Burned
            </label>
            <input
              type="number"
              id="caloriesBurned"
              value={caloriesBurned}
              onChange={(e) => setCaloriesBurned(Number(e.target.value))}
              className="w-full sm:w-20 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 dark:border-gray-600"
              min="0"
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:flex-1 min-w-[120px]">
            <label
              htmlFor="steps"
              className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-0"
            >
              Steps
            </label>
            <input
              type="number"
              id="steps"
              value={steps}
              onChange={(e) => setSteps(Number(e.target.value))}
              className="w-full sm:w-20 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 dark:border-gray-600"
              min="0"
            />
          </div>
        </div>
        <div>
          <label
            htmlFor="notes"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Notes for today
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 dark:border-gray-600"
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 bg-green-600 text-white font-semibold rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          Log Today
        </button>
      </form>
    </div>
  );
};

export default DailyEntryForm;
