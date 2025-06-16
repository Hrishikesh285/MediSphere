import { format, isPast, parseISO } from 'date-fns';
import { Appointment } from '../../context/MedicationContext';
import { Calendar, Clock, Video, User, CheckCircle, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface AppointmentCardProps {
  appointment: Appointment;
}

const AppointmentCard = ({ appointment }: AppointmentCardProps) => {
  const appointmentDate = new Date(`${appointment.date}T${appointment.time}`);
  const isPastAppointment = isPast(appointmentDate);
  
  const getStatusBadge = () => {
    switch (appointment.status) {
      case 'scheduled':
        return (
          <span className="flex items-center rounded-full bg-primary-100 px-2.5 py-0.5 text-xs font-medium text-primary-800">
            <Clock className="mr-1 h-3 w-3" />
            Scheduled
          </span>
        );
      case 'completed':
        return (
          <span className="flex items-center rounded-full bg-success-100 px-2.5 py-0.5 text-xs font-medium text-success-800">
            <CheckCircle className="mr-1 h-3 w-3" />
            Completed
          </span>
        );
      case 'cancelled':
        return (
          <span className="flex items-center rounded-full bg-error-100 px-2.5 py-0.5 text-xs font-medium text-error-800">
            <XCircle className="mr-1 h-3 w-3" />
            Cancelled
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div 
      whileHover={{ backgroundColor: '#f9fafb' }}
      className="px-6 py-4"
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100">
            <User className="h-6 w-6 text-primary-600" />
          </div>
        </div>
        <div className="ml-4 flex-1">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center">
                <h3 className="text-base font-medium text-gray-900">{appointment.doctorName}</h3>
                <div className="ml-2">{getStatusBadge()}</div>
              </div>
              <p className="text-sm text-gray-500">{appointment.specialty}</p>
            </div>
          </div>
          <div className="mt-2 flex flex-col space-y-2 sm:flex-row sm:space-x-4 sm:space-y-0">
            <div className="flex items-center text-sm text-gray-500">
              <Calendar className="mr-1 h-4 w-4 text-gray-400" />
              {format(new Date(appointment.date), 'MMMM d, yyyy')}
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <Clock className="mr-1 h-4 w-4 text-gray-400" />
              {appointment.time}
            </div>
          </div>
          {appointment.notes && (
            <p className="mt-2 text-sm text-gray-600">
              {appointment.notes}
            </p>
          )}
          <div className="mt-3 flex">
            {appointment.status === 'scheduled' && !isPastAppointment && (
              <button className="mr-2 flex items-center rounded-md bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700 hover:bg-primary-100">
                <Video className="mr-1 h-3 w-3" />
                Join video call
              </button>
            )}
            <button className="rounded-md bg-gray-50 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-100">
              View details
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AppointmentCard;