import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AlertTriangle, TrendingUp, UserCheck, FileText, BarChart3, BarChartHorizontal } from 'lucide-react';

import ResultsHeader from '@/components/results/ResultsHeader';
import PatientDetailsCard from '@/components/results/PatientDetailsCard';
import AnalysisInfoCard from '@/components/results/AnalysisInfoCard';
import QuantumCharts from '@/components/results/QuantumCharts';
import PersonalizedRecommendations from '@/components/results/PersonalizedRecommendations';
import ResultsActions from '@/components/results/ResultsActions';
import EvolutionChart from '@/components/results/EvolutionChart';
import PatientPhaseManager from '@/components/results/PatientPhaseManager';
import ComparativeBarChart from '@/components/results/ComparativeBarChart';

const ResultsView = ({
  patient,
  currentAnalysis,
  previousAnalysis,
  allAnalyses,
  currentPhaseNumber,
  phaseStartDate,
  currentPhaseIdPk,
  onPhaseUpdate,
  onPrint,
  onShare,
  onBack,
}) => {
  const hasValidCurrentAnalysis = currentAnalysis && currentAnalysis.results && currentAnalysis.results.categories && Object.keys(currentAnalysis.results.categories).length > 0;
  const hasHistoryForEvolution = allAnalyses && allAnalyses.length > 0 && allAnalyses.some(a => a?.results?.categories && Object.keys(a.results.categories).length > 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="container mx-auto p-4 md:p-8 print:p-0"
    >
      <ResultsHeader patientName={patient.name} onBack={onBack} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 print:grid-cols-3">
        <div className="md:col-span-2 print:col-span-2">
            <PatientDetailsCard patient={patient} currentPhaseNumber={currentPhaseNumber} phaseStartDate={phaseStartDate} />
        </div>
        <ResultsActions onPrint={onPrint} onShare={onShare} patientId={patient.id} />
      </div>
      
      <div className="mb-8 print:hidden">
        <PatientPhaseManager 
          patientId={patient.id} 
          currentPhaseIdPk={currentPhaseIdPk}
          currentPhaseNumber={currentPhaseNumber}
          onPhaseUpdate={onPhaseUpdate}
        />
      </div>

      {/* Seção da Análise Mais Recente */}
      {currentAnalysis && (
        <Card className="quantum-card shadow-xl my-8 border border-border/50">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 flex items-center">
              <FileText size={28} className="mr-3 text-indigo-500" />
              Análise Mais Recente
            </CardTitle>
            <AnalysisInfoCard 
              analysisResults={currentAnalysis.results} 
              analysisDate={currentAnalysis.created_at} 
              analysisId={currentAnalysis.id ? currentAnalysis.id.substring(0, 8) : 'N/A'} 
            />
          </CardHeader>
          <CardContent>
            {hasValidCurrentAnalysis ? (
              <QuantumCharts analysisData={currentAnalysis} />
            ) : (
              <div className="text-center py-8 my-4 bg-amber-50 dark:bg-amber-900/30 p-6 rounded-lg border border-amber-300 dark:border-amber-700">
                <AlertTriangle className="mx-auto h-12 w-12 text-amber-500 dark:text-amber-400 mb-3" />
                <h3 className="text-xl font-semibold text-amber-700 dark:text-amber-300 mb-2">Gráfico Indisponível</h3>
                <p className="text-amber-600 dark:text-amber-400">
                  Os dados da análise mais recente estão incompletos para gerar o gráfico de radar. 
                  Pode ser necessário realizar uma nova análise.
                </p>
              </div>
            )}
            {currentAnalysis.recommendations && (
              <PersonalizedRecommendations recommendations={currentAnalysis.recommendations} />
            )}
          </CardContent>
        </Card>
      )}
      
      {!currentAnalysis && allAnalyses && allAnalyses.length > 0 && (
         <Card className="quantum-card shadow-xl my-8 border border-border/50">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600 dark:from-red-400 dark:to-orange-400 flex items-center">
              <AlertTriangle size={28} className="mr-3 text-red-500" />
              Problema com Análise Recente
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center py-8 my-4 bg-red-50 dark:bg-red-900/30 p-6 rounded-lg border border-red-300 dark:border-red-700">
            <p className="text-red-600 dark:text-red-400">
              Não foi possível carregar os detalhes completos da análise mais recente. O gráfico de radar e as recomendações podem não estar disponíveis.
              Tente realizar uma nova análise quântica para este paciente.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Seção de Gráficos Adicionais */}
      {currentAnalysis && (
        <Card className="quantum-card shadow-xl my-8 border border-border/50">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-teal-600 dark:from-green-400 dark:to-teal-400 flex items-center">
              <BarChartHorizontal size={28} className="mr-3 text-green-500" />
              Visualizações Adicionais
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ComparativeBarChart currentAnalysis={currentAnalysis} previousAnalysis={previousAnalysis} />
          </CardContent>
        </Card>
      )}


      {/* Seção de Evolução do Paciente */}
      {hasHistoryForEvolution ? (
         <EvolutionChart historyData={allAnalyses} />
      ) : (
        allAnalyses && allAnalyses.length > 0 && ( 
          <Card className="quantum-card shadow-xl my-8 border border-border/50">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-cyan-600 dark:from-sky-400 dark:to-cyan-400 flex items-center">
                <BarChart3 size={28} className="mr-3 text-sky-500" />
                Evolução do Paciente
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center py-8 my-4 bg-sky-50 dark:bg-sky-900/30 p-6 rounded-lg border border-sky-300 dark:border-sky-700">
              <AlertTriangle className="mx-auto h-12 w-12 text-sky-500 dark:text-sky-400 mb-3" />
              <h3 className="text-xl font-semibold text-sky-700 dark:text-sky-300 mb-2">Gráfico de Evolução Indisponível</h3>
              <p className="text-sky-600 dark:text-sky-400">
                Nenhuma das análises anteriores contém dados de categorias suficientes para gerar o gráfico de evolução. 
                Verifique as análises ou realize uma nova completa.
              </p>
            </CardContent>
          </Card>
        )
      )}
      
    </motion.div>
  );
};

export default ResultsView;