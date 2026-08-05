'use client';

export default function StatsCard({ title, value, icon: Icon, colorClass, borderAccent, subtitle }) {
  return (
    <div className={`group relative bg-white/90 backdrop-blur-md rounded-2xl border border-shelf-border p-6 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden ${borderAccent || ''}`}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-shelf-muted uppercase tracking-wider">{title}</p>
          <p className="text-4xl font-serif font-extrabold text-shelf-text group-hover:scale-105 transition-transform duration-300 origin-left">
            {value}
          </p>
          {subtitle && <p className="text-[11px] font-medium text-shelf-muted pt-1">{subtitle}</p>}
        </div>
        <div className={`p-3.5 rounded-xl ${colorClass} shadow-sm group-hover:rotate-6 transition-transform duration-300`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-shelf-gold/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
}
