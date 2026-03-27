import { render, screen, fireEvent } from '@testing-library/react';
import FileGrid from '../FileGrid';
import { FileNode } from '@/context/FileSystemContext';

const mockNodes: FileNode[] = [
  { id: '1', name: 'Z-Folder', type: 'folder', parentId: null, createdAt: 1 },
  { id: '2', name: 'A-Folder', type: 'folder', parentId: null, createdAt: 2 },
  { id: '3', name: 'B-File.txt', type: 'file', parentId: null, createdAt: 3 },
];

const mockOnNodeClick = jest.fn();
const mockOpenRenameModal = jest.fn();
const mockDeleteNode = jest.fn();

describe('FileGrid', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders empty folder state correctly', () => {
    render(
      <FileGrid
        nodes={[]}
        onNodeClick={mockOnNodeClick}
        openRenameModal={mockOpenRenameModal}
        deleteNode={mockDeleteNode}
      />,
    );
    expect(screen.getByText('This folder is empty')).toBeInTheDocument();
  });

  it('renders nodes and sorts them (folders first, then name)', () => {
    render(
      <FileGrid
        nodes={mockNodes}
        onNodeClick={mockOnNodeClick}
        openRenameModal={mockOpenRenameModal}
        deleteNode={mockDeleteNode}
      />,
    );

    const labels = screen.getAllByText(/[A-Z]-/);
    expect(labels[0]).toHaveTextContent('A-Folder');
    expect(labels[1]).toHaveTextContent('Z-Folder');
    expect(labels[2]).toHaveTextContent('B-File.txt');
  });

  it('calls onNodeClick when an item is clicked', () => {
    render(
      <FileGrid
        nodes={mockNodes}
        onNodeClick={mockOnNodeClick}
        openRenameModal={mockOpenRenameModal}
        deleteNode={mockDeleteNode}
      />,
    );

    fireEvent.click(screen.getByText('A-Folder'));
    expect(mockOnNodeClick).toHaveBeenCalledWith(mockNodes[1]);
  });

  it('toggles menu on click and handles rename/delete', () => {
    render(
      <FileGrid
        nodes={mockNodes}
        onNodeClick={mockOnNodeClick}
        openRenameModal={mockOpenRenameModal}
        deleteNode={mockDeleteNode}
      />,
    );

    // Get the first item's options button using its accessible name
    const aFolderOptions = screen.getByRole('button', {
      name: /options for A-Folder/i,
    });
    fireEvent.click(aFolderOptions);

    // Check if Rename/Delete appear
    expect(screen.getByText('Rename')).toBeInTheDocument();

    // Click Rename
    fireEvent.click(screen.getByText('Rename'));
    expect(mockOpenRenameModal).toHaveBeenCalledWith(mockNodes[1]);

    // Menu should be closed (we need to trigger it again for delete to confirm state if needed, but our logic closes it on action)
    // Let's re-open and test delete
    fireEvent.click(aFolderOptions);
    fireEvent.click(screen.getByText('Delete'));
    expect(mockDeleteNode).toHaveBeenCalledWith(mockNodes[1].id);
  });
});
