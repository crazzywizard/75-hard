import React, { useState } from 'react';

interface DailyEntryFormProps {
  onAddEntry: (entry: {
    noSugar: boolean;
    ateOut: boolean;
    eatingOutCalories: number;
    caloriesBurned: number;
    steps: number;
    notes: string;
  }) => void;
}

const DailyEntryForm: React.FC<DailyEntryFormProps> = ({ onAddEntry }) => {
  const [noSugar, setNoSugar] = useState(false);
  const [ateOut, setAteOut] = useState(false);
  const [eatingOutCalories, setEatingOutCalories] = useState('');
  const [caloriesBurned, setCaloriesBurned] = useState('');
  const [steps, setSteps] = useState('');
  const [notes, setNotes] = useState('');

  // Helper function to convert string to number for validation
  const convertToNumber = (value: string): number => {
    if (value.trim() === '') return 0;
    const num = parseInt(value);
    return isNaN(num) ? 0 : num;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onAddEntry({
      noSugar,
      ateOut,
      eatingOutCalories: ateOut ? convertToNumber(eatingOutCalories) : 0,
      caloriesBurned: convertToNumber(caloriesBurned),
      steps: convertToNumber(steps),
      notes
    });
    
    // Reset fields after submission
    setNoSugar(false);
    setAteOut(false);
    setEatingOutCalories('');
    setCaloriesBurned('');
    setSteps('');
    setNotes('');
  };

  const isEatingOutRuleSatisfied = !ateOut || (ateOut && (convertToNumber(eatingOutCalories) < 500));

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
        Add Today&apos;s Entry
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end sm:gap-4 w-full">
          <label className="flex items-center gap-3 w-full sm:w-auto sm:flex-1 min-w-[120px] text-sm font-medium text-gray-700 dark:text-gray-300 px-2 py-2">
            <input
              type="checkbox"
              checked={noSugar}
              onChange={(e) => setNoSugar(e.target.checked)}
              className="w-6 h-6 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500 dark:focus:ring-red-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            No Sugar
          </label>
          
          {/* Enhanced Eating Out Section */}
          <div className="flex flex-col gap-2 w-full sm:w-auto sm:flex-1 min-w-[220px] px-2 py-2">
            <label className="flex items-center gap-3 text-sm font-medium text-gray-700 dark:text-gray-300">
              <input
                type="checkbox"
                checked={ateOut}
                onChange={(e) => {
                  setAteOut(e.target.checked);
                  if (!e.target.checked) {
                    setEatingOutCalories('');
                  }
                }}
                className="w-6 h-6 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500 dark:focus:ring-orange-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              Ate Out Today
            </label>
            {ateOut && (
              <div className="flex items-center gap-2 ml-9">
                <label
                  htmlFor="eatingOutCalories"
                  className="text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap"
                >
                  Calories:
                </label>
                <input
                  type="number"
                  id="eatingOutCalories"
                  value={eatingOutCalories}
                  onChange={(e) => setEatingOutCalories(e.target.value)}
                  className={`w-20 p-1 text-center border rounded-md focus:ring-2 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 dark:border-gray-600 ${
                    isEatingOutRuleSatisfied 
                      ? 'border-gray-300 focus:ring-green-500' 
                      : 'border-red-500 focus:ring-red-500'
                  }`}
                  min="0"
                  placeholder="0"
                  required
                />
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  (rule: &lt;500 cal)
                </span>
              </div>
            )}
            {ateOut && !isEatingOutRuleSatisfied && (
              <p className="text-xs text-red-600 dark:text-red-400 ml-9">
                ⚠️ Warning: This will break your streak! Rule requires &lt;500 calories.
              </p>
            )}
          </div>
          
          <div className="flex items-center gap-2 w-full sm:w-auto sm:flex-1 min-w-[160px] px-2 py-2">
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
              onChange={(e) => setCaloriesBurned(e.target.value)}
              className="w-full sm:w-20 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 dark:border-gray-600"
              min="0"
              placeholder="0"
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto sm:flex-1 min-w-[120px] px-2 py-2">
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
              onChange={(e) => setSteps(e.target.value)}
              className="w-full sm:w-20 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 dark:border-gray-600"
              min="0"
              placeholder="0"
            />
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-end sm:gap-4 w-full">
          <div className="flex-1">
            <label
              htmlFor="notes"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Notes (optional)
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 dark:border-gray-600"
              rows={2}
              placeholder="Any notes about today..."
            />
          </div>
        </div>
        
        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white font-semibold rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-blue-400"
        >
          Add Entry
        </button>
      </form>
    </div>
  );
};

export default DailyEntryForm;
