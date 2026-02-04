'use client';

import { useDroppable } from '@dnd-kit/core';
import { TimeLog, TimeLogStatus } from '@/types';
import TimeLogCard from '../kanban/TimeLogCard';

interface KanbanColumnProps {
  id: TimeLogStatus;
  title: string;
  color: string;
  timeLogs: TimeLog[];
}

export default function KanbanColumn({ id, title, color, timeLogs }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id });

  const bgColors = {
    TODO: 'bg-gray-50',
    IN_PROGRESS: 'bg-amber-50',
    DONE: 'bg-emerald-50',
  };

  return (
    <div
      ref={setNodeRef}
      className={`p-4 rounded-xl border-2 transition-all duration-200 ${
        isOver 
          ? 'border-primary-400 bg-primary-50' 
          : `border-gray-200 ${bgColors[id]}`
      } min-h-[280px]`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">{title}</h3>
        <span className={`${color} text-white text-xs font-medium px-2 py-1 rounded-full`}>
          {timeLogs.length}
        </span>
      </div>
      <div className="space-y-3">
        {timeLogs.map((timeLog) => (
          <TimeLogCard key={timeLog.id} timeLog={timeLog} />
        ))}
        {timeLogs.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-400 text-sm">Drop items here</p>
          </div>
        )}
      </div>
    </div>
  );
}
