import React from 'react';
import { DocumentArrowUpIcon, XCircleIcon, SparklesIcon } from '@heroicons/react/24/solid';
import PersonaSelector from './PersonaSelector';

interface UploadZoneProps {
  uploadedFile: File | null;
  onFileSelect: (file: File | null) => void;
  onAnalyze: () => void;
  isLoading: boolean;
  error: string | null;
  persona: string;
  onPersonaChange: (persona: string) => void;
}

const UploadZone: React.FC<UploadZoneProps> = ({ uploadedFile, onFileSelect, onAnalyze, isLoading, error, persona, onPersonaChange }) => {
  const removeFile = () => {
    onFileSelect(null);
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg h-full flex flex-col justify-center items-center">
      <div className="w-full text-center">
        <h3 className="text-2xl font-bold text-brand-blue font-display mb-2">Begin Your Analysis</h3>
        <p className="text-brand-text mb-6">Securely upload your document to get started.</p>
        
        {!uploadedFile && (
          <label htmlFor="file-upload" className="w-full h-48 border-2 border-dashed rounded-lg flex flex-col justify-center items-center cursor-pointer transition-colors border-gray-300 hover:border-brand-green hover:bg-green-50">
            <DocumentArrowUpIcon className="h-12 w-12 text-gray-400 mb-2" />
            <p className="text-lg font-semibold text-brand-blue">Click to upload your document</p>
            <p className="text-sm text-gray-500 mt-1">PDF, DOCX, PNG, or JPG</p>
            <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={(e) => e.target.files && onFileSelect(e.target.files[0])} />
          </label>
        )}

        {uploadedFile && (
          <div className="text-left">
            <div className="bg-green-50 border border-green-200 p-4 rounded-lg flex items-center justify-between">
              <p className="text-green-800 font-medium truncate">{uploadedFile.name}</p>
              <button onClick={removeFile} className="ml-4 text-gray-500 hover:text-danger">
                <XCircleIcon className="h-6 w-6" />
              </button>
            </div>
            
            {/* --- PLACE THE NEW COMPONENT HERE --- */}
            <PersonaSelector selectedPersona={persona} onPersonaChange={onPersonaChange} />

            <button
              onClick={onAnalyze}
              disabled={isLoading}
              className="w-full bg-brand-green hover:bg-opacity-90 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                 <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analyzing...
                </>
              ) : (
                <>
                  <SparklesIcon className="h-5 w-5 mr-2" />
                  Analyze Now
                </>
              )}
            </button>
          </div>
        )}
        {error && <p className="mt-4 text-sm text-danger text-left">{error}</p>}
      </div>
    </div>
  );
};

export default UploadZone;