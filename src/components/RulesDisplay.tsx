import React from 'react';

const RulesDisplay = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
    <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-red-500">
      <h3 className="font-semibold text-red-600 mb-2">Rule 1</h3>
      <p className="text-sm text-gray-700">NO SUGAR</p>
    </div>
    <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-orange-500">
      <h3 className="font-semibold text-orange-600 mb-2">Rule 2</h3>
      <p className="text-sm text-gray-700">NO EATING OUT</p>
    </div>
    <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-green-500">
      <h3 className="font-semibold text-green-600 mb-2">Rule 3</h3>
      <p className="text-sm text-gray-700">MINIMUM 350 CALORIES BURNED DAILY</p>
    </div>
  </div>
);

export default RulesDisplay;
