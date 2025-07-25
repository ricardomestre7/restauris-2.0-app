import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { AlertTriangle, Zap } from 'lucide-react';

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
        <p className="font-semibold text-foreground">{label}</p>
        <p className="text-primary">{`${payload[0].name} : ${payload[0].value}%`}</p>
      </div>
    );
  }
  return null;
};

const QuantumCharts = ({ analysisData }) => {
  const categoriesData = analysisData?.results?.categories;

  if (!analysisData || !categoriesData || Object.keys(categoriesData).length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="quantum-card shadow-xl border-red-500/50 dark:border-red-400/50 border-2">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500 dark:from-red-400 dark:to-orange-400 flex items-center justify-center">
              <AlertTriangle className="mr-2 h-7 w-7" />
              Visualização Indisponível
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">
              Não foi possível carregar os dados para o gráfico de radar. Verifique se a análise foi concluída corretamente.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  const chartData = Object.keys(categoriesData).map(key => ({
    subject: categoryLabels[key] || key.charAt(0).toUpperCase() + key.slice(1),
    value: categoriesData[key],
    fullMark: 100,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="quantum-card shadow-xl overflow-hidden border border-border/50">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 flex items-center justify-center">
             <Zap className="mr-2 h-7 w-7" />
            Visualização Quântica
          </CardTitle>
          <CardDescription className="text-center text-muted-foreground">
            Representação gráfica dos níveis energéticos da análise mais recente.
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[350px] md:h-[450px] p-4 relative">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
              <PolarGrid stroke="hsl(var(--border) / 0.5)" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} />
              <Radar name="Nível Energético" dataKey="value" stroke="hsl(var(--primary))" fill="hsl(var(--primary) / 0.3)" fillOpacity={0.6} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
            </RadarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default QuantumCharts;