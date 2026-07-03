'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hoverable?: boolean;
  onClick?: () => void;
}

export default function Card({ children, className = '', hoverable = false, onClick }: CardProps) {
  return (
    <motion.div
      whileHover={hoverable ? { y: -2 } : undefined}
      onClick={onClick}
      className={`
        bg-white rounded-xl border border-zinc-200/60 p-5
        ${hoverable ? 'cursor-pointer hover:border-zinc-300 transition-colors duration-200' : ''}
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
}
