import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, Download, BookText } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const DashboardHeader = ({ onAddNewPatient, onExportPatients, patientCount, isExporting }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleViewProtocol = () => {
    navigate('/protocol-resources');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8 p-6 rounded-xl shadow-xl bg-gradient-to-tr from-slate-900 via-purple-900 to-slate-800 text-white"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-orange-300">
            Painel Lumina Restauris
          </h1>
          <p className="text-slate-300 mt-1 max-w-2xl">
            Bem-vindo(a), {user?.user_metadata?.name || user?.email || 'Terapeuta'}! Aqui você gerencia seus pacientes e suas jornadas de transformação.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button 
            onClick={handleViewProtocol} 
            variant="outline" 
            className="border-sky-400 text-sky-400 hover:bg-sky-400 hover:text-slate-900 transition-colors duration-300"
          >
            <BookText className="mr-2 h-4 w-4" /> 
            Ver Protocolo
          </Button>
          <Button 
            onClick={onExportPatients} 
            variant="outline" 
            className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-slate-900 transition-colors duration-300"
            disabled={patientCount === 0 || isExporting}
          >
            <Download className="mr-2 h-4 w-4" /> 
            {isExporting ? 'Exportando...' : 'Exportar (CSV)'}
          </Button>
          <Button 
            onClick={onAddNewPatient} 
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg transform hover:scale-105 transition-transform duration-300"
          >
            <PlusCircle className="mr-2 h-4 w-4" /> Novo Paciente
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default DashboardHeader;