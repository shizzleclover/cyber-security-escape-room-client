'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';
import { motion } from 'framer-motion';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
}

const variants = {
  primary: 'bg-zinc-900 text-white shadow-sm hover:shadow-md hover:bg-zinc-800 focus:ring-zinc-400',
  secondary: 'bg-white text-zinc-900 border border-zinc-200 shadow-sm hover:border-zinc-300 hover:shadow-md hover:bg-zinc-50 focus:ring-zinc-300',
  danger: 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 focus:ring-red-300',
  ghost: 'bg-transparent text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 focus:ring-zinc-200',
};

const sizes = {
  sm: 'px-4 py-2 text-xs',
  md: 'px-6 py-3 text-sm',
  lg: 'px-8 py-4 text-base',
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', fullWidth = false, loading = false, className = '', children, disabled, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
        whileTap={{ scale: disabled || loading ? 1 : 0.96 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        className={`
          inline-flex items-center justify-center
          font-bold rounded-full
          transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#F7F7F8]
          disabled:opacity-50 disabled:cursor-not-allowed
          ${variants[variant]}
          ${sizes[size]}
          ${fullWidth ? 'w-full' : ''}
          ${className}
        `}
        disabled={disabled || loading}
        {...(props as any)}
      >
        {loading && (
          <div className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin mr-2" />
        )}
        {children}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
