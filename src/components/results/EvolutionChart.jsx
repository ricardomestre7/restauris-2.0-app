import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { TrendingUp, Info } from 'lucide-react';

const categoryColors = {
  energetico: 'hsl(346, 82%, 60%)', // Red-pink
  emocional: 'hsl(210, 82%, 60%)', // Blue
  mental: 'hsl(45, 100%, 51%)', // Yellow
  fisico: 'hsl(160, 67%, 51%)', // Green-cyan
  espiritual: 'hsl(260, 82%, 65%)', // Purple
};

const categoryLabels = {
  energetico: "Energético",
  emocional: "Emocional",
  mental: "Mental",
  fisico: "Físico",
  espiritual: "Espiritual",
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-3 bg-background/80 backdrop-blur-sm shadow-lg rounded-lg border border-border">
        <p className="label font-semibold text-foreground">{`Análise: ${label}`}</p>
        {payload.map((p, index) => (
          <p key={index} style={{ color: p.color }}>{`${p.name}: ${p.value}%`}</p>
        ))}
      </div>
    );
  }
  return null;
};

const EvolutionChart = ({ historyData }) => {
  if (!historyData || historyData.length < 2) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="quantum-card shadow-xl mt-6 border border-border/50">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-600 dark:from-blue-400 dark:to-teal-400 flex items-center justify-center">
              <Info className="mr-2 h-7 w-7" />
              Evolução do Paciente
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center py-10">
            <p className="text-muted-foreground">É necessária pelo menos duas análises para exibir a evolução.</p>
            <p className="text-sm text-muted-foreground/80 mt-2">Realize uma nova análise para acompanhar o progresso.</p>
          </CardContent>
        </Card>
      </motion.div>
    );
  }
  
  const validAnalyses = historyData
    .filter(a => a?.results?.categories && Object.keys(a.results.categories).length > 0)
    .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

  if (validAnalyses.length < 2) {
     return (
       <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
        <Card className="quantum-card shadow-xl mt-6 border border-amber-500/50 dark:border-amber-400/50 border-2">
          <CardHeader>
              <CardTitle className="text-2xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-500 dark:from-amber-400 dark:to-orange-400 flex items-center justify-center">
                 <Info className="mr-2 h-7 w-7" />
                  Dados Incompletos para Evolução
              </CardTitle>
          </CardHeader>
          <CardContent className="text-center py-10">
              <p className="text-muted-foreground">O histórico não contém análises válidas suficientes para gerar o gráfico.</p>
          </CardContent>
        </Card>
       </motion.div>
    );
  }
  
  const chartData = validAnalyses.map((analysis, index) => {
    const dataPoint = {
      name: `Análise ${index + 1} (${new Date(analysis.created_at).toLocaleDateString('pt-BR')})`,
    };
    Object.keys(categoryLabels).forEach(key => {
      dataPoint[key] = analysis.results.categories[key] || 0;
    });
    return dataPoint;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="quantum-card shadow-xl mt-6 overflow-hidden border border-border/50">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-600 dark:from-blue-400 dark:to-teal-400 flex items-center justify-center">
            <TrendingUp className="mr-2 h-7 w-7" />
            Evolução do Paciente
          </CardTitle>
          <CardDescription className="text-center text-muted-foreground">
            Progresso dos níveis energéticos ao longo do tempo.
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[350px] md:h-[450px] p-4 relative">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 30, left: -10, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
              <XAxis dataKey="name" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} angle={-20} textAnchor="end" height={50} />
              <YAxis domain={[0, 100]} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ paddingBottom: '20px' }} />
              {Object.keys(categoryLabels).map((key) => (
                <Line 
                  key={key} 
                  type="monotone" 
                  dataKey={key} 
                  name={categoryLabels[key]} 
                  stroke={categoryColors[key]} 
                  strokeWidth={2}
                  activeDot={{ r: 8 }} 
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default EvolutionChart;