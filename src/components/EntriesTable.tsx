import React, { useState } from 'react';

export interface DayEntry {
  id: number;
  date: string;
  no_sugar: boolean;
  no_eating_out: boolean;
  calories_burned: number;
  steps: number;
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

const EntriesTable: React.FC<EntriesTableProps> = ({ entries, updateEntry, deleteEntry }) => {
  const [editingDate, setEditingDate] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Partial<DayEntry>>({});

  // Calculate today's date in local time, format YYYY-MM-DD
  const today = new Date();
  const pad = (n: number) => n.toString().padStart(2, '0');
  const todayStr = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;

  const startEdit = (entry: DayEntry) => {
    setEditingDate(entry.date);
    setEditValues({ ...entry });
  };

  const cancelEdit = () => {
    setEditingDate(null);
    setEditValues({});
  };

  const handleFieldChange = (
    field: keyof Omit<DayEntry, 'id' | 'date'>,
    value: string | number | boolean
  ) => {
    setEditValues((prev) => ({ ...prev, [field]: value }));
  };

  const saveEdit = async (date: string) => {
    if (!editValues) return;
    // Only update fields that have changed
    const original = entries.find((e) => e.date === date);
    if (!original) return;
    for (const key of Object.keys(editValues) as (keyof Omit<DayEntry, 'id' | 'date'>)[]) {
      if (editValues[key] !== undefined && editValues[key] !== original[key]) {
        await updateEntry(date, key, editValues[key]!);
      }
    }
    setEditingDate(null);
    setEditValues({});
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      {/* Mobile Card Layout */}
      <div className="block sm:hidden">
        {entries.map((entry) => {
          const isEditing = editingDate === entry.date;
          const isToday = entry.date === todayStr;
          return (
            <div key={entry.date} className="border-b border-gray-200 dark:border-gray-700 p-4">
              <div className="mb-2">
                <span className="font-semibold text-gray-900 dark:text-gray-100 block">Date:</span>
                <span className="text-gray-700 dark:text-gray-300 block">{entry.date}</span>
              </div>
              <div className="mb-2">
                <span className="font-semibold text-gray-900 dark:text-gray-100 block">
                  No Sugar:
                </span>
                <input
                  type="checkbox"
                  checked={isEditing ? !!editValues.no_sugar : entry.no_sugar}
                  disabled={!isEditing}
                  onChange={(e) => handleFieldChange('no_sugar', e.target.checked)}
                  className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500 dark:focus:ring-red-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 mt-1"
                />
              </div>
              <div className="mb-2">
                <span className="font-semibold text-gray-900 dark:text-gray-100 block">
                  No Eating Out:
                </span>
                <input
                  type="checkbox"
                  checked={isEditing ? !!editValues.no_eating_out : entry.no_eating_out}
                  disabled={!isEditing}
                  onChange={(e) => handleFieldChange('no_eating_out', e.target.checked)}
                  className="w-4 h-4 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500 dark:focus:ring-orange-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 mt-1"
                />
              </div>
              <div className="mb-2">
                <span className="font-semibold text-gray-900 dark:text-gray-100 block">
                  Calories Burned:
                </span>
                <input
                  type="number"
                  value={isEditing ? editValues.calories_burned ?? '' : entry.calories_burned}
                  disabled={!isEditing}
                  onChange={(e) =>
                    handleFieldChange('calories_burned', parseInt(e.target.value) || 0)
                  }
                  className="w-full p-1 text-left border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 dark:border-gray-600 mt-1"
                  min="0"
                />
              </div>
              <div className="mb-2">
                <span className="font-semibold text-gray-900 dark:text-gray-100 block">Steps:</span>
                <input
                  type="number"
                  value={isEditing ? editValues.steps ?? '' : entry.steps}
                  disabled={!isEditing}
                  onChange={(e) => handleFieldChange('steps', parseInt(e.target.value) || 0)}
                  className="w-full p-1 text-left border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 dark:border-gray-600 mt-1"
                  min="0"
                />
              </div>
              <div className="mb-2">
                <span className="font-semibold text-gray-900 dark:text-gray-100 block">Notes:</span>
                <input
                  type="text"
                  value={isEditing ? editValues.notes ?? '' : entry.notes || ''}
                  disabled={!isEditing}
                  onChange={(e) => handleFieldChange('notes', e.target.value)}
                  className="w-full mt-1 p-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 dark:border-gray-600"
                  placeholder="Add notes..."
                />
              </div>
              <div className="flex gap-2">
                {isToday ? (
                  isEditing ? (
                    <>
                      <button
                        onClick={() => saveEdit(entry.date)}
                        className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 border shadow-sm rounded px-3 py-1"
                      >
                        Save
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100 border shadow-sm rounded px-3 py-1"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => startEdit(entry)}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 border shadow-sm rounded px-3 py-1"
                      >
                        Update
                      </button>
                      <button
                        onClick={() => deleteEntry(entry.date)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 border shadow-sm rounded px-3 py-1"
                      >
                        Delete
                      </button>
                    </>
                  )
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
      {/* Table Layout for sm+ */}
      <div className="hidden sm:block overflow-x-auto">
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
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Notes
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {entries.map((entry) => {
              const isEditing = editingDate === entry.date;
              const isToday = entry.date === todayStr;
              return (
                <tr key={entry.date} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100 font-medium">
                    {entry.date}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <input
                      type="checkbox"
                      checked={isEditing ? !!editValues.no_sugar : entry.no_sugar}
                      disabled={!isEditing}
                      onChange={(e) => handleFieldChange('no_sugar', e.target.checked)}
                      className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500 dark:focus:ring-red-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <input
                      type="checkbox"
                      checked={isEditing ? !!editValues.no_eating_out : entry.no_eating_out}
                      disabled={!isEditing}
                      onChange={(e) => handleFieldChange('no_eating_out', e.target.checked)}
                      className="w-4 h-4 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500 dark:focus:ring-orange-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <input
                      type="number"
                      value={isEditing ? editValues.calories_burned ?? '' : entry.calories_burned}
                      disabled={!isEditing}
                      onChange={(e) =>
                        handleFieldChange('calories_burned', parseInt(e.target.value) || 0)
                      }
                      className="w-20 p-1 text-center border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 dark:border-gray-600"
                      min="0"
                    />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <input
                      type="number"
                      value={isEditing ? editValues.steps ?? '' : entry.steps}
                      disabled={!isEditing}
                      onChange={(e) => handleFieldChange('steps', parseInt(e.target.value) || 0)}
                      className="w-20 p-1 text-center border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 dark:border-gray-600"
                      min="0"
                    />
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                    <input
                      type="text"
                      value={isEditing ? editValues.notes ?? '' : entry.notes || ''}
                      disabled={!isEditing}
                      onChange={(e) => handleFieldChange('notes', e.target.value)}
                      className="w-full p-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 dark:border-gray-600"
                      placeholder="Add notes..."
                    />
                  </td>
                  <td className="px-4 py-3 text-center">
                    {isToday ? (
                      isEditing ? (
                        <>
                          <button
                            onClick={() => saveEdit(entry.date)}
                            className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 border shadow-sm rounded px-3 py-1 mr-2"
                          >
                            Save
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100 border shadow-sm rounded px-3 py-1"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => startEdit(entry)}
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 border shadow-sm rounded px-3 py-1"
                          >
                            Update
                          </button>
                          <button
                            onClick={() => deleteEntry(entry.date)}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 border shadow-sm rounded px-3 py-1"
                          >
                            Delete
                          </button>
                        </>
                      )
                    ) : null}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EntriesTable;
