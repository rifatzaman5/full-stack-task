'use client';

import Link from 'next/link';
import { Project } from '@/types';
import { Clock, ArrowRight } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const statusColors = {
    ACTIVE: 'bg-emerald-100 text-emerald-700',
    COMPLETED: 'bg-blue-100 text-blue-700',
    ARCHIVED: 'bg-gray-100 text-gray-700',
  };

  const statusBgColors = {
    ACTIVE: 'from-emerald-500 to-emerald-600',
    COMPLETED: 'from-blue-500 to-blue-600',
    ARCHIVED: 'from-gray-400 to-gray-500',
  };

  return (
    <Link
      href={`/projects/${project.id}`}
      className="group block bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
            {project.name}
          </h3>
          {project.user && (
            <p className="text-sm text-gray-500 mt-1">by {project.user.name}</p>
          )}
        </div>
        <span
          className={`px-3 py-1 text-xs font-medium rounded-full ${
            statusColors[project.status]
          }`}
        >
          {project.status}
        </span>
      </div>

      {/* Description */}
      {project.description && (
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {project.description}
        </p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-4">
          <div className="flex items-center text-gray-600">
            <Clock className="h-4 w-4 mr-1" />
            <span className="text-sm font-medium">${project.billingRate}/hr</span>
          </div>
          <div className="flex items-center text-gray-500">
            <span className="text-sm">{project._count?.timeLogs || 0} logs</span>
          </div>
        </div>
        <div className="flex items-center text-primary-600 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <span className="text-sm font-medium mr-1">View</span>
          <ArrowRight className="h-4 w-4" />
        </div>
      </div>

      {/* Status indicator bar */}
      <div className={`h-1 mt-4 rounded-full bg-gradient-to-r ${statusBgColors[project.status]} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
    </Link>
  );
}
