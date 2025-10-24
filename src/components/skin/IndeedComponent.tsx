'use client';

import { useState } from 'react';
import { IndeedComponentProps } from '@/types/skin';

export function IndeedComponent(props: IndeedComponentProps) {
  const [activeView, setActiveView] = useState(props.view || 'candidates');

  const mockCandidates = [
    { id: '1', name: 'Sarah Johnson', position: 'Senior React Developer', match: 95, applied: '2025-10-20', resume: 'resume-1.pdf' },
    { id: '2', name: 'Michael Chen', position: 'Full Stack Engineer', match: 88, applied: '2025-10-21', resume: 'resume-2.pdf' },
    { id: '3', name: 'Emily Rodriguez', position: 'Frontend Developer', match: 92, applied: '2025-10-22', resume: 'resume-3.pdf' },
  ];

  const mockJobs = [
    { id: '1', title: 'Senior React Developer', posted: '2025-10-15', applications: 24, status: 'Active' },
    { id: '2', title: 'Full Stack Engineer', posted: '2025-10-18', applications: 18, status: 'Active' },
    { id: '3', title: 'DevOps Engineer', posted: '2025-10-10', applications: 31, status: 'Closed' },
  ];

  if (!props.companyId) {
    return (
      <div className="h-full flex items-center justify-center bg-white dark:bg-gray-900 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700">
        <div className="text-center p-6">
          <div className="text-4xl mb-3">💼</div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Indeed Integration
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Configure your Indeed Company ID to access job postings and candidates.
          </p>
          <div className="text-xs text-gray-500 dark:text-gray-500 space-y-1">
            <p>• Connect to your Indeed employer account</p>
            <p>• View and manage job postings</p>
            <p>• Access candidate applications</p>
            <p>• Track recruitment analytics</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="p-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">💼</span>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Indeed</h3>
          </div>
          <div className="flex gap-1">
            {(['candidates', 'jobs', 'analytics'] as const).map((view) => (
              <button
                key={view}
                onClick={() => setActiveView(view)}
                className={`px-3 py-1 text-xs rounded ${
                  activeView === view
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {view.charAt(0).toUpperCase() + view.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4">
        {activeView === 'candidates' && (
          <div className="space-y-3">
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-3">
              Showing recent applications from Indeed
            </div>
            {mockCandidates.map((candidate) => (
              <div
                key={candidate.id}
                className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold text-sm text-gray-900 dark:text-white">{candidate.name}</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{candidate.position}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-semibold text-green-600 dark:text-green-400">{candidate.match}% Match</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{candidate.applied}</div>
                  </div>
                </div>
                <div className="mt-2 flex gap-2">
                  <button className="text-xs px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded hover:bg-blue-200">
                    View Resume
                  </button>
                  <button className="text-xs px-2 py-1 bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 rounded hover:bg-gray-200">
                    Contact
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeView === 'jobs' && (
          <div className="space-y-3">
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-3">
              Your active job postings on Indeed
            </div>
            {mockJobs.map((job) => (
              <div
                key={job.id}
                className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold text-sm text-gray-900 dark:text-white">{job.title}</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Posted: {job.posted}</p>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      job.status === 'Active'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                    }`}
                  >
                    {job.status}
                  </span>
                </div>
                <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                  {job.applications} applications
                </div>
              </div>
            ))}
          </div>
        )}

        {activeView === 'analytics' && (
          <div className="space-y-4">
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-3">
              Recruitment analytics from Indeed
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">73</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Total Applications</div>
              </div>
              <div className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">12</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Interviews Scheduled</div>
              </div>
              <div className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">2.4k</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Job Views</div>
              </div>
              <div className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">5.2%</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Application Rate</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
