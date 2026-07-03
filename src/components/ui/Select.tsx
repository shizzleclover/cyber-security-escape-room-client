'use client';

import { SelectHTMLAttributes, forwardRef } from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: SelectOption[];
  error?: string;
  placeholder?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, error, placeholder = 'Select an option', className = '', id, ...props }, ref) => {
    const selectId = id || label.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="space-y-1.5">
        <label htmlFor={selectId} className="block text-sm font-medium text-zinc-900">
          {label}
        </label>
        <select
          ref={ref}
          id={selectId}
          className={`
            w-full px-3 py-2 rounded-lg
            bg-white ring-1 ring-zinc-200
            text-zinc-900
            focus:outline-none focus:ring-2 focus:ring-zinc-800
            transition-all duration-150
            text-sm appearance-none
            ${error ? 'ring-red-300 focus:ring-red-500' : ''}
            ${className}
          `}
          {...props}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;
