import React from 'react';
import { motion } from 'framer-motion';

const pageVariants = {
  initial: {
    opacity: 0,
    x: "-5vw", 
    scale: 0.98
  },
  in: {
    opacity: 1,
    x: 0,
    scale: 1
  },
  out: {
    opacity: 0,
    x: "5vw", 
    scale: 1.02
  }
};

const pageTransition = {
  type: "tween",
  ease: "anticipate", 
  duration: 0.4 
};

const AnimatedPage = ({ children }) => {
  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedPage;