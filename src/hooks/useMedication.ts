import { useContext } from 'react';
import { MedicationContext } from '../context/MedicationContext';

export const useMedication = () => useContext(MedicationContext);