'use client';

import React, { useState } from 'react';

interface AddParticipantFormProps {
  onParticipantAdded: () => void;
}

const AddParticipantForm: React.FC<AddParticipantFormProps> = ({ onParticipantAdded }) => {
  const [userId, setUserId] = useState('');
  const [startWeight, setStartWeight] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId.trim()) {
      setError('Please enter a participant name.');
      return;
    }

    if (!startWeight.trim()) {
      setError('Please enter a starting weight.');
      return;
    }

    const weight = parseFloat(startWeight.trim());
    if (isNaN(weight) || weight <= 0) {
      setError('Please enter a valid starting weight greater than 0.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // Get today's date in YYYY-MM-DD format (local time)
      const today = new Date();
      const localDate = new Date(today.getTime() - (today.getTimezoneOffset() * 60000))
        .toISOString()
        .split('T')[0];

      const response = await fetch('/api/participants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId.trim(),
          start_date: localDate,
          start_weight: weight
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add participant');
      }

      setUserId('');
      setStartWeight('');
      onParticipantAdded();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mb-6">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 flex-wrap">
        <input
          type="text"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          placeholder="Participant Name"
          className="flex-grow p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          disabled={isSubmitting}
        />
        <input
          type="number"
          value={startWeight}
          onChange={(e) => setStartWeight(e.target.value)}
          placeholder="Starting Weight (lbs)"
          min="1"
          step="0.1"
          className="w-full sm:w-40 p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          disabled={isSubmitting}
        />
        <button
          type="submit"
          className="bg-indigo-600 text-white py-2 px-6 rounded-md hover:bg-indigo-700 transition-colors disabled:bg-indigo-400"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Adding...' : 'Add Participant'}
        </button>
      </form>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
};

export default AddParticipantForm;
