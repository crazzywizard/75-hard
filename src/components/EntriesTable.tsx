import React from 'react';

export interface DayEntry {
  date: string;
  noSugar: boolean;
  noEatingOut: boolean;
  caloriesBurned: number;
  weight?: number;
  notes?: string;
}

interface EntriesTableProps {
  entries: DayEntry[];
  updateEntry: (date: string, field: keyof DayEntry, value: string | number | boolean) => void;
  deleteEntry: (date: string) => void;
}

const EntriesTable: React.FC<EntriesTableProps> = ({ entries, updateEntry, deleteEntry }) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden">
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              No Sugar
            </th>
            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              No Eating Out
            </th>
            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Calories Burned
            </th>
            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Weight (lbs)
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Notes
            </th>
            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {entries.map((entry) => (
            <tr key={entry.date} className="hover:bg-gray-50">
              <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                {new Date(entry.date).toLocaleDateString()}
              </td>
              <td className="px-4 py-3 text-center">
                <input
                  type="checkbox"
                  checked={entry.noSugar}
                  onChange={(e) => updateEntry(entry.date, 'noSugar', e.target.checked)}
                  className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500"
                />
              </td>
              <td className="px-4 py-3 text-center">
                <input
                  type="checkbox"
                  checked={entry.noEatingOut}
                  onChange={(e) => updateEntry(entry.date, 'noEatingOut', e.target.checked)}
                  className="w-4 h-4 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500"
                />
              </td>
              <td className="px-4 py-3 text-center">
                <input
                  type="number"
                  value={entry.caloriesBurned}
                  onChange={(e) =>
                    updateEntry(entry.date, 'caloriesBurned', parseInt(e.target.value) || 0)
                  }
                  className="w-20 p-1 text-center border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                  className="w-20 p-1 text-center border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  step="0.1"
                />
              </td>
              <td className="px-4 py-3 text-sm text-gray-900">
                <input
                  type="text"
                  value={entry.notes || ''}
                  onChange={(e) => updateEntry(entry.date, 'notes', e.target.value)}
                  className="w-full p-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Add notes..."
                />
              </td>
              <td className="px-4 py-3 text-center">
                <button
                  onClick={() => deleteEntry(entry.date)}
                  className="text-red-600 hover:text-red-900 text-sm font-medium"
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
