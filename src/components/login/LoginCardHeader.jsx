import React from 'react';
import { motion } from 'framer-motion';
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const LoginCardHeader = () => {
  return (
    <CardHeader className="text-center pt-8">
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.15, type: 'spring', stiffness: 150, damping: 10 }}
        className="flex justify-center mb-6"
      >
        <div className="p-1 bg-divinity-gold/10 rounded-full inline-block quantum-glow-gold">
          <img  
            alt="Lumina Restauris Logomarca"
            className="w-20 h-20 object-contain" 
            src="https://storage.googleapis.com/hostinger-horizons-assets-prod/f9c256f6-ea15-437b-9c07-58682ae75567/092c86dcdeeee6e2ee447e05857322cf.png" />
        </div>
      </motion.div>
      <CardTitle className="text-4xl font-bold quantum-text-gold-gradient mb-1">
        Lumina Restauris
      </CardTitle>
      <CardDescription className="text-slate-300 text-sm">
        Acesse para restaurar sua saúde e iluminação quântica.
      </CardDescription>
    </CardHeader>
  );
};

export default LoginCardHeader;