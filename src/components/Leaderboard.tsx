import React, { useState } from 'react';
import { DayEntry } from './EntriesTable';
import { Participant } from './ParticipantSelector';

interface LeaderboardProps {
  entries: DayEntry[];
  participants: Participant[];
}

interface LeaderboardEntry {
  participant: Participant;
  total: number;
  rank: number;
}

type MetricType = 'steps' | 'calories';
type TimePeriodType = 'week' | 'alltime';

const Leaderboard: React.FC<LeaderboardProps> = ({ entries, participants }) => {
  const [selectedMetric, setSelectedMetric] = useState<MetricType>('steps');
  const [selectedTimePeriod, setSelectedTimePeriod] = useState<TimePeriodType>('week');

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

  // Calculate totals based on selected time period
  const calculateTotals = (): LeaderboardEntry[] => {
    let filteredEntries = entries;
    
    // Filter entries based on time period
    if (selectedTimePeriod === 'week') {
      const { monday, sunday } = getCurrentWeekRange();
      filteredEntries = entries.filter(entry => {
        const entryDate = new Date(entry.date);
        return entryDate >= monday && entryDate <= sunday;
      });
    }
    // For 'alltime', we use all entries without filtering

    // Group by participant and sum the selected metric
    const participantTotals = new Map<string, number>();
    
    filteredEntries.forEach((entry: DayEntry) => {
      const participantId = String(entry.participant_id);
      const currentTotal = participantTotals.get(participantId) || 0;
      const valueToAdd = selectedMetric === 'steps' ? entry.steps : entry.calories_burned;
      participantTotals.set(participantId, currentTotal + valueToAdd);
    });

    // Create leaderboard entries
    const leaderboardEntries: LeaderboardEntry[] = [];
    
    participants.forEach((participant: Participant) => {
      const total = participantTotals.get(String(participant.id)) || 0;
      leaderboardEntries.push({
        participant,
        total,
        rank: 0 // Will be set after sorting
      });
    });

    // Sort by total (descending) and assign ranks
    leaderboardEntries.sort((a, b) => b.total - a.total);
    
    // Assign ranks (handle ties)
    let currentRank = 1;
    leaderboardEntries.forEach((entry, index) => {
      if (index > 0 && entry.total < leaderboardEntries[index - 1].total) {
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
    return selectedMetric === 'steps' ? "🏃" : "🔥";
  };

  // Get metric-specific styling and labels
  const getMetricInfo = () => {
    if (selectedMetric === 'steps') {
      return {
        title: `🏆 Steps Leaderboard`,
        color: 'sky',
        colorClass: 'text-sky-600 dark:text-sky-400',
        unit: 'steps'
      };
    } else {
      return {
        title: `🏆 Calories Leaderboard`,
        color: 'orange',
        colorClass: 'text-orange-600 dark:text-orange-400',
        unit: 'calories'
      };
    }
  };

  // Get time period info
  const getTimePeriodInfo = () => {
    if (selectedTimePeriod === 'week') {
      const { monday, sunday } = getCurrentWeekRange();
      const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
      const mondayStr = monday.toLocaleDateString('en-US', options);
      const sundayStr = sunday.toLocaleDateString('en-US', options);
      return {
        label: `Week of ${mondayStr} - ${sundayStr}`,
        totalLabel: `Total ${selectedMetric === 'steps' ? 'Steps' : 'Calories'} This Week`,
        averageLabel: `Average ${selectedMetric === 'steps' ? 'Steps' : 'Calories'}`,
        highestLabel: 'Highest This Week',
        entryLabel: selectedTimePeriod === 'week' ? 'Weekly total' : 'All-time total'
      };
    } else {
      return {
        label: 'All Time',
        totalLabel: `Total ${selectedMetric === 'steps' ? 'Steps' : 'Calories'} All Time`,
        averageLabel: `Average ${selectedMetric === 'steps' ? 'Steps' : 'Calories'}`,
        highestLabel: 'Highest All Time',
        entryLabel: 'All-time total'
      };
    }
  };

  const leaderboardData = calculateTotals();
  const metricInfo = getMetricInfo();
  const timePeriodInfo = getTimePeriodInfo();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {metricInfo.title}
        </h2>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {timePeriodInfo.label}
        </div>
      </div>

      {/* Time Period and Metric Toggle buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
        {/* Time Period Selector */}
        <div className="bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
          <button
            onClick={() => setSelectedTimePeriod('week')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              selectedTimePeriod === 'week'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'
            }`}
          >
            📅 This Week
          </button>
          <button
            onClick={() => setSelectedTimePeriod('alltime')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              selectedTimePeriod === 'alltime'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'
            }`}
          >
            🏆 All Time
          </button>
        </div>

        {/* Metric Selector */}
        <div className="bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
          <button
            onClick={() => setSelectedMetric('steps')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              selectedMetric === 'steps'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'
            }`}
          >
            🏃 Steps
          </button>
          <button
            onClick={() => setSelectedMetric('calories')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              selectedMetric === 'calories'
                ? 'bg-orange-600 text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'
            }`}
          >
            🔥 Calories
          </button>
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
                    {timePeriodInfo.entryLabel}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <div className={`text-2xl font-bold ${metricInfo.colorClass}`}>
                    {formatNumber(entry.total)}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {metricInfo.unit}
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
            <div className={`${selectedMetric === 'steps' ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-orange-50 dark:bg-orange-900/20'} p-3 rounded-lg`}>
              <div className={`text-2xl font-bold ${selectedMetric === 'steps' ? 'text-blue-600 dark:text-blue-400' : 'text-orange-600 dark:text-orange-400'}`}>
                {formatNumber(leaderboardData.reduce((sum, entry) => sum + entry.total, 0))}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {timePeriodInfo.totalLabel}
              </div>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {leaderboardData.length > 0 ? formatNumber(Math.round(leaderboardData.reduce((sum, entry) => sum + entry.total, 0) / leaderboardData.length)) : 0}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {timePeriodInfo.averageLabel}
              </div>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {leaderboardData.length > 0 ? formatNumber(Math.max(...leaderboardData.map(entry => entry.total))) : 0}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {timePeriodInfo.highestLabel}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;