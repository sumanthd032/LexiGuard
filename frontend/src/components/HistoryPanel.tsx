/**
 * @file HistoryPanel.tsx
 * @description This component renders a sidebar panel that displays a list of the user's previously saved document analyses, sorted by date.
 */

import React from 'react';
import { motion } from 'framer-motion';
import type { AnalysisResult } from '../types';
import { DocumentTextIcon, ExclamationTriangleIcon, ShieldExclamationIcon } from '@heroicons/react/24/outline';

/**
 * @interface AnalysisHistoryItem
 * @description Defines the structure of a single saved analysis item.
 */
interface AnalysisHistoryItem {
  file_name: string;
  timestamp: string;
  analysis_data: AnalysisResult;
}

/**
 * @interface HistoryPanelProps
 * @description Defines the props for the HistoryPanel component.
 */
interface HistoryPanelProps {
  history: AnalysisHistoryItem[];
  loading: boolean;
}

/**
 * A helper function to calculate the "Legal Wellness Score" from analysis data.
 * @param {AnalysisResult | undefined} analysis_data - The analysis result object.
 * @returns {number} The calculated score from 0 to 100.
 */
const calculateScore = (analysis_data: AnalysisResult | undefined): number => {
    if (!analysis_data || !analysis_data.clauses) return 0;
    const criticalCount = analysis_data.clauses.filter(c => c.risk_level === 'Critical').length;
    const attentionCount = analysis_data.clauses.filter(c => c.risk_level === 'Attention').length;
    // The score starts at 100 and is penalized for critical and attention-worthy clauses.
    return Math.max(0, 100 - (criticalCount * 10) - (attentionCount * 3));
};

/**
 * Renders the user's analysis history in a side panel.
 * It handles loading states and displays a message if the history is empty.
 * @param {HistoryPanelProps} props - The component props.
 */
const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, loading }) => {
  return (
    <div className="h-full flex flex-col">
       <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">My Analyses</h3>
      
      {/* Conditional rendering based on loading and history state */}
      {loading ? <p className="text-brand-text text-sm px-3">Loading...</p> : 
       history.length === 0 ? (
        // Displayed when the user has no saved analyses.
        <div className="text-center text-gray-400 mt-10 px-3">
          <DocumentTextIcon className="h-12 w-12 mx-auto mb-2" />
          <p className="text-sm font-medium">No saved analyses.</p>
          <p className="text-xs mt-1">Your analyzed documents will appear here for future reference.</p>
        </div>
      ) : (
        // Renders the list of history items.
        <div className="overflow-y-auto space-y-2">
          {/* Sort history to show the most recent items first before mapping */}
          {history.sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).map((item, index) => {
            // Calculate metrics for display
            const score = calculateScore(item.analysis_data);
            const criticalCount = item.analysis_data.clauses.filter(c => c.risk_level === 'Critical').length;
            const attentionCount = item.analysis_data.clauses.filter(c => c.risk_level === 'Attention').length;
            
            // Determine the color for the score based on its value
            let scoreColor = 'text-green-600';
            if (score < 50) scoreColor = 'text-red-600';
            else if (score < 80) scoreColor = 'text-yellow-600';

            return (
                <motion.div
                  key={index}
                  // Staggered animation for each item in the list
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
                        {/* Container for risk-level counts */}
                        <div className="flex items-center space-x-3 text-xs text-gray-500">
                           {/* Conditionally render critical count if greater than 0 */}
                           {criticalCount > 0 && (
                             <div className="flex items-center" title={`${criticalCount} Critical Clauses`}>
                                <ShieldExclamationIcon className="h-4 w-4 text-red-500" />
                                <span className="ml-1 font-medium text-red-600">{criticalCount}</span>
                             </div>
                           )}
                           {/* Conditionally render attention count if greater than 0 */}
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