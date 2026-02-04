'use client';

import { useDroppable } from '@dnd-kit/core';
import { TimeLog, TimeLogStatus } from '@/types';
import TimeLogCard from '../kanban/TimeLogCard';

interface KanbanColumnProps {
  id: TimeLogStatus;
  title: string;
  timeLogs: TimeLog[];
}

export default function KanbanColumn({ id, title, timeLogs }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id });

  const statusColors = {
    TODO: 'bg-gray-100',
    IN_PROGRESS: 'bg-blue-100',
    DONE: 'bg-green-100',
  };

  return (
    <div
      ref={setNodeRef}
      className={`p-4 rounded-lg ${
        isOver ? 'bg-primary-50' : statusColors[id]
      } min-h-[200px]`}
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="space-y-3">
        {timeLogs.map((timeLog) => (
          <TimeLogCard key={timeLog.id} timeLog={timeLog} />
        ))}
        {timeLogs.length === 0 && (
          <p className="text-gray-500 text-sm text-center py-4">
            No items
          </p>
        )}
      </div>
    </div>
  );
}
