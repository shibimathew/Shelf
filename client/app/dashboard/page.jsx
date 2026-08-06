'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';
import { useToast } from '@/components/ToastProvider';
import { bookAPI } from '@/lib/api';
import StatsCard from '@/components/StatsCard';
import BookCard from '@/components/BookCard';
import ConfirmModal from '@/components/ConfirmModal';
import {
  Library,
  BookOpen,
  CheckCircle2,
  Bookmark,
  Plus,
  ArrowRight,
  Sparkles,
  TrendingUp,
  RotateCw,
} from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const toast = useToast();

  const [stats, setStats] = useState({
    totalBooks: 0,
    reading: 0,
    completed: 0,
    wantToRead: 0,
  });
  const [recentBooks, setRecentBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal for book deletion
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchDashboardData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const [dashRes, booksRes] = await Promise.all([
        bookAPI.getDashboard(),
        bookAPI.getBooks(),
      ]);

      if (dashRes.success && dashRes.data) {
        setStats(dashRes.data);
      }
      if (booksRes.success && Array.isArray(booksRes.books)) {
        setRecentBooks(booksRes.books.slice(0, 4));
      }
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data');
      toast.error('Unable to synchronize library statistics.', 'Dashboard Error');
    } finally {
      setLoading(false);
    }
  }, [toast, user]);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [fetchDashboardData, user]);

  const handleDeleteBook = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await bookAPI.deleteBook(deleteId);
      toast.success('Book successfully removed from your library', 'Book Removed');
      setDeleteId(null);
      fetchDashboardData();
    } catch (err) {
      toast.error(err.message || 'Failed to delete book', 'Action Failed');
    } finally {
      setIsDeleting(false);
    }
  };

  // Time-of-day personalized greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const totalTracked = stats.totalBooks || 0;
  const completionRate = totalTracked > 0 ? Math.round((stats.completed / totalTracked) * 100) : 0;

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header Banner */}
      <div className="relative bg-shelf-dark text-white rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl overflow-hidden border border-white/10">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-shelf-gold/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-12 w-48 h-48 bg-shelf-gold/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-shelf-gold text-xs font-semibold uppercase tracking-widest bg-shelf-gold/10 px-3 py-1 rounded-full border border-shelf-gold/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Personal Sanctuary</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold tracking-tight text-white">
              {getGreeting()}, {user?.name || 'Reader'}
            </h1>
            <p className="text-neutral-400 text-sm max-w-xl leading-relaxed">
              Track your reading journeys, organize your bookshelves, and discover your next great literary escape.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/books/new"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-shelf-gold hover:bg-shelf-goldHover text-shelf-dark font-semibold text-sm shadow-lg shadow-shelf-gold/20 transition-all hover:scale-105"
            >
              <Plus className="w-4 h-4" />
              <span>Add Book</span>
            </Link>
            <Link
              href="/books"
              className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-sm border border-white/15 transition-all"
            >
              <span>View All</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatsCard
          title="Total Library"
          value={loading ? '...' : stats.totalBooks}
          icon={Library}
          colorClass="bg-amber-500/10 text-amber-600"
          subtitle="Books in collection"
        />
        <StatsCard
          title="Currently Reading"
          value={loading ? '...' : stats.reading}
          icon={BookOpen}
          colorClass="bg-sky-500/10 text-sky-600"
          subtitle="Active read progress"
        />
        <StatsCard
          title="Completed"
          value={loading ? '...' : stats.completed}
          icon={CheckCircle2}
          colorClass="bg-emerald-500/10 text-emerald-600"
          subtitle="Books finished"
        />
        <StatsCard
          title="Want to Read"
          value={loading ? '...' : stats.wantToRead}
          icon={Bookmark}
          colorClass="bg-purple-500/10 text-purple-600"
          subtitle="Saved for later"
        />
      </div>

      {/* Progress & Quick Stats Section */}
      {!loading && stats.totalBooks > 0 && (
        <div className="bg-white rounded-3xl border border-shelf-border p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <h2 className="text-lg font-serif font-bold text-shelf-text flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-shelf-gold" />
                <span>Reading Goal Progress</span>
              </h2>
              <p className="text-xs text-shelf-muted mt-0.5">
                You have finished {completionRate}% of the books in your bookshelf.
              </p>
            </div>
            <div className="text-sm font-semibold text-shelf-gold">
              {stats.completed} of {stats.totalBooks} Completed
            </div>
          </div>

          {/* Multi-segment Progress Bar */}
          <div className="w-full h-3 bg-shelf-cream rounded-full overflow-hidden flex p-0.5 border border-shelf-border">
            <div
              className="bg-emerald-500 h-full rounded-l-full transition-all duration-500"
              style={{ width: `${(stats.completed / totalTracked) * 100}%` }}
              title={`Completed: ${stats.completed}`}
            />
            <div
              className="bg-sky-500 h-full transition-all duration-500"
              style={{ width: `${(stats.reading / totalTracked) * 100}%` }}
              title={`Reading: ${stats.reading}`}
            />
            <div
              className="bg-amber-400 h-full rounded-r-full transition-all duration-500"
              style={{ width: `${(stats.wantToRead / totalTracked) * 100}%` }}
              title={`Want to Read: ${stats.wantToRead}`}
            />
          </div>

          <div className="flex items-center gap-6 mt-4 text-xs font-medium text-shelf-muted">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
              <span>Completed ({stats.completed})</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-sky-500 inline-block" />
              <span>Reading ({stats.reading})</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-400 inline-block" />
              <span>Want to Read ({stats.wantToRead})</span>
            </div>
          </div>
        </div>
      )}

      {/* Recent Books Section */}
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-serif font-bold text-shelf-text">Recently Added Books</h2>
            <p className="text-xs text-shelf-muted mt-0.5">Latest titles in your collection</p>
          </div>
          {recentBooks.length > 0 && (
            <Link
              href="/books"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-shelf-gold hover:text-shelf-goldHover transition-colors"
            >
              <span>View All Books</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
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
              onClick={fetchDashboardData}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-shelf-cream text-shelf-text text-xs font-semibold hover:bg-shelf-border transition-colors"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>Try Again</span>
            </button>
          </div>
        ) : recentBooks.length === 0 ? (
          <div className="bg-white rounded-3xl border border-shelf-border p-10 sm:p-14 text-center max-w-xl mx-auto space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-shelf-cream flex items-center justify-center mx-auto text-shelf-gold border border-shelf-border">
              <Library className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-serif font-bold text-shelf-text">Your bookshelf is empty</h3>
              <p className="text-xs text-shelf-muted mt-1 leading-relaxed">
                Start cataloging your reading list by adding your first book today.
              </p>
            </div>
            <Link
              href="/books/new"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-shelf-dark hover:bg-shelf-darker text-white font-semibold text-xs shadow-lg transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Your First Book</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentBooks.map((book) => (
              <BookCard
                key={book._id}
                book={book}
                onDelete={(id) => setDeleteId(id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteBook}
        title="Delete Book"
        message="Are you sure you want to remove this book from your library? This action cannot be undone."
        loading={isDeleting}
      />
    </div>
  );
}
