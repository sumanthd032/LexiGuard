import React from 'react';
import { DocumentArrowUpIcon, XCircleIcon, SparklesIcon, DocumentTextIcon } from '@heroicons/react/24/solid';
import PersonaSelector from './PersonaSelector';
import LanguageSelector from './LanguageSelector';
import { motion } from 'framer-motion';


interface UploadZoneProps {
  uploadedFile: File | null;
  onFileSelect: (file: File | null) => void;
  onAnalyze: () => void;
  isLoading: boolean;
  error: string | null;
  persona: string;
  onPersonaChange: (persona: string) => void;
  language: string;
  onLanguageChange: (language: string) => void;
}

const UploadZone: React.FC<UploadZoneProps> = ({ 
  uploadedFile, 
  onFileSelect, 
  onAnalyze, 
  isLoading, 
  error, 
  persona, 
  onPersonaChange,
  language,
  onLanguageChange
}) => {
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
        {!uploadedFile ? (
          <>
            <h3 className="text-2xl font-bold text-brand-blue font-display mb-2">Upload Your Document</h3>
            <p className="text-brand-text mb-6">Drag & drop or click to select a file.</p>
            <label htmlFor="file-upload" className="w-full h-48 border-2 border-dashed rounded-lg flex flex-col justify-center items-center cursor-pointer transition-colors border-gray-300 hover:border-brand-green hover:bg-green-50">
              <DocumentArrowUpIcon className="h-12 w-12 text-gray-400 mb-2" />
              <p className="text-lg font-semibold text-brand-blue">Click to upload</p>
              <p className="text-sm text-gray-500 mt-1">PDF, DOCX, PNG, or JPG</p>
              <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={(e) => e.target.files && onFileSelect(e.target.files[0])} />
            </label>
          </>
        ) : (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-left">
            <div className="bg-green-50 border border-green-200 p-4 rounded-lg flex items-center justify-between mb-4">
              <div className="flex items-center min-w-0">
                  <DocumentTextIcon className="h-6 w-6 text-green-700 flex-shrink-0"/>
                  <p className="text-green-800 font-medium truncate ml-3">{uploadedFile.name}</p>
              </div>
              <button onClick={removeFile} className="ml-4 text-gray-500 hover:text-danger">
                <XCircleIcon className="h-6 w-6" />
              </button>
            </div>
            
            <PersonaSelector selectedPersona={persona} onPersonaChange={onPersonaChange} />
            
            <LanguageSelector selectedLanguage={language} onLanguageChange={onLanguageChange} />

            <button
              onClick={onAnalyze}
              disabled={isLoading}
              className="w-full mt-4 bg-brand-green hover:bg-opacity-90 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center transition-all disabled:bg-gray-400 disabled:cursor-not-allowed text-lg shadow-lg hover:shadow-xl"
            >
              {isLoading ? (
                 <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" viewBox="0 0 24 24">
                    {/* SVG content */}
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
        {error && <p className="mt-4 text-sm text-danger text-left">{error}</p>}
      </div>
    </motion.div>
  );
};

export default UploadZone;