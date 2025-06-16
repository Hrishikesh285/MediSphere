import { useState } from 'react';
import { useMedication } from '../../hooks/useMedication';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  ShoppingCart, 
  AlertTriangle, 
  Check,
  Package,
  RefreshCw
} from 'lucide-react';

import MedicationStockCard from './MedicationStockCard';
import CartSidebar from './CartSidebar';

const Pharmacy = () => {
  const { medications, cart } = useMedication();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLowStock, setFilterLowStock] = useState(false);
  const [showCart, setShowCart] = useState(false);
  
  // Filter medications based on search term and filter
  const filteredMedications = medications.filter(med => {
    const matchesSearch = med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         med.dosage.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterLowStock) {
      return matchesSearch && med.pillsLeft <= med.refillAt;
    }
    
    return matchesSearch;
  });
  
  // Count low stock medications
  const lowStockCount = medications.filter(med => med.pillsLeft <= med.refillAt).length;

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
    <div className="relative">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-6"
      >
        {/* Header */}
        <motion.div variants={item} className="flex flex-col justify-between space-y-4 sm:flex-row sm:items-center sm:space-y-0">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Pharmacy</h1>
            <p className="mt-2 text-sm text-gray-600">
              Refill your medications and manage your pharmacy orders
            </p>
          </div>
          <button
            onClick={() => setShowCart(true)}
            className="btn-primary flex items-center"
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Cart {cart.items.length > 0 && `(${cart.items.length})`}
          </button>
        </motion.div>
        
        {/* Alerts */}
        {lowStockCount > 0 && (
          <motion.div variants={item} className="rounded-lg bg-warning-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-warning-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-warning-800">Low Stock Alert</h3>
                <div className="mt-2 text-sm text-warning-700">
                  <p>
                    You have {lowStockCount} medication{lowStockCount > 1 ? 's' : ''} running low on stock. 
                    Consider refilling them soon to avoid running out.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
        
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
          
          <button 
            className={`flex items-center rounded-md px-3 py-2 text-sm font-medium ${
              filterLowStock 
                ? 'bg-warning-100 text-warning-700' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setFilterLowStock(!filterLowStock)}
          >
            <AlertTriangle className="mr-2 h-4 w-4" />
            Low stock only
          </button>
        </motion.div>
        
        {/* Medications grid */}
        <motion.div variants={item} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredMedications.length > 0 ? (
            filteredMedications.map((medication) => (
              <MedicationStockCard key={medication.id} medication={medication} />
            ))
          ) : (
            <div className="col-span-1 flex flex-col items-center justify-center rounded-lg border border-gray-200 bg-white p-6 sm:col-span-2 lg:col-span-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                <Package className="h-6 w-6 text-gray-400" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">No medications found</h3>
              <p className="mt-1 text-center text-sm text-gray-500">
                {searchTerm || filterLowStock
                  ? 'Try adjusting your search or filters'
                  : 'Your pharmacy stock is empty. Add medications to get started.'}
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterLowStock(false);
                }}
                className="mt-4 inline-flex items-center rounded-md bg-primary-50 px-4 py-2 text-sm font-medium text-primary-700 hover:bg-primary-100"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Reset filters
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
      
      {/* Cart sidebar */}
      <CartSidebar isOpen={showCart} onClose={() => setShowCart(false)} />
    </div>
  );
};

export default Pharmacy;