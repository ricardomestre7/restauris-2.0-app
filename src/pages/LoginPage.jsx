import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import LoginCardHeader from '@/components/login/LoginCardHeader';
import EmailConfirmationPanel from '@/components/login/EmailConfirmationPanel';
import LoginForm from '@/components/login/LoginForm';
import SignUpButton from '@/components/login/SignUpButton';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmittingLogin, setIsSubmittingLogin] = useState(false);
  const [isSubmittingSignUp, setIsSubmittingSignUp] = useState(false);
  const [showConfirmationMessage, setShowConfirmationMessage] = useState(false);
  const [emailForConfirmation, setEmailForConfirmation] = useState('');


  return (
    <div className="min-h-screen flex items-center justify-center p-4 quantum-gradient-green-gold quantum-pattern-green-gold-dark">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, type: 'spring', stiffness: 100, damping: 15 }}
      >
        <Card className="w-full max-w-md shadow-2xl quantum-card-dark-green-gold">
          <LoginCardHeader />
          <CardContent className="px-6 sm:px-8 pt-6 pb-8">
            {showConfirmationMessage && <EmailConfirmationPanel email={emailForConfirmation} />}
            <LoginForm 
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              isSubmittingLogin={isSubmittingLogin}
              setIsSubmittingLogin={setIsSubmittingLogin}
              isSubmittingSignUp={isSubmittingSignUp}
              setShowConfirmationMessage={setShowConfirmationMessage}
              setEmailForConfirmation={setEmailForConfirmation}
            />
          </CardContent>
          <CardFooter className="flex flex-col items-center space-y-3 pt-6 pb-8 border-t border-slate-700/50">
            <Link to="#" className="text-sm text-divinity-gold-light hover:text-divinity-gold hover:underline transition-colors">
              Esqueceu sua senha? (Funcionalidade em breve)
            </Link>
            <div className="text-sm text-slate-400">
              Não tem uma conta?{' '}
              <SignUpButton 
                email={email}
                password={password}
                isSubmittingLogin={isSubmittingLogin}
                isSubmittingSignUp={isSubmittingSignUp}
                setIsSubmittingSignUp={setIsSubmittingSignUp}
                setShowConfirmationMessage={setShowConfirmationMessage}
                setEmailForConfirmation={setEmailForConfirmation}
              />
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default LoginPage;