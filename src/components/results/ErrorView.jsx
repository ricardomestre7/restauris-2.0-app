import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, ChevronLeft } from 'lucide-react';

const ErrorView = ({ message, onBack, backButtonText = "Voltar ao Dashboard" }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
      <AlertTriangle className="w-16 h-16 text-red-500 mb-4" />
      <h2 className="text-2xl font-semibold mb-2">Erro</h2>
      <p className="text-muted-foreground mb-4">{message}</p>
      <Button onClick={onBack}>
        <ChevronLeft className="mr-2 h-4 w-4" />
        {backButtonText}
      </Button>
    </div>
  );
};

export default ErrorView;