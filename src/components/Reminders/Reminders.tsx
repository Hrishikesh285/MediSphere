import { useState } from 'react';
import { useMedication } from '../../hooks/useMedication';
import { format, isToday, isPast, parseISO } from 'date-fns';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Calendar, 
  Clock, 
  Filter, 
  Check, 
  AlertTriangle,
  X
} from 'lucide-react';

import MedicationScheduleCard from './MedicationScheduleCard';
import AddMedicationModal from './AddMedicationModal';

const Reminders = () => {
  const { medications } = useMedication();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const filteredMedications = medications.filter(med => {
    const matchesSearch = med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         med.dosage.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterStatus === 'low') {
      return matchesSearch && med.pillsLeft <= med.refillAt;
    }
    
    return matchesSearch;
  });

  // Get medication status
  const getMedicationStatus = (med: any) => {
    if (med.pillsLeft <= med.refillAt) {
      return 'low';
    }
    
    // Check if any dose was taken today
    const takenToday = med.history.some((dose: any) => 
      isToday(parseISO(dose.scheduledTime)) && 
      dose.status === 'taken'
    );
    
    if (takenToday) {
      return 'taken';
    }
    
    // Check if any upcoming dose today
    const dayOfWeek = format(new Date(), 'EEEE');
    if (med.schedule.days.includes(dayOfWeek)) {
      const upcomingToday = med.schedule.times.some((time: string) => {
        const [hours, minutes] = time.split(':');
        const scheduledTime = new Date();
        scheduledTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
        return scheduledTime > new Date();
      });
      
      if (upcomingToday) {
        return 'upcoming';
      }
    }
    
    return 'none';
  };

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
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Medication Reminders</h1>
          <p className="mt-2 text-sm text-gray-600">
            Track and manage your medications and schedules
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary flex items-center"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add medication
        </button>
      </motion.div>
      
      {/* Search and filters */}
      <motion.div variants={item} className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
        <div className="relative flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="form-input pl-10"
            placeholder="Search medications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex space-x-2">
          <button 
            className={`flex items-center rounded-md px-3 py-2 text-sm font-medium ${
              filterStatus === null 
                ? 'bg-primary-100 text-primary-700' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setFilterStatus(null)}
          >
            <Filter className="mr-2 h-4 w-4" />
            All
          </button>
          <button 
            className={`flex items-center rounded-md px-3 py-2 text-sm font-medium ${
              filterStatus === 'low' 
                ? 'bg-error-100 text-error-700' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setFilterStatus(filterStatus === 'low' ? null : 'low')}
          >
            <AlertTriangle className="mr-2 h-4 w-4" />
            Low stock
          </button>
        </div>
      </motion.div>
      
      {/* Medications list */}
      <motion.div variants={item} className="space-y-4">
        {filteredMedications.length > 0 ? (
          filteredMedications.map((medication) => (
            <MedicationScheduleCard 
              key={medication.id} 
              medication={medication}
              status={getMedicationStatus(medication)}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg border border-gray-200 bg-white py-12">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
              <Calendar className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No medications found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm 
                ? 'Try adjusting your search or filters' 
                : 'Add your first medication to get started'}
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="mt-4 inline-flex items-center rounded-md bg-primary-50 px-4 py-2 text-sm font-medium text-primary-700 hover:bg-primary-100"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add medication
            </button>
          </div>
        )}
      </motion.div>
      
      {/* Add medication modal */}
      {showAddModal && (
        <AddMedicationModal onClose={() => setShowAddModal(false)} />
      )}
    </motion.div>
  );
};

export default Reminders;
