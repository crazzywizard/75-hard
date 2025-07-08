import React, { useState, useEffect } from 'react';
import { DayEntry } from './EntriesTable';
import { Participant } from './ParticipantSelector';

interface DebugInfoProps {
  entries: DayEntry[];
  participants: Participant[];
}

const DebugInfo: React.FC<DebugInfoProps> = ({ entries, participants }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [todayStr, setTodayStr] = useState('');

  useEffect(() => {
    const today = new Date();
    const pad = (n: number) => n.toString().padStart(2, '0');
    const todayString = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;
    setTodayStr(todayString);
  }, []);

  const todayEntries = entries.filter(entry => entry.date === todayStr);
  const thisWeekEntries = entries.filter(entry => {
    const now = new Date();
    const currentDay = now.getDay();
    const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay;
    
    const monday = new Date(now);
    monday.setDate(now.getDate() + mondayOffset);
    
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    
    const formatDate = (date: Date): string => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };
    
    const mondayStr = formatDate(monday);
    const sundayStr = formatDate(sunday);
    
    return entry.date >= mondayStr && entry.date <= sundayStr;
  });

  if (!isVisible) {
    return (
      <div className="mb-4">
        <button
          onClick={() => setIsVisible(true)}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Show Debug Info
        </button>
      </div>
    );
  }

  return (
    <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-red-800 dark:text-red-200">
          Debug Information
        </h2>
        <button
          onClick={() => setIsVisible(false)}
          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Hide
        </button>
      </div>
      
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold text-red-700 dark:text-red-300">Basic Info:</h3>
          <p className="text-sm text-red-600 dark:text-red-400">
            Today&apos;s date: {todayStr}<br/>
            Total entries: {entries.length}<br/>
            Total participants: {participants.length}
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-red-700 dark:text-red-300">Today&apos;s Entries ({todayEntries.length}):</h3>
          <div className="text-xs text-red-600 dark:text-red-400 max-h-32 overflow-y-auto">
            {todayEntries.length === 0 ? (
              <p>No entries for today</p>
            ) : (
              todayEntries.map((entry, index) => (
                <div key={index} className="mb-2">
                  Participant: {entry.participant_id}, Steps: {entry.steps}, Calories: {entry.calories_burned}
                </div>
              ))
            )}
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-red-700 dark:text-red-300">This Week&apos;s Entries ({thisWeekEntries.length}):</h3>
          <div className="text-xs text-red-600 dark:text-red-400 max-h-32 overflow-y-auto">
            {thisWeekEntries.length === 0 ? (
              <p>No entries for this week</p>
            ) : (
              thisWeekEntries.map((entry, index) => (
                <div key={index} className="mb-2">
                  Date: {entry.date}, Participant: {entry.participant_id}, Steps: {entry.steps}, Calories: {entry.calories_burned}
                </div>
              ))
            )}
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-red-700 dark:text-red-300">All Entries (last 10):</h3>
          <div className="text-xs text-red-600 dark:text-red-400 max-h-32 overflow-y-auto">
            {entries.slice(-10).map((entry, index) => (
              <div key={index} className="mb-2">
                Date: {entry.date}, Participant: {entry.participant_id}, Steps: {entry.steps}, Calories: {entry.calories_burned}
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-red-700 dark:text-red-300">Participants:</h3>
          <div className="text-xs text-red-600 dark:text-red-400">
            {participants.map((participant, index) => (
              <div key={index}>
                ID: {participant.id}, Name: {participant.user_id}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DebugInfo;