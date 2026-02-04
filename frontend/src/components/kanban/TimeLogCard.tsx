'use client';

import { useDraggable } from '@dnd-kit/core';
import { TimeLog } from '@/types';
import { Clock, User } from 'lucide-react';

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
      className={`bg-white p-4 rounded-lg shadow-sm border border-gray-200 cursor-move hover:shadow-md transition-all duration-200 ${
        isDragging ? 'opacity-50 scale-105 shadow-xl' : ''
      }`}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center space-x-2">
          <div className="bg-primary-100 p-1.5 rounded-lg">
            <Clock className="h-4 w-4 text-primary-600" />
          </div>
          <span className="text-lg font-bold text-gray-900">{timeLog.hours}h</span>
        </div>
        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
          {formatDate(timeLog.logDate)}
        </span>
      </div>
      {timeLog.notes && (
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {timeLog.notes}
        </p>
      )}
      <div className="flex items-center text-xs text-gray-500 pt-2 border-t border-gray-100">
        <User className="h-3 w-3 mr-1" />
        <span>{timeLog.user?.name || 'Unknown'}</span>
      </div>
    </div>
  );
}
