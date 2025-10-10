
import { ReactNode } from 'react';

interface SectionProps {
  title: string;
  icon: ReactNode;
  color: 'purple' | 'orange';
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  children: ReactNode;
}

export default function Section({ title, icon, color, enabled, onToggle, children }: SectionProps) {
  const colorClasses = {
    purple: {
      bg: 'bg-gradient-to-r from-purple-500 to-purple-600',
      text: 'text-purple-600',
      ring: 'focus:ring-purple-500',
    },
    orange: {
      bg: 'bg-gradient-to-r from-orange-500 to-orange-600',
      text: 'text-orange-600',
      ring: 'focus:ring-orange-500',
    },
  };

  const classes = colorClasses[color];

  return (
    <div className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 border border-bd rounded-xl shadow-md">
      <div className="flex items-center gap-3 p-4 border-b border-bd">
        <input
          type="checkbox"
          checked={enabled}
          onChange={(e) => onToggle(e.target.checked)}
          className={`w-4 h-4 rounded border-bd bg-background ${classes.text} ${classes.ring}`}
        />
        <div className={`w-8 h-8 ${classes.bg} rounded-lg flex items-center justify-center shadow-md`}>
          {icon}
        </div>
        <h2 className="text-lg font-bold text-txt">{title}</h2>
      </div>
      {enabled && <div className="p-4 space-y-4">{children}</div>}
    </div>
  );
}
