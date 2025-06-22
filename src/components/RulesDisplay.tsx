import React from 'react';

const RulesDisplay = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border-l-4 border-red-500">
      <h3 className="font-semibold text-red-600 dark:text-red-400 mb-2">Rule 1</h3>
      <p className="text-sm text-gray-700 dark:text-gray-300">NO SUGAR</p>
    </div>
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border-l-4 border-orange-500">
      <h3 className="font-semibold text-orange-600 dark:text-orange-400 mb-2">Rule 2</h3>
      <p className="text-sm text-gray-700 dark:text-gray-300">NO EATING OUT</p>
    </div>
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border-l-4 border-green-500">
      <h3 className="font-semibold text-green-600 dark:text-green-400 mb-2">Rule 3</h3>
      <p className="text-sm text-gray-700 dark:text-gray-300">MINIMUM 350 CALORIES BURNED</p>
    </div>
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border-l-4 border-sky-500">
      <h3 className="font-semibold text-sky-600 dark:text-sky-400 mb-2">Rule 4</h3>
      <p className="text-sm text-gray-700 dark:text-gray-300">8000 STEPS DAILY</p>
    </div>
  </div>
);

export default RulesDisplay;
