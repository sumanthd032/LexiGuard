import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { DocumentTextIcon, ClockIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

interface AnalysisHistoryItem {
  file_name: string;
}

const HistoryPanel: React.FC = () => {
  const [history, setHistory] = useState<AnalysisHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchHistory = async () => {
      if (!user) return;
      try {
        const token = await user.getIdToken();
        const response = await fetch("http://127.0.0.1:8000/api/analyses", {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setHistory(data);
        }
      } catch (error) {
        console.error("Failed to fetch history:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [user]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg h-full flex flex-col">
      <h3 className="text-2xl font-bold text-brand-blue font-display mb-4">Analysis History</h3>
      {loading ? (
        <p className="text-brand-text">Loading history...</p>
      ) : history.length === 0 ? (
        <div className="flex-grow flex flex-col items-center justify-center text-center">
          <DocumentTextIcon className="h-16 w-16 text-gray-300 mb-4" />
          <p className="text-brand-text font-semibold">No history found</p>
          <p className="text-sm text-gray-500">Your saved analyses will appear here.</p>
        </div>
      ) : (
        <div className="overflow-y-auto space-y-3 pr-2">
          {history.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="p-4 border border-gray-200 rounded-lg hover:bg-brand-gray hover:border-brand-green cursor-pointer"
            >
              <p className="font-semibold text-brand-blue truncate">{item.file_name}</p>
              <div className="flex items-center text-xs text-gray-500 mt-1">
                <ClockIcon className="h-4 w-4 mr-1.5" />
                <span>Analyzed on Sept 17, 2025</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryPanel;