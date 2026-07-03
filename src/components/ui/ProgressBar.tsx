'use client';

import { motion } from 'framer-motion';

interface ProgressBarProps {
  current: number;
  total: number;
  label?: string;
  colour?: string;
}

export default function ProgressBar({ current, total, label, colour = 'bg-zinc-900' }: ProgressBarProps) {
  const percentage = Math.round((current / total) * 100);

  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <div className="flex justify-between items-center text-xs font-medium font-mono text-zinc-500">
          <span>{label}</span>
          <span>
            {current}/{total}
          </span>
        </div>
      )}
      <div className="w-full h-1.5 bg-zinc-200/50 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'circOut' }}
          className={`h-full rounded-full ${colour}`}
        />
      </div>
    </div>
  );
}
