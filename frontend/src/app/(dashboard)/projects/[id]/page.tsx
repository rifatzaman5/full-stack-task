'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import KanbanBoard from '@/components/kanban/KanbanBoard';
import BillingSummary from '@/components/projects/BillingSummary';
import TimeLogForm from '@/components/timelogs/TimeLogForm';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { getProject, getBillingSummary, archiveProject } from '@/services/projectService';
import { createTimeLog, updateTimeLogStatus } from '@/services/timeLogService';
import { Project, BillingSummary as BillingSummaryType, TimeLog, CreateTimeLogInput, TimeLogStatus } from '@/types';
import { useAuthStore } from '@/hooks/useAuth';
import { ArrowLeft, Clock, Archive } from 'lucide-react';
import Link from 'next/link';

export default function ProjectDetailPage() {
  const params = useParams();
  const projectId = params.id as string;
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'ADMIN';

  const [project, setProject] = useState<Project | null>(null);
  const [billingSummary, setBillingSummary] = useState<BillingSummaryType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isTimeLogModalOpen, setIsTimeLogModalOpen] = useState(false);
  const [error, setError] = useState('');

  const fetchProject = async () => {
    try {
      const [projectRes, summaryRes] = await Promise.all([
        getProject(projectId),
        getBillingSummary(projectId),
      ]);
      setProject(projectRes.project);
      setBillingSummary(summaryRes.summary);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load project');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) {
      fetchProject();
    }
  }, [projectId]);

  const handleCreateTimeLog = async (data: CreateTimeLogInput) => {
    try {
      await createTimeLog(data);
      setIsTimeLogModalOpen(false);
      fetchProject();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create time log');
    }
  };

  const handleStatusChange = async (id: string, status: TimeLogStatus) => {
    try {
      await updateTimeLogStatus(id, status);
      fetchProject();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update status');
    }
  };

  const handleArchiveProject = async () => {
    if (confirm('Are you sure you want to archive this project?')) {
      try {
        await archiveProject(projectId);
        window.location.href = '/projects';
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to archive project');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error && !project) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        {error}
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Project not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back button and header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link 
            href="/projects" 
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Projects
          </Link>
        </div>
        <div className="flex items-center space-x-3">
          <Button 
            variant="outline" 
            onClick={() => setIsTimeLogModalOpen(true)}
            className="flex items-center space-x-2"
          >
            <Clock className="h-4 w-4" />
            <span>Log Time</span>
          </Button>
          {isAdmin && (
            <Button 
              variant="secondary" 
              onClick={handleArchiveProject}
              className="flex items-center space-x-2"
            >
              <Archive className="h-4 w-4" />
              <span>Archive</span>
            </Button>
          )}
        </div>
      </div>

      {/* Project Info */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
            {project.description && (
              <p className="text-gray-600 mt-2">{project.description}</p>
            )}
            {project.user && (
              <p className="text-sm text-gray-500 mt-2">Created by {project.user.name}</p>
            )}
          </div>
          <div className={`px-4 py-2 rounded-lg text-sm font-medium ${
            project.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' :
            project.status === 'COMPLETED' ? 'bg-blue-100 text-blue-700' :
            'bg-gray-100 text-gray-700'
          }`}>
            {project.status}
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Kanban and Billing Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Time Tracking Board</h2>
            <KanbanBoard
              timeLogs={project.timeLogs || []}
              onStatusChange={handleStatusChange}
            />
          </div>
        </div>
        <div>
          {billingSummary && <BillingSummary summary={billingSummary} />}
        </div>
      </div>

      {/* Time Log Modal */}
      <Modal
        isOpen={isTimeLogModalOpen}
        onClose={() => setIsTimeLogModalOpen(false)}
        title="Log Time"
      >
        <TimeLogForm
          projectId={projectId}
          onSubmit={handleCreateTimeLog}
          onClose={() => setIsTimeLogModalOpen(false)}
        />
      </Modal>
    </div>
  );
}
