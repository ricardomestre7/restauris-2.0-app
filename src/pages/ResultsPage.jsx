import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

import LoadingSpinner from '@/components/quantumAnalysis/LoadingSpinner';
import { useResultsPageLogic } from '@/hooks/useResultsPageLogic'; 
import ResultsView from '@/components/results/ResultsView';
import NoAnalysisView from '@/components/results/NoAnalysisView';
import ErrorView from '@/components/results/ErrorView';


const ResultsPage = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const {
    patient,
    currentAnalysis,
    previousAnalysis, 
    allAnalyses,
    isLoading,
    currentPhaseNumber,
    phaseStartDate,
    currentPhaseIdPk,
    handlePhaseUpdate,
    handlePrint,
    handleShare,
  } = useResultsPageLogic(patientId, toast, navigate);

  if (isLoading) return <LoadingSpinner message="Carregando resultados quânticos..." />;

  if (!patient && !isLoading) {
    return <ErrorView message="Paciente não encontrado. Verifique o ID ou retorne ao início." onBack={() => navigate('/')} />;
  }
  
  if (patient && allAnalyses.length === 0 && !isLoading) {
    return (
      <NoAnalysisView
        patient={patient}
        currentPhaseNumber={currentPhaseNumber}
        phaseStartDate={phaseStartDate}
        currentPhaseIdPk={currentPhaseIdPk}
        onPhaseUpdate={handlePhaseUpdate}
        onBack={() => navigate('/')}
        onStartNewAnalysis={() => navigate(`/quantum-analysis/${patientId}`)}
      />
    );
  }
  
  if (patient && allAnalyses.length > 0 && !currentAnalysis && !isLoading) {
    return <ErrorView 
              message="A análise mais recente parece estar incompleta ou corrompida. Por favor, tente realizar uma nova análise ou contate o suporte." 
              onBack={() => navigate(`/quantum-analysis/${patientId}`)} 
              backButtonText="Nova Análise" 
            />;
  }

  if (patient && currentAnalysis && !isLoading) {
    return (
      <ResultsView
        patient={patient}
        currentAnalysis={currentAnalysis} 
        previousAnalysis={previousAnalysis}
        allAnalyses={allAnalyses}
        currentPhaseNumber={currentPhaseNumber}
        phaseStartDate={phaseStartDate}
        currentPhaseIdPk={currentPhaseIdPk}
        onPhaseUpdate={handlePhaseUpdate}
        onPrint={handlePrint}
        onShare={handleShare}
        onBack={() => navigate('/')}
      />
    );
  }

  return <ErrorView message="Ocorreu um erro inesperado ao carregar os dados. Por favor, tente recarregar a página." onBack={() => window.location.reload()} backButtonText="Recarregar Página" />;
};

export default ResultsPage;