'use client';

import Link from 'next/link';
import { BookOpen, ArrowLeft, Home, Library } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-shelf-dark flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="relative inline-block">
          <div className="w-24 h-24 bg-shelf-gold/10 border border-shelf-gold/30 rounded-2xl flex items-center justify-center mx-auto shadow-2xl backdrop-blur-sm">
            <BookOpen className="w-12 h-12 text-shelf-gold animate-bounce" />
          </div>
          <span className="absolute -top-2 -right-2 px-2.5 py-0.5 bg-shelf-gold text-shelf-dark text-xs font-bold font-mono rounded-full">
            404
          </span>
        </div>

        <div className="space-y-3">
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-white tracking-tight">
            Page Lost in the Stacks
          </h1>
          <p className="text-neutral-400 text-sm sm:text-base leading-relaxed max-w-sm mx-auto">
            The book or page you are looking for has been misplaced or moved to another shelf.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <Link
            href="/dashboard"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-shelf-gold text-shelf-dark rounded-xl font-semibold hover:bg-shelf-goldHover transition-all shadow-lg shadow-shelf-gold/10"
          >
            <Home className="w-4 h-4" />
            Go to Dashboard
          </Link>
          <Link
            href="/books"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 border border-white/10 bg-white/5 text-white rounded-xl font-medium hover:bg-white/10 transition-all"
          >
            <Library className="w-4 h-4" />
            My Collection
          </Link>
        </div>

        <div className="pt-6 border-t border-white/5">
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-1.5 text-xs text-neutral-500 hover:text-shelf-gold transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Go Back to Previous Page
          </button>
        </div>
      </div>
    </div>
  );
}
