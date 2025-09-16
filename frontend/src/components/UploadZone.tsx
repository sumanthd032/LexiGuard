import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { DocumentArrowUpIcon, XCircleIcon } from '@heroicons/react/24/solid';

interface UploadZoneProps {
  onFileAccepted: (file: File) => void;
}

const UploadZone: React.FC<UploadZoneProps> = ({ onFileAccepted }) => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[], fileRejections: any[]) => {
    setError(null);
    if (fileRejections.length > 0) {
      setError('File type not accepted. Please upload a PDF, DOCX, PNG, or JPG.');
      setUploadedFile(null);
      return;
    }
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setUploadedFile(file);
      onFileAccepted(file); // Pass the file to the parent component
    }
  }, [onFileAccepted]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxFiles: 1,
  });

  const removeFile = () => {
    setUploadedFile(null);
    setError(null);
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg h-full flex flex-col justify-center items-center">
      {!uploadedFile ? (
        <div
          {...getRootProps()}
          className={`w-full h-full border-2 border-dashed rounded-lg flex flex-col justify-center items-center cursor-pointer transition-colors
            ${isDragActive ? 'border-brand-green bg-green-50' : 'border-gray-300 hover:border-brand-green'}`}
        >
          <input {...getInputProps()} />
          <DocumentArrowUpIcon className="h-16 w-16 text-gray-400 mb-4" />
          {isDragActive ? (
            <p className="text-xl font-semibold text-brand-green">Drop the file here...</p>
          ) : (
            <>
              <p className="text-xl font-semibold text-brand-blue">Drag & drop your document here</p>
              <p className="text-brand-text mt-1">or click to browse</p>
              <p className="text-xs text-gray-500 mt-4">Supports: PDF, DOCX, PNG, JPG</p>
            </>
          )}
        </div>
      ) : (
        <div className="w-full text-center">
            <h3 className="text-xl font-semibold text-brand-blue mb-4">Document Ready!</h3>
            <div className="bg-brand-gray p-4 rounded-lg flex items-center justify-between">
                <p className="text-brand-text font-medium truncate">{uploadedFile.name}</p>
                <button onClick={removeFile} className="ml-4 text-gray-500 hover:text-danger">
                    <XCircleIcon className="h-6 w-6" />
                </button>
            </div>
            {/* We will add a "Analyze" button here in the next phase */}
        </div>
      )}
      {error && <p className="mt-4 text-sm text-danger">{error}</p>}
    </div>
  );
};

export default UploadZone;
