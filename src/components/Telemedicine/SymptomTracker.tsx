import { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, CalendarPlus, Thermometer, Heart, Settings as Lungs, Brain } from 'lucide-react';

interface SymptomTrackerProps {
  onBookConsultation: () => void;
}

const SymptomTracker = ({ onBookConsultation }: SymptomTrackerProps) => {
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [urgency, setUrgency] = useState<string>('medium');
  const [details, setDetails] = useState('');
  
  const commonSymptoms = [
    { id: 'fever', name: 'Fever', icon: Thermometer },
    { id: 'cough', name: 'Cough', icon: Lungs },
    { id: 'headache', name: 'Headache', icon: Brain },
    { id: 'fatigue', name: 'Fatigue', icon: AlertTriangle },
    { id: 'chestPain', name: 'Chest Pain', icon: Heart },
    { id: 'shortnessOfBreath', name: 'Shortness of Breath', icon: Lungs },
    { id: 'nauseaVomiting', name: 'Nausea/Vomiting', icon: AlertTriangle },
    { id: 'dizziness', name: 'Dizziness', icon: Brain },
  ];
  
  const toggleSymptom = (symptomId: string) => {
    if (symptoms.includes(symptomId)) {
      setSymptoms(symptoms.filter(id => id !== symptomId));
    } else {
      setSymptoms([...symptoms, symptomId]);
    }
  };
  
  const handleBookWithSymptoms = () => {
    // In a real app, we would pass the symptoms data to the consultation booking form
    onBookConsultation();
  };

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-medium text-gray-900">Track Your Symptoms</h2>
          <p className="mt-1 text-sm text-gray-500">
            Log your symptoms to share with doctors during consultations
          </p>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div>
              <label className="form-label">Select your symptoms</label>
              <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {commonSymptoms.map((symptom) => {
                  const Icon = symptom.icon;
                  return (
                    <motion.button
                      key={symptom.id}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      className={`flex flex-col items-center rounded-lg border p-3 ${
                        symptoms.includes(symptom.id)
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-300 bg-white hover:bg-gray-50'
                      }`}
                      onClick={() => toggleSymptom(symptom.id)}
                    >
                      <Icon className={`h-6 w-6 ${
                        symptoms.includes(symptom.id) ? 'text-primary-600' : 'text-gray-400'
                      }`} />
                      <span className={`mt-2 text-sm font-medium ${
                        symptoms.includes(symptom.id) ? 'text-primary-700' : 'text-gray-900'
                      }`}>
                        {symptom.name}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </div>
            
            <div>
              <label className="form-label">How urgent are your symptoms?</label>
              <div className="mt-2 grid grid-cols-3 gap-3">
                <button
                  type="button"
                  className={`rounded-md px-3 py-2 text-sm font-medium ${
                    urgency === 'low'
                      ? 'bg-success-100 text-success-800'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  onClick={() => setUrgency('low')}
                >
                  Not urgent
                </button>
                <button
                  type="button"
                  className={`rounded-md px-3 py-2 text-sm font-medium ${
                    urgency === 'medium'
                      ? 'bg-warning-100 text-warning-800'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  onClick={() => setUrgency('medium')}
                >
                  Somewhat urgent
                </button>
                <button
                  type="button"
                  className={`rounded-md px-3 py-2 text-sm font-medium ${
                    urgency === 'high'
                      ? 'bg-error-100 text-error-800'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  onClick={() => setUrgency('high')}
                >
                  Very urgent
                </button>
              </div>
            </div>
            
            <div>
              <label htmlFor="symptom-details" className="form-label">Additional details</label>
              <textarea
                id="symptom-details"
                rows={3}
                className="form-input"
                placeholder="Describe when symptoms started, their severity, and any other relevant information..."
                value={details}
                onChange={(e) => setDetails(e.target.value)}
              />
            </div>
            
            <div className="pt-4">
              <button
                type="button"
                onClick={handleBookWithSymptoms}
                className="btn-primary flex w-full items-center justify-center sm:w-auto"
                disabled={symptoms.length === 0}
              >
                <CalendarPlus className="mr-2 h-4 w-4" />
                Book consultation with these symptoms
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="card">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-medium text-gray-900">When to seek immediate care</h2>
        </div>
        <div className="p-6">
          <div className="rounded-md bg-error-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-error-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-error-800">Emergency symptoms</h3>
                <div className="mt-2 text-sm text-error-700">
                  <p>Seek immediate medical attention if you experience:</p>
                  <ul className="mt-2 list-inside list-disc space-y-1">
                    <li>Severe chest pain or pressure</li>
                    <li>Difficulty breathing or shortness of breath</li>
                    <li>Severe, persistent headache</li>
                    <li>Sudden weakness or numbness, especially on one side</li>
                    <li>Severe abdominal pain</li>
                    <li>Uncontrollable bleeding</li>
                  </ul>
                </div>
                <div className="mt-4">
                  <button
                    type="button"
                    className="rounded-md bg-error-100 px-3 py-2 text-sm font-medium text-error-800 hover:bg-error-200"
                  >
                    Get emergency assistance
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SymptomTracker;