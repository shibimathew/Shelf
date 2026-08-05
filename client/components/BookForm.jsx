'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { bookAPI } from '@/lib/api';
import { useToast } from '@/components/ToastProvider';
import { Upload, X, BookOpen, Tag, Sparkles, Check, Image as ImageIcon, Bookmark } from 'lucide-react';
import { cn, statusConfig } from '@/lib/utils';

const statuses = [
  { id: 'Want to Read', label: 'Want to Read', icon: '📖', badge: 'bg-amber-500/10 text-amber-700 border-amber-300 hover:bg-amber-500/20' },
  { id: 'Reading', label: 'Reading', icon: '📘', badge: 'bg-sky-500/10 text-sky-700 border-sky-300 hover:bg-sky-500/20' },
  { id: 'Completed', label: 'Completed', icon: '✅', badge: 'bg-emerald-500/10 text-emerald-700 border-emerald-300 hover:bg-emerald-500/20' },
];

export default function BookForm({ book = null }) {
  const router = useRouter();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(book?.image || book?.coverImage || null);
  const [formData, setFormData] = useState({
    title: book?.title || '',
    author: book?.author || '',
    tags: book?.tags?.join(', ') || '',
    status: book?.status || 'Want to Read',
  });

  const handleFile = (file) => {
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    } else {
      toast.error('Please upload a valid image file', 'Invalid File');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('author', formData.author);
      data.append('tags', formData.tags);
      data.append('status', formData.status);

      if (selectedFile) {
        data.append('image', selectedFile);
      } else {
        const fileInput = e.target.querySelector('input[type="file"]');
        if (fileInput?.files?.[0]) {
          data.append('image', fileInput.files[0]);
        }
      }

      if (book) {
        await bookAPI.updateBook(book._id, data);
        toast.success(`"${formData.title}" updated successfully!`, 'Book Updated');
      } else {
        await bookAPI.createBook(data);
        toast.success(`"${formData.title}" added to your shelf!`, 'Book Added');
      }

      router.push('/books');
      router.refresh();
    } catch (err) {
      toast.error(err.message || 'Failed to save book', 'Save Failed');
    } finally {
      setLoading(false);
    }
  };

  const parsedTags = formData.tags
    ? formData.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)
    : [];

  const currentStatusObj = statusConfig[formData.status] || statusConfig['Want to Read'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Form Section */}
      <form
        onSubmit={handleSubmit}
        className="lg:col-span-7 bg-white/90 backdrop-blur-md rounded-2xl border border-shelf-border p-6 sm:p-8 shadow-xl shadow-shelf-dark/5 space-y-6"
      >
        <div className="flex items-center gap-2 pb-2 border-b border-shelf-border">
          <span className="p-2 rounded-xl bg-shelf-gold/10 text-shelf-gold">
            <Sparkles className="w-5 h-5" />
          </span>
          <div>
            <h2 className="text-lg font-serif font-bold text-shelf-text">
              {book ? 'Edit Book Details' : 'New Book Details'}
            </h2>
            <p className="text-xs text-shelf-muted">Fill out the metadata to update your collection</p>
          </div>
        </div>

        {/* Cover Upload Dropzone */}
        <div>
          <label className="block text-xs font-semibold text-shelf-text uppercase tracking-wider mb-2">
            Book Cover Image
          </label>
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={cn(
              'relative rounded-xl border-2 border-dashed p-6 transition-all duration-300 text-center flex flex-col items-center justify-center bg-shelf-cream/40',
              dragActive ? 'border-shelf-gold bg-shelf-gold/10 scale-[1.01]' : 'border-neutral-300 hover:border-shelf-gold',
              preview ? 'py-4' : 'py-8'
            )}
          >
            {preview ? (
              <div className="relative group w-32 h-44 rounded-lg overflow-hidden shadow-md border border-shelf-border">
                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setPreview(null);
                      setSelectedFile(null);
                    }}
                    className="p-2 rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors shadow"
                    title="Remove Cover"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-shelf-gold/10 flex items-center justify-center text-shelf-gold mb-3">
                  <ImageIcon className="w-6 h-6" />
                </div>
                <p className="text-sm font-medium text-shelf-text mb-1">
                  Drag & drop cover here, or <span className="text-shelf-gold underline cursor-pointer">browse</span>
                </p>
                <p className="text-xs text-shelf-muted">Supports JPG, PNG, WEBP up to 5MB</p>
              </div>
            )}
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>
        </div>

        {/* Title Input */}
        <div>
          <label className="block text-xs font-semibold text-shelf-text uppercase tracking-wider mb-2">
            Book Title <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-shelf-border focus:border-shelf-gold focus:ring-4 focus:ring-shelf-gold/10 outline-none transition-all text-shelf-text font-serif text-base bg-white"
              placeholder="e.g. To Kill a Mockingbird"
            />
          </div>
        </div>

        {/* Author Input */}
        <div>
          <label className="block text-xs font-semibold text-shelf-text uppercase tracking-wider mb-2">
            Author Name <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            name="author"
            required
            value={formData.author}
            onChange={(e) => setFormData({ ...formData, author: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-shelf-border focus:border-shelf-gold focus:ring-4 focus:ring-shelf-gold/10 outline-none transition-all text-shelf-text text-sm bg-white"
            placeholder="e.g. Harper Lee"
          />
        </div>

        {/* Reading Status Selector */}
        <div>
          <label className="block text-xs font-semibold text-shelf-text uppercase tracking-wider mb-2">
            Reading Status
          </label>
          <div className="grid grid-cols-3 gap-3">
            {statuses.map((s) => {
              const active = formData.status === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, status: s.id })}
                  className={cn(
                    'flex items-center justify-center gap-2 py-3 px-3 rounded-xl text-xs font-semibold border transition-all duration-200',
                    active
                      ? 'bg-shelf-dark text-white border-shelf-dark shadow-md scale-[1.02]'
                      : 'bg-white text-shelf-muted border-shelf-border hover:border-shelf-gold/50 hover:bg-shelf-cream/50'
                  )}
                >
                  <span>{s.icon}</span>
                  <span>{s.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tags Input */}
        <div>
          <label className="block text-xs font-semibold text-shelf-text uppercase tracking-wider mb-2">
            Tags / Genres (comma separated)
          </label>
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-shelf-border focus:border-shelf-gold focus:ring-4 focus:ring-shelf-gold/10 outline-none transition-all text-shelf-text text-sm bg-white"
            placeholder="fiction, mystery, classic"
          />
          {parsedTags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {parsedTags.map((tag, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 text-[11px] font-medium text-shelf-dark bg-shelf-gold/15 border border-shelf-gold/30 px-2.5 py-1 rounded-lg"
                >
                  <Tag className="w-3 h-3 text-shelf-gold" />
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-4 border-t border-shelf-border">
          <button
            type="button"
            onClick={() => router.push('/books')}
            className="flex-1 py-3 px-5 border border-shelf-border text-shelf-muted rounded-xl font-medium text-sm hover:bg-shelf-cream transition-colors text-center"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-3 px-5 bg-shelf-gold hover:bg-shelf-goldHover text-shelf-dark rounded-xl font-bold text-sm shadow-lg shadow-shelf-gold/20 transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-shelf-dark border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Check className="w-4 h-4" />
                {book ? 'Save Changes' : 'Add to Collection'}
              </>
            )}
          </button>
        </div>
      </form>

      {/* Live Preview Column */}
      <div className="lg:col-span-5 lg:sticky lg:top-8 space-y-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-shelf-muted uppercase tracking-wider px-1">
          <Bookmark className="w-4 h-4 text-shelf-gold" /> Live Card Preview
        </div>

        <div className="bg-white rounded-2xl border border-shelf-border overflow-hidden shadow-2xl p-4 transition-all duration-300">
          <div className="aspect-[3/4] relative bg-shelf-cream rounded-xl overflow-hidden mb-4 border border-shelf-border">
            {preview ? (
              <img src={preview} alt="Preview Cover" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
                <BookOpen className="w-16 h-16 text-neutral-300 mb-2" />
                <span className="text-xs text-neutral-400 font-medium">Cover Preview</span>
              </div>
            )}
            <div className="absolute top-3 right-3">
              <span className={cn('text-xs font-semibold px-2.5 py-1 rounded-md border shadow-sm backdrop-blur-md bg-white/90', currentStatusObj.color)}>
                {currentStatusObj.icon} {currentStatusObj.label}
              </span>
            </div>
          </div>

          <div className="p-2 space-y-2">
            <h3 className="font-serif font-bold text-shelf-text text-xl leading-snug line-clamp-2">
              {formData.title || 'Untitled Book'}
            </h3>
            <p className="text-sm text-shelf-muted italic">
              by {formData.author || 'Unknown Author'}
            </p>

            {parsedTags.length > 0 ? (
              <div className="flex flex-wrap gap-1.5 pt-2">
                {parsedTags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 text-[11px] text-shelf-muted bg-shelf-cream px-2 py-1 rounded border border-shelf-border"
                  >
                    <Tag className="w-3 h-3" />
                    {tag}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-neutral-400 italic pt-1">No tags added yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
