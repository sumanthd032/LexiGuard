// frontend/src/components/HistoryPanel.tsx
import React from 'react';
import { motion } from 'framer-motion';
import type { AnalysisResult } from '../types';
import { DocumentTextIcon, ExclamationTriangleIcon, ShieldExclamationIcon } from '@heroicons/react/24/outline';

interface AnalysisHistoryItem {
  file_name: string;
  timestamp: string;
  analysis_data: AnalysisResult;
}

interface HistoryPanelProps {
  history: AnalysisHistoryItem[];
  loading: boolean;
}

const calculateScore = (analysis_data: AnalysisResult | undefined) => {
    if (!analysis_data || !analysis_data.clauses) return 0;
    const criticalCount = analysis_data.clauses.filter(c => c.risk_level === 'Critical').length;
    const attentionCount = analysis_data.clauses.filter(c => c.risk_level === 'Attention').length;
    return Math.max(0, 100 - (criticalCount * 10) - (attentionCount * 3));
};

const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, loading }) => {
  return (
    <div className="h-full flex flex-col">
       <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">My Analyses</h3>
      {loading ? <p className="text-brand-text text-sm px-3">Loading...</p> : 
       history.length === 0 ? (
        <div className="text-center text-gray-400 mt-10 px-3">
          <DocumentTextIcon className="h-12 w-12 mx-auto mb-2" />
          <p className="text-sm font-medium">No saved analyses.</p>
          <p className="text-xs mt-1">Your analyzed documents will appear here for future reference.</p>
        </div>
      ) : (
        <div className="overflow-y-auto space-y-2">
          {history.sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).map((item, index) => {
            const score = calculateScore(item.analysis_data);
            const criticalCount = item.analysis_data.clauses.filter(c => c.risk_level === 'Critical').length;
            const attentionCount = item.analysis_data.clauses.filter(c => c.risk_level === 'Attention').length;
            
            let scoreColor = 'text-green-600';
            if (score < 50) scoreColor = 'text-red-600';
            else if (score < 80) scoreColor = 'text-yellow-600';

            return (
                <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="p-3 border border-transparent rounded-lg hover:bg-brand-gray hover:border-brand-green cursor-pointer"
                >
                    <div className="flex justify-between items-start">
                        <p className="font-semibold text-sm text-brand-blue truncate pr-2">{item.file_name}</p>
                        <p className={`text-lg font-bold font-display ${scoreColor}`}>{score}</p>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center space-x-3 text-xs text-gray-500">
                           {criticalCount > 0 && (
                             <div className="flex items-center" title={`${criticalCount} Critical Clauses`}>
                                <ShieldExclamationIcon className="h-4 w-4 text-red-500" />
                                <span className="ml-1 font-medium text-red-600">{criticalCount}</span>
                             </div>
                           )}
                           {attentionCount > 0 && (
                            <div className="flex items-center" title={`${attentionCount} Clauses Need Attention`}>
                                <ExclamationTriangleIcon className="h-4 w-4 text-yellow-500" />
                                <span className="ml-1 font-medium text-yellow-600">{attentionCount}</span>
                            </div>
                           )}
                        </div>
                    </div>
                </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default HistoryPanel;