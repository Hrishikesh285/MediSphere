import { Pill } from 'lucide-react';
import { motion } from 'framer-motion';

const LoadingScreen = () => {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-gradient-to-r from-primary-600 to-primary-800">
      <div className="flex flex-col items-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-6 flex items-center justify-center rounded-full bg-white p-4 shadow-lg"
        >
          <Pill className="h-12 w-12 text-primary-600" />
        </motion.div>
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-3 text-3xl font-bold text-white"
        >
          MediSphere
        </motion.h1>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mb-6 text-primary-100"
        >
          Your medication management solution
        </motion.p>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="h-2 w-48 overflow-hidden rounded-full bg-primary-700"
        >
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            className="h-full w-24 bg-white bg-opacity-30"
          />
        </motion.div>
      </div>
    </div>
  );
};

export default LoadingScreen;