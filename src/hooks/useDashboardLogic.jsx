import { useState, useEffect, useCallback } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import { getAllPatients, deletePatientById } from '@/lib/patientDataUtils';

const useDashboardLogic = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [patients, setPatients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    withAnalysis: 0,
    newLast7Days: 0,
  });

  const fetchPatients = useCallback(async () => {
    if (!user || !user.id) {
      setError("Usuário não autenticado. Não é possível carregar os dados.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await getAllPatients(user.id);
      if (fetchError) {
        throw new Error(fetchError.message || "Ocorreu um erro desconhecido.");
      }
      
      const sortedPatients = data ? data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)) : [];
      setPatients(sortedPatients);
      calculateStats(sortedPatients);

    } catch (err) {
      console.error("Falha ao buscar pacientes:", err);
      setError(err.message);
      toast({
        title: "Falha ao Carregar Dados",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [user, toast]);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  const calculateStats = (currentPatients) => {
    const total = currentPatients.length;
    const withAnalysis = currentPatients.filter(p => p.has_analysis).length;
    
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const newLast7Days = currentPatients.filter(p => new Date(p.created_at) >= sevenDaysAgo).length;

    setStats({ total, withAnalysis, newLast7Days });
  };

  const handleDeletePatient = async (patientId) => {
    try {
      const { error: deleteError } = await deletePatientById(patientId);
      if (deleteError) {
        throw new Error(deleteError.message || "Não foi possível remover o paciente.");
      }
      
      toast({
        title: "Paciente Removido",
        description: "O paciente foi removido com sucesso.",
        className: "bg-green-500 text-white dark:bg-green-600",
      });
      
      setPatients(prev => prev.filter(p => p.id !== patientId));
      calculateStats(patients.filter(p => p.id !== patientId));

    } catch (err) {
      console.error("Erro ao remover paciente:", err);
      toast({
        title: "Erro ao Remover",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  return {
    patients,
    isLoading,
    error,
    stats,
    handleDeletePatient,
    fetchPatients,
  };
};

export default useDashboardLogic;