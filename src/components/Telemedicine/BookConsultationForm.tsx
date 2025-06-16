import { useState } from 'react';
import { X, Calendar, Clock, User, AlertCircle } from 'lucide-react';
import { useMedication } from '../../hooks/useMedication';
import { motion, AnimatePresence } from 'framer-motion';
import { format, addDays } from 'date-fns';

interface BookConsultationFormProps {
  onClose: () => void;
}

const BookConsultationForm = ({ onClose }: BookConsultationFormProps) => {
  const { addAppointment } = useMedication();
  const [step, setStep] = useState(1);
  const [symptomDescription, setSymptomDescription] = useState('');
  const [urgencyLevel, setUrgencyLevel] = useState('medium');
  const [specialty, setSpecialty] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedDate, setSelectedDate] = useState(format(addDays(new Date(), 1), 'yyyy-MM-dd'));
  const [selectedTime, setSelectedTime] = useState('09:00');
  const [notes, setNotes] = useState('');
  
  // Mock data for doctors
  const doctors = [
    { id: '1', name: 'Dr. Sarah Smith', specialty: 'Cardiology', available: true },
    { id: '2', name: 'Dr. Michael Johnson', specialty: 'Endocrinology', available: true },
    { id: '3', name: 'Dr. Emily Chen', specialty: 'General Practice', available: true },
    { id: '4', name: 'Dr. Robert Wilson', specialty: 'Neurology', available: false },
  ];
  
  // Mock data for specialties
  const specialties = [
    'Cardiology',
    'Endocrinology',
    'General Practice',
    'Neurology',
    'Psychiatry',
    'Dermatology'
  ];
  
  // Mock data for available times
  const availableTimes = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '13:00', '13:30', '14:00', '14:30', '15:00', '15:30'
  ];
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Find the selected doctor
    const doctor = doctors.find(d => d.id === selectedDoctor);
    
    addAppointment({
      doctorName: doctor ? doctor.name : 'TBD',
      specialty: doctor ? doctor.specialty : specialty,
      date: selectedDate,
      time: selectedTime,
      notes: `Symptoms: ${symptomDescription}\nUrgency: ${urgencyLevel}\nAdditional notes: ${notes}`,
      status: 'scheduled'
    });
    
    onClose();
  };
  
  const nextStep = () => {
    setStep(step + 1);
  };
  
  const prevStep = () => {
    setStep(step - 1);
  };
  
  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <label htmlFor="symptom-description" className="form-label">
                Describe your symptoms <span className="text-error-500">*</span>
              </label>
              <textarea
                id="symptom-description"
                rows={4}
                className="form-input"
                placeholder="Please describe your symptoms in detail..."
                value={symptomDescription}
                onChange={(e) => setSymptomDescription(e.target.value)}
                required
              />
            </div>
            
            <div>
              <label className="form-label">
                How urgent is your situation? <span className="text-error-500">*</span>
              </label>
              <div className="mt-2 grid grid-cols-3 gap-2">
                <button
                  type="button"
                  className={`rounded-md px-3 py-2 text-sm font-medium ${
                    urgencyLevel === 'low' 
                      ? 'bg-success-100 text-success-800' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  onClick={() => setUrgencyLevel('low')}
                >
                  Low
                </button>
                <button
                  type="button"
                  className={`rounded-md px-3 py-2 text-sm font-medium ${
                    urgencyLevel === 'medium' 
                      ? 'bg-warning-100 text-warning-800' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  onClick={() => setUrgencyLevel('medium')}
                >
                  Medium
                </button>
                <button
                  type="button"
                  className={`rounded-md px-3 py-2 text-sm font-medium ${
                    urgencyLevel === 'high' 
                      ? 'bg-error-100 text-error-800' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  onClick={() => setUrgencyLevel('high')}
                >
                  High
                </button>
              </div>
            </div>
            
            <div>
              <label htmlFor="specialty" className="form-label">
                Preferred specialty (optional)
              </label>
              <select
                id="specialty"
                className="form-input"
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
              >
                <option value="">Select a specialty</option>
                {specialties.map((spec) => (
                  <option key={spec} value={spec}>
                    {spec}
                  </option>
                ))}
              </select>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <div>
              <label className="form-label">
                Select a doctor <span className="text-error-500">*</span>
              </label>
              <div className="mt-2 space-y-2">
                {doctors
                  .filter(doc => !specialty || doc.specialty === specialty)
                  .map((doctor) => (
                    <button
                      key={doctor.id}
                      type="button"
                      className={`flex w-full items-start rounded-md border p-3 text-left ${
                        selectedDoctor === doctor.id
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-300 hover:bg-gray-50'
                      } ${!doctor.available ? 'cursor-not-allowed opacity-60' : ''}`}
                      onClick={() => doctor.available && setSelectedDoctor(doctor.id)}
                      disabled={!doctor.available}
                    >
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary-100">
                        <User className="h-5 w-5 text-primary-600" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-gray-900">{doctor.name}</h3>
                        <p className="text-xs text-gray-500">{doctor.specialty}</p>
                        {!doctor.available && (
                          <span className="mt-1 inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-800">
                            Unavailable
                          </span>
                        )}
                      </div>
                    </button>
                  ))}
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <div>
              <label htmlFor="date" className="form-label">
                Select a date <span className="text-error-500">*</span>
              </label>
              <div className="mt-1 flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-gray-400" />
                <input
                  type="date"
                  id="date"
                  className="form-input"
                  min={format(addDays(new Date(), 1), 'yyyy-MM-dd')}
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="form-label">
                Select a time <span className="text-error-500">*</span>
              </label>
              <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-4">
                {availableTimes.map((time) => (
                  <button
                    key={time}
                    type="button"
                    className={`rounded-md py-2 text-sm font-medium ${
                      selectedTime === time
                        ? 'bg-primary-100 text-primary-800'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    onClick={() => setSelectedTime(time)}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label htmlFor="notes" className="form-label">
                Additional notes (optional)
              </label>
              <textarea
                id="notes"
                rows={3}
                className="form-input"
                placeholder="Any additional information for the doctor..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black"
          onClick={onClose}
        ></motion.div>
        
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', damping: 25 }}
          className="relative mx-4 w-full max-w-3xl overflow-hidden rounded-lg bg-white shadow-xl"
        >
          <div className="flex items-center justify-between border-b border-gray-200 p-4">
            <h2 className="text-lg font-medium text-gray-900">Book a Consultation</h2>
            <button
              onClick={onClose}
              className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="p-4">
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full ${
                    step >= 1 ? 'bg-primary-600' : 'bg-gray-200'
                  }`}>
                    <span className="text-sm font-medium text-white">1</span>
                  </div>
                  <div className={`ml-2 text-sm font-medium ${
                    step >= 1 ? 'text-gray-900' : 'text-gray-500'
                  }`}>
                    Symptoms
                  </div>
                </div>
                <div className={`h-0.5 w-10 ${step >= 2 ? 'bg-primary-600' : 'bg-gray-200'}`}></div>
                <div className="flex items-center">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full ${
                    step >= 2 ? 'bg-primary-600' : 'bg-gray-200'
                  }`}>
                    <span className="text-sm font-medium text-white">2</span>
                  </div>
                  <div className={`ml-2 text-sm font-medium ${
                    step >= 2 ? 'text-gray-900' : 'text-gray-500'
                  }`}>
                    Doctor
                  </div>
                </div>
                <div className={`h-0.5 w-10 ${step >= 3 ? 'bg-primary-600' : 'bg-gray-200'}`}></div>
                <div className="flex items-center">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full ${
                    step >= 3 ? 'bg-primary-600' : 'bg-gray-200'
                  }`}>
                    <span className="text-sm font-medium text-white">3</span>
                  </div>
                  <div className={`ml-2 text-sm font-medium ${
                    step >= 3 ? 'text-gray-900' : 'text-gray-500'
                  }`}>
                    Schedule
                  </div>
                </div>
              </div>
            </div>
            
            <form onSubmit={handleSubmit}>
              {renderStepContent()}
              
              <div className="mt-6 flex justify-between">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="btn-outline"
                  >
                    Back
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={onClose}
                    className="btn-outline"
                  >
                    Cancel
                  </button>
                )}
                
                {step < 3 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="btn-primary"
                    disabled={step === 1 && !symptomDescription || step === 2 && !selectedDoctor}
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={!selectedDate || !selectedTime}
                  >
                    Book Consultation
                  </button>
                )}
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default BookConsultationForm;