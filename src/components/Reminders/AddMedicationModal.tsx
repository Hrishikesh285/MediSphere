import { useState } from 'react';
import { X, Plus, Trash } from 'lucide-react';
import { useMedication } from '../../hooks/useMedication';
import { motion, AnimatePresence } from 'framer-motion';

interface AddMedicationModalProps {
  onClose: () => void;
}

const AddMedicationModal = ({ onClose }: AddMedicationModalProps) => {
  const { addMedication } = useMedication();
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [instructions, setInstructions] = useState('');
  const [pillsLeft, setPillsLeft] = useState('30');
  const [refillAt, setRefillAt] = useState('5');
  const [price, setPrice] = useState('15.99');
  const [prescribedBy, setPrescribedBy] = useState('');
  const [image, setImage] = useState('');
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [times, setTimes] = useState<string[]>(['08:00']);
  
  const daysOfWeek = [
    'Monday', 
    'Tuesday', 
    'Wednesday', 
    'Thursday', 
    'Friday', 
    'Saturday', 
    'Sunday'
  ];
  
  const toggleDay = (day: string) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter(d => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };
  
  const addTimeSlot = () => {
    setTimes([...times, '']);
  };
  
  const removeTimeSlot = (index: number) => {
    setTimes(times.filter((_, i) => i !== index));
  };
  
  const updateTime = (index: number, value: string) => {
    const newTimes = [...times];
    newTimes[index] = value;
    setTimes(newTimes);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
   
    if (!name || !dosage || !instructions || selectedDays.length === 0 || times.some(t => !t)) {
      alert('Please fill in all required fields');
      return;
    }
    
    addMedication({
      name,
      dosage,
      instructions,
      schedule: {
        days: selectedDays,
        times: times
      },
      pillsLeft: parseInt(pillsLeft),
      totalPills: parseInt(pillsLeft),
      refillAt: parseInt(refillAt),
      lastRefill: new Date().toISOString(),
      image,
      price: parseFloat(price),
      prescribedBy
    });
    
    onClose();
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
          className="relative mx-4 max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg bg-white shadow-xl"
        >
          <div className="flex items-center justify-between border-b border-gray-200 p-4">
            <h2 className="text-lg font-medium text-gray-900">Add New Medication</h2>
            <button
              onClick={onClose}
              className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="form-label">
                  Medication Name <span className="text-error-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  className="form-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              
              <div>
                <label htmlFor="dosage" className="form-label">
                  Dosage <span className="text-error-500">*</span>
                </label>
                <input
                  type="text"
                  id="dosage"
                  className="form-input"
                  placeholder="e.g. 10mg"
                  value={dosage}
                  onChange={(e) => setDosage(e.target.value)}
                  required
                />
              </div>
              
              <div className="sm:col-span-2">
                <label htmlFor="instructions" className="form-label">
                  Instructions <span className="text-error-500">*</span>
                </label>
                <textarea
                  id="instructions"
                  rows={2}
                  className="form-input"
                  placeholder="e.g. Take with food"
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  required
                />
              </div>
              
              <div>
                <label htmlFor="pills-left" className="form-label">
                  Pills Count <span className="text-error-500">*</span>
                </label>
                <input
                  type="number"
                  id="pills-left"
                  className="form-input"
                  min="1"
                  value={pillsLeft}
                  onChange={(e) => setPillsLeft(e.target.value)}
                  required
                />
              </div>
              
              <div>
                <label htmlFor="refill-at" className="form-label">
                  Refill When Below <span className="text-error-500">*</span>
                </label>
                <input
                  type="number"
                  id="refill-at"
                  className="form-input"
                  min="1"
                  value={refillAt}
                  onChange={(e) => setRefillAt(e.target.value)}
                  required
                />
              </div>
              
              <div>
                <label htmlFor="price" className="form-label">
                  Price ($)
                </label>
                <input
                  type="number"
                  id="price"
                  className="form-input"
                  min="0"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
              
              <div>
                <label htmlFor="prescribed-by" className="form-label">
                  Prescribed By
                </label>
                <input
                  type="text"
                  id="prescribed-by"
                  className="form-input"
                  placeholder="e.g. Dr. Smith"
                  value={prescribedBy}
                  onChange={(e) => setPrescribedBy(e.target.value)}
                />
              </div>
              
              <div className="sm:col-span-2">
                <label htmlFor="image" className="form-label">
                  Medication Image URL
                </label>
                <input
                  type="text"
                  id="image"
                  className="form-input"
                  placeholder="https://example.com/image.jpg"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                />
              </div>
              
              <div className="sm:col-span-2">
                <label className="form-label">
                  Schedule Days <span className="text-error-500">*</span>
                </label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {daysOfWeek.map((day) => (
                    <button
                      key={day}
                      type="button"
                      className={`rounded-full px-3 py-1 text-sm font-medium ${
                        selectedDays.includes(day)
                          ? 'bg-primary-100 text-primary-800'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      onClick={() => toggleDay(day)}
                    >
                      {day.substring(0, 3)}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="sm:col-span-2">
                <label className="form-label">
                  Schedule Times <span className="text-error-500">*</span>
                </label>
                <div className="space-y-2">
                  {times.map((time, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="time"
                        className="form-input"
                        value={time}
                        onChange={(e) => updateTime(index, e.target.value)}
                        required
                      />
                      {times.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeTimeSlot(index)}
                          className="rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
                        >
                          <Trash className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addTimeSlot}
                    className="mt-2 flex items-center text-sm font-medium text-primary-600 hover:text-primary-700"
                  >
                    <Plus className="mr-1 h-4 w-4" />
                    Add another time
                  </button>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="btn-outline"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
              >
                Add Medication
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AddMedicationModal;
