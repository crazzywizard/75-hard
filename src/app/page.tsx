'use client';

import { useState, useEffect } from 'react';
import ChallengeHeader from '../components/ChallengeHeader';
import RulesDisplay from '../components/RulesDisplay';
import StatsDisplay from '../components/StatsDisplay';
import SetupChallenge from '../components/SetupChallenge';
import DailyEntryForm from '../components/DailyEntryForm';
import EntriesTable, { DayEntry } from '../components/EntriesTable';
import PrizeDisplay from '../components/PrizeDisplay';

export default function Home() {
  const [entries, setEntries] = useState<DayEntry[]>([]);
  const [currentWeight, setCurrentWeight] = useState<number>(0);
  const [notes, setNotes] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [loading, setLoading] = useState(true);

  // Load data from Supabase on component mount
  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const response = await fetch('/api/entries');
        const data = await response.json();
        if (Array.isArray(data)) {
          setEntries(data);
        } else {
          setEntries([]); // or handle error
        }
      } catch (error) {
        console.error('Failed to fetch entries:', error);
        setEntries([]);
      }
      setLoading(false);
    };

    fetchEntries();

    // You might want to store start_date and start_weight in a separate table/logic
    // For now, keeping it in local storage for simplicity
    const savedStartDate = localStorage.getItem('75hard-start-date');
    const savedWeight = localStorage.getItem('75hard-start-weight');
    if (savedStartDate) setStartDate(savedStartDate);
    if (savedWeight) setCurrentWeight(parseFloat(savedWeight));
  }, []);

  const addTodayEntry = async () => {
    const today = new Date().toISOString().split('T')[0];
    if (entries.find((entry) => entry.date === today)) {
      alert('Entry for today already exists!');
      return;
    }

    const newEntry: Omit<DayEntry, 'id'> = {
      date: today,
      noSugar: false,
      noEatingOut: false,
      caloriesBurned: 0,
      weight: currentWeight,
      notes: notes
    };

    try {
      const response = await fetch('/api/entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEntry)
      });
      const [createdEntry] = await response.json();
      setEntries([...entries, createdEntry]);
      setNotes('');
    } catch (error) {
      console.error('Failed to add entry:', error);
    }
  };

  const updateEntry = async (
    date: string,
    field: keyof DayEntry,
    value: string | number | boolean
  ) => {
    const updatedEntry = entries.find((e) => e.date === date);
    if (!updatedEntry) return;

    try {
      await fetch(`/api/entries/${date}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: value })
      });
      setEntries(
        entries.map((entry) => (entry.date === date ? { ...entry, [field]: value } : entry))
      );
    } catch (error) {
      console.error('Failed to update entry:', error);
    }
  };

  const deleteEntry = async (date: string) => {
    try {
      await fetch(`/api/entries/${date}`, { method: 'DELETE' });
      setEntries(entries.filter((entry) => entry.date !== date));
    } catch (error) {
      console.error('Failed to delete entry:', error);
    }
  };

  const startChallenge = () => {
    if (!startDate) {
      alert('Please set a start date!');
      return;
    }
    if (currentWeight <= 0) {
      alert('Please enter your starting weight!');
      return;
    }
    localStorage.setItem('75hard-start-date', startDate);
    localStorage.setItem('75hard-start-weight', currentWeight.toString());
    addTodayEntry();
  };

  const getCurrentStreak = () => {
    if (entries.length === 0) return 0;

    let streak = 0;
    const sortedEntries = [...entries].sort((a, b) => b.date.localeCompare(a.date));

    for (const entry of sortedEntries) {
      if (entry.noSugar && entry.noEatingOut && entry.caloriesBurned >= 350) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  };

  const getWeightLost = () => {
    if (entries.length === 0 || !currentWeight) return 0;
    const firstEntry = entries.find((entry) => entry.weight);
    if (!firstEntry?.weight) return 0;
    return firstEntry.weight - currentWeight;
  };

  const resetChallenge = async () => {
    if (confirm('Are you sure you want to reset the challenge? This will delete all entries.')) {
      try {
        // This needs a more robust implementation like a dedicated API route to delete all entries for a user
        const deletePromises = entries.map((e) =>
          fetch(`/api/entries/${e.date}`, { method: 'DELETE' })
        );
        await Promise.all(deletePromises);

        setEntries([]);
        setStartDate('');
        setCurrentWeight(0);
        localStorage.removeItem('75hard-start-date');
        localStorage.removeItem('75hard-start-weight');
      } catch (error) {
        console.error('Failed to reset challenge:', error);
      }
    }
  };

  const sortedEntries = [...entries].sort((a, b) => a.date.localeCompare(b.date));

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <p className="text-xl text-gray-700">Loading your challenge...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        <ChallengeHeader />
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

        <PrizeDisplay />
      </div>
    </div>
  );
}
