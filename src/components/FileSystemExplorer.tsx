'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useFileSystem, FileType, FileNode } from '@/context/FileSystemContext';
// Dynamically import all heavy components to maximize code splitting and speed up initial page load
const ActionBar = dynamic(() => import('./explorer/ActionBar'), {
  ssr: true,
});

const FileGrid = dynamic(() => import('./explorer/FileGrid'), {
  ssr: true,
});

const FileModals = dynamic(() => import('./explorer/FileModals'), {
  ssr: false,
  loading: () => null, // Modals should be silent while loading to avoid layout shift
});

export default function FileSystemExplorer() {
  const {
    currentNodes,
    breadcrumbs,
    navigateTo,
    createNode,
    deleteNode,
    renameNode,
    updateFileContent,
  } = useFileSystem();

  const [modalType, setModalType] = useState<
    null | 'create' | 'rename' | 'edit'
  >(null);
  const [targetType, setTargetType] = useState<FileType>('folder');
  const [targetNode, setTargetNode] = useState<FileNode | null>(null);

  const handleCreate = (val: string) => {
    if (!val.trim()) return;
    createNode(val.trim(), targetType);
    setModalType(null);
  };

  const handleRename = (val: string) => {
    if (!val.trim() || !targetNode) return;
    renameNode(targetNode.id, val.trim());
    setModalType(null);
    setTargetNode(null);
  };

  const handleEditContent = (val: string) => {
    if (!targetNode) return;
    updateFileContent(targetNode.id, val);
    setModalType(null);
    setTargetNode(null);
  };

  const openCreateModal = (type: FileType) => {
    setTargetType(type);
    setModalType('create');
  };

  const openRenameModal = (node: FileNode) => {
    setTargetNode(node);
    setModalType('rename');
  };

  const openEditModal = (node: FileNode) => {
    setTargetNode(node);
    setModalType('edit');
  };

  const onNodeClick = (node: FileNode) => {
    if (node.type === 'folder') {
      navigateTo(node.id);
    } else {
      openEditModal(node);
    }
  };

  return (
    <div className="w-full h-full relative">
      <ActionBar
        breadcrumbs={breadcrumbs}
        navigateTo={navigateTo}
        openCreateModal={openCreateModal}
      />

      <FileGrid
        nodes={currentNodes}
        onNodeClick={onNodeClick}
        openRenameModal={openRenameModal}
        deleteNode={deleteNode}
      />

      {modalType && (
        <FileModals
          modalType={modalType}
          targetType={targetType}
          targetNode={targetNode}
          setModalType={setModalType}
          handleCreate={handleCreate}
          handleRename={handleRename}
          handleEditContent={handleEditContent}
        />
      )}
    </div>
  );
}
