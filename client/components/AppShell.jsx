'use client';

import Sidebar from './Sidebar';
import { useAuth } from './AuthProvider';
import { usePathname } from 'next/navigation';

export default function AppShell({ children }) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const publicPaths = ['/login', '/register'];

  if (loading) {
    return (
      <div className="min-h-screen bg-shelf-cream flex flex-col items-center justify-center space-y-3">
        <div className="w-10 h-10 border-4 border-shelf-gold border-t-transparent rounded-full animate-spin" />
        <div className="text-shelf-gold text-lg font-serif animate-pulse">Loading your library...</div>
      </div>
    );
  }

  if (!user && !publicPaths.includes(pathname)) {
    return (
      <div className="min-h-screen bg-shelf-cream flex flex-col items-center justify-center space-y-3">
        <div className="w-10 h-10 border-4 border-shelf-gold border-t-transparent rounded-full animate-spin" />
        <div className="text-shelf-gold text-sm font-serif">Redirecting to sign in...</div>
      </div>
    );
  }

  if (!user) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-shelf-cream">
      <Sidebar />
      <main className="lg:ml-64 min-h-screen pt-16 lg:pt-0 transition-all duration-300">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
          {children}
        </div>
      </main>
    </div>
  );
}