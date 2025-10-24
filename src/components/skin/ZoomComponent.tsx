'use client';

import { useState } from 'react';
import { ZoomComponentProps } from '@/types/skin';

export function ZoomComponent(props: ZoomComponentProps) {
  const [activeView, setActiveView] = useState(props.view || 'upcoming');
  const [showScheduleForm, setShowScheduleForm] = useState(false);

  const mockUpcomingMeetings = [
    { id: '1', title: 'Interview: Sarah Johnson', date: '2025-10-24', time: '10:00 AM', duration: '45 min', link: 'https://zoom.us/j/123456789' },
    { id: '2', title: 'Interview: Michael Chen', date: '2025-10-24', time: '2:00 PM', duration: '30 min', link: 'https://zoom.us/j/987654321' },
    { id: '3', title: 'Team Sync', date: '2025-10-25', time: '11:00 AM', duration: '60 min', link: 'https://zoom.us/j/456789123' },
  ];

  const mockPastMeetings = [
    { id: '1', title: 'Interview: Emily Rodriguez', date: '2025-10-22', time: '3:00 PM', duration: '45 min', recording: 'Available' },
    { id: '2', title: 'Screening Call', date: '2025-10-21', time: '1:00 PM', duration: '30 min', recording: 'Available' },
  ];

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="p-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">📹</span>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Zoom Meetings</h3>
          </div>
          <div className="flex gap-1">
            {(['schedule', 'upcoming', 'past'] as const).map((view) => (
              <button
                key={view}
                onClick={() => {
                  setActiveView(view);
                  setShowScheduleForm(view === 'schedule');
                }}
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
        {showScheduleForm && (
          <div className="max-w-md mx-auto space-y-4">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Schedule New Meeting</h4>
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Meeting Title</label>
              <input
                type="text"
                placeholder="e.g., Interview: Candidate Name"
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Time</label>
                <input
                  type="time"
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Duration (minutes)</label>
              <select className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                <option>30</option>
                <option>45</option>
                <option>60</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Attendee Email</label>
              <input
                type="email"
                placeholder="candidate@example.com"
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
            <button className="w-full px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
              Create Zoom Meeting
            </button>
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
              Meeting link will be automatically sent to the attendee
            </p>
          </div>
        )}

        {activeView === 'upcoming' && !showScheduleForm && (
          <div className="space-y-3">
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-3">
              Your upcoming Zoom meetings
            </div>
            {mockUpcomingMeetings.map((meeting) => (
              <div
                key={meeting.id}
                className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-sm text-gray-900 dark:text-white">{meeting.title}</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {meeting.date} at {meeting.time} • {meeting.duration}
                    </p>
                  </div>
                  <span className="text-xs px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded">
                    Scheduled
                  </span>
                </div>
                <div className="flex gap-2">
                  <button className="text-xs px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">
                    Join Meeting
                  </button>
                  <button className="text-xs px-3 py-1 bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 rounded hover:bg-gray-200">
                    Copy Link
                  </button>
                  <button className="text-xs px-3 py-1 bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 rounded hover:bg-gray-200">
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeView === 'past' && !showScheduleForm && (
          <div className="space-y-3">
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-3">
              Past Zoom meetings
            </div>
            {mockPastMeetings.map((meeting) => (
              <div
                key={meeting.id}
                className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-sm text-gray-900 dark:text-white">{meeting.title}</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {meeting.date} at {meeting.time} • {meeting.duration}
                    </p>
                  </div>
                  <span className="text-xs px-2 py-1 bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 rounded">
                    Completed
                  </span>
                </div>
                {meeting.recording && (
                  <div className="flex gap-2">
                    <button className="text-xs px-3 py-1 bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 rounded hover:bg-purple-200">
                      ▶ Watch Recording
                    </button>
                    <button className="text-xs px-3 py-1 bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 rounded hover:bg-gray-200">
                      Download
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
