/**
 * @file PersonaSelector.tsx
 * @description A component that allows the user to select a "persona" to tailor the AI's analysis to a specific context.
 */

import React from 'react';
import { UserIcon, BuildingOffice2Icon, AcademicCapIcon, UserGroupIcon } from '@heroicons/react/24/outline';

// An array of available persona objects, each with a name and a corresponding icon.
export const personas = [
  { name: 'General User', icon: <UserIcon className="h-6 w-6 mb-1" /> },
  { name: 'Student', icon: <AcademicCapIcon className="h-6 w-6 mb-1" /> },
  { name: 'Small Business', icon: <BuildingOffice2Icon className="h-6 w-6 mb-1" /> },
  { name: 'Senior Citizen', icon: <UserGroupIcon className="h-6 w-6 mb-1" /> },
];

/**
 * @interface PersonaSelectorProps
 * @description Defines the props for the PersonaSelector component.
 */
interface PersonaSelectorProps {
  // The currently selected persona's name.
  selectedPersona: string;
  // A callback function that is triggered when the user clicks a persona button.
  onPersonaChange: (persona: string) => void;
}

/**
 * A UI component that displays a set of buttons for a user to select a persona.
 * The selected persona is highlighted visually.
 * @param {PersonaSelectorProps} props - The props for the component.
 */
const PersonaSelector: React.FC<PersonaSelectorProps> = ({ selectedPersona, onPersonaChange }) => {
  return (
    <div className="w-full text-left my-6">
      <label className="block text-sm font-medium text-brand-text mb-2">
        Analyze as a...
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Map over the personas array to create a button for each one. */}
        {personas.map((persona) => (
          <button
            key={persona.name}
            onClick={() => onPersonaChange(persona.name)}
            className={`flex flex-col items-center justify-center p-3 border rounded-lg text-sm font-semibold transition-all duration-200
              ${selectedPersona === persona.name
                // Apply distinct styles if this persona is the currently selected one.
                ? 'bg-brand-green text-white border-brand-green shadow-md'
                // Default styles for unselected personas with a hover effect.
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