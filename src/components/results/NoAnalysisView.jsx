import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, ChevronLeft } from 'lucide-react';
import ResultsHeader from '@/components/results/ResultsHeader';
import PatientDetailsCard from '@/components/results/PatientDetailsCard';
import PatientPhaseManager from '@/components/results/PatientPhaseManager';

const NoAnalysisView = ({
  patient,
  currentPhaseNumber,
  phaseStartDate,
  currentPhaseIdPk,
  onPhaseUpdate,
  onBack,
  onStartNewAnalysis
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
      <ResultsHeader patientName={patient.name} onBack={onBack} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 w-full max-w-4xl">
        <PatientDetailsCard patient={patient} currentPhaseNumber={currentPhaseNumber} phaseStartDate={phaseStartDate} />
        <PatientPhaseManager 
            patientId={patient.id} 
            currentPhaseIdPk={currentPhaseIdPk}
            currentPhaseNumber={currentPhaseNumber}
            onPhaseUpdate={onPhaseUpdate}
        />
      </div>
      <AlertTriangle className="w-16 h-16 text-yellow-500 my-8" />
      <h2 className="text-2xl font-semibold mb-2">Nenhuma Análise Encontrada</h2>
      <p className="text-muted-foreground mb-4">Este paciente ainda não possui uma análise quântica registrada.</p>
      <div className="space-x-4">
        <Button onClick={onBack}><ChevronLeft className="mr-2 h-4 w-4" />Voltar ao Dashboard</Button>
        <Button onClick={onStartNewAnalysis} variant="outline">Iniciar Nova Análise</Button>
      </div>
    </div>
  );
};

export default NoAnalysisView;