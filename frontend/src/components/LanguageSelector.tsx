/**
 * @file LanguageSelector.tsx
 * @description A simple dropdown component that allows users to select a language for their analysis report.
 */

import React from 'react';

// A predefined list of supported languages for the analysis.
const languages = [
  'English', 'Hindi', 'Spanish', 'French', 'German', 'Tamil', 'Telugu', 'Mandarin'
];

/**
 * @interface LanguageSelectorProps
 * @description Defines the props for the LanguageSelector component.
 */
interface LanguageSelectorProps {
  // The currently selected language.
  selectedLanguage: string;
  // A callback function that is triggered when the user selects a new language.
  onLanguageChange: (language: string) => void;
}

/**
 * A reusable dropdown component for selecting a language.
 * @param {LanguageSelectorProps} props - The props for the component.
 */
const LanguageSelector: React.FC<LanguageSelectorProps> = ({ selectedLanguage, onLanguageChange }) => {
  return (
    <div className="w-full my-6">
      <label htmlFor="language" className="block text-sm font-medium text-brand-text">
        Analysis Language
      </label>
      <select
        id="language"
        name="language"
        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-brand-green focus:border-brand-green sm:text-sm rounded-md"
        value={selectedLanguage}
        onChange={(e) => onLanguageChange(e.target.value)}
      >
        {/* Map over the languages array to create an <option> for each one. */}
        {languages.map((lang) => (
          <option key={lang}>{lang}</option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSelector;