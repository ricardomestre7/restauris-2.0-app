import React from 'react';
import { motion } from 'framer-motion';
import PageHeader from '@/components/PageHeader';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { protocolResourcesByPhase } from '@/lib/protocolResources';
import { Sparkles, BookOpen, Brain, Leaf, Music, Video, Wind, Apple, ClipboardList, ShieldCheck, Sun, Zap, FileText, Link as LinkIcon, GitBranch, Gem, Star, Moon, Waves, Feather, Palette } from 'lucide-react';
import { cn } from "@/lib/utils";

const phaseDetails = {
  1: {
    title: "FASE 1 – Liberação (Lumina Libertas)",
    icon: <Moon className="h-8 w-8 text-indigo-400" />,
    gradient: "from-indigo-500 to-purple-600",
    description: "Soltar o que não serve mais, limpando o campo para o novo."
  },
  2: {
    title: "FASE 2 – Regeneração (Lumina Vitalis)",
    icon: <Leaf className="h-8 w-8 text-emerald-400" />,
    gradient: "from-emerald-500 to-green-600",
    description: "Nutrir e reconstruir a energia vital, despertando a força interior."
  },
  3: {
    title: "FASE 3 – Equilíbrio (Lumina Equilibrium)",
    icon: <Waves className="h-8 w-8 text-sky-400" />,
    gradient: "from-sky-500 to-cyan-600",
    description: "Harmonizar corpo, mente e espírito, encontrando o centro."
  },
  4: {
    title: "FASE 4 – Expansão da Consciência (Lumina Claritas)",
    icon: <Star className="h-8 w-8 text-amber-400" />,
    gradient: "from-amber-500 to-yellow-600",
    description: "Ampliar a percepção e conectar-se com a sabedoria superior."
  },
  5: {
    title: "FASE 5 – Realinhamento Multidimensional (Lumina Axis)",
    icon: <Gem className="h-8 w-8 text-rose-400" />,
    gradient: "from-rose-500 to-pink-600",
    description: "Ajustar o campo energético em múltiplas dimensões e linhagens."
  },
  6: {
    title: "FASE 6 – Integração Luminar (Lumina Unitas)",
    icon: <Sun className="h-8 w-8 text-orange-400" />,
    gradient: "from-orange-500 to-red-600",
    description: "Unificar a jornada, celebrar a transformação e irradiar a nova luz."
  },
};

const iconMap = {
  ClipboardList: ClipboardList,
  Wind: Wind,
  Music: Music,
  Leaf: Leaf,
  BookOpen: BookOpen,
  Zap: Zap,
  Sun: Sun,
  Palette: Palette,
  GitBranch: GitBranch,
  Gem: Gem,
  Star: Star,
  Feather: Feather,
  Default: Sparkles,
};

const getIcon = (iconName) => {
  const IconComponent = iconMap[iconName] || iconMap.Default;
  return <IconComponent className="h-5 w-5" />;
};

const ProtocolResourcesPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-8 pb-12"
    >
      <PageHeader
        title="Técnicas do Protocolo Lumina Restauris"
        description="Um guia completo com as ferramentas e práticas de cada fase da jornada de transformação quântica."
      />

      {Object.entries(protocolResourcesByPhase).map(([phase, resources], phaseIndex) => {
        const details = phaseDetails[phase];
        return (
          <motion.section
            key={phase}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: phaseIndex * 0.15, duration: 0.5 }}
            className={cn(
              "p-4 sm:p-6 rounded-2xl shadow-2xl border border-white/10",
              `bg-gradient-to-br ${details.gradient}`
            )}
          >
            <div className="flex items-start sm:items-center space-x-4 mb-4">
              <div className="p-3 bg-black/20 rounded-full">{details.icon}</div>
              <div>
                <h2 className="text-2xl font-bold text-white tracking-tight">{details.title}</h2>
                <p className="text-sm text-white/80">{details.description}</p>
              </div>
            </div>
            
            <Accordion type="single" collapsible className="w-full space-y-3">
              {resources.map((resource, resourceIndex) => (
                <motion.div
                  key={resource.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: resourceIndex * 0.05 + (phaseIndex * 0.15), duration: 0.4 }}
                >
                  <AccordionItem value={resource.id} className="border-b-0 bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden">
                    <AccordionTrigger className="p-4 text-left hover:bg-white/20 transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent rounded-lg">
                      <div className="flex items-start text-base font-medium text-white w-full">
                        <span className="mr-4 mt-1 p-2 bg-black/20 rounded-full shrink-0">
                          {getIcon(resource.icon)}
                        </span>
                        <span className="flex-grow">{resource.title}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="p-4 bg-black/10">
                      <p className="text-white/90 text-sm leading-relaxed">{resource.description}</p>
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>
          </motion.section>
        );
      })}
    </motion.div>
  );
};

export default ProtocolResourcesPage;