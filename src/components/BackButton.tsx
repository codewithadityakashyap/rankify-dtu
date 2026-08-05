'use client';

import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';

export function BackButton({ fallback = '/', label = 'Back' }: { fallback?: string, label?: string }) {
  const router = useRouter();

  return (
    <button 
      onClick={() => {
        if (window.history.length > 2) {
          router.back();
        } else {
          router.push(fallback);
        }
      }} 
      className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6 transition-colors"
    >
      <ChevronLeft className="w-4 h-4 mr-1" /> {label}
    </button>
  );
}
