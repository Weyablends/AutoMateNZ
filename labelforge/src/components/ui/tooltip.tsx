'use client';
import { useState, useRef } from 'react';
import { cn } from '@/lib/utils';

export function Tooltip({
  children,
  content,
  side = 'top',
  delay = 400,
}: {
  children: React.ReactNode;
  content: React.ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  delay?: number;
}) {
  const [visible, setVisible] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>();

  const show = () => {
    timer.current = setTimeout(() => setVisible(true), delay);
  };
  const hide = () => {
    clearTimeout(timer.current);
    setVisible(false);
  };

  const positionClass = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-1.5',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-1.5',
    left: 'right-full top-1/2 -translate-y-1/2 mr-1.5',
    right: 'left-full top-1/2 -translate-y-1/2 ml-1.5',
  }[side];

  return (
    <div className="relative inline-flex" onMouseEnter={show} onMouseLeave={hide}>
      {children}
      {visible && content && (
        <div
          className={cn(
            'absolute z-50 px-2 py-1 rounded-md text-xs text-forge-text bg-forge-panel border border-forge-border shadow-lg whitespace-nowrap pointer-events-none animate-fade-in',
            positionClass
          )}
        >
          {content}
        </div>
      )}
    </div>
  );
}
