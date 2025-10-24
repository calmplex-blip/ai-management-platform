'use client';

import { useState, useRef, ChangeEvent } from 'react';
import { SpreadsheetComponentProps } from '@/types/skin';
import { Button } from '@/components/ui/Button';

interface CandidateRow {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  stage: string;
  source: string;
  dateApplied: string;
  notes: string;
  [key: string]: string;
}

export function SpreadsheetComponent(props: SpreadsheetComponentProps) {
  const defaultStages = props.trackingStages || ['New', 'Screening', 'Interview', 'Offer', 'Hired', 'Rejected'];
  const [data, setData] = useState<CandidateRow[]>(props.data || []);
  const [selectedRow, setSelectedRow] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const defaultColumns = props.columns || [
    { key: 'name', label: 'Name', width: 150 },
    { key: 'email', label: 'Email', width: 200 },
    { key: 'phone', label: 'Phone', width: 130 },
    { key: 'position', label: 'Position', width: 150 },
    { key: 'stage', label: 'Stage', width: 120 },
    { key: 'source', label: 'Source', width: 100 },
    { key: 'dateApplied', label: 'Date Applied', width: 120 },
    { key: 'notes', label: 'Notes', width: 200 },
  ];

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (!text) return;

      // Parse CSV
      const lines = text.split('\n');
      const headers = lines[0].split(',').map((h) => h.trim().replace(/"/g, ''));

      const newData: CandidateRow[] = [];
      for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;

        const values = lines[i].split(',').map((v) => v.trim().replace(/"/g, ''));
        const row: any = { id: crypto.randomUUID() };

        headers.forEach((header, index) => {
          const key = header.toLowerCase().replace(/\s+/g, '');
          row[key] = values[index] || '';
        });

        // Ensure required fields
        if (!row.name) continue;
        row.email = row.email || '';
        row.phone = row.phone || '';
        row.position = row.position || '';
        row.stage = row.stage || defaultStages[0];
        row.source = row.source || 'CSV Upload';
        row.dateApplied = row.dateapplied || row.date || new Date().toISOString().split('T')[0];
        row.notes = row.notes || '';

        newData.push(row as CandidateRow);
      }

      setData((prevData) => [...prevData, ...newData]);
    };

    reader.readAsText(file);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCellChange = (rowId: string, columnKey: string, value: string) => {
    if (!props.editable) return;

    setData((prevData) =>
      prevData.map((row) =>
        row.id === rowId ? { ...row, [columnKey]: value } : row
      )
    );
  };

  const handleAddRow = () => {
    const newRow: CandidateRow = {
      id: crypto.randomUUID(),
      name: '',
      email: '',
      phone: '',
      position: '',
      stage: defaultStages[0],
      source: 'Manual',
      dateApplied: new Date().toISOString().split('T')[0],
      notes: '',
    };
    setData([...data, newRow]);
  };

  const handleDeleteRow = (rowId: string) => {
    setData((prevData) => prevData.filter((row) => row.id !== rowId));
    if (selectedRow === rowId) {
      setSelectedRow(null);
    }
  };

  const handleExportCSV = () => {
    if (data.length === 0) return;

    const headers = defaultColumns.map((col) => col.label).join(',');
    const rows = data.map((row) =>
      defaultColumns.map((col) => `"${row[col.key] || ''}"`).join(',')
    );

    const csv = [headers, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `candidates_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const getStageColor = (stage: string) => {
    const colors: Record<string, string> = {
      'New': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'Screening': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      'Interview': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      'Offer': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'Hired': 'bg-green-200 text-green-900 dark:bg-green-800 dark:text-green-100',
      'Rejected': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    };
    return colors[stage] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
  };

  const stageCounts = defaultStages.reduce((acc, stage) => {
    acc[stage] = data.filter((row) => row.stage === stage).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
      {/* Header with Pipeline Stats */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recruitment Pipeline</h3>
          <div className="flex gap-2">
            {props.allowUpload && (
              <>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                >
                  📤 Upload CSV
                </Button>
              </>
            )}
            <Button size="sm" variant="outline" onClick={handleExportCSV}>
              📥 Export CSV
            </Button>
            <Button size="sm" onClick={handleAddRow}>
              ➕ Add Candidate
            </Button>
          </div>
        </div>

        {/* Pipeline Stage Counts */}
        <div className="flex gap-2 flex-wrap">
          {defaultStages.map((stage) => (
            <div
              key={stage}
              className={`px-3 py-1 rounded-full text-xs font-medium ${getStageColor(stage)}`}
            >
              {stage}: {stageCounts[stage] || 0}
            </div>
          ))}
          <div className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
            Total: {data.length}
          </div>
        </div>
      </div>

      {/* Spreadsheet Table */}
      <div className="flex-1 overflow-auto">
        {data.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
            <div className="text-center">
              <div className="text-4xl mb-2">📊</div>
              <p className="text-sm">No candidates yet. Upload a CSV or add manually.</p>
            </div>
          </div>
        ) : (
          <table className="w-full border-collapse">
            <thead className="sticky top-0 bg-gray-50 dark:bg-gray-800 z-10">
              <tr>
                <th className="px-2 py-2 text-left text-xs font-medium text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700 w-10">
                  #
                </th>
                {defaultColumns.map((column) => (
                  <th
                    key={column.key}
                    className="px-3 py-2 text-left text-xs font-medium text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700"
                    style={{ width: column.width }}
                  >
                    {column.label}
                  </th>
                ))}
                <th className="px-2 py-2 text-left text-xs font-medium text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700 w-20">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <tr
                  key={row.id}
                  className={`hover:bg-gray-50 dark:hover:bg-gray-800 ${
                    selectedRow === row.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                  }`}
                  onClick={() => setSelectedRow(row.id)}
                >
                  <td className="px-2 py-2 text-xs text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-800">
                    {index + 1}
                  </td>
                  {defaultColumns.map((column) => (
                    <td
                      key={column.key}
                      className="px-3 py-2 text-sm border-b border-gray-100 dark:border-gray-800"
                    >
                      {column.key === 'stage' ? (
                        <select
                          value={row[column.key] || ''}
                          onChange={(e) => handleCellChange(row.id, column.key, e.target.value)}
                          disabled={!props.editable}
                          className={`w-full px-2 py-1 rounded text-xs font-medium ${getStageColor(row.stage)} border-0 focus:ring-2 focus:ring-blue-500`}
                        >
                          {defaultStages.map((stage) => (
                            <option key={stage} value={stage}>
                              {stage}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type="text"
                          value={row[column.key] || ''}
                          onChange={(e) => handleCellChange(row.id, column.key, e.target.value)}
                          disabled={!props.editable}
                          className="w-full px-2 py-1 text-sm bg-transparent border-0 focus:ring-2 focus:ring-blue-500 rounded text-gray-900 dark:text-white disabled:cursor-not-allowed"
                        />
                      )}
                    </td>
                  ))}
                  <td className="px-2 py-2 border-b border-gray-100 dark:border-gray-800">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteRow(row.id);
                      }}
                      className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 text-xs"
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
