import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardStats from '@/components/dashboard/DashboardStats';
import DashboardTabs from '@/components/dashboard/DashboardTabs';
import DashboardContent from '@/components/dashboard/DashboardContent';
import useDashboardLogic from '@/hooks/useDashboardLogic';

const DashboardPage = () => {
  const navigate = useNavigate();
  const {
    patients, 
    isLoading,
    error,
    searchTerm,
    setSearchTerm,
    handlePatientAction,
    handlePatientDelete,
    fetchPatients,
    handleExportPatients,
    isExporting,
    stats,
    originalPatientCount 
  } = useDashboardLogic();

  const handleAddNewPatient = () => {
    navigate('/patient-form');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen p-4 md:p-6 lg:p-8 quantum-subtle-pattern"
    >
      <DashboardHeader 
        onAddNewPatient={handleAddNewPatient} 
        onExportPatients={handleExportPatients}
        patientCount={originalPatientCount} 
        isExporting={isExporting}
      />
      
      <DashboardStats stats={stats} />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-card/80 dark:bg-card/60 backdrop-blur-sm shadow-2xl rounded-xl p-4 sm:p-6 mt-6 border border-border/20"
      >
        <DashboardContent
          isLoading={isLoading}
          error={error}
          onRetry={fetchPatients}
          patients={patients}
        />
        <DashboardTabs 
          patients={patients} 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          isLoading={isLoading && originalPatientCount === 0}
          handlePatientAction={handlePatientAction}
          handleDeletePatient={handlePatientDelete}
          handleNewPatient={handleAddNewPatient} 
        />
      </motion.div>
    </motion.div>
  );
};

export default DashboardPage;