import React, { useState } from 'react';

interface DailyEntryFormProps {
  onAddEntry: (currentWeight: number, notes: string) => void;
}

const DailyEntryForm: React.FC<DailyEntryFormProps> = ({ onAddEntry }) => {
  const [currentWeight, setCurrentWeight] = useState(0);
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentWeight > 0) {
      onAddEntry(currentWeight, notes);
      // Reset fields after submission if needed
      setCurrentWeight(0);
      setNotes('');
    } else {
      alert('Please enter a valid weight.');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
        Add Today&apos;s Entry
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="currentWeight"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Current Weight (lbs)
          </label>
          <input
            type="number"
            id="currentWeight"
            value={currentWeight || ''}
            onChange={(e) => setCurrentWeight(Number(e.target.value))}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 dark:border-gray-600"
            required
            min="1"
          />
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
