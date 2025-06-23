import React from 'react';

export interface Participant {
  id: string | number;
  user_id: string;
  start_date?: string | null;
  start_weight?: number | null;
}

interface ParticipantSelectorProps {
  participants: Participant[];
  currentParticipant: Participant | null;
  setCurrentParticipant: (participant: Participant) => void;
}

const ParticipantSelector: React.FC<ParticipantSelectorProps> = ({
  participants,
  currentParticipant,
  setCurrentParticipant
}) => (
  <div className="mb-6 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">
      Select Participant
    </h3>
    <div className="flex flex-wrap gap-3">
      {participants.map((participant) => (
        <button
          key={participant.id}
          onClick={() => setCurrentParticipant(participant)}
          className={`py-2 px-5 rounded-full text-sm font-semibold transition-colors ${
            currentParticipant?.id === participant.id
              ? 'bg-indigo-600 text-white shadow'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          {participant.user_id}
        </button>
      ))}
    </div>
  </div>
);

export default ParticipantSelector;
