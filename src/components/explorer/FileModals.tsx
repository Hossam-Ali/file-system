'use client';

import React, { useState, useEffect } from 'react';
import { FolderPlus, FilePlus, Edit3, FileText, Save, X } from 'lucide-react';
import { FileNode, FileType } from '@/context/FileSystemContext';

interface FileModalsProps {
  modalType: 'create' | 'rename' | 'edit' | null;
  targetType: FileType;
  targetNode: FileNode | null;
  setModalType: (value: 'create' | 'rename' | 'edit' | null) => void;
  handleCreate: (val: string) => void;
  handleRename: (val: string) => void;
  handleEditContent: (val: string) => void;
}

export default function FileModals({
  modalType,
  targetType,
  targetNode,
  setModalType,
  handleCreate,
  handleRename,
  handleEditContent,
}: FileModalsProps) {
  const [inputValue, setInputValue] = useState(() => {
    if (modalType === 'rename') return targetNode?.name || '';
    if (modalType === 'edit') return targetNode?.content || '';
    return '';
  });

  // Handle closing modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setModalType(null);
      }
    };

    if (modalType) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [modalType, setModalType]);

  if (!modalType) return null;

  const config = {
    create: {
      Icon: targetType === 'folder' ? FolderPlus : FilePlus,
      color: targetType === 'folder' ? 'text-amber-500' : 'text-blue-400',
      title: `Create New ${targetType === 'folder' ? 'Folder' : 'File'}`,
      placeholder:
        targetType === 'folder' ? 'e.g., Documents' : 'e.g., index.html',
      handler: handleCreate,
    },
    rename: {
      Icon: Edit3,
      color: 'text-gray-300',
      title: `Rename ${targetNode?.type === 'folder' ? 'Folder' : 'File'}`,
      placeholder: `Enter new ${
        targetNode?.type === 'folder' ? 'folder' : 'file'
      } name...`,
      handler: handleRename,
    },
    edit: {
      Icon: FileText,
      color: 'text-blue-400',
      title: `Editing: ${targetNode?.name}`,
      placeholder: 'Enter file content...',
      handler: handleEditContent,
    },
  };

  const {
    Icon: ModalIcon,
    color: iconColor,
    title: modalTitle,
    placeholder,
    handler,
  } = config[modalType];

  const onSubmitHandler = (e: React.FormEvent) => {
    e.preventDefault();
    handler(inputValue);
  };

  return (
    <div
      className="fixed inset-0 bg-slate-900/40 z-50 flex items-center justify-center p-4"
      onClick={() => setModalType(null)}
      role="presentation"
    >
      <div
        className="bg-white w-full max-w-md rounded-3xl border border-gray-100 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="flex items-center justify-between px-6 py-5 bg-slate-50 border-b border-gray-100">
          <h3
            id="modal-title"
            className="text-lg font-bold text-gray-900 flex items-center gap-3"
          >
            <ModalIcon className={`w-6 h-6 ${iconColor}`} aria-hidden="true" />
            {modalTitle}
          </h3>
          <button
            onClick={() => setModalType(null)}
            className="p-2 rounded-full text-gray-400 hover:text-gray-900 bg-white border border-gray-200 transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={onSubmitHandler} className="p-6">
          {modalType === 'edit' ? (
            <div>
              <label
                htmlFor="file-content"
                className="text-sm font-bold text-gray-700 ml-1 mb-2 block"
              >
                File Content
              </label>
              <textarea
                id="file-content"
                autoFocus
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-full h-56 bg-slate-50 text-gray-900 border border-gray-200 rounded-2xl p-4 outline-none focus:bg-white focus:border-blue-400 transition-all focus:ring-2 focus:ring-blue-500/20 font-mono text-sm leading-relaxed"
                placeholder={placeholder}
              />
            </div>
          ) : (
            <div>
              <label
                htmlFor="item-name"
                className="text-sm font-bold text-gray-700 ml-1 mb-2 block"
              >
                Name
              </label>
              <input
                id="item-name"
                type="text"
                autoFocus
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-full bg-slate-50 text-gray-900 border border-gray-200 rounded-2xl px-5 py-3.5 outline-none focus:bg-white focus:border-blue-400 transition-all font-medium focus:ring-2 focus:ring-blue-500/20"
                placeholder={placeholder}
              />
            </div>
          )}

          <div className="flex justify-end gap-3 mt-8">
            <button
              type="button"
              onClick={() => setModalType(null)}
              className="px-5 py-2.5 text-sm font-bold text-gray-600 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl transition-colors focus:ring-2 focus:ring-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={modalType !== 'edit' && !inputValue.trim()}
              className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold rounded-xl transition-all shadow-sm focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {modalType === 'edit' ? (
                <>
                  <Save className="w-4 h-4" aria-hidden="true" /> Save File
                </>
              ) : (
                'Confirm'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
