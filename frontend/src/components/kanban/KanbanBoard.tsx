'use client';

import { useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { TimeLog, TimeLogStatus } from '@/types';
import KanbanColumn from './KanbanColumn';
import TimeLogCard from './TimeLogCard';

interface KanbanBoardProps {
  timeLogs: TimeLog[];
  onStatusChange: (id: string, status: TimeLogStatus) => void;
}

export default function KanbanBoard({ timeLogs, onStatusChange }: KanbanBoardProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const columns: { id: TimeLogStatus; title: string }[] = [
    { id: 'TODO', title: 'Todo' },
    { id: 'IN_PROGRESS', title: 'In Progress' },
    { id: 'DONE', title: 'Done' },
  ];

  const getTimeLogsByStatus = (status: TimeLogStatus) => {
    return timeLogs.filter((log) => log.status === status);
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (over && active.id !== over.id) {
      const status = over.id as TimeLogStatus;
      onStatusChange(active.id as string, status);
    }
  };

  const activeTimeLog = activeId ? timeLogs.find((log) => log.id === activeId) : null;

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map((column) => (
          <KanbanColumn
            key={column.id}
            id={column.id}
            title={column.title}
            timeLogs={getTimeLogsByStatus(column.id)}
          />
        ))}
      </div>

      <DragOverlay>
        {activeTimeLog ? <TimeLogCard timeLog={activeTimeLog} isDragging /> : null}
      </DragOverlay>
    </DndContext>
  );
}
