import { useState } from 'react';
import { Medication } from '../../context/MedicationContext';
import { Pill, ShoppingCart, MinusCircle, PlusCircle, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useMedication } from '../../hooks/useMedication';

interface MedicationStockCardProps {
  medication: Medication;
}

const MedicationStockCard = ({ medication }: MedicationStockCardProps) => {
  const { addToCart } = useMedication();
  const [quantity, setQuantity] = useState(1);
  
  const increaseQuantity = () => {
    setQuantity(prev => prev + 1);
  };
  
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };
  
  const handleAddToCart = () => {
    addToCart(medication, quantity);
    setQuantity(1); // Reset quantity after adding to cart
  };
  
  const getLowStockWarning = () => {
    if (medication.pillsLeft <= medication.refillAt) {
      return (
        <div className="mt-2 flex items-center text-warning-600">
          <AlertTriangle className="mr-1 h-4 w-4" />
          <span className="text-xs font-medium">Low stock</span>
        </div>
      );
    }
    return null;
  };
  
  const getStockPercentage = () => {
    return (medication.pillsLeft / medication.totalPills) * 100;
  };
  
  const getProgressColor = () => {
    const percentage = getStockPercentage();
    if (percentage <= 20) return 'bg-error-500';
    if (percentage <= 40) return 'bg-warning-500';
    return 'bg-success-500';
  };

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      transition={{ type: 'spring', stiffness: 300 }}
      className="card h-full"
    >
      <div className="relative">
        {medication.image ? (
          <img 
            src={medication.image} 
            alt={medication.name}
            className="h-48 w-full rounded-t-xl object-cover"
          />
        ) : (
          <div className="flex h-48 w-full items-center justify-center rounded-t-xl bg-primary-100">
            <Pill className="h-16 w-16 text-primary-600" />
          </div>
        )}
        
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="h-2 overflow-hidden rounded-full bg-gray-200 bg-opacity-70">
            <div 
              className={`h-full ${getProgressColor()}`}
              style={{ width: `${getStockPercentage()}%` }}
            ></div>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-medium text-gray-900">{medication.name}</h3>
        <p className="text-sm text-gray-500">{medication.dosage}</p>
        
        <div className="mt-2 flex items-center justify-between">
          <p className="text-lg font-bold text-gray-900">${medication.price.toFixed(2)}</p>
          <p className="text-sm text-gray-600">
            {medication.pillsLeft} pills left
          </p>
        </div>
        
        {getLowStockWarning()}
        
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center">
            <button 
              onClick={decreaseQuantity}
              className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              disabled={quantity <= 1}
            >
              <MinusCircle className="h-5 w-5" />
            </button>
            <span className="mx-2 w-8 text-center text-gray-700">{quantity}</span>
            <button 
              onClick={increaseQuantity}
              className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            >
              <PlusCircle className="h-5 w-5" />
            </button>
          </div>
          
          <button
            onClick={handleAddToCart}
            className="flex items-center rounded-md bg-primary-100 px-3 py-1.5 text-sm font-medium text-primary-700 hover:bg-primary-200"
          >
            <ShoppingCart className="mr-1 h-4 w-4" />
            Add to cart
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default MedicationStockCard;