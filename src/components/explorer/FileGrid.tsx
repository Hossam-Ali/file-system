'use client';

import { useMemo, useState, useEffect } from 'react';
import { FileNode } from '@/context/FileSystemContext';
import {
  Folder as FolderIcon,
  FileText,
  MoreVertical,
  Edit3,
  Trash2,
} from 'lucide-react';

interface FileGridProps {
  nodes: FileNode[];
  onNodeClick: (node: FileNode) => void;
  openRenameModal: (node: FileNode) => void;
  deleteNode: (id: string) => void;
}

export default function FileGrid({
  nodes,
  onNodeClick,
  openRenameModal,
  deleteNode,
}: FileGridProps) {
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const sortedNodes = useMemo(() => {
    return [...nodes].sort((a, b) => {
      if (a.type !== b.type) return a.type === 'folder' ? -1 : 1;
      return a.name.localeCompare(b.name);
    });
  }, [nodes]);

  // Handle clicking outside to close any open menu
  useEffect(() => {
    const handleClick = () => setActiveMenuId(null);
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  const handleNodeClick = (node: FileNode) => {
    onNodeClick(node);
  };

  const handleMenuToggle = (e: React.MouseEvent, nodeId: string) => {
    e.stopPropagation();
    setActiveMenuId((prev) => (prev === nodeId ? null : nodeId));
  };

  const handleRenameClick = (e: React.MouseEvent, node: FileNode) => {
    e.stopPropagation();
    openRenameModal(node);
    setActiveMenuId(null);
  };

  const handleDeleteClick = (e: React.MouseEvent, nodeId: string) => {
    e.stopPropagation();
    deleteNode(nodeId);
    setActiveMenuId(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent, node: FileNode) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleNodeClick(node);
    }
  };

  if (nodes.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center py-20 px-4 text-center border border-gray-100 rounded-3xl bg-white shadow-sm"
        role="status"
      >
        <div className="w-20 h-20 mb-5 flex items-center justify-center bg-blue-50 rounded-full border border-blue-100">
          <FolderIcon className="w-10 h-10 text-blue-400" aria-hidden="true" />
        </div>
        <p className="text-gray-900 text-lg font-bold mb-1 tracking-tight">
          This folder is empty
        </p>
        <p className="text-gray-500 font-medium">
          Create a new file or folder to get started.
        </p>
      </div>
    );
  }

  return (
    <div
      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5"
      role="grid"
      aria-label="Files and folders"
    >
      {sortedNodes.map((node) => (
        <div
          key={node.id}
          role="button"
          tabIndex={0}
          aria-label={`${node.type === 'folder' ? 'Folder' : 'File'}: ${
            node.name
          }`}
          className="group relative bg-white p-5 rounded-2xl ring-1 ring-gray-900/5 shadow-sm hover:shadow-lg hover:ring-blue-500/20 transition-all cursor-pointer flex flex-col items-center gap-4 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          onClick={() => handleNodeClick(node)}
          onKeyDown={(e) => handleKeyDown(e, node)}
        >
          <div className="absolute top-2 right-2">
            <div className="relative">
              <button
                className="text-gray-400 hover:text-gray-900 bg-transparent hover:bg-gray-100 p-1.5 rounded-lg transition-colors focus:ring-2 focus:ring-blue-500/30"
                onClick={(e) => handleMenuToggle(e, node.id)}
                aria-label={`Options for ${node.name}`}
                aria-haspopup="true"
                aria-expanded={activeMenuId === node.id}
              >
                <MoreVertical className="w-5 h-5" />
              </button>

              {activeMenuId === node.id && (
                <div
                  className="absolute top-full right-0 mt-1 w-36 bg-white ring-1 ring-gray-900/5 rounded-xl shadow-2xl z-20 py-1 overflow-hidden transform origin-top-right animate-in fade-in zoom-in-95 duration-100"
                  role="menu"
                  aria-label="Item actions"
                >
                  <button
                    onClick={(e) => handleRenameClick(e, node)}
                    role="menuitem"
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors focus:bg-gray-50 focus:outline-none"
                  >
                    <Edit3
                      className="w-4 h-4 text-gray-400"
                      aria-hidden="true"
                    />
                    Rename
                  </button>
                  <div className="h-px bg-gray-100 my-0.5 px-2" role="none" />
                  <button
                    onClick={(e) => handleDeleteClick(e, node.id)}
                    role="menuitem"
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors focus:bg-red-50 focus:outline-none"
                  >
                    <Trash2
                      className="w-4 h-4 text-red-400"
                      aria-hidden="true"
                    />
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>

          <div
            className="w-16 h-16 flex items-center justify-center mt-2 group-hover:scale-110 transition-transform duration-300 drop-shadow-sm"
            aria-hidden="true"
          >
            {node.type === 'folder' ? (
              <FolderIcon
                className="w-16 h-16 text-amber-400 drop-shadow-sm"
                fill="currentColor"
              />
            ) : (
              <FileText className="w-14 h-14 text-blue-500 drop-shadow-sm" />
            )}
          </div>

          <span className="text-sm font-semibold text-gray-800 truncate w-full text-center px-2">
            {node.name}
          </span>
        </div>
      ))}
    </div>
  );
}
