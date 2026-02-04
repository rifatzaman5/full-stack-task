'use client';

import { useDraggable } from '@dnd-kit/core';
import { TimeLog } from '@/types';

interface TimeLogCardProps {
  timeLog: TimeLog;
  isDragging?: boolean;
}

export default function TimeLogCard({ timeLog, isDragging }: TimeLogCardProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: timeLog.id,
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`bg-white p-4 rounded-lg shadow-sm border border-gray-200 cursor-move hover:shadow-md transition-shadow ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <div className="flex justify-between items-start mb-2">
        <span className="text-lg font-medium">{timeLog.hours}h</span>
        <span className="text-xs text-gray-500">{formatDate(timeLog.logDate)}</span>
      </div>
      {timeLog.notes && (
        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{timeLog.notes}</p>
      )}
      <div className="flex justify-between items-center">
        <span className="text-xs text-gray-500">
          {timeLog.user?.name || 'Unknown'}
        </span>
      </div>
    </div>
  );
}
