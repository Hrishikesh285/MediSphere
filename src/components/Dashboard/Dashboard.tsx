import { useEffect, useState } from 'react';
import { useMedication } from '../../hooks/useMedication';
import { useAuth } from '../../hooks/useAuth';
import { format } from 'date-fns';
import { Pill, ArrowRight, Activity, Calendar, Clock, Bell, Video } from 'lucide-react';
import { motion } from 'framer-motion';

import MedicationCard from './MedicationCard';
import AdherenceChart from './AdherenceChart';

const Dashboard = () => {
  const { user } = useAuth();
  const { 
    medications, 
    getUpcomingDoses, 
    getMedicationAdherence,
    appointments,
    markDoseTaken,
    updateMedication 
  } = useMedication();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [greeting, setGreeting] = useState('');
  const [snoozeDuration, setSnoozeDuration] = useState(15); // minutes
  const [alarmSound] = useState(new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3'));
  
  useEffect(() => {
    const checkMedications = () => {
      const now = new Date();
      medications.forEach(medication => {
        if (medication.schedule.days.includes(format(now, 'EEEE'))) {
          medication.schedule.times.forEach(time => {
            const [hours, minutes] = time.split(':');
            const scheduledTime = new Date();
            scheduledTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

            if (Math.abs(now.getTime() - scheduledTime.getTime()) < 60000) {
              const doseId = `${medication.id}-${format(scheduledTime, 'yyyy-MM-dd-HH-mm')}`;
              const existingDose = medication.history.find(d => d.id === doseId);

              if (!existingDose) {
                alarmSound.play();
                
                if (Notification.permission === "granted") {
                  new Notification("Medication Reminder", {
                    body: `Time to take ${medication.name} (${medication.dosage})`,
                    icon: "/favicon.svg",
                    requireInteraction: true 
                  });
                }
              }
            }
          });
        }
      });
    };

    if ("Notification" in window) {
      Notification.requestPermission();
    }

    checkMedications();
    const medicationTimer = setInterval(checkMedications, 60000);

    const timeTimer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => {
      clearInterval(medicationTimer);
      clearInterval(timeTimer);
    };
  }, [medications, alarmSound]);

  useEffect(() => {
    const hour = currentTime.getHours();
    if (hour < 12) {
      setGreeting('Good morning');
    } else if (hour < 18) {
      setGreeting('Good afternoon');
    } else {
      setGreeting('Good evening');
    }
  }, [currentTime]);

  const upcomingDoses = getUpcomingDoses();
  const adherenceScore = getMedicationAdherence();
  const adherenceColor = 
    adherenceScore >= 90 ? 'text-success-600' : 
    adherenceScore >= 70 ? 'text-warning-500' : 
    'text-error-600';
  
  const todayMedications = medications.filter(med => {
    const dayOfWeek = format(currentTime, 'EEEE');
    return med.schedule.days.includes(dayOfWeek);
  });
  
  const upcomingAppointment = appointments.find(app => 
    new Date(`${app.date}T${app.time}`) > currentTime
  );

  const handleTakeNow = (medicationId: string, doseId: string) => {
    markDoseTaken(medicationId, doseId);
    
    if (Notification.permission === "granted") {
      new Notification("Medication Taken", {
        body: `You've taken your medication: ${medications.find(m => m.id === medicationId)?.name}`,
        icon: "/favicon.svg"
      });
    }
  };

  const handleSnooze = (medicationId: string, doseId: string) => {
    const medication = medications.find(m => m.id === medicationId);
    if (!medication) return;

    const dose = medication.history.find(d => d.id === doseId);
    if (!dose) return;

    const newTime = new Date(new Date(dose.scheduledTime).getTime() + snoozeDuration * 60000);
  
    updateMedication(medicationId, {
      history: medication.history.map(d => 
        d.id === doseId 
          ? { ...d, scheduledTime: newTime.toISOString() }
          : d
      )
    });

    if (Notification.permission === "granted") {
      new Notification("Reminder Snoozed", {
        body: `Reminder for ${medication.name} snoozed for ${snoozeDuration} minutes`,
        icon: "/favicon.svg"
      });
    }
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
      {/* Header section */}
      <motion.div variants={item} className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          {greeting}, {user?.name}!
        </h1>
        <p className="mt-2 text-gray-600">
          {format(currentTime, 'EEEE, MMMM d, yyyy')} · {format(currentTime, 'h:mm a')}
        </p>
      </motion.div>
      
      {/* Quick stats */}
      <motion.div variants={item} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card p-4 sm:p-6">
          <div className="flex items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-primary-600">
              <Pill className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h2 className="text-lg font-semibold text-gray-900">{medications.length}</h2>
              <p className="text-sm text-gray-500">Medications</p>
            </div>
          </div>
        </div>
        
        <div className="card p-4 sm:p-6">
          <div className="flex items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary-100 text-secondary-600">
              <Bell className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h2 className="text-lg font-semibold text-gray-900">{upcomingDoses.length}</h2>
              <p className="text-sm text-gray-500">Upcoming doses</p>
            </div>
          </div>
        </div>
        
        <div className="card p-4 sm:p-6">
          <div className="flex items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-100 text-accent-600">
              <Activity className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h2 className={`text-lg font-semibold ${adherenceColor}`}>{adherenceScore}%</h2>
              <p className="text-sm text-gray-500">Adherence score</p>
            </div>
          </div>
        </div>
        
        <div className="card p-4 sm:p-6">
          <div className="flex items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 text-purple-600">
              <Calendar className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h2 className="text-lg font-semibold text-gray-900">{appointments.length}</h2>
              <p className="text-sm text-gray-500">Appointments</p>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Main content */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left column - Upcoming doses and today's medications */}
        <motion.div variants={item} className="space-y-6 lg:col-span-2">
          {/* Next medication alert */}
          {upcomingDoses.length > 0 && (
            <div className="card overflow-visible">
              <div className="bg-primary-600 px-6 py-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-medium text-white">Next medication dose</h2>
                  <Clock className="h-5 w-5 text-primary-200" />
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-100">
                    <Pill className="h-8 w-8 text-primary-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      {medications.find(med => med.id === upcomingDoses[0].medicationId)?.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {medications.find(med => med.id === upcomingDoses[0].medicationId)?.dosage} · 
                      {format(new Date(upcomingDoses[0].scheduledTime), ' h:mm a')}
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex">
                  <button 
                    onClick={() => handleTakeNow(upcomingDoses[0].medicationId, upcomingDoses[0].id)}
                    className="btn-primary mr-2"
                  >
                    Take now
                  </button>
                  <div className="relative">
                    <button 
                      onClick={() => handleSnooze(upcomingDoses[0].medicationId, upcomingDoses[0].id)}
                      className="btn-outline"
                    >
                      Snooze
                    </button>
                    <select
                      value={snoozeDuration}
                      onChange={(e) => setSnoozeDuration(Number(e.target.value))}
                      className="absolute right-0 top-full mt-1 w-32 rounded-md border border-gray-300 bg-white py-1 text-sm shadow-sm"
                    >
                      <option value={5}>5 minutes</option>
                      <option value={15}>15 minutes</option>
                      <option value={30}>30 minutes</option>
                      <option value={60}>1 hour</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Today's medications */}
          <div className="card">
            <div className="border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900">Today's medications</h2>
                <a href="/reminders" className="flex items-center text-sm font-medium text-primary-600 hover:text-primary-700">
                  View all <ArrowRight className="ml-1 h-4 w-4" />
                </a>
              </div>
            </div>
            <div className="divide-y divide-gray-200">
              {todayMedications.length > 0 ? (
                todayMedications.map(medication => (
                  <MedicationCard 
                    key={medication.id} 
                    medication={medication}
                    onTake={(doseId) => handleTakeNow(medication.id, doseId)}
                    onSnooze={(doseId) => handleSnooze(medication.id, doseId)}
                  />
                ))
              ) : (
                <div className="px-6 py-8 text-center">
                  <p className="text-gray-500">No medications scheduled for today</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
        
        {/* Right column - Adherence and upcoming appointment */}
        <motion.div variants={item} className="space-y-6">
          {/* Adherence score card */}
          <div className="card">
            <div className="border-b border-gray-200 px-6 py-4">
              <h2 className="text-lg font-medium text-gray-900">Medication Adherence</h2>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-center">
                <div className="relative h-32 w-32">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className={`text-3xl font-bold ${adherenceColor}`}>{adherenceScore}%</span>
                  </div>
                  <AdherenceChart percentage={adherenceScore} />
                </div>
              </div>
              <p className="mt-4 text-center text-sm text-gray-600">
                {adherenceScore >= 90 
                  ? 'Excellent! Keep up the good work.' 
                  : adherenceScore >= 70 
                    ? 'Good adherence. Try to be more consistent.' 
                    : 'Your adherence needs improvement. Set reminders to help.'}
              </p>
              <div className="mt-4">
                <a 
                  href="/analysis" 
                  className="block w-full rounded-md bg-primary-50 px-4 py-2 text-center text-sm font-medium text-primary-700 hover:bg-primary-100"
                >
                  View detailed analysis
                </a>
              </div>
            </div>
          </div>
          
          {/* Upcoming appointment */}
          {upcomingAppointment && (
            <div className="card">
              <div className="border-b border-gray-200 px-6 py-4">
                <h2 className="text-lg font-medium text-gray-900">Upcoming Appointment</h2>
              </div>
              <div className="p-6">
                <div className="mb-4 flex items-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary-100 text-secondary-600">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{upcomingAppointment.doctorName}</p>
                    <p className="text-xs text-gray-500">{upcomingAppointment.specialty}</p>
                  </div>
                </div>
                <div className="rounded-md bg-gray-50 p-4">
                  <div className="flex justify-between">
                    <div>
                      <p className="text-xs text-gray-500">Date</p>
                      <p className="text-sm font-medium text-gray-900">
                        {format(new Date(upcomingAppointment.date), 'MMM d, yyyy')}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Time</p>
                      <p className="text-sm font-medium text-gray-900">
                        {upcomingAppointment.time}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <a 
                    href="/telemedicine" 
                    className="block w-full rounded-md bg-secondary-50 px-4 py-2 text-center text-sm font-medium text-secondary-700 hover:bg-secondary-100"
                  >
                    View appointment details
                  </a>
                </div>
              </div>
            </div>
          )}
          
          {/* Quick actions */}
          <div className="card">
            <div className="border-b border-gray-200 px-6 py-4">
              <h2 className="text-lg font-medium text-gray-900">Quick actions</h2>
            </div>
            <div className="grid grid-cols-2 gap-2 p-4">
              <a href="/reminders" className="rounded-md bg-primary-50 p-4 text-center hover:bg-primary-100">
                <Bell className="mx-auto h-6 w-6 text-primary-600" />
                <span className="mt-2 block text-sm font-medium text-primary-700">Set reminders</span>
              </a>
              <a href="/pharmacy" className="rounded-md bg-secondary-50 p-4 text-center hover:bg-secondary-100">
                <Pill className="mx-auto h-6 w-6 text-secondary-600" />
                <span className="mt-2 block text-sm font-medium text-secondary-700">Refill medications</span>
              </a>
              <a href="/telemedicine" className="rounded-md bg-accent-50 p-4 text-center hover:bg-accent-100">
                <Video className="mx-auto h-6 w-6 text-accent-600" />
                <span className="mt-2 block text-sm font-medium text-accent-700">Book consultation</span>
              </a>
              <a href="/analysis" className="rounded-md bg-purple-50 p-4 text-center hover:bg-purple-100">
                <Activity className="mx-auto h-6 w-6 text-purple-600" />
                <span className="mt-2 block text-sm font-medium text-purple-700">View adherence</span>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
