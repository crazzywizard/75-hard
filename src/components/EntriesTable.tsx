import React, { useState } from 'react';

export interface DayEntry {
  id: number;
  date: string;
  no_sugar: boolean;
  no_eating_out: boolean;
  ate_out: boolean;
  eating_out_calories: number;
  steps: number;
  calories_burned: number;
  notes?: string;
  participant_id?: string;
}

interface EntriesTableProps {
  entries: DayEntry[];
  updateEntry: (date: string, updates: Partial<Omit<DayEntry, 'id' | 'date'>>) => void;
  deleteEntry: (date: string) => void;
}

// Internal interface for edit values with string number fields
interface EditValues {
  no_sugar?: boolean;
  ate_out?: boolean;
  eating_out_calories?: string;
  calories_burned?: string;
  steps?: string;
  notes?: string;
}

const EntriesTable: React.FC<EntriesTableProps> = ({ entries, updateEntry, deleteEntry }) => {
  const [editingDate, setEditingDate] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<EditValues>({});

  // Calculate today's date in local time, format YYYY-MM-DD
  const today = new Date();
  const pad = (n: number) => n.toString().padStart(2, '0');
  const todayStr = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;

  const startEdit = (entry: DayEntry) => {
    setEditingDate(entry.date);
    setEditValues({
      no_sugar: entry.no_sugar,
      ate_out: entry.ate_out,
      eating_out_calories: entry.eating_out_calories.toString(),
      calories_burned: entry.calories_burned.toString(),
      steps: entry.steps.toString(),
      notes: entry.notes
    });
  };

  const cancelEdit = () => {
    setEditingDate(null);
    setEditValues({});
  };

  const handleFieldChange = (field: keyof EditValues, value: string | boolean) => {
    setEditValues((prev: EditValues) => ({
      ...prev,
      [field]: value
    }));
  };

  const saveEdit = (date: string) => {
    // Convert string values to numbers for database submission
    const updates: Record<string, string | number | boolean> = {};
    
    Object.entries(editValues).forEach(([field, value]) => {
      if (value !== undefined && value !== null) {
        if (field === 'eating_out_calories' || field === 'calories_burned' || field === 'steps') {
          // Convert string to number, but only if it's not empty
          const stringValue = value as string;
          if (stringValue.trim() === '') {
            updates[field] = 0; // Default to 0 for empty strings
          } else {
            const numValue = parseInt(stringValue);
            updates[field] = isNaN(numValue) ? 0 : numValue;
          }
        } else {
          updates[field] = value as string | boolean;
        }
      }
    });
    
    // Make a single API call with all updates
    if (Object.keys(updates).length > 0) {
      updateEntry(date, updates);
    }
    
    setEditingDate(null);
    setEditValues({});
  };

  const getEatingOutStatus = (entry: DayEntry, isEditing: boolean) => {
    if (isEditing) {
      const ateOut = editValues.ate_out;
      if (!ateOut) {
        return { text: 'No', color: 'text-green-600 dark:text-green-400' };
      }
      const calories = editValues.eating_out_calories || '0';
      const calorieNum = parseInt(calories) || 0;
      return calorieNum < 500
        ? { text: `Yes (${calorieNum} cal)`, color: 'text-green-600 dark:text-green-400' }
        : { text: `Yes (${calorieNum} cal)`, color: 'text-red-600 dark:text-red-400' };
    }

    if (!entry.ate_out) {
      return { text: 'No', color: 'text-green-600 dark:text-green-400' };
    }
    return entry.eating_out_calories < 500
      ? { text: `Yes (${entry.eating_out_calories} cal)`, color: 'text-green-600 dark:text-green-400' }
      : { text: `Yes (${entry.eating_out_calories} cal)`, color: 'text-red-600 dark:text-red-400' };
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
      {/* Mobile view */}
      <div className="block sm:hidden">
        {entries.map((entry) => {
          const isEditing = editingDate === entry.date;
          const isToday = entry.date === todayStr;
          const eatingOutStatus = getEatingOutStatus(entry, isEditing);
          
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
              
              {/* Enhanced Eating Out Section */}
              <div className="mb-2">
                <span className="font-semibold text-gray-900 dark:text-gray-100 block">
                  Eating Out:
                </span>
                {isEditing ? (
                  <div className="space-y-2 mt-1">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={!!editValues.ate_out}
                        onChange={(e) => {
                          handleFieldChange('ate_out', e.target.checked);
                          if (!e.target.checked) {
                            handleFieldChange('eating_out_calories', '0');
                          }
                        }}
                        className="w-4 h-4 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500 dark:focus:ring-orange-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <span className="text-sm">Ate Out</span>
                    </label>
                    {editValues.ate_out && (
                      <div className="flex items-center gap-2">
                        <label className="text-xs text-gray-600 dark:text-gray-400">Calories:</label>
                        <input
                          type="number"
                          value={editValues.eating_out_calories || ''}
                          onChange={(e) => handleFieldChange('eating_out_calories', e.target.value)}
                          className="w-20 p-1 text-center border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 dark:border-gray-600"
                          min="0"
                          placeholder="0"
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <span className={`${eatingOutStatus.color} block mt-1`}>
                    {eatingOutStatus.text}
                  </span>
                )}
              </div>
              
              <div className="mb-2">
                <span className="font-semibold text-gray-900 dark:text-gray-100 block">
                  Calories Burned:
                </span>
                <input
                  type="number"
                  value={isEditing ? editValues.calories_burned || '' : entry.calories_burned}
                  disabled={!isEditing}
                  onChange={(e) => handleFieldChange('calories_burned', e.target.value)}
                  className="w-full p-1 text-left border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 dark:border-gray-600 mt-1"
                  min="0"
                  placeholder="0"
                />
              </div>
              <div className="mb-2">
                <span className="font-semibold text-gray-900 dark:text-gray-100 block">Steps:</span>
                <input
                  type="number"
                  value={isEditing ? editValues.steps || '' : entry.steps}
                  disabled={!isEditing}
                  onChange={(e) => handleFieldChange('steps', e.target.value)}
                  className="w-full p-1 text-left border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 dark:border-gray-600 mt-1"
                  min="0"
                  placeholder="0"
                />
              </div>
              <div className="mb-2">
                <span className="font-semibold text-gray-900 dark:text-gray-100 block">Notes:</span>
                <textarea
                  value={isEditing ? editValues.notes || '' : entry.notes || ''}
                  disabled={!isEditing}
                  onChange={(e) => handleFieldChange('notes', e.target.value)}
                  className="w-full p-1 text-left border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 dark:border-gray-600 mt-1"
                  rows={2}
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

      {/* Desktop view */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Date
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                No Sugar
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Eating Out
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
              const eatingOutStatus = getEatingOutStatus(entry, isEditing);
              
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
                    {isEditing ? (
                      <div className="flex flex-col items-center gap-1">
                        <label className="flex items-center gap-1 text-xs">
                          <input
                            type="checkbox"
                            checked={!!editValues.ate_out}
                            onChange={(e) => {
                              handleFieldChange('ate_out', e.target.checked);
                              if (!e.target.checked) {
                                handleFieldChange('eating_out_calories', '0');
                              }
                            }}
                            className="w-3 h-3 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500 dark:focus:ring-orange-600 dark:ring-offset-gray-800 focus:ring-1 dark:bg-gray-700 dark:border-gray-600"
                          />
                          Ate Out
                        </label>
                        {editValues.ate_out && (
                          <input
                            type="number"
                            value={editValues.eating_out_calories || ''}
                            onChange={(e) => handleFieldChange('eating_out_calories', e.target.value)}
                            className="w-16 p-1 text-xs text-center border border-gray-300 rounded-md focus:ring-1 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 dark:border-gray-600"
                            min="0"
                            placeholder="cal"
                          />
                        )}
                      </div>
                    ) : (
                      <span className={`text-sm ${eatingOutStatus.color}`}>
                        {eatingOutStatus.text}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <input
                      type="number"
                      value={isEditing ? editValues.calories_burned || '' : entry.calories_burned}
                      disabled={!isEditing}
                      onChange={(e) => handleFieldChange('calories_burned', e.target.value)}
                      className="w-20 p-1 text-center border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 dark:border-gray-600"
                      min="0"
                      placeholder="0"
                    />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <input
                      type="number"
                      value={isEditing ? editValues.steps || '' : entry.steps}
                      disabled={!isEditing}
                      onChange={(e) => handleFieldChange('steps', e.target.value)}
                      className="w-20 p-1 text-center border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 dark:border-gray-600"
                      min="0"
                      placeholder="0"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <textarea
                      value={isEditing ? editValues.notes || '' : entry.notes || ''}
                      disabled={!isEditing}
                      onChange={(e) => handleFieldChange('notes', e.target.value)}
                      className="w-full p-1 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 dark:border-gray-600 resize-none"
                      rows={1}
                    />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center gap-2">
                      {isToday && (
                        isEditing ? (
                          <>
                            <button
                            onClick={() => saveEdit(entry.date)}
                            className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 text-sm font-medium"
                          >
                            Save
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100 text-sm font-medium"
                          >
                            Cancel
                          </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => startEdit(entry)}
                              className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
                            >
                              Update
                            </button>
                            <button
                              onClick={() => deleteEntry(entry.date)}
                              className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 text-sm font-medium"
                            >
                              Delete
                            </button>
                          </>
                        )
                      )}
                    </div>
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
