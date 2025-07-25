import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { BarChartHorizontal, Info, AlertTriangle } from 'lucide-react';

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
        <p className="label font-semibold text-foreground">{label}</p>
        {payload.map((p, index) => (
          <p key={index} style={{ color: p.color }}>{`${p.name} : ${p.value}%`}</p>
        ))}
      </div>
    );
  }
  return null;
};

const InfoCard = ({ icon, title, text, subtext, colorClass = "sky" }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.3 }}
  >
    <Card className={`quantum-card shadow-xl mt-6 border-${colorClass}-500/50 dark:border-${colorClass}-400/50 border-2`}>
      <CardHeader>
        <CardTitle className={`text-xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-${colorClass}-500 to-${colorClass === 'red' ? 'orange' : 'cyan'}-500 dark:from-${colorClass}-400 dark:to-${colorClass === 'red' ? 'orange' : 'cyan'}-400 flex items-center justify-center`}>
          {icon} {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center py-8">
        <p className="text-muted-foreground">{text}</p>
        {subtext && <p className="text-sm text-muted-foreground/80 mt-1">{subtext}</p>}
      </CardContent>
    </Card>
  </motion.div>
);

const ComparativeBarChart = ({ currentAnalysis, previousAnalysis }) => {
  if (!currentAnalysis?.results?.categories) {
    return (
      <InfoCard 
        icon={<Info className="mr-2 h-6 w-6" />}
        title="Comparativo de Análises"
        text="Dados da análise atual insuficientes para comparação."
        colorClass="amber"
      />
    );
  }

  if (!previousAnalysis) {
    return (
      <InfoCard 
        icon={<Info className="mr-2 h-6 w-6" />}
        title="Comparativo de Análises"
        text="Esta é a primeira análise registrada. Não há dados anteriores para comparação."
        subtext="Realize uma nova análise para visualizar a evolução comparativa."
        colorClass="sky"
      />
    );
  }

  const currentCategories = currentAnalysis.results.categories;
  const previousCategories = previousAnalysis?.results?.categories;

  if (!previousCategories || Object.keys(previousCategories).length === 0) {
    return (
      <InfoCard 
        icon={<AlertTriangle className="mr-2 h-6 w-6" />}
        title="Comparativo Indisponível"
        text="Os dados da análise anterior estão incompletos ou ausentes."
        subtext="Não é possível gerar o gráfico comparativo."
        colorClass="red"
      />
    );
  }

  const chartData = Object.keys(categoryLabels).map(key => ({
    name: categoryLabels[key],
    'Análise Atual': currentCategories[key] || 0,
    'Análise Anterior': previousCategories[key] || 0,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <Card className="quantum-card shadow-xl mt-6 overflow-hidden border border-border/50">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-500 dark:from-green-400 dark:to-emerald-400 flex items-center justify-center">
            <BarChartHorizontal className="mr-2 h-6 w-6" />
            Comparativo de Análises
          </CardTitle>
          <CardDescription className="text-center text-muted-foreground">
            Níveis energéticos da análise atual vs. anterior.
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] md:h-[400px] p-4 relative">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
              <XAxis type="number" domain={[0, 100]} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} />
              <YAxis type="category" dataKey="name" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} width={80} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="Análise Anterior" fill="hsl(var(--muted-foreground) / 0.5)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Análise Atual" fill="hsl(var(--primary) / 0.7)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ComparativeBarChart;