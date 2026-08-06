'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { bookAPI } from '@/lib/api';
import { useAuth } from '@/components/AuthProvider';
import { useToast } from '@/components/ToastProvider';
import BookCard from '@/components/BookCard';
import ConfirmModal from '@/components/ConfirmModal';
import {
  Library,
  Plus,
  Search,
  Grid,
  List as ListIcon,
  RotateCw,
  Filter,
  X,
} from 'lucide-react';

const STATUS_FILTERS = ['All', 'Want to Read', 'Reading', 'Completed'];

export default function BooksPage() {
  const { user } = useAuth();
  const toast = useToast();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [viewMode, setViewMode] = useState('grid');

  const [deleteId, setDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchBooks = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (selectedStatus !== 'All') params.status = selectedStatus;
      if (search.trim()) params.search = search.trim();

      const res = await bookAPI.getBooks(params);
      if (res.success && Array.isArray(res.books)) {
        setBooks(res.books);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch books');
      toast.error('Unable to load your collection.', 'Error');
    } finally {
      setLoading(false);
    }
  }, [selectedStatus, search, toast, user]);

  useEffect(() => {
    if (!user) return;
    const timer = setTimeout(() => {
      fetchBooks();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchBooks, user]);

  const handleDeleteBook = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await bookAPI.deleteBook(deleteId);
      toast.success('Book removed from collection.', 'Removed');
      setDeleteId(null);
      fetchBooks();
    } catch (err) {
      toast.error(err.message || 'Failed to delete book', 'Error');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-shelf-border">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-shelf-text">My Books</h1>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-shelf-gold/15 text-shelf-gold text-xs font-bold">
              <Library className="w-3.5 h-3.5" /> {books.length} {books.length === 1 ? 'Book' : 'Books'}
            </span>
          </div>
          <p className="text-sm text-shelf-muted mt-1">Browse, filter, and manage your personal book collection</p>
        </div>

        <Link
          href="/books/new"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-shelf-dark hover:bg-shelf-darker text-white font-semibold text-sm shadow-lg shadow-black/10 transition-all shrink-0 hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Book</span>
        </Link>
      </div>

      {/* Control Bar: Search, Filters, View Mode */}
      <div className="bg-white rounded-2xl border border-shelf-border p-4 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-4">
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title or author..."
              className="w-full pl-10 pr-9 py-2.5 bg-shelf-cream/50 border border-shelf-border rounded-xl text-shelf-text placeholder-neutral-400 text-sm focus:outline-none focus:ring-2 focus:ring-shelf-gold focus:bg-white transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-shelf-text"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-1 bg-shelf-cream p-1 rounded-xl border border-shelf-border shrink-0 self-end md:self-auto">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg text-xs font-medium transition-all ${
                viewMode === 'grid'
                  ? 'bg-white text-shelf-text shadow-sm'
                  : 'text-shelf-muted hover:text-shelf-text'
              }`}
              title="Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg text-xs font-medium transition-all ${
                viewMode === 'list'
                  ? 'bg-white text-shelf-text shadow-sm'
                  : 'text-shelf-muted hover:text-shelf-text'
              }`}
              title="List View"
            >
              <ListIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Status Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-shelf-border/60 scrollbar-none">
          <span className="text-xs font-semibold text-shelf-muted flex items-center gap-1 pr-2 shrink-0">
            <Filter className="w-3.5 h-3.5" /> Filter:
          </span>
          {STATUS_FILTERS.map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedStatus === status
                  ? 'bg-shelf-gold text-white shadow-md shadow-shelf-gold/20'
                  : 'bg-shelf-cream/80 text-shelf-muted hover:text-shelf-text hover:bg-shelf-cream border border-shelf-border'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Book List / Grid Display */}
      {loading ? (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6' : 'space-y-4'}>
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-shelf-border p-4 space-y-4 animate-pulse">
              <div className="aspect-[3/4] bg-shelf-cream rounded-xl" />
              <div className="h-4 bg-shelf-cream rounded w-3/4" />
              <div className="h-3 bg-shelf-cream rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="bg-white rounded-2xl border border-shelf-border p-8 text-center space-y-4">
          <p className="text-sm text-rose-600 font-medium">{error}</p>
          <button
            onClick={fetchBooks}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-shelf-cream text-shelf-text text-xs font-semibold hover:bg-shelf-border transition-colors"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>Reload Library</span>
          </button>
        </div>
      ) : books.length === 0 ? (
        <div className="bg-white rounded-3xl border border-shelf-border p-12 text-center max-w-xl mx-auto space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-shelf-cream flex items-center justify-center mx-auto text-shelf-gold border border-shelf-border">
            <Library className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-serif font-bold text-shelf-text">No books found</h3>
            <p className="text-xs text-shelf-muted mt-1 leading-relaxed">
              {search || selectedStatus !== 'All'
                ? 'Try adjusting your search query or filter criteria.'
                : 'Your collection is empty. Start by adding a new book.'}
            </p>
          </div>
          {search || selectedStatus !== 'All' ? (
            <button
              onClick={() => {
                setSearch('');
                setSelectedStatus('All');
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-shelf-cream text-shelf-text text-xs font-semibold hover:bg-shelf-border transition-colors"
            >
              Clear Filters
            </button>
          ) : (
            <Link
              href="/books/new"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-shelf-dark hover:bg-shelf-darker text-white font-semibold text-xs shadow-lg transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Your First Book</span>
            </Link>
          )}
        </div>
      ) : (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6' : 'space-y-4'}>
          {books.map((book) => (
            <BookCard
              key={book._id}
              book={book}
              onDelete={(id) => setDeleteId(id)}
              viewMode={viewMode}
            />
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteBook}
        title="Delete Book"
        message="Are you sure you want to remove this book from your collection? This action cannot be undone."
        loading={isDeleting}
      />
    </div>
  );
}
