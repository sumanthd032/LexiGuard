import React from 'react';
import Header from './components/Header';
import UploadZone from './components/UploadZone';
import AnalysisPanel from './components/AnalysisPanel';

function App() {

  // This function will handle the file upload to the backend
  const handleFileUpload = async (file: File) => {
    console.log('File selected:', file.name);
    
    // Create a FormData object to send the file
    const formData = new FormData();
    formData.append('file', file);

    try {
      // We will make the API call here in a future step
      console.log('Preparing to send file to backend...');
      // For now, let's just log it. The actual fetch call will be added
      // once the user clicks "Analyze" in a later phase.
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <div className="min-h-screen bg-brand-gray">
      <Header />
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[calc(100vh-12rem)]">
          {/* Left Panel: Upload */}
          <div className="h-full">
            <UploadZone onFileAccepted={handleFileUpload} />
          </div>

          {/* Right Panel: Analysis */}
          <div className="h-full">
            <AnalysisPanel />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;