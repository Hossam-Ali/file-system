'use client';

import React from 'react';
import { Home, ChevronRight, FolderPlus, FilePlus } from 'lucide-react';
import { FileNode, FileType } from '@/context/FileSystemContext';

interface ActionBarProps {
  breadcrumbs: FileNode[];
  navigateTo: (id: string | null) => void;
  openCreateModal: (type: FileType) => void;
}

export default function ActionBar({
  breadcrumbs,
  navigateTo,
  openCreateModal,
}: ActionBarProps) {
  return (
    <nav
      aria-label="File explorer navigation"
      className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8 bg-white p-4 rounded-2xl shadow-sm border border-gray-100"
    >
      <div
        className="flex items-center gap-2 overflow-x-auto text-sm text-gray-500 w-full sm:w-auto font-medium"
        aria-label="Breadcrumbs"
      >
        <button
          onClick={() => navigateTo(null)}
          className="hover:text-blue-600 hover:bg-blue-50 p-1.5 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Back to home folder"
        >
          <Home className="w-5 h-5 text-blue-500" />
        </button>

        {breadcrumbs.map((crumb) => (
          <React.Fragment key={crumb.id}>
            <ChevronRight
              className="w-4 h-4 text-gray-300"
              aria-hidden="true"
            />
            <button
              onClick={() => navigateTo(crumb.id)}
              className="hover:text-blue-600 hover:bg-blue-50 px-2 py-1 rounded-md transition-colors whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-blue-500"
              title={crumb.name}
              aria-label={`Navigate to ${crumb.name}`}
            >
              {crumb.name}
            </button>
          </React.Fragment>
        ))}
      </div>

      <div
        className="flex items-center gap-3"
        role="toolbar"
        aria-label="File actions"
      >
        <button
          onClick={() => openCreateModal('folder')}
          className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-xl shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2"
          aria-label="Create new folder"
        >
          <FolderPlus className="w-4 h-4" />
          <span className="hidden sm:inline">New Folder</span>
        </button>
        <button
          onClick={() => openCreateModal('file')}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label="Create new file"
        >
          <FilePlus className="w-4 h-4" />
          <span className="hidden sm:inline">New File</span>
        </button>
      </div>
    </nav>
  );
}
