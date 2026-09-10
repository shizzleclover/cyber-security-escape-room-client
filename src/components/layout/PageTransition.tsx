'use client';

/**
 * @fileoverview PageTransition.tsx
 * @module layout/PageTransition.tsx
 * 
 * React Component/Page for the CyberEscape platform.
 * This file handles logic specific to its directory domain.
 */


import { motion } from 'framer-motion';
import { ReactNode } from 'react';

export default function PageTransition({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ 
        type: 'spring',
        stiffness: 100,
        damping: 20,
        mass: 0.8
      }}
    >
      {children}
    </motion.div>
  );
}
