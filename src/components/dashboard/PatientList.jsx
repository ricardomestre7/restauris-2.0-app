import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PatientCard from '@/components/dashboard/PatientCard';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07 }
  }
};

const PatientList = ({ patients, onPatientAction, onPatientDelete }) => {
  return (
    <motion.div 
      layout
      className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <AnimatePresence>
        {patients.map((patient) => (
          <PatientCard 
            key={patient.id} 
            patient={patient} 
            onAction={onPatientAction} 
            onDelete={onPatientDelete}
          />
        ))}
      </AnimatePresence>
    </motion.div>
  );
};

export default PatientList;