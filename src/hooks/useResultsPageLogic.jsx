import { useState, useEffect, useCallback } from 'react';
import { getPatientById, getPatientCurrentPhase } from '@/lib/patientDataUtils';
import { getAnalysesForPatient } from '@/lib/analysisDataUtils';
import { getJournalEntriesForPatient } from '@/lib/journalUtils';

export const useResultsPageLogic = (patientId, toast, navigate) => {
  const [patient, setPatient] = useState(null);
  const [currentAnalysis, setCurrentAnalysis] = useState(null);
  const [previousAnalysis, setPreviousAnalysis] = useState(null);
  const [allAnalyses, setAllAnalyses] = useState([]);
  const [journalEntries, setJournalEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPhaseNumber, setCurrentPhaseNumber] = useState(1);
  const [phaseStartDate, setPhaseStartDate] = useState(null);
  const [currentPhaseIdPk, setCurrentPhaseIdPk] = useState(null);

  const fetchData = useCallback(async () => {
    if (!patientId) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const { data: patientData, error: patientError } = await getPatientById(patientId);
      if (patientError || !patientData) {
        throw new Error(patientError?.message || 'Paciente não encontrado.');
      }
      setPatient(patientData);

      const analysesResult = await getAnalysesForPatient(patientId);
      if (analysesResult.error) throw analysesResult.error;
      
      const sortedAnalyses = analysesResult.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setAllAnalyses(sortedAnalyses);
      setCurrentAnalysis(sortedAnalyses[0] || null);
      setPreviousAnalysis(sortedAnalyses[1] || null);

      const { data: phaseData, error: phaseError } = await getPatientCurrentPhase(patientId);
      if (phaseError) {
        console.warn("Could not fetch patient phase, might not exist yet.", phaseError.message);
      }
      
      if (phaseData) {
        setCurrentPhaseNumber(phaseData.phase_number);
        setPhaseStartDate(phaseData.phase_start_date);
        setCurrentPhaseIdPk(phaseData.id);
      }

      const journalResult = await getJournalEntriesForPatient(patientId);
      if (journalResult.data) {
        setJournalEntries(journalResult.data);
      }

    } catch (error) {
      console.error("Error fetching results page data:", error);
      toast({
        title: 'Erro ao Carregar Dados',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [patientId, toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handlePhaseUpdate = (newPhaseNumber, newPhaseStartDate, newPhaseIdPk) => {
    setCurrentPhaseNumber(newPhaseNumber);
    setPhaseStartDate(newPhaseStartDate);
    setCurrentPhaseIdPk(newPhaseIdPk);
  };

  const handlePrint = () => {
    toast({ title: "Imprimir", description: "Preparando para impressão..." });
    setTimeout(() => window.print(), 500);
  };

  const handleShare = async () => {
    const shareData = {
      title: `Resultados Quânticos de ${patient?.name}`,
      text: `Confira os resultados da análise quântica de ${patient?.name} na plataforma Lumina Restauris.`,
      url: window.location.href,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
        toast({ title: "Compartilhado!", description: "Link dos resultados compartilhado com sucesso." });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast({ title: "Link Copiado!", description: "O link para os resultados foi copiado para a área de transferência." });
      }
    } catch (error) {
      console.error('Error sharing:', error);
      toast({
        title: "Erro ao Compartilhar",
        description: "Não foi possível compartilhar os resultados.",
        variant: "destructive",
      });
    }
  };

  return {
    patient,
    currentAnalysis,
    previousAnalysis,
    allAnalyses,
    journalEntries,
    isLoading,
    currentPhaseNumber,
    phaseStartDate,
    currentPhaseIdPk,
    handlePhaseUpdate,
    handlePrint,
    handleShare,
  };
};