'use client';

import { useState, useEffect, useCallback } from 'react';
import ChallengeHeader from '../components/ChallengeHeader';
import RulesDisplay from '../components/RulesDisplay';
import StatsDisplay from '../components/StatsDisplay';
import SetupChallenge from '../components/SetupChallenge';
import DailyEntryForm from '../components/DailyEntryForm';
import EntriesTable, { DayEntry } from '../components/EntriesTable';
import PrizeDisplay from '../components/PrizeDisplay';
import ParticipantSelector, { Participant } from '../components/ParticipantSelector';
import { ThemeSwitcher } from '../components/ThemeSwitcher';
import AddParticipantForm from '../components/AddParticipantForm';

export default function Home() {
  const [entries, setEntries] = useState<DayEntry[]>([]);
  const [currentWeight, setCurrentWeight] = useState<number>(0);
  const [notes, setNotes] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [currentParticipant, setCurrentParticipant] = useState<Participant | null>(null);

  const fetchParticipants = useCallback(async () => {
    try {
      const response = await fetch('/api/participants');
      const data = await response.json();
      if (Array.isArray(data)) {
        setParticipants(data);
        // If there's no current participant and we fetched some, default to the first one
        if (!currentParticipant && data.length > 0) {
          setCurrentParticipant(data[0]);
        }
      }
    } catch (error) {
      console.error('Failed to fetch participants:', error);
    }
  }, [currentParticipant]);

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

    if (currentParticipant) {
      setStartDate(currentParticipant.start_date || '');
      setCurrentWeight(currentParticipant.start_weight ?? 0);
    }
  }, [currentParticipant]);

  useEffect(() => {
    const syncLocalAndDb = async () => {
      if (!currentParticipant) return;
      const localStartDate = localStorage.getItem(`75hard-start-date-${currentParticipant.id}`);
      const localStartWeight = localStorage.getItem(`75hard-start-weight-${currentParticipant.id}`);
      const dbStartDate = currentParticipant.start_date;
      const dbStartWeight = currentParticipant.start_weight;

      // If DB has value but localStorage does not or is different, update localStorage
      if (dbStartDate && dbStartDate !== localStartDate) {
        localStorage.setItem(`75hard-start-date-${currentParticipant.id}`, dbStartDate);
      }
      if (
        dbStartWeight !== null &&
        dbStartWeight !== undefined &&
        dbStartWeight.toString() !== localStartWeight
      ) {
        localStorage.setItem(
          `75hard-start-weight-${currentParticipant.id}`,
          dbStartWeight.toString()
        );
      }

      // If DB is missing but localStorage has value, update DB
      if (!dbStartDate && localStartDate) {
        await updateParticipant({ start_date: localStartDate });
      }
      if ((dbStartWeight === null || dbStartWeight === undefined) && localStartWeight) {
        await updateParticipant({ start_weight: parseFloat(localStartWeight) });
      }

      // Always use DB as source of truth for state
      setStartDate(dbStartDate || '');
      setCurrentWeight(dbStartWeight ?? 0);
    };
    syncLocalAndDb();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentParticipant]);

  const addTodayEntry = async (currentWeight: number, notes: string) => {
    if (!currentParticipant) return;

    const today = new Date().toISOString().split('T')[0];
    if (entries.find((entry) => entry.date === today)) {
      alert('Entry for today already exists!');
      return;
    }

    const newEntry = {
      date: today,
      no_sugar: false,
      no_eating_out: false,
      calories_burned: 0,
      weight: currentWeight,
      notes: notes,
      participant_id: currentParticipant.id,
      steps: 0
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
      setNotes('');
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

  const handleStartDateChange = (date: string) => {
    setStartDate(date);
    localStorage.setItem(`75hard-start-date-${currentParticipant?.id}`, date);
    updateParticipant({ start_date: date });
  };

  const handleStartWeightChange = (weight: number) => {
    setCurrentWeight(weight);
    localStorage.setItem(`75hard-start-weight-${currentParticipant?.id}`, weight.toString());
    updateParticipant({ start_weight: weight });
  };

  const startChallenge = () => {
    if (!currentParticipant) return;
    if (!startDate) {
      alert('Please set a start date!');
      return;
    }
    if (currentWeight <= 0) {
      alert('Please enter your starting weight!');
      return;
    }
    updateParticipant({ start_date: startDate, start_weight: currentWeight });
    addTodayEntry(currentWeight, notes);
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

  const getWeightLost = () => {
    if (!currentParticipant) return 0;
    if (currentParticipant.start_weight == null || entries.length === 0) return 0;
    const startWeight = currentParticipant.start_weight;
    const latestEntry = entries.sort((a, b) => b.date.localeCompare(a.date))[0];
    if (!latestEntry.weight) return 0;
    return startWeight - latestEntry.weight;
  };

  const getDaysPassed = () => {
    if (!currentParticipant) return 0;
    if (!currentParticipant.start_date) return 0;
    const start = new Date(currentParticipant.start_date).getTime();
    const end = new Date().getTime();
    const diffInTime = Math.abs(end - start);
    const diffInDays = Math.ceil(diffInTime / (1000 * 3600 * 24));
    return diffInDays;
  };

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
                currentStreak={getCurrentStreak(entries)}
                weightLost={getWeightLost()}
                totalDays={entries.length}
                daysPassed={getDaysPassed()}
              />
            </div>

            {entries.length === 0 ? (
              <SetupChallenge
                startDate={startDate}
                setStartDate={handleStartDateChange}
                currentWeight={currentWeight}
                setCurrentWeight={handleStartWeightChange}
                startChallenge={startChallenge}
              />
            ) : (
              <>
                <div className="mt-6">
                  <DailyEntryForm onAddEntry={addTodayEntry} />
                </div>

                <EntriesTable
                  entries={entries.sort((a, b) => b.date.localeCompare(a.date))}
                  updateEntry={updateEntry}
                  deleteEntry={deleteEntry}
                />
              </>
            )}
          </>
        )}

        <PrizeDisplay />
      </div>
    </div>
  );
}
