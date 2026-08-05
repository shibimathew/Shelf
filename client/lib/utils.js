import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const statusConfig = {
  'Want to Read': {
    color: 'bg-amber-50 text-amber-800 border-amber-200',
    icon: '📖',
    label: 'Want to Read',
  },
  'Reading': {
    color: 'bg-sky-50 text-sky-800 border-sky-200',
    icon: '📘',
    label: 'Reading',
  },
  'Completed': {
    color: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    icon: '✅',
    label: 'Completed',
  },
};

export const statusColors = {
  'Want to Read': 'bg-amber-100 text-amber-800',
  'Reading': 'bg-sky-100 text-sky-800',
  'Completed': 'bg-emerald-100 text-emerald-800',
};
