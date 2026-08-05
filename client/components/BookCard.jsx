'use client';

import Link from 'next/link';
import { Book, Tag, Trash2, Pencil, ExternalLink } from 'lucide-react';
import { statusConfig, cn } from '@/lib/utils';

export default function BookCard({ book, onDelete, viewMode = 'grid' }) {
  const status = statusConfig[book.status] || statusConfig['Want to Read'];

  if (viewMode === 'list') {
    return (
      <div className="group bg-white rounded-2xl border border-shelf-border p-4 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-5">
        <div className="w-16 h-20 shrink-0 bg-shelf-cream rounded-xl overflow-hidden border border-shelf-border relative">
          {book.image || book.coverImage ? (
            <img src={book.image || book.coverImage} alt={book.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Book className="w-8 h-8 text-neutral-300" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={cn('text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border', status.color)}>
              {status.icon} {status.label}
            </span>
          </div>
          <h3 className="font-serif font-bold text-shelf-text text-base leading-snug truncate group-hover:text-shelf-gold transition-colors">
            {book.title}
          </h3>
          <p className="text-xs text-shelf-muted italic">by {book.author}</p>
        </div>

        {book.tags && book.tags.length > 0 && (
          <div className="hidden md:flex flex-wrap gap-1.5 max-w-xs">
            {book.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="inline-flex items-center gap-1 text-[10px] font-medium text-shelf-muted bg-shelf-cream px-2 py-1 rounded-lg border border-shelf-border">
                <Tag className="w-2.5 h-2.5" />
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2 shrink-0">
          <Link
            href={`/books/${book._id}/edit`}
            className="p-2.5 rounded-xl border border-shelf-border hover:bg-shelf-gold hover:text-white hover:border-shelf-gold text-shelf-text transition-colors shadow-sm"
            title="Edit Book"
          >
            <Pencil className="w-4 h-4" />
          </Link>
          <button
            onClick={() => onDelete(book._id)}
            className="p-2.5 rounded-xl border border-shelf-border hover:bg-rose-600 hover:text-white hover:border-rose-600 text-shelf-text transition-colors shadow-sm"
            title="Delete Book"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="group bg-white rounded-2xl border border-shelf-border overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
      <div>
        <div className="aspect-[3/4] relative bg-shelf-cream overflow-hidden border-b border-shelf-border">
          {book.image || book.coverImage ? (
            <img
              src={book.image || book.coverImage}
              alt={book.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-4">
              <Book className="w-16 h-16 text-neutral-300 mb-2" />
              <span className="text-xs text-neutral-400 font-medium">No Cover</span>
            </div>
          )}

          {/* Status Badge */}
          <div className="absolute top-3 right-3">
            <span className={cn('text-xs font-semibold px-2.5 py-1 rounded-lg border shadow-md backdrop-blur-md bg-white/90', status.color)}>
              {status.icon} {status.label}
            </span>
          </div>

          {/* Hover Overlay Action Buttons */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 backdrop-blur-[2px]">
            <Link
              href={`/books/${book._id}/edit`}
              className="p-3 bg-white text-shelf-dark rounded-xl shadow-xl hover:bg-shelf-gold hover:text-white transition-all transform hover:scale-110"
              title="Edit Details"
            >
              <Pencil className="w-4 h-4" />
            </Link>
            <button
              onClick={() => onDelete(book._id)}
              className="p-3 bg-white text-shelf-dark rounded-xl shadow-xl hover:bg-rose-600 hover:text-white transition-all transform hover:scale-110"
              title="Delete Book"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="p-5 space-y-2">
          <h3 className="font-serif font-bold text-shelf-text text-lg leading-snug line-clamp-2 group-hover:text-shelf-gold transition-colors">
            {book.title}
          </h3>
          <p className="text-xs text-shelf-muted italic">by {book.author}</p>

          {book.tags && book.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-2">
              {book.tags.map((tag) => (
                <span key={tag} className="inline-flex items-center gap-1 text-[11px] font-medium text-shelf-muted bg-shelf-cream px-2 py-0.5 rounded-md border border-shelf-border">
                  <Tag className="w-3 h-3 text-shelf-gold" />
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="px-5 pb-5 pt-2">
        <Link
          href={`/books/${book._id}/edit`}
          className="flex items-center justify-center gap-2 w-full py-2.5 border border-shelf-border rounded-xl text-xs font-semibold text-shelf-text hover:bg-shelf-gold hover:text-white hover:border-shelf-gold transition-colors"
        >
          Edit Details <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
