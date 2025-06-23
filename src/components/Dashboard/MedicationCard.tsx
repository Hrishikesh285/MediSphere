import { useState } from 'react';
import { Medication } from '../../context/MedicationContext';
import { Check, Clock, Pill } from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

interface MedicationCardProps {
  medication: Medication;
  onTake: (doseId: string) => void;
  onSnooze: (doseId: string) => void;
}

const MedicationCard = ({ medication, onTake, onSnooze }: MedicationCardProps) => {
  const [showSnoozeOptions, setShowSnoozeOptions] = useState(false);
  const [snoozeDuration, setSnoozeDuration] = useState(15);

  const todaySchedule = medication.schedule.times.map(time => {
    const [hours, minutes] = time.split(':');
    const scheduledTime = new Date();
    scheduledTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
  
    const existingDose = medication.history.find(dose => 
      new Date(dose.scheduledTime).toDateString() === new Date().toDateString() &&
      format(new Date(dose.scheduledTime), 'HH:mm') === time
    );
    
    return {
      id: existingDose?.id || `temp-${medication.id}-${time}`,
      time: scheduledTime,
      timeStr: time,
      taken: existingDose?.status === 'taken',
      status: existingDose?.status || 'upcoming'
    };
  });
  
  const getPillCountColor = () => {
    const percentage = (medication.pillsLeft / medication.totalPills) * 100;
    if (percentage <= 20) return 'text-error-600';
    if (percentage <= 40) return 'text-warning-600';
    return 'text-gray-700';
  };

  return (
    <div className="px-6 py-4">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          {medication.image ? (
            <img 
              src={medication.image} 
              alt={medication.name} 
              className="h-12 w-12 rounded-md object-cover"
            />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary-100">
              <Pill className="h-6 w-6 text-primary-600" />
            </div>
          )}
        </div>
        <div className="ml-4 flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-base font-medium text-gray-900">{medication.name}</h3>
              <p className="text-sm text-gray-500">{medication.dosage}</p>
            </div>
            <p className={`text-sm font-medium ${getPillCountColor()}`}>
              {medication.pillsLeft} pills left
            </p>
          </div>
          <div className="mt-2">
            <div className="flex flex-wrap gap-2">
              {todaySchedule.map((dose, index) => (
                <div 
                  key={index} 
                  className={`flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                    dose.taken ? 'bg-success-100 text-success-800' : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {dose.taken ? (
                    <Check className="mr-1 h-3 w-3" />
                  ) : (
                    <Clock className="mr-1 h-3 w-3" />
                  )}
                  {format(dose.time, 'h:mm a')}
                </div>
              ))}
            </div>
          </div>
          <div className="mt-3 flex">
            {todaySchedule.map((dose, index) => (
              !dose.taken && (
                <div key={index} className="mr-2">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onTake(dose.id)}
                    className="mr-2 rounded-md bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700 hover:bg-primary-100"
                  >
                    Take {format(dose.time, 'h:mm a')} dose
                  </motion.button>
                  <div className="relative inline-block">
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowSnoozeOptions(!showSnoozeOptions)}
                      className="rounded-md bg-gray-50 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-100"
                    >
                      Snooze
                    </motion.button>
                    {showSnoozeOptions && (
                      <div className="absolute right-0 mt-1 w-32 rounded-md border border-gray-200 bg-white shadow-lg">
                        <div className="py-1">
                          {[5, 15, 30, 60].map((duration) => (
                            <button
                              key={duration}
                              className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                              onClick={() => {
                                setSnoozeDuration(duration);
                                onSnooze(dose.id);
                                setShowSnoozeOptions(false);
                              }}
                            >
                              {duration} minutes
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicationCard;
