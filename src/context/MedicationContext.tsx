import { createContext, useState, ReactNode, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { addDays, format, isToday, isFuture, parseISO, differenceInDays, startOfDay, endOfDay, isWithinInterval } from 'date-fns';


export interface Medication {
  id: string;
  name: string;
  dosage: string;
  instructions: string;
  schedule: {
    days: string[];
    times: string[];
  };
  pillsLeft: number;
  totalPills: number;
  refillAt: number;
  lastRefill: string;
  image?: string;
  price: number;
  prescribedBy: string;
  history: DoseHistory[];
}

export interface DoseHistory {
  id: string;
  medicationId: string;
  scheduledTime: string;
  takenTime: string | null;
  status: 'taken' | 'missed' | 'upcoming';
}

export interface Appointment {
  id: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  notes: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}

export interface Cart {
  items: CartItem[];
  total: number;
}

export interface CartItem {
  medicationId: string;
  quantity: number;
  price: number;
  name: string;
}

interface MedicationContextType {
  medications: Medication[];
  appointments: Appointment[];
  cart: Cart;
  addMedication: (medication: Omit<Medication, 'id' | 'history'>) => void;
  updateMedication: (id: string, medication: Partial<Medication>) => void;
  deleteMedication: (id: string) => void;
  markDoseTaken: (medicationId: string, doseId: string) => void;
  addToCart: (medication: Medication, quantity: number) => void;
  removeFromCart: (medicationId: string) => void;
  clearCart: () => void;
  getUpcomingDoses: () => DoseHistory[];
  getMedicationAdherence: () => number;
  addAppointment: (appointment: Omit<Appointment, 'id'>) => void;
  updateAppointment: (id: string, appointment: Partial<Appointment>) => void;
  deleteAppointment: (id: string) => void;
}

export const MedicationContext = createContext<MedicationContextType>({
  medications: [],
  appointments: [],
  cart: { items: [], total: 0 },
  addMedication: () => {},
  updateMedication: () => {},
  deleteMedication: () => {},
  markDoseTaken: () => {},
  addToCart: () => {},
  removeFromCart: () => {},
  clearCart: () => {},
  getUpcomingDoses: () => [],
  getMedicationAdherence: () => 0,
  addAppointment: () => {},
  updateAppointment: () => {},
  deleteAppointment: () => {},
});

const initialMedications: Medication[] = [
  {
    id: '1',
    name: 'Lisinopril',
    dosage: '10mg',
    instructions: 'Take once daily with or without food',
    schedule: {
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      times: ['08:00']
    },
    pillsLeft: 24,
    totalPills: 30,
    refillAt: 5,
    lastRefill: '2023-04-01',
    image: 'assets\lisinopril.jpg',
    price: 15.99,
    prescribedBy: 'Dr. Smith',
    history: []
  },
  {
    id: '2',
    name: 'Metformin',
    dosage: '500mg',
    instructions: 'Take twice daily with meals',
    schedule: {
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      times: ['08:00', '20:00']
    },
    pillsLeft: 45,
    totalPills: 60,
    refillAt: 10,
    lastRefill: '2023-03-15',
    image: 'assets\metformin.jpeg',
    price: 12.99,
    prescribedBy: 'Dr. Johnson',
    history: []
  },
  {
    id: '3',
    name: 'Atorvastatin',
    dosage: '20mg',
    instructions: 'Take once daily in the evening',
    schedule: {
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      times: ['20:00']
    },
    pillsLeft: 10,
    totalPills: 30,
    refillAt: 7,
    lastRefill: '2023-03-20',
    image: 'assets\ATORVASTATIN.png',
    price: 22.50,
    prescribedBy: 'Dr. Smith',
    history: []
  }
];

const initialAppointments: Appointment[] = [
  {
    id: '1',
    doctorName: 'Dr. Sarah Smith',
    specialty: 'Cardiology',
    date: format(addDays(new Date(), 7), 'yyyy-MM-dd'),
    time: '10:00',
    notes: 'Regular checkup for blood pressure',
    status: 'scheduled'
  },
  {
    id: '2',
    doctorName: 'Dr. Michael Johnson',
    specialty: 'Endocrinology',
    date: format(addDays(new Date(), 14), 'yyyy-MM-dd'),
    time: '14:30',
    notes: 'Follow-up on diabetes management',
    status: 'scheduled'
  }
];

interface MedicationProviderProps {
  children: ReactNode;
}

export const MedicationProvider = ({ children }: MedicationProviderProps) => {
  const [medications, setMedications] = useState<Medication[]>(initialMedications);
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [cart, setCart] = useState<Cart>({ items: [], total: 0 });

  useEffect(() => {
    const storedMeds = localStorage.getItem('medisphere_medications');
    const storedAppointments = localStorage.getItem('medisphere_appointments');
    const storedCart = localStorage.getItem('medisphere_cart');

    if (storedMeds) setMedications(JSON.parse(storedMeds));
    if (storedAppointments) setAppointments(JSON.parse(storedAppointments));
    if (storedCart) setCart(JSON.parse(storedCart));
  }, []);

  useEffect(() => {
    localStorage.setItem('medisphere_medications', JSON.stringify(medications));
    localStorage.setItem('medisphere_appointments', JSON.stringify(appointments));
    localStorage.setItem('medisphere_cart', JSON.stringify(cart));
  }, [medications, appointments, cart]);

  const addMedication = (medication: Omit<Medication, 'id' | 'history'>) => {
    const newMedication: Medication = {
      ...medication,
      id: uuidv4(),
      history: []
    };
    setMedications([...medications, newMedication]);
  };

  const updateMedication = (id: string, updates: Partial<Medication>) => {
    setMedications(medications.map(med => 
      med.id === id ? { ...med, ...updates } : med
    ));
  };

  const deleteMedication = (id: string) => {
    setMedications(medications.filter(med => med.id !== id));
  };

  const markDoseTaken = (medicationId: string, doseId: string) => {
    const now = new Date();
    setMedications(medications.map(med => {
      if (med.id === medicationId) {
        const existingDose = med.history.find(d => d.id === doseId);
        let updatedHistory;

        if (existingDose) {
          // Update existing dose
          updatedHistory = med.history.map(dose => 
            dose.id === doseId ? {
              ...dose,
              takenTime: now.toISOString(),
              status: 'taken' as const
            } : dose
          );
        } else {
          // Create new dose record
          updatedHistory = [...med.history, {
            id: doseId,
            medicationId: medicationId,
            scheduledTime: now.toISOString(),
            takenTime: now.toISOString(),
            status: 'taken' as const
          }];
        }

        return {
          ...med,
          pillsLeft: Math.max(0, med.pillsLeft - 1),
          history: updatedHistory
        };
      }
      return med;
    }));
  };

  const addToCart = (medication: Medication, quantity: number) => {
    const existingItem = cart.items.find(item => item.medicationId === medication.id);
    
    let newItems;
    if (existingItem) {
      newItems = cart.items.map(item => 
        item.medicationId === medication.id 
          ? { ...item, quantity: item.quantity + quantity } 
          : item
      );
    } else {
      newItems = [
        ...cart.items, 
        { 
          medicationId: medication.id, 
          quantity, 
          price: medication.price,
          name: medication.name
        }
      ];
    }
    
    const newTotal = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    setCart({ 
      items: newItems, 
      total: parseFloat(newTotal.toFixed(2))
    });
  };

  const removeFromCart = (medicationId: string) => {
    const newItems = cart.items.filter(item => item.medicationId !== medicationId);
    const newTotal = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    setCart({ 
      items: newItems, 
      total: parseFloat(newTotal.toFixed(2))
    });
  };

  const clearCart = () => {
    setCart({ items: [], total: 0 });
  };

  const getUpcomingDoses = (): DoseHistory[] => {
    const now = new Date();
    const upcomingDoses: DoseHistory[] = [];

    medications.forEach(med => {
      const dayOfWeek = format(now, 'EEEE');
      
      if (med.schedule.days.includes(dayOfWeek)) {
        med.schedule.times.forEach(time => {
          const [hours, minutes] = time.split(':');
          const scheduledTime = new Date();
          scheduledTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
          
          if (scheduledTime > now) {
            const existingDose = med.history.find(dose => 
              isToday(parseISO(dose.scheduledTime)) && 
              format(parseISO(dose.scheduledTime), 'HH:mm') === time
            );

            if (!existingDose) {
              upcomingDoses.push({
                id: uuidv4(),
                medicationId: med.id,
                scheduledTime: scheduledTime.toISOString(),
                takenTime: null,
                status: 'upcoming'
              });
            }
          }
        });
      }
    });

    return upcomingDoses.sort((a, b) => 
      new Date(a.scheduledTime).getTime() - new Date(b.scheduledTime).getTime()
    );
  };

  const getMedicationAdherence = (): number => {
    const now = new Date();
    const startOfToday = startOfDay(now);
    const endOfToday = endOfDay(now);
    let totalScheduledDoses = 0;
    let takenDoses = 0;

    medications.forEach(med => {
      med.history.forEach(dose => {
        const doseTime = parseISO(dose.scheduledTime);
        
        if (isWithinInterval(doseTime, { start: startOfToday, end: now })) {
          totalScheduledDoses++;
          if (dose.status === 'taken') {
            takenDoses++;
          }
        }
      });

      if (med.schedule.days.includes(format(now, 'EEEE'))) {
        med.schedule.times.forEach(time => {
          const [hours, minutes] = time.split(':');
          const scheduledTime = new Date();
          scheduledTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

          if (scheduledTime <= now) {
            const existingDose = med.history.find(dose => 
              isToday(parseISO(dose.scheduledTime)) && 
              format(parseISO(dose.scheduledTime), 'HH:mm') === time
            );

            if (!existingDose) {
              totalScheduledDoses++;
            }
          }
        });
      }
    });

    return totalScheduledDoses > 0 ? Math.round((takenDoses / totalScheduledDoses) * 100) : 100;
  };

  const addAppointment = (appointment: Omit<Appointment, 'id'>) => {
    const newAppointment: Appointment = {
      ...appointment,
      id: uuidv4()
    };
    setAppointments([...appointments, newAppointment]);
  };

  const updateAppointment = (id: string, updates: Partial<Appointment>) => {
    setAppointments(appointments.map(app => 
      app.id === id ? { ...app, ...updates } : app
    ));
  };

  const deleteAppointment = (id: string) => {
    setAppointments(appointments.filter(app => app.id !== id));
  };

  return (
    <MedicationContext.Provider value={{
      medications,
      appointments,
      cart,
      addMedication,
      updateMedication,
      deleteMedication,
      markDoseTaken,
      addToCart,
      removeFromCart,
      clearCart,
      getUpcomingDoses,
      getMedicationAdherence,
      addAppointment,
      updateAppointment,
      deleteAppointment
    }}>
      {children}
    </MedicationContext.Provider>
  );
};
