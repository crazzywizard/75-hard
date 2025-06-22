import React from 'react';

interface DailyEntryFormProps {
  currentWeight: number;
  setCurrentWeight: (weight: number) => void;
  notes: string;
  setNotes: (notes: string) => void;
  addTodayEntry: () => void;
  resetChallenge: () => void;
}

const DailyEntryForm: React.FC<DailyEntryFormProps> = ({
  currentWeight,
  setCurrentWeight,
  notes,
  setNotes,
  addTodayEntry,
  resetChallenge
}) => (
  <div className="bg-white p-6 rounded-lg shadow-md mb-6">
    <h2 className="text-xl font-semibold mb-4">Add Today&apos;s Entry</h2>
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Current Weight (lbs)</label>
        <input
          type="number"
          value={currentWeight || ''}
          onChange={(e) => setCurrentWeight(parseFloat(e.target.value) || 0)}
          placeholder="Enter weight"
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
        <input
          type="text"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Optional notes"
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      <div className="flex items-end">
        <button
          onClick={addTodayEntry}
          className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
        >
          Add Today
        </button>
      </div>
      <div className="flex items-end">
        <button
          onClick={resetChallenge}
          className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
        >
          Reset Challenge
        </button>
      </div>
    </div>
  </div>
);

export default DailyEntryForm;
