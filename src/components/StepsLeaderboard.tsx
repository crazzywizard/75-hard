import React from 'react';
import { DayEntry } from './EntriesTable';
import { Participant } from './ParticipantSelector';

interface StepsLeaderboardProps {
  entries: DayEntry[];
  participants: Participant[];
}

interface LeaderboardEntry {
  participant: Participant;
  weeklySteps: number;
  rank: number;
}

const StepsLeaderboard: React.FC<StepsLeaderboardProps> = ({ entries, participants }) => {
  // Get the current week's date range (Monday to Sunday)
  const getCurrentWeekRange = () => {
    const now = new Date();
    const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay; // Adjust for Sunday
    
    const monday = new Date(now);
    monday.setDate(now.getDate() + mondayOffset);
    monday.setHours(0, 0, 0, 0);
    
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    sunday.setHours(23, 59, 59, 999);
    
    return { monday, sunday };
  };

  // Filter entries for current week and calculate totals
  const calculateWeeklySteps = (): LeaderboardEntry[] => {
    const { monday, sunday } = getCurrentWeekRange();
    
    // Filter entries for current week
    const weeklyEntries = entries.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate >= monday && entryDate <= sunday;
    });

    // Group by participant and sum steps
    const participantSteps = new Map<string, number>();
    
    weeklyEntries.forEach(entry => {
      const participantId = String(entry.participant_id);
      const currentSteps = participantSteps.get(participantId) || 0;
      participantSteps.set(participantId, currentSteps + entry.steps);
    });

    // Create leaderboard entries
    const leaderboardEntries: LeaderboardEntry[] = [];
    
    participants.forEach(participant => {
      const weeklySteps = participantSteps.get(String(participant.id)) || 0;
      leaderboardEntries.push({
        participant,
        weeklySteps,
        rank: 0 // Will be set after sorting
      });
    });

    // Sort by steps (descending) and assign ranks
    leaderboardEntries.sort((a, b) => b.weeklySteps - a.weeklySteps);
    
    // Assign ranks (handle ties)
    let currentRank = 1;
    leaderboardEntries.forEach((entry, index) => {
      if (index > 0 && entry.weeklySteps < leaderboardEntries[index - 1].weeklySteps) {
        currentRank = index + 1;
      }
      entry.rank = currentRank;
    });

    return leaderboardEntries;
  };

  // Format number with commas
  const formatNumber = (num: number): string => {
    return num.toLocaleString();
  };

  // Get rank badge styling
  const getRankBadge = (rank: number) => {
    if (rank === 1) {
      return "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white";
    } else if (rank === 2) {
      return "bg-gradient-to-r from-gray-300 to-gray-500 text-white";
    } else if (rank === 3) {
      return "bg-gradient-to-r from-amber-600 to-amber-800 text-white";
    } else {
      return "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300";
    }
  };

  // Get rank emoji
  const getRankEmoji = (rank: number) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return "🏃";
  };

  const leaderboardData = calculateWeeklySteps();
  const { monday, sunday } = getCurrentWeekRange();

  // Format date range for display
  const formatDateRange = () => {
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
    const mondayStr = monday.toLocaleDateString('en-US', options);
    const sundayStr = sunday.toLocaleDateString('en-US', options);
    return `${mondayStr} - ${sundayStr}`;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          🏆 Steps Leaderboard
        </h2>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Week of {formatDateRange()}
        </div>
      </div>

      {leaderboardData.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">
            No participants found. Add some participants to see the leaderboard!
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {leaderboardData.map((entry) => (
            <div
              key={entry.participant.id}
              className={`flex items-center justify-between p-4 rounded-lg transition-all duration-200 ${
                entry.rank === 1
                  ? 'bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 border-2 border-yellow-300 dark:border-yellow-600'
                  : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
              }`}
            >
              <div className="flex items-center space-x-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${getRankBadge(entry.rank)}`}>
                  {entry.rank}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {entry.participant.user_id}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Weekly total
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <div className="text-2xl font-bold text-sky-600 dark:text-sky-400">
                    {formatNumber(entry.weeklySteps)}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    steps
                  </div>
                </div>
                <div className="text-2xl">
                  {getRankEmoji(entry.rank)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {leaderboardData.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {formatNumber(leaderboardData.reduce((sum, entry) => sum + entry.weeklySteps, 0))}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Total Steps This Week
              </div>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {leaderboardData.length > 0 ? formatNumber(Math.round(leaderboardData.reduce((sum, entry) => sum + entry.weeklySteps, 0) / leaderboardData.length)) : 0}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Average Steps
              </div>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {leaderboardData.length > 0 ? formatNumber(Math.max(...leaderboardData.map(entry => entry.weeklySteps))) : 0}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Highest This Week
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StepsLeaderboard;