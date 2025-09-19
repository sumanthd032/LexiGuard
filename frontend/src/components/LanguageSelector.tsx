import React from 'react';

const languages = [
  'English', 'Hindi', 'Spanish', 'French', 'German', 'Tamil', 'Telugu', 'Mandarin'
];

interface LanguageSelectorProps {
  selectedLanguage: string;
  onLanguageChange: (language: string) => void;
}

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
        {languages.map((lang) => (
          <option key={lang}>{lang}</option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSelector;