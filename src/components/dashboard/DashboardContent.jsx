import React from 'react';
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; 
import { Button } from '@/components/ui/button';

const DashboardContent = ({
  isLoading,
  error,
  onRetry,
  patients,
}) => {

  if (error) {
    return (
      <Alert variant="destructive" className="my-6 quantum-card">
        <AlertTitle className="text-lg font-semibold">Falha ao Carregar Dados</AlertTitle>
        <AlertDescription className="mt-2">
          {typeof error === 'string' ? error : error.message || "Não foi possível carregar as informações dos pacientes."}
          {onRetry && (
            <Button onClick={onRetry} variant="link" className="p-0 h-auto mt-3 text-sm text-destructive-foreground hover:text-destructive-foreground/80">
              Tentar Novamente
            </Button>
          )}
        </AlertDescription>
      </Alert>
    );
  }
  
  if (isLoading && (!patients || patients.length === 0)) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Loader2 className="h-12 w-12 animate-spin text-indigo-500 mb-4" />
        <p className="text-lg font-medium text-muted-foreground">Carregando informações dos pacientes...</p>
        <p className="text-sm text-muted-foreground">Por favor, aguarde um momento.</p>
      </div>
    );
  }

  return null;
};

export default DashboardContent;