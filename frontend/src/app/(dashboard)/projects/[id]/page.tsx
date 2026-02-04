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

export default function ProjectDetailPage() {
  const params = useParams();
  const projectId = params.id as string;

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
      throw new Error(err.response?.data?.message || 'Failed to create time log');
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
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
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
    <div>
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
          {project.description && (
            <p className="text-gray-600 mt-1">{project.description}</p>
          )}
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={() => setIsTimeLogModalOpen(true)}>
            Log Time
          </Button>
          <Button variant="secondary" onClick={handleArchiveProject}>
            Archive
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Time Tracking</h2>
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
