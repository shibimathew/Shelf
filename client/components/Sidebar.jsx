'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from './AuthProvider';
import {
  LayoutDashboard,
  Library,
  PlusCircle,
  LogOut,
  BookOpen,
  User,
  Menu,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/books', label: 'My Books', icon: Library },
  { href: '/books/new', label: 'Add Book', icon: PlusCircle },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  if (!user) return null;

  return (
    <>
      {/* Mobile Top Navigation Header (< lg screens) */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-shelf-dark border-b border-white/10 flex items-center justify-between px-4 z-40 text-white shadow-md">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-shelf-gold rounded-lg flex items-center justify-center">
            <BookOpen className="w-4 h-4 text-shelf-dark" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-wider uppercase text-white leading-none">Shelf</h1>
            <p className="text-[9px] text-neutral-400 uppercase tracking-widest">Library</p>
          </div>
        </Link>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-xl border border-white/15 bg-white/5 text-white hover:bg-white/10 transition-colors"
          aria-label="Toggle navigation menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-45 animate-fade-in"
        />
      )}

      {/* Sidebar Drawer Container */}
      <aside
        className={cn(
          'fixed left-0 top-0 h-screen w-64 bg-shelf-dark text-white flex flex-col z-50 transition-transform duration-300 ease-in-out border-r border-white/10 shadow-2xl lg:shadow-none lg:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Logo Header */}
        <div className="p-6 sm:p-8 pb-6 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-shelf-gold rounded-xl flex items-center justify-center shadow-lg shadow-shelf-gold/20">
              <BookOpen className="w-5 h-5 text-shelf-dark" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-widest uppercase text-white">Shelf</h1>
              <p className="text-[10px] text-neutral-400 uppercase tracking-wider">Personal Library</p>
            </div>
          </Link>

          {/* Close button inside mobile menu */}
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200',
                  isActive
                    ? 'bg-shelf-gold text-shelf-dark shadow-lg shadow-shelf-gold/20'
                    : 'text-neutral-400 hover:text-white hover:bg-white/5'
                )}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User Footer Profile */}
        <div className="p-4 border-t border-white/10 bg-white/[0.02]">
          <div className="flex items-center gap-3 px-3 py-2.5 mb-2">
            <div className="w-9 h-9 rounded-xl bg-shelf-gold/20 flex items-center justify-center shrink-0 border border-shelf-gold/30">
              <User className="w-4 h-4 text-shelf-gold" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate">{user.name}</p>
              <p className="text-xs text-neutral-400 truncate">{user.email}</p>
            </div>
          </div>

          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-2.5 w-full rounded-xl text-xs font-semibold text-neutral-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all border border-transparent hover:border-rose-500/20"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}
