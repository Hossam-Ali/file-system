'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from 'react';

export type FileType = 'file' | 'folder';

export interface FileNode {
  id: string;
  name: string;
  type: FileType;
  parentId: string | null;
  content?: string;
  createdAt: number;
}

export interface FileSystemContextType {
  nodes: FileNode[];
  currentFolderId: string | null;
  currentNodes: FileNode[];
  breadcrumbs: FileNode[];
  navigateTo: (folderId: string | null) => void;
  createNode: (name: string, type: FileType) => void;
  renameNode: (id: string, newName: string) => void;
  deleteNode: (id: string) => void;
  updateFileContent: (id: string, content: string) => void;
}

const FileSystemContext = createContext<FileSystemContextType | undefined>(
  undefined,
);

export const FileSystemProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [nodes, setNodes] = useState<FileNode[]>([]);
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from LocalStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('file-system-state');
      if (saved) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setNodes(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load file system', e);
    }
    setIsLoaded(true);
  }, []);

  // Save to LocalStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('file-system-state', JSON.stringify(nodes));
    }
  }, [nodes, isLoaded]);

  // Get nodes for current folder
  const currentNodes = useMemo(
    () => nodes.filter((node) => node.parentId === currentFolderId),
    [nodes, currentFolderId],
  );

  // Calculate breadcrumbs
  const breadcrumbs = useMemo(() => {
    const list: FileNode[] = [];
    let currentId = currentFolderId;

    while (currentId) {
      const node = nodes.find((n) => n.id === currentId);
      if (!node) break;
      list.unshift(node);
      currentId = node.parentId;
    }
    return list;
  }, [nodes, currentFolderId]);

  const createNode = (name: string, type: FileType) => {
    // Check for duplicates in current directory
    const exists = nodes.some(
      (n) => n.name === name && n.parentId === currentFolderId,
    );

    if (exists) {
      alert(`A ${type} with the name "${name}" already exists in this folder.`);
      return;
    }

    setNodes((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name,
        type,
        parentId: currentFolderId,
        createdAt: Date.now(),
        content: type === 'file' ? '' : undefined,
      },
    ]);
  };

  const deleteNode = (id: string) => {
    setNodes((prev) =>
      prev.filter((node) => {
        let current: FileNode | undefined = node;
        while (current) {
          if (current.id === id) return false;
          // Look up parent to traverse up the tree
          current = prev.find((p) => p.id === current?.parentId);
        }
        return true;
      }),
    );
  };

  const renameNode = (id: string, name: string) => {
    const target = nodes.find((n) => n.id === id);
    if (!target) return;

    // Check for duplicate names in the same folder (excluding itself)
    const exists = nodes.some(
      (n) => n.name === name && n.parentId === target.parentId && n.id !== id,
    );

    if (exists) {
      alert(
        `An item with the name "${name}" already exists in this directory.`,
      );
      return;
    }

    setNodes((prev) => prev.map((n) => (n.id === id ? { ...n, name } : n)));
  };

  const updateFileContent = (id: string, content: string) => {
    setNodes((prev) => prev.map((n) => (n.id === id ? { ...n, content } : n)));
  };

  if (!isLoaded) return null;

  return (
    <FileSystemContext.Provider
      value={{
        nodes,
        currentFolderId,
        currentNodes,
        breadcrumbs,
        navigateTo: setCurrentFolderId,
        createNode,
        renameNode,
        deleteNode,
        updateFileContent,
      }}
    >
      {children}
    </FileSystemContext.Provider>
  );
};

export const useFileSystem = () => {
  const context = useContext(FileSystemContext);
  if (!context)
    throw new Error('useFileSystem must be used within FileSystemProvider');
  return context;
};
