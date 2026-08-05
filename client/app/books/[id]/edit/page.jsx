'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { bookAPI } from '@/lib/api';
import { useAuth } from '@/components/AuthProvider';
import BookForm from '@/components/BookForm';
import { ArrowLeft, Pencil } from 'lucide-react';
import Link from 'next/link';

export default function EditBookPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    if (params.id) {
      bookAPI
        .getBook(params.id)
        .then((res) => setBook(res.book))
        .catch(() => router.push('/books'))
        .finally(() => setLoading(false));
    }
  }, [params.id, router, user]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-3">
        <div className="w-10 h-10 border-4 border-shelf-gold border-t-transparent rounded-full animate-spin" />
        <div className="text-shelf-gold font-serif text-lg animate-pulse">Loading book details...</div>
      </div>
    );
  }

  if (!book) return null;

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
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-shelf-text">Edit "{book.title}"</h1>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-shelf-gold/15 text-shelf-gold text-xs font-semibold">
              <Pencil className="w-3.5 h-3.5" /> Edit Mode
            </span>
          </div>
          <p className="text-sm text-shelf-muted mt-1">Update book details, status, tags, or upload a new cover</p>
        </div>
      </div>

      <BookForm book={book} />
    </div>
  );
}
