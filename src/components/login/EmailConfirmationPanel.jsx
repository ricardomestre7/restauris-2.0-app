import React from 'react';
import { motion } from 'framer-motion';
import { MailCheck } from 'lucide-react';

const EmailConfirmationPanel = ({ email }) => {
  if (!email) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6 p-4 bg-divinity-gold/10 border border-divinity-gold rounded-md text-center"
    >
      <MailCheck className="h-10 w-10 text-divinity-gold mx-auto mb-2" />
      <p className="text-lg font-semibold text-divinity-gold">Confirmação Necessária!</p>
      <p className="text-sm text-slate-200">
        <strong className="text-divinity-gold">Importante:</strong> Enviamos um link de confirmação para <strong className="text-slate-100">{email}</strong>. 
        Por favor, verifique sua caixa de entrada (incluindo as pastas de spam/lixo eletrônico) e clique no link fornecido para ativar sua conta. Sem esta etapa, o login não será possível.
      </p>
    </motion.div>
  );
};

export default EmailConfirmationPanel;