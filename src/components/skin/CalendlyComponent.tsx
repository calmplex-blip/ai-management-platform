'use client';

import { CalendlyComponentProps } from '@/types/skin';

export function CalendlyComponent(props: CalendlyComponentProps) {
  const calendlyUrl = props.url || (props.username ? `https://calendly.com/${props.username}${props.eventType ? `/${props.eventType}` : ''}` : '');

  if (!calendlyUrl) {
    return (
      <div className="h-full flex items-center justify-center bg-white dark:bg-gray-900 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700">
        <div className="text-center p-6">
          <div className="text-4xl mb-3">📅</div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Calendly Integration
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Configure your Calendly URL or username to embed your scheduling page.
          </p>
          <div className="text-xs text-gray-500 dark:text-gray-500 space-y-1">
            <p>• Set your Calendly username</p>
            <p>• Or provide a full Calendly URL</p>
            <p>• Enable candidates to schedule interviews seamlessly</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="p-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <div className="flex items-center gap-2">
          <span className="text-lg">📅</span>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Interview Scheduling</h3>
        </div>
      </div>
      <iframe
        src={calendlyUrl}
        width="100%"
        height="100%"
        frameBorder="0"
        title="Calendly Scheduling"
        className="calendly-inline-widget"
        style={{ minHeight: '600px' }}
      />
    </div>
  );
}
