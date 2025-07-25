import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { useResultsPageLogic } from '@/hooks/useResultsPageLogic';
import LoadingSpinner from '@/components/quantumAnalysis/LoadingSpinner';
import ErrorView from '@/components/results/ErrorView';
import PageHeader from '@/components/PageHeader';
import PatientDetailsCard from '@/components/results/PatientDetailsCard';
import EvolutionChart from '@/components/results/EvolutionChart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Calendar, FileText, BookOpen } from 'lucide-react';
import JournalEntriesList from '@/components/journal/JournalEntriesList';

const TimelineItem = ({ icon: Icon, title, date, children, colorClass }) => (
  <div className="flex items-start space-x-4">
    <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br ${colorClass}`}>
      <Icon className="w-6 h-6 text-white" />
    </div>
    <div className="flex-grow pb-8 border-l-2 border-slate-200 dark:border-slate-700 pl-4">
      <div className="transform -translate-y-1.5">
        <p className="text-xs text-muted-foreground">{new Date(date).toLocaleString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
        <h4 className="font-semibold text-foreground">{title}</h4>
        <div className="text-sm text-muted-foreground mt-1">{children}</div>
      </div>
    </div>
  </div>
);

const PatientEvolutionPage = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const {
    patient,
    allAnalyses,
    journalEntries,
    isLoading,
    currentPhaseNumber,
    phaseStartDate,
  } = useResultsPageLogic(patientId, toast, navigate);

  if (isLoading) return <LoadingSpinner message="Carregando histórico de evolução..." />;
  if (!patient) return <ErrorView message="Paciente não encontrado." onBack={() => navigate('/')} />;

  const sortedTimelineEvents = [
    ...(allAnalyses || []).map(a => ({ type: 'analysis', ...a })),
    ...(journalEntries || []).map(j => ({ type: 'journal', ...j, created_at: j.entry_date })),
  ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto p-4 md:p-8"
    >
      <PageHeader
        title={`Jornada de ${patient.name}`}
        description="Uma visão completa da evolução, análises e registros do paciente."
        icon={<TrendingUp />}
        onBack={() => navigate('/')}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className="quantum-card shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <TrendingUp className="mr-2 h-6 w-6 text-indigo-500" />
                Gráfico de Evolução Quântica
              </CardTitle>
            </CardHeader>
            <CardContent>
              <EvolutionChart historyData={allAnalyses} />
            </CardContent>
          </Card>
          
          <Card className="quantum-card shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <Calendar className="mr-2 h-6 w-6 text-purple-500" />
                Linha do Tempo da Jornada
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <div className="absolute left-6 top-0 h-full w-0.5 bg-slate-200 dark:bg-slate-700" aria-hidden="true"></div>
                {sortedTimelineEvents.map((event, index) => (
                  <TimelineItem
                    key={`${event.type}-${event.id}-${index}`}
                    icon={event.type === 'analysis' ? FileText : BookOpen}
                    title={event.type === 'analysis' ? `Análise Quântica #${allAnalyses.length - allAnalyses.findIndex(a => a.id === event.id)}` : 'Entrada no Diário'}
                    date={event.created_at}
                    colorClass={event.type === 'analysis' ? 'from-indigo-500 to-purple-600' : 'from-emerald-500 to-green-600'}
                  >
                    {event.type === 'analysis' && (
                      <ul className="text-xs list-disc pl-4">
                        {Object.entries(event.results?.categories || {}).map(([key, value]) => (
                          <li key={key}>{`${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}%`}</li>
                        ))}
                      </ul>
                    )}
                    {event.type === 'journal' && (
                      <p className="text-xs italic">"{event.insights || event.symptoms || 'Registro de observações.'}"</p>
                    )}
                  </TimelineItem>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1 space-y-8">
          <PatientDetailsCard patient={patient} currentPhaseNumber={currentPhaseNumber} phaseStartDate={phaseStartDate} />
          <Card className="quantum-card shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <BookOpen className="mr-2 h-6 w-6 text-emerald-500" />
                Últimas Entradas do Diário
              </CardTitle>
            </CardHeader>
            <CardContent>
              <JournalEntriesList entries={journalEntries.slice(0, 3)} />
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default PatientEvolutionPage;