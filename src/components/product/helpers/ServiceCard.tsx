import { ReactNode } from 'react';

interface ServiceCardProps {
  id?: number; 
  icon: ReactNode;
  title: string;
  subtitle: string;
  isFirst?: boolean;
  isLast?: boolean;
}

export function ServiceCard({ id, icon, title, subtitle }: ServiceCardProps) {
  return (
    <div className={`${id === 1 ? "" : " border-r-2 border-r-pink-100"} text-center p-3 transition-colors`}>
      <div className="text-pink-500 mx-auto mb-2 flex justify-center">{icon}</div>
      <p className="text-xs font-semibold text-gray-700">{title}</p>
      <p className="text-xs text-gray-400">{subtitle}</p>
    </div>
  );
}