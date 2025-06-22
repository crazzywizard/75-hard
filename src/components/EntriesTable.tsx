import React from 'react';

export interface DayEntry {
  id: number;
  date: string;
  no_sugar: boolean;
  no_eating_out: boolean;
  calories_burned: number;
  steps: number;
  weight?: number;
  notes?: string;
  participant_id?: string;
}

interface EntriesTableProps {
  entries: DayEntry[];
  updateEntry: (
    date: string,
    field: keyof Omit<DayEntry, 'id' | 'date'>,
    value: string | number | boolean
  ) => void;
  deleteEntry: (date: string) => void;
}

const EntriesTable: React.FC<EntriesTableProps> = ({ entries, updateEntry, deleteEntry }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Date
            </th>
            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              No Sugar
            </th>
            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              No Eating Out
            </th>
            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Calories Burned
            </th>
            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Steps
            </th>
            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Weight (lbs)
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Notes
            </th>
            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {entries.map((entry) => (
            <tr key={entry.date} className="hover:bg-gray-50 dark:hover:bg-gray-700">
              <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100 font-medium">
                {new Date(entry.date).toLocaleDateString()}
              </td>
              <td className="px-4 py-3 text-center">
                <input
                  type="checkbox"
                  checked={entry.no_sugar}
                  onChange={(e) => updateEntry(entry.date, 'no_sugar', e.target.checked)}
                  className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500 dark:focus:ring-red-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
              </td>
              <td className="px-4 py-3 text-center">
                <input
                  type="checkbox"
                  checked={entry.no_eating_out}
                  onChange={(e) => updateEntry(entry.date, 'no_eating_out', e.target.checked)}
                  className="w-4 h-4 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500 dark:focus:ring-orange-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
              </td>
              <td className="px-4 py-3 text-center">
                <input
                  type="number"
                  value={entry.calories_burned}
                  onChange={(e) =>
                    updateEntry(entry.date, 'calories_burned', parseInt(e.target.value) || 0)
                  }
                  className="w-20 p-1 text-center border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 dark:border-gray-600"
                  min="0"
                />
              </td>
              <td className="px-4 py-3 text-center">
                <input
                  type="number"
                  value={entry.steps}
                  onChange={(e) => updateEntry(entry.date, 'steps', parseInt(e.target.value) || 0)}
                  className="w-20 p-1 text-center border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 dark:border-gray-600"
                  min="0"
                />
              </td>
              <td className="px-4 py-3 text-center">
                <input
                  type="number"
                  value={entry.weight || ''}
                  onChange={(e) =>
                    updateEntry(entry.date, 'weight', parseFloat(e.target.value) || 0)
                  }
                  className="w-20 p-1 text-center border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 dark:border-gray-600"
                  step="0.1"
                />
              </td>
              <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                <input
                  type="text"
                  value={entry.notes || ''}
                  onChange={(e) => updateEntry(entry.date, 'notes', e.target.value)}
                  className="w-full p-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 dark:border-gray-600"
                  placeholder="Add notes..."
                />
              </td>
              <td className="px-4 py-3 text-center">
                <button
                  onClick={() => deleteEntry(entry.date)}
                  className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 text-sm font-medium"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default EntriesTable;
