'use client';

import BookForm from '@/components/BookForm';
import { ArrowLeft, PlusCircle } from 'lucide-react';
import Link from 'next/link';

export default function NewBookPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-shelf-border">
        <div>
          <Link
            href="/books"
            className="inline-flex items-center gap-2 text-xs font-semibold text-shelf-muted hover:text-shelf-gold uppercase tracking-wider transition-colors mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to My Collection
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-shelf-text">Add a New Book</h1>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-shelf-gold/15 text-shelf-gold text-xs font-semibold">
              <PlusCircle className="w-3.5 h-3.5" /> New Entry
            </span>
          </div>
       
        </div>
      </div>

      <BookForm />
    </div>
  );
}