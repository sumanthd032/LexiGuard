/**
 * @file UploadZone.tsx
 * @description A multi-stage component for handling file uploads. It allows users to
 * select a file, then configure analysis options (persona and language) before
 * starting the analysis process.
 */

import React from 'react';
import { DocumentArrowUpIcon, XCircleIcon, SparklesIcon, DocumentTextIcon } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';

// --- Local Component Imports ---
import PersonaSelector from './PersonaSelector';
import LanguageSelector from './LanguageSelector';

/**
 * @interface UploadZoneProps
 * @description Defines the props for the UploadZone component.
 */
interface UploadZoneProps {
  uploadedFile: File | null; // The file object that the user has selected, or null.
  onFileSelect: (file: File | null) => void; // Callback when a file is selected or removed.
  onAnalyze: () => void; // Callback to trigger the analysis process.
  isLoading: boolean; // Flag to indicate if the analysis is in progress.
  error: string | null; // An error message to display, if any.
  persona: string; // The currently selected persona for analysis.
  onPersonaChange: (persona: string) => void; // Callback for persona changes.
  language: string; // The currently selected language for analysis.
  onLanguageChange: (language: string) => void; // Callback for language changes.
}

/**
 * A UI component that manages the file upload and analysis configuration steps.
 * It has two primary states: one for prompting a file upload, and another for
 * setting parameters after a file has been selected.
 * @param {UploadZoneProps} props - The props for the component.
 */
const UploadZone: React.FC<UploadZoneProps> = ({
  uploadedFile,
  onFileSelect,
  onAnalyze,
  isLoading,
  error,
  persona,
  onPersonaChange,
  language,
  onLanguageChange,
}) => {
  // A simple handler to clear the currently selected file.
  const removeFile = () => {
    onFileSelect(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white p-6 rounded-lg shadow-lg h-full flex flex-col justify-center"
    >
      <div className="w-full text-center">
        {/* --- Conditional View: No File Uploaded --- */}
        {!uploadedFile ? (
          <>
            <h3 className="text-2xl font-bold text-brand-blue font-display mb-2">Upload Your Document</h3>
            <p className="text-brand-text mb-6">Drag & drop or click to select a file.</p>
            <label
              htmlFor="file-upload"
              className="w-full h-48 border-2 border-dashed rounded-lg flex flex-col justify-center items-center cursor-pointer transition-colors border-gray-300 hover:border-brand-green hover:bg-green-50"
            >
              <DocumentArrowUpIcon className="h-12 w-12 text-gray-400 mb-2" />
              <p className="text-lg font-semibold text-brand-blue">Click to upload</p>
              <p className="text-sm text-gray-500 mt-1">PDF, DOCX, PNG, or JPG</p>
              {/* The actual file input is hidden for styling purposes. */}
              <input
                id="file-upload"
                name="file-upload"
                type="file"
                className="sr-only"
                onChange={(e) => e.target.files && onFileSelect(e.target.files[0])}
              />
            </label>
          </>
        ) : (
          /* --- Conditional View: File is Uploaded --- */
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-left">
            {/* Display the name of the uploaded file with a remove button. */}
            <div className="bg-green-50 border border-green-200 p-4 rounded-lg flex items-center justify-between mb-4">
              <div className="flex items-center min-w-0">
                  <DocumentTextIcon className="h-6 w-6 text-green-700 flex-shrink-0"/>
                  <p className="text-green-800 font-medium truncate ml-3">{uploadedFile.name}</p>
              </div>
              <button onClick={removeFile} className="ml-4 text-gray-500 hover:text-danger">
                <XCircleIcon className="h-6 w-6" />
              </button>
            </div>
            
            {/* Render the child components for setting analysis parameters. */}
            <PersonaSelector selectedPersona={persona} onPersonaChange={onPersonaChange} />
            <LanguageSelector selectedLanguage={language} onLanguageChange={onLanguageChange} />

            {/* The main action button to start the analysis. */}
            <button
              onClick={onAnalyze}
              disabled={isLoading}
              className="w-full mt-4 bg-brand-green hover:bg-opacity-90 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center transition-all disabled:bg-gray-400 disabled:cursor-not-allowed text-lg shadow-lg hover:shadow-xl"
            >
              {/* Show a loading state inside the button when analysis is in progress. */}
              {isLoading ? (
                 <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analyzing...
                </>
              ) : (
                <>
                  <SparklesIcon className="h-6 w-6 mr-2" />
                  Analyze Now
                </>
              )}
            </button>
          </motion.div>
        )}
        
        {/* Display an error message if one exists. */}
        {error && <p className="mt-4 text-sm text-danger text-left">{error}</p>}
      </div>
    </motion.div>
  );
};

export default UploadZone;