'use client';

import Link from 'next/link';
import { Project } from '@/types';

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const statusColors = {
    ACTIVE: 'bg-green-100 text-green-800',
    COMPLETED: 'bg-blue-100 text-blue-800',
    ARCHIVED: 'bg-gray-100 text-gray-800',
  };

  return (
    <Link
      href={`/projects/${project.id}`}
      className="block bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full ${
            statusColors[project.status]
          }`}
        >
          {project.status}
        </span>
      </div>
      {project.description && (
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {project.description}
        </p>
      )}
      <div className="flex justify-between items-center text-sm text-gray-500">
        <span>${project.billingRate}/hr</span>
        <span>{project._count?.timeLogs || 0} time logs</span>
      </div>
    </Link>
  );
}
