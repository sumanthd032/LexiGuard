import React from 'react';
import { UserIcon, BuildingOffice2Icon, AcademicCapIcon, UserGroupIcon } from '@heroicons/react/24/outline';

export const personas = [
  { name: 'General User', icon: <UserIcon className="h-6 w-6 mb-1" /> },
  { name: 'Student', icon: <AcademicCapIcon className="h-6 w-6 mb-1" /> },
  { name: 'Small Business', icon: <BuildingOffice2Icon className="h-6 w-6 mb-1" /> },
  { name: 'Senior Citizen', icon: <UserGroupIcon className="h-6 w-6 mb-1" /> },
];

interface PersonaSelectorProps {
  selectedPersona: string;
  onPersonaChange: (persona: string) => void;
}

const PersonaSelector: React.FC<PersonaSelectorProps> = ({ selectedPersona, onPersonaChange }) => {
  return (
    <div className="w-full text-left my-6">
      <label className="block text-sm font-medium text-brand-text mb-2">
        Analyze as a...
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {personas.map((persona) => (
          <button
            key={persona.name}
            onClick={() => onPersonaChange(persona.name)}
            className={`flex flex-col items-center justify-center p-3 border rounded-lg text-sm font-semibold transition-all duration-200
              ${selectedPersona === persona.name
                ? 'bg-brand-green text-white border-brand-green shadow-md'
                : 'bg-white text-brand-text border-gray-300 hover:border-brand-blue hover:text-brand-blue'
              }`}
          >
            {persona.icon}
            {persona.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PersonaSelector;