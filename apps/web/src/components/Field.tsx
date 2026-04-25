'use client';

import { InputHTMLAttributes, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/cn';

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
}

export function Field({ label, error, hint, className, type, ...props }: FieldProps) {
  const [show, setShow] = useState(false);
  const isPassword = type === 'password';
  const resolvedType = isPassword ? (show ? 'text' : 'password') : type;

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-ink-2">{label}</label>
      <div className="relative">
        <input
          type={resolvedType}
          className={cn(
            'w-full px-3.5 py-2.5 bg-surface-2 border rounded-md text-sm text-ink placeholder:text-ink-4',
            'transition-all duration-150',
            'focus:bg-surface focus:border-primary focus:ring-2 focus:ring-primary/20',
            error ? 'border-red-400 focus:border-red-400 focus:ring-red-100' : 'border-border hover:border-border-strong',
            isPassword ? 'pr-10' : '',
            className,
          )}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-4 hover:text-ink-3 transition-colors"
            tabIndex={-1}
          >
            {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
      {hint && !error && <p className="text-xs text-ink-4">{hint}</p>}
    </div>
  );
}
