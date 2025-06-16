import { useState } from 'react';
import { Medication } from '../../context/MedicationContext';
import { 
  ChevronDown, 
  ChevronUp, 
  Clock, 
  Calendar, 
  Check, 
  AlertTriangle,
  Pill,
  Edit2,
  Save,
  X,
  Plus,
  Trash
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMedication } from '../../hooks/useMedication';
import { format } from 'date-fns';

interface MedicationScheduleCardProps {
  medication: Medication;
  status: string;
}

const MedicationScheduleCard = ({ medication, status }: MedicationScheduleCardProps) => {
  const [expanded, setExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { markDoseTaken, updateMedication, addToCart } = useMedication();
  
  // Editing state
  const [editedMedication, setEditedMedication] = useState(medication);
  const [newTime, setNewTime] = useState('');
  
  const toggleExpanded = () => {
    setExpanded(!expanded);
  };
  
  const handleMarkAsTaken = (doseId: string) => {
    markDoseTaken(medication.id, doseId);
  };
  
  const handleAddToCart = () => {
    addToCart(medication, 1);
  };

  const handleSave = () => {
    updateMedication(medication.id, editedMedication);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedMedication(medication);
    setIsEditing(false);
  };

  const addScheduleTime = () => {
    if (newTime && !editedMedication.schedule.times.includes(newTime)) {
      setEditedMedication({
        ...editedMedication,
        schedule: {
          ...editedMedication.schedule,
          times: [...editedMedication.schedule.times, newTime].sort()
        }
      });
      setNewTime('');
    }
  };

  const removeScheduleTime = (timeToRemove: string) => {
    setEditedMedication({
      ...editedMedication,
      schedule: {
        ...editedMedication.schedule,
        times: editedMedication.schedule.times.filter(time => time !== timeToRemove)
      }
    });
  };

  const toggleScheduleDay = (day: string) => {
    const days = editedMedication.schedule.days;
    const updatedDays = days.includes(day)
      ? days.filter(d => d !== day)
      : [...days, day];

    setEditedMedication({
      ...editedMedication,
      schedule: {
        ...editedMedication.schedule,
        days: updatedDays
      }
    });
  };
  
  const getStatusBadge = () => {
    switch (status) {
      case 'low':
        return (
          <span className="flex items-center rounded-full bg-error-100 px-2.5 py-0.5 text-xs font-medium text-error-800">
            <AlertTriangle className="mr-1 h-3 w-3" />
            Low stock
          </span>
        );
      case 'taken':
        return (
          <span className="flex items-center rounded-full bg-success-100 px-2.5 py-0.5 text-xs font-medium text-success-800">
            <Check className="mr-1 h-3 w-3" />
            Taken today
          </span>
        );
      case 'upcoming':
        return (
          <span className="flex items-center rounded-full bg-primary-100 px-2.5 py-0.5 text-xs font-medium text-primary-800">
            <Clock className="mr-1 h-3 w-3" />
            Upcoming dose
          </span>
        );
      default:
        return null;
    }
  };
  
  const getPillCountColor = () => {
    const percentage = (medication.pillsLeft / medication.totalPills) * 100;
    if (percentage <= 20) return 'text-error-600';
    if (percentage <= 40) return 'text-warning-600';
    return 'text-gray-700';
  };

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <div className="card overflow-hidden">
      <div 
        className="flex cursor-pointer items-center justify-between p-4"
        onClick={toggleExpanded}
      >
        <div className="flex items-center">
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
          <div className="ml-4">
            <div className="flex items-center">
              <h3 className="text-base font-medium text-gray-900">{medication.name}</h3>
              <div className="ml-2">{getStatusBadge()}</div>
            </div>
            <p className="text-sm text-gray-500">{medication.dosage}</p>
          </div>
        </div>
        <div className="flex items-center">
          <p className={`mr-4 text-sm font-medium ${getPillCountColor()}`}>
            {medication.pillsLeft} / {medication.totalPills}
          </p>
          {expanded ? (
            <ChevronUp className="h-5 w-5 text-gray-400" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-400" />
          )}
        </div>
      </div>
      
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-gray-100 bg-gray-50"
          >
            <div className="p-4">
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="form-label">Name</label>
                    <input
                      type="text"
                      className="form-input"
                      value={editedMedication.name}
                      onChange={(e) => setEditedMedication({
                        ...editedMedication,
                        name: e.target.value
                      })}
                    />
                  </div>

                  <div>
                    <label className="form-label">Dosage</label>
                    <input
                      type="text"
                      className="form-input"
                      value={editedMedication.dosage}
                      onChange={(e) => setEditedMedication({
                        ...editedMedication,
                        dosage: e.target.value
                      })}
                    />
                  </div>

                  <div>
                    <label className="form-label">Instructions</label>
                    <textarea
                      className="form-input"
                      value={editedMedication.instructions}
                      onChange={(e) => setEditedMedication({
                        ...editedMedication,
                        instructions: e.target.value
                      })}
                    />
                  </div>

                  <div>
                    <label className="form-label">Schedule Days</label>
                    <div className="flex flex-wrap gap-2">
                      {daysOfWeek.map((day) => (
                        <button
                          key={day}
                          type="button"
                          onClick={() => toggleScheduleDay(day)}
                          className={`rounded-full px-3 py-1 text-sm font-medium ${
                            editedMedication.schedule.days.includes(day)
                              ? 'bg-primary-100 text-primary-700'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {day.substring(0, 3)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="form-label">Schedule Times</label>
                    <div className="space-y-2">
                      {editedMedication.schedule.times.map((time) => (
                        <div key={time} className="flex items-center space-x-2">
                          <input
                            type="time"
                            className="form-input"
                            value={time}
                            onChange={(e) => {
                              const updatedTimes = editedMedication.schedule.times
                                .filter(t => t !== time)
                                .concat(e.target.value)
                                .sort();
                              setEditedMedication({
                                ...editedMedication,
                                schedule: {
                                  ...editedMedication.schedule,
                                  times: updatedTimes
                                }
                              });
                            }}
                          />
                          <button
                            onClick={() => removeScheduleTime(time)}
                            className="text-error-600 hover:text-error-700"
                          >
                            <Trash className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                      <div className="flex items-center space-x-2">
                        <input
                          type="time"
                          className="form-input"
                          value={newTime}
                          onChange={(e) => setNewTime(e.target.value)}
                        />
                        <button
                          onClick={addScheduleTime}
                          className="text-primary-600 hover:text-primary-700"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={handleCancel}
                      className="btn-outline"
                    >
                      <X className="mr-1 h-4 w-4" />
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      className="btn-primary"
                    >
                      <Save className="mr-1 h-4 w-4" />
                      Save Changes
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="rounded-md bg-white p-3 shadow-sm">
                      <h4 className="mb-2 text-sm font-medium text-gray-700">Schedule</h4>
                      <div className="flex flex-wrap gap-2">
                        {medication.schedule.days.map((day, index) => (
                          <span 
                            key={index} 
                            className="rounded-full bg-primary-50 px-2 py-1 text-xs font-medium text-primary-700"
                          >
                            {day.substring(0, 3)}
                          </span>
                        ))}
                      </div>
                      <div className="mt-2 flex items-center">
                        <Clock className="mr-2 h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {medication.schedule.times.map(time => {
                            const [hours, minutes] = time.split(':');
                            const date = new Date();
                            date.setHours(parseInt(hours), parseInt(minutes));
                            return format(date, 'h:mm a');
                          }).join(', ')}
                        </span>
                      </div>
                    </div>
                    <div className="rounded-md bg-white p-3 shadow-sm">
                      <h4 className="mb-2 text-sm font-medium text-gray-700">Details</h4>
                      <p className="text-sm text-gray-600">{medication.instructions}</p>
                      <div className="mt-2 flex items-center">
                        <Calendar className="mr-2 h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          Last refill: {format(new Date(medication.lastRefill), 'MMM d, yyyy')}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center rounded-md bg-primary-50 px-3 py-1.5 text-xs font-medium text-primary-700 hover:bg-primary-100"
                      >
                        <Edit2 className="mr-1 h-3 w-3" />
                        Edit Schedule
                      </button>
                      <button
                        onClick={() => handleMarkAsTaken('temp-dose-id')}
                        className="flex items-center rounded-md bg-success-50 px-3 py-1.5 text-xs font-medium text-success-700 hover:bg-success-100"
                      >
                        <Check className="mr-1 h-3 w-3" />
                        Mark as taken
                      </button>
                    </div>
                    
                    {medication.pillsLeft <= medication.refillAt && (
                      <button
                        onClick={handleAddToCart}
                        className="flex items-center rounded-md bg-accent-100 px-3 py-1.5 text-xs font-medium text-accent-700 hover:bg-accent-200"
                      >
                        <Pill className="mr-1 h-3 w-3" />
                        Refill now
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MedicationScheduleCard;