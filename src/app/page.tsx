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
      const savedStartDate = localStorage.getItem(`75hard-start-date-${currentParticipant.id}`);
      const savedWeight = localStorage.getItem(`75hard-start-weight-${currentParticipant.id}`);
      setStartDate(savedStartDate || '');
      setCurrentWeight(savedWeight ? parseFloat(savedWeight) : 0);
    }
  }, [currentParticipant]);

  const addTodayEntry = async () => {
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
    field: keyof DayEntry,
    value: string | number | boolean
  ) => {
    if (!currentParticipant) return;
    try {
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

      setEntries(
        entries.map((entry) => (entry.date === date ? { ...entry, [field]: value } : entry))
      );
    } catch (error: unknown) {
      console.error('Failed to update entry:', error);
      if (error instanceof Error) {
        alert(`Error: ${error.message}`);
      } else {
        alert('An unknown error occurred.');
      }
    }
  };

  const deleteEntry = async (date: string) => {
    if (!currentParticipant) return;
    try {
      const response = await fetch(
        `/api/entries?date=${date}&participant_id=${currentParticipant.id}`,
        { method: 'DELETE' }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete entry');
      }

      setEntries(entries.filter((entry) => entry.date !== date));
    } catch (error: unknown) {
      console.error('Failed to delete entry:', error);
      if (error instanceof Error) {
        alert(`Error: ${error.message}`);
      } else {
        alert('An unknown error occurred.');
      }
    }
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
    localStorage.setItem(`75hard-start-date-${currentParticipant.id}`, startDate);
    localStorage.setItem(`75hard-start-weight-${currentParticipant.id}`, currentWeight.toString());
    addTodayEntry();
  };

  const getCurrentStreak = () => {
    if (entries.length === 0) return 0;

    let streak = 0;
    const sortedEntries = [...entries].sort((a, b) => b.date.localeCompare(a.date));

    for (const entry of sortedEntries) {
      if (entry.no_sugar && entry.no_eating_out && entry.calories_burned >= 350) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  };

  const getWeightLost = () => {
    if (!currentParticipant) return 0;
    const startWeightStr = localStorage.getItem(`75hard-start-weight-${currentParticipant.id}`);
    if (!startWeightStr || entries.length === 0) return 0;

    const startWeight = parseFloat(startWeightStr);
    const latestEntry = entries.sort((a, b) => b.date.localeCompare(a.date))[0];

    if (!latestEntry.weight) return 0;

    return startWeight - latestEntry.weight;
  };

  const resetChallenge = async () => {
    if (!currentParticipant) return;
    if (
      confirm(
        `Are you sure you want to reset the challenge for ${currentParticipant.user_id}? This will delete all their entries.`
      )
    ) {
      try {
        const deletePromises = entries.map((e) =>
          fetch(`/api/entries?date=${e.date}&participant_id=${currentParticipant.id}`, {
            method: 'DELETE'
          })
        );

        const responses = await Promise.all(deletePromises);

        for (const response of responses) {
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to delete one or more entries.');
          }
        }

        setEntries([]);
        setStartDate('');
        setCurrentWeight(0);
        localStorage.removeItem(`75hard-start-date-${currentParticipant.id}`);
        localStorage.removeItem(`75hard-start-weight-${currentParticipant.id}`);
      } catch (error: unknown) {
        console.error('Failed to reset challenge:', error);
        if (error instanceof Error) {
          alert(`Error: ${error.message}`);
        } else {
          alert('An unknown error occurred.');
        }
      }
    }
  };

  const sortedEntries = [...entries].sort((a, b) => a.date.localeCompare(b.date));

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
                currentStreak={getCurrentStreak()}
                weightLost={getWeightLost()}
                totalDays={entries.length}
              />
            </div>

            {entries.length === 0 ? (
              <SetupChallenge
                startDate={startDate}
                setStartDate={setStartDate}
                currentWeight={currentWeight}
                setCurrentWeight={setCurrentWeight}
                startChallenge={startChallenge}
              />
            ) : (
              <DailyEntryForm
                currentWeight={currentWeight}
                setCurrentWeight={setCurrentWeight}
                notes={notes}
                setNotes={setNotes}
                addTodayEntry={addTodayEntry}
                resetChallenge={resetChallenge}
              />
            )}

            {entries.length > 0 && (
              <EntriesTable
                entries={sortedEntries}
                updateEntry={updateEntry}
                deleteEntry={deleteEntry}
              />
            )}
          </>
        )}

        <PrizeDisplay />
      </div>
    </div>
  );
}
