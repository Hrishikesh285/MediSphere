import { useState } from 'react';
import { useMedication } from '../../hooks/useMedication';
import { motion } from 'framer-motion';
import { Activity, Brain, ArrowDown, ArrowUp, Calendar, Clock, AlertTriangle } from 'lucide-react';

import AdherenceChart from './AdherenceChart';
import AdherenceSuggestions from './AdherenceSuggestions';
import MedicationTrendChart from './MedicationTrendChart';

const AIAnalysis = () => {
  const { medications, getMedicationAdherence } = useMedication();
  const [timeRange, setTimeRange] = useState('month');
  
  const adherenceScore = getMedicationAdherence();
  
  // Mock data for adherence over time
  const adherenceTrend = {
    month: [85, 92, 78, 88, 95, 90, 85, 82, 88, 92, 95, 96, 95, 90, 92, 88, 89, 92, 95, 90, 92, 94, 95, 88, 87, 89, 92, 95, 94, 92],
    week: [88, 92, 95, 90, 92, 94, 95],
    day: [95, 92, 90, 92]
  };
  
  // Generate suggestions based on adherence
  const getSuggestions = () => {
    if (adherenceScore >= 90) {
      return [
        "You're doing great! Keep up the excellent medication adherence.",
        "Consider setting up a backup reminder system for emergencies.",
        "Share your success with your healthcare provider at your next visit."
      ];
    } else if (adherenceScore >= 70) {
      return [
        "Try setting alarms at the same times every day to build a routine.",
        "Use a pill organizer to help track which medications you've taken.",
        "Consider setting reminders on your mobile device.",
        "Pair medication taking with an existing daily habit like brushing teeth."
      ];
    } else {
      return [
        "Your medication adherence needs improvement. Let's work on a plan.",
        "Set multiple reminders throughout the day for your medications.",
        "Place your medications somewhere visible as a visual cue.",
        "Use a pill organizer to help track your doses.",
        "Consider discussing simplified medication regimens with your doctor."
      ];
    }
  };
  
  // Get adherence status and color
  const getAdherenceStatus = () => {
    if (adherenceScore >= 90) {
      return {
        label: 'Excellent',
        color: 'text-success-600',
        bgColor: 'bg-success-100',
        icon: <Activity className="h-5 w-5 text-success-600" />
      };
    } else if (adherenceScore >= 70) {
      return {
        label: 'Good',
        color: 'text-warning-600',
        bgColor: 'bg-warning-100',
        icon: <Activity className="h-5 w-5 text-warning-600" />
      };
    } else {
      return {
        label: 'Needs Improvement',
        color: 'text-error-600',
        bgColor: 'bg-error-100',
        icon: <AlertTriangle className="h-5 w-5 text-error-600" />
      };
    }
  };
  
  const adherenceStatus = getAdherenceStatus();
  const suggestions = getSuggestions();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={item} className="flex flex-col justify-between space-y-4 sm:flex-row sm:items-center sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">AI Analysis</h1>
          <p className="mt-2 text-sm text-gray-600">
            Insights and suggestions to improve your medication management
          </p>
        </div>
      </motion.div>
      
      {/* Adherence score card */}
      <motion.div variants={item} className="card overflow-hidden">
        <div className="bg-gradient-to-r from-primary-600 to-primary-800 px-6 py-5 sm:px-8">
          <div className="flex flex-col justify-between sm:flex-row sm:items-center">
            <div>
              <h2 className="text-xl font-bold text-white">Medication Adherence Score</h2>
              <p className="mt-1 text-primary-100">
                Based on your historical medication data
              </p>
            </div>
            <div className="mt-4 flex items-center rounded-full bg-white/10 px-4 py-2 sm:mt-0">
              <Brain className="h-5 w-5 text-white" />
              <span className="ml-2 text-sm font-medium text-white">AI Powered Analysis</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 divide-y divide-gray-200 sm:divide-y-0 sm:divide-x sm:grid-cols-3">
          <div className="p-6 sm:p-8">
            <h3 className="text-base font-medium text-gray-900">Current Adherence</h3>
            <div className="mt-4 flex items-center">
              <div className="relative h-32 w-32">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className={`text-3xl font-bold ${adherenceStatus.color}`}>{adherenceScore}%</span>
                </div>
                <AdherenceChart percentage={adherenceScore} />
              </div>
              <div className="ml-4">
                <div className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${adherenceStatus.bgColor} ${adherenceStatus.color}`}>
                  {adherenceStatus.icon}
                  <span className="ml-1">{adherenceStatus.label}</span>
                </div>
                <p className="mt-2 text-sm text-gray-600">
                  {adherenceScore >= 90 
                    ? 'Keep up the great work!' 
                    : adherenceScore >= 70 
                      ? 'Room for improvement' 
                      : 'Significant improvement needed'}
                </p>
              </div>
            </div>
          </div>
          
          <div className="p-6 sm:p-8">
            <h3 className="text-base font-medium text-gray-900">Adherence Trend</h3>
            <div className="mt-4">
              <div className="flex items-center space-x-2">
                <button 
                  className={`rounded-md px-3 py-1 text-xs font-medium ${
                    timeRange === 'day' ? 'bg-primary-100 text-primary-800' : 'bg-gray-100 text-gray-700'
                  }`}
                  onClick={() => setTimeRange('day')}
                >
                  Day
                </button>
                <button 
                  className={`rounded-md px-3 py-1 text-xs font-medium ${
                    timeRange === 'week' ? 'bg-primary-100 text-primary-800' : 'bg-gray-100 text-gray-700'
                  }`}
                  onClick={() => setTimeRange('week')}
                >
                  Week
                </button>
                <button 
                  className={`rounded-md px-3 py-1 text-xs font-medium ${
                    timeRange === 'month' ? 'bg-primary-100 text-primary-800' : 'bg-gray-100 text-gray-700'
                  }`}
                  onClick={() => setTimeRange('month')}
                >
                  Month
                </button>
              </div>
              <div className="mt-3 h-40">
                <MedicationTrendChart data={adherenceTrend[timeRange as keyof typeof adherenceTrend]} timeRange={timeRange} />
              </div>
            </div>
          </div>
          
          <div className="p-6 sm:p-8">
            <h3 className="text-base font-medium text-gray-900">Key Insights</h3>
            <div className="mt-4 space-y-3">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  {adherenceScore > 80 ? (
                    <ArrowUp className="h-5 w-5 text-success-500" />
                  ) : (
                    <ArrowDown className="h-5 w-5 text-error-500" />
                  )}
                </div>
                <div className="ml-3">
                  <p className="text-sm text-gray-600">
                    {adherenceScore > 80 
                      ? 'Your adherence is above average compared to patients with similar conditions.'
                      : 'Your adherence is below average compared to patients with similar conditions.'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <Clock className="h-5 w-5 text-gray-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-gray-600">
                    You're most consistent with morning medications and least consistent with evening doses.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-gray-600">
                    Weekends show a 15% drop in adherence compared to weekdays.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* AI Suggestions */}
      <motion.div variants={item}>
        <AdherenceSuggestions suggestions={suggestions} adherenceScore={adherenceScore} />
      </motion.div>
      
      {/* Medication-specific analysis */}
      <motion.div variants={item} className="card">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-medium text-gray-900">Medication-Specific Analysis</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {medications.map((medication) => {
            // Generate a random adherence score for each medication for demo purposes
            const medAdherence = Math.floor(Math.random() * (100 - 60) + 60);
            const adherenceColor = 
              medAdherence >= 90 ? 'text-success-600' : 
              medAdherence >= 70 ? 'text-warning-600' : 
              'text-error-600';
            
            return (
              <div key={medication.id} className="p-6">
                <div className="flex items-start">
                  <div className="flex-1">
                    <div className="flex items-center">
                      <h3 className="text-base font-medium text-gray-900">{medication.name}</h3>
                      <span className={`ml-2 ${adherenceColor} font-medium`}>{medAdherence}%</span>
                    </div>
                    <p className="text-sm text-gray-500">{medication.dosage}</p>
                    
                    <div className="mt-2">
                      <div className="h-2 w-full rounded-full bg-gray-200">
                        <div 
                          className={`h-2 rounded-full ${
                            medAdherence >= 90 ? 'bg-success-500' : 
                            medAdherence >= 70 ? 'bg-warning-500' : 
                            'bg-error-500'
                          }`}
                          style={{ width: `${medAdherence}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <p className="text-sm text-gray-600">
                        {medAdherence >= 90 
                          ? "You\'re consistently taking this medication as prescribed." 
                          : medAdherence >= 70 
                            ? "You occasionally miss doses of this medication." 
                            : "You frequently miss doses of this medication."}
                      </p>
                      
                      {medAdherence < 70 && (
                        <div className="mt-2 rounded-md bg-primary-50 p-3">
                          <div className="flex">
                            <div className="flex-shrink-0">
                              <Brain className="h-5 w-5 text-primary-500" />
                            </div>
                            <div className="ml-3">
                              <h4 className="text-sm font-medium text-primary-800">AI Suggestion</h4>
                              <p className="mt-1 text-sm text-primary-700">
                                {medication.schedule.times.length > 1 
                                  ? "Consider discussing with your doctor if this medication can be taken once daily instead of multiple times."
                                  : "Try taking this medication at the same time as another medication you take consistently."}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AIAnalysis;