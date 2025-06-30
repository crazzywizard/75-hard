'use client';

import { useState, useEffect, useCallback } from 'react';
import ChallengeHeader from '../components/ChallengeHeader';
import RulesDisplay from '../components/RulesDisplay';
import StatsDisplay from '../components/StatsDisplay';
// import SetupChallenge from '../components/SetupChallenge'; // Removed - no longer using SetupChallenge
import DailyEntryForm from '../components/DailyEntryForm';
import EntriesTable, { DayEntry } from '../components/EntriesTable';
import PrizeDisplay from '../components/PrizeDisplay';
import ParticipantSelector, { Participant } from '../components/ParticipantSelector';
import { ThemeSwitcher } from '../components/ThemeSwitcher';
import AddParticipantForm from '../components/AddParticipantForm';
import EndWeightForm from '../components/EndWeightForm';

export default function Home() {
  const [entries, setEntries] = useState<DayEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [currentParticipant, setCurrentParticipant] = useState<Participant | null>(null);
  const [currentParticipantId, setCurrentParticipantId] = useState<string | null>(null);

  const fetchParticipants = useCallback(async () => {
    try {
      const response = await fetch('/api/participants');
      const data = await response.json();
      if (Array.isArray(data)) {
        const sorted = data.sort((a, b) => a.user_id.localeCompare(b.user_id));
        setParticipants(sorted);
        // If there's no current participant and we fetched some, default to the first in sorted list
        if (!currentParticipantId && sorted.length > 0) {
          setCurrentParticipantId(sorted[0].id);
        }
      }
    } catch (error) {
      console.error('Failed to fetch participants:', error);
    }
  }, [currentParticipantId]);

  // Fetch participants on initial load
  useEffect(() => {
    fetchParticipants();
  }, [fetchParticipants]);

  // Load data from Supabase when participant changes
  useEffect(() => {
    const fetchEntries = async () => {
      if (!currentParticipant) return;
      setLoading(true);
      try {
        const response = await fetch(`/api/entries?participant_id=${currentParticipant.id}`);
        const data = await response.json();
        if (Array.isArray(data)) {
          setEntries(data);
        } else {
          setEntries([]);
        }
      } catch (error) {
        console.error('Failed to fetch entries:', error);
        setEntries([]);
      }
      setLoading(false);
    };

    fetchEntries();
  }, [currentParticipant]);

  useEffect(() => {
    const syncLocalAndDb = async () => {
      if (!currentParticipant) return;
      const localStartDate = localStorage.getItem(`75hard-start-date-${currentParticipant.id}`);
      const dbStartDate = currentParticipant.start_date;

      // If DB has value but localStorage does not or is different, update localStorage
      if (dbStartDate && dbStartDate !== localStartDate) {
        localStorage.setItem(`75hard-start-date-${currentParticipant.id}`, dbStartDate);
      }

      // If DB is missing but localStorage has value, update DB
      if (!dbStartDate && localStartDate) {
        await updateParticipant({ start_date: localStartDate });
      }

      // DB is source of truth for start date (no longer needed in local state)
    };
    syncLocalAndDb();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentParticipant]);

  const addTodayEntry = async (entry: {
    noSugar: boolean;
    noEatingOut: boolean;
    caloriesBurned: number;
    steps: number;
    notes: string;
  }) => {
    if (!currentParticipant) return;

    if (entries.find((entryObj) => entryObj.date === todayStr)) {
      alert('Entry for today already exists!');
      return;
    }

    const newEntry = {
      date: todayStr,
      no_sugar: entry.noSugar,
      no_eating_out: entry.noEatingOut,
      calories_burned: entry.caloriesBurned,
      steps: entry.steps,
      notes: entry.notes,
      participant_id: currentParticipant.id
    };

    try {
      const response = await fetch('/api/entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEntry)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add entry');
      }

      const createdEntries = await response.json();
      if (!Array.isArray(createdEntries) || createdEntries.length === 0) {
        throw new Error('API did not return the created entry.');
      }
      const [createdEntry] = createdEntries;
      setEntries([...entries, createdEntry]);
    } catch (error: unknown) {
      console.error('Failed to add entry:', error);
      if (error instanceof Error) {
        alert(`Error: ${error.message}`);
      } else {
        alert('An unknown error occurred.');
      }
    }
  };

  const updateEntry = async (
    date: string,
    field: keyof Omit<DayEntry, 'id' | 'date'>,
    value: string | number | boolean
  ) => {
    if (!currentParticipant) return;

    const originalEntries = [...entries];

    try {
      const updatedEntries = entries.map((entry) =>
        entry.date === date ? { ...entry, [field]: value } : entry
      );
      setEntries(updatedEntries);

      const response = await fetch(
        `/api/entries?date=${date}&participant_id=${currentParticipant.id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ [field]: value })
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update entry');
      }
    } catch (error: unknown) {
      console.error('Failed to update entry:', error);
      alert(`Error updating entry: ${error instanceof Error ? error.message : String(error)}`);
      // Revert state on error
      setEntries(originalEntries);
    }
  };

  const deleteEntry = async (date: string) => {
    if (!currentParticipant) return;

    const originalEntries = [...entries];
    setEntries(entries.filter((entry) => entry.date !== date));

    try {
      const response = await fetch(
        `/api/entries?date=${date}&participant_id=${currentParticipant.id}`,
        {
          method: 'DELETE'
        }
      );

      if (!response.ok) {
        throw new Error('Failed to delete entry');
      }
    } catch (error) {
      console.error('Failed to delete entry:', error);
      setEntries(originalEntries);
      alert('Failed to delete entry.');
    }
  };

  const updateParticipant = async (fields: Partial<Participant>) => {
    if (!currentParticipant) return;
    try {
      const response = await fetch('/api/participants', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: currentParticipant.id, ...fields })
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update participant');
      }
      // Refetch participants to update state
      fetchParticipants();
    } catch (error) {
      console.error('Failed to update participant:', error);
    }
  };

  const handleEndWeightChange = (weight: number) => {
    updateParticipant({ end_weight: weight });
  };

  const getCurrentStreak = (entries: DayEntry[]): number => {
    let streak = 0;
    const sortedEntries = [...entries].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    for (const entry of sortedEntries) {
      if (
        entry.no_sugar &&
        entry.no_eating_out &&
        (entry.calories_burned >= 350 || entry.steps >= 8000)
      ) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  };

  // Helper to parse YYYY-MM-DD as local date
  function parseLocalDate(dateStr: string) {
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day);
  }

  const getDaysPassed = () => {
    if (!currentParticipant) return 0;
    if (!currentParticipant.start_date) return 0;
    const start = parseLocalDate(currentParticipant.start_date).getTime();
    const end = new Date().setHours(0, 0, 0, 0); // today at local midnight
    const diffInTime = Math.abs(end - start);
    const diffInDays = Math.ceil(diffInTime / (1000 * 3600 * 24));
    return diffInDays;
  };

  const currentStreak = getCurrentStreak(entries);
  const showEndWeightForm = currentStreak >= 75 && !currentParticipant?.end_weight;

  // Calculate today's date in local time, format YYYY-MM-DD
  const today = new Date();
  const pad = (n: number) => n.toString().padStart(2, '0');
  const todayStr = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;
  const hasTodayEntry = entries.some((entry) => entry.date === todayStr);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 dark:from-gray-900 dark:to-black">
      <div className="max-w-7xl mx-auto relative">
        <ThemeSwitcher />
        <ChallengeHeader />
        <AddParticipantForm onParticipantAdded={fetchParticipants} />
        <ParticipantSelector
          participants={participants}
          currentParticipant={currentParticipant}
          setCurrentParticipant={setCurrentParticipant}
        />

        {loading || !currentParticipant ? (
          <div className="text-center py-10">
            <p className="text-xl text-gray-700 dark:text-gray-300">
              {currentParticipant
                ? `Loading ${currentParticipant.user_id}'s challenge...`
                : 'Select a participant to begin.'}
            </p>
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <RulesDisplay />
              <StatsDisplay
                currentStreak={currentStreak}
                startWeight={currentParticipant.start_weight}
                endWeight={currentParticipant.end_weight}
                totalDays={entries.length}
                daysPassed={getDaysPassed()}
              />
            </div>

            {showEndWeightForm && (
              <EndWeightForm onSetEndWeight={handleEndWeightChange} isVisible={true} />
            )}

            <>
              {!hasTodayEntry && (
                <div className="mt-6">
                  <DailyEntryForm onAddEntry={addTodayEntry} />
                </div>
              )}

              {entries.length > 0 && (
                <EntriesTable
                  entries={entries.sort((a, b) => b.date.localeCompare(a.date))}
                  updateEntry={updateEntry}
                  deleteEntry={deleteEntry}
                />
              )}
            </>
          </>
        )}

        <PrizeDisplay />
      </div>
    </div>
  );
}
