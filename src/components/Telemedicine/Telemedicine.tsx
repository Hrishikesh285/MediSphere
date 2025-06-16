import { useState } from 'react';
import { useMedication } from '../../hooks/useMedication';
import { motion } from 'framer-motion';
import { 
  CalendarPlus, 
  Video, 
  Clock, 
  Calendar, 
  User,
  AlertCircle,
  ChevronRight
} from 'lucide-react';

import BookConsultationForm from './BookConsultationForm';
import SymptomTracker from './SymptomTracker';
import AppointmentCard from './AppointmentCard';

const Telemedicine = () => {
  const { appointments } = useMedication();
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [activeTab, setActiveTab] = useState('appointments');
  
  // Sort appointments by date
  const sortedAppointments = [...appointments].sort((a, b) => {
    const dateA = new Date(`${a.date} ${a.time}`);
    const dateB = new Date(`${b.date} ${b.time}`);
    return dateA.getTime() - dateB.getTime();
  });
  
  // Filter upcoming appointments
  const upcomingAppointments = sortedAppointments.filter(
    app => app.status === 'scheduled'
  );
  
  // Filter past appointments
  const pastAppointments = sortedAppointments.filter(
    app => app.status === 'completed' || app.status === 'cancelled'
  );

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
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Telemedicine</h1>
          <p className="mt-2 text-sm text-gray-600">
            Connect with healthcare professionals remotely
          </p>
        </div>
        <button
          onClick={() => setShowBookingForm(true)}
          className="btn-primary flex items-center"
        >
          <CalendarPlus className="mr-2 h-4 w-4" />
          Book Consultation
        </button>
      </motion.div>
      
      {/* Consultation booking form */}
      {showBookingForm && (
        <BookConsultationForm onClose={() => setShowBookingForm(false)} />
      )}
      
      {/* Quick stats */}
      <motion.div variants={item} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card p-4 sm:p-6">
          <div className="flex items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-primary-600">
              <Calendar className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h2 className="text-lg font-semibold text-gray-900">{upcomingAppointments.length}</h2>
              <p className="text-sm text-gray-500">Upcoming appointments</p>
            </div>
          </div>
        </div>
        
        <div className="card p-4 sm:p-6">
          <div className="flex items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary-100 text-secondary-600">
              <Clock className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h2 className="text-lg font-semibold text-gray-900">{pastAppointments.length}</h2>
              <p className="text-sm text-gray-500">Past consultations</p>
            </div>
          </div>
        </div>
        
        <div className="card p-4 sm:p-6">
          <div className="flex items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-100 text-accent-600">
              <User className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h2 className="text-lg font-semibold text-gray-900">3</h2>
              <p className="text-sm text-gray-500">Available doctors</p>
            </div>
          </div>
        </div>
        
        <div className="card p-4 sm:p-6">
          <div className="flex items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 text-purple-600">
              <Video className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h2 className="text-lg font-semibold text-gray-900">24/7</h2>
              <p className="text-sm text-gray-500">Support available</p>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Tabs */}
      <motion.div variants={item} className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            className={`py-4 text-sm font-medium ${
              activeTab === 'appointments'
                ? 'border-b-2 border-primary-500 text-primary-600'
                : 'border-b-2 border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('appointments')}
          >
            Appointments
          </button>
          <button
            className={`py-4 text-sm font-medium ${
              activeTab === 'symptoms'
                ? 'border-b-2 border-primary-500 text-primary-600'
                : 'border-b-2 border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('symptoms')}
          >
            Symptom Tracker
          </button>
        </nav>
      </motion.div>
      
      {/* Tab content */}
      {activeTab === 'appointments' ? (
        <motion.div variants={item} className="space-y-6">
          {/* Upcoming appointments */}
          <div className="card">
            <div className="border-b border-gray-200 px-6 py-4">
              <h2 className="text-lg font-medium text-gray-900">Upcoming Appointments</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {upcomingAppointments.length > 0 ? (
                upcomingAppointments.map((appointment) => (
                  <AppointmentCard key={appointment.id} appointment={appointment} />
                ))
              ) : (
                <div className="px-6 py-8 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                    <Calendar className="h-6 w-6 text-gray-400" />
                  </div>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No upcoming appointments</h3>
                  <p className="mt-1 text-sm text-gray-500">Schedule a consultation with a doctor.</p>
                  <div className="mt-6">
                    <button
                      onClick={() => setShowBookingForm(true)}
                      className="inline-flex items-center rounded-md bg-primary-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700"
                    >
                      <CalendarPlus className="mr-1 h-4 w-4" />
                      Book now
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Past appointments */}
          {pastAppointments.length > 0 && (
            <div className="card">
              <div className="border-b border-gray-200 px-6 py-4">
                <h2 className="text-lg font-medium text-gray-900">Past Consultations</h2>
              </div>
              <div className="divide-y divide-gray-200">
                {pastAppointments.map((appointment) => (
                  <AppointmentCard key={appointment.id} appointment={appointment} />
                ))}
              </div>
            </div>
          )}
        </motion.div>
      ) : (
        <motion.div variants={item}>
          <SymptomTracker onBookConsultation={() => setShowBookingForm(true)} />
        </motion.div>
      )}
      
      {/* Health tips */}
      <motion.div variants={item} className="rounded-lg bg-gradient-to-r from-primary-600 to-primary-800 p-6 text-white">
        <div className="flex flex-col justify-between space-y-4 sm:flex-row sm:items-center sm:space-y-0">
          <div>
            <h2 className="text-xl font-bold">Need immediate assistance?</h2>
            <p className="mt-1 text-primary-100">
              Our virtual doctors are available 24/7 for urgent consultations.
            </p>
          </div>
          <button className="inline-flex items-center rounded-md bg-white px-4 py-2 text-sm font-medium text-primary-700 shadow-sm hover:bg-primary-50">
            Start emergency consultation <ChevronRight className="ml-1 h-4 w-4" />
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Telemedicine;