import { render, screen, fireEvent } from '@testing-library/react';
import FileModals from '../FileModals';
import { FileNode } from '@/context/FileSystemContext';

const mockHandleCreate = jest.fn();
const mockHandleRename = jest.fn();
const mockHandleEditContent = jest.fn();
const mockSetModalType = jest.fn();

const mockFolder: FileNode = {
  id: 'folder-1',
  name: 'My Folder',
  type: 'folder',
  parentId: null,
  createdAt: Date.now(),
};

describe('FileModals', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders "Create New Folder" modal correctly', () => {
    render(
      <FileModals
        modalType="create"
        targetType="folder"
        targetNode={null}
        setModalType={mockSetModalType}
        handleCreate={mockHandleCreate}
        handleRename={mockHandleRename}
        handleEditContent={mockHandleEditContent}
      />
    );

    expect(screen.getByText('Create New Folder')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('e.g., Documents')).toBeInTheDocument();
  });

  it('handles input and calls handleCreate on submit', () => {
    render(
      <FileModals
        modalType="create"
        targetType="file"
        targetNode={null}
        setModalType={mockSetModalType}
        handleCreate={mockHandleCreate}
        handleRename={mockHandleRename}
        handleEditContent={mockHandleEditContent}
      />
    );

    const input = screen.getByPlaceholderText('e.g., index.html');
    fireEvent.change(input, { target: { value: 'cool-file.txt' } });
    fireEvent.submit(screen.getByRole('button', { name: 'Confirm' }));

    expect(mockHandleCreate).toHaveBeenCalledWith('cool-file.txt');
  });

  it('renders "Rename" modal with initial value', () => {
    render(
      <FileModals
        modalType="rename"
        targetType="folder"
        targetNode={mockFolder}
        setModalType={mockSetModalType}
        handleCreate={mockHandleCreate}
        handleRename={mockHandleRename}
        handleEditContent={mockHandleEditContent}
      />
    );

    const input = screen.getByDisplayValue('My Folder');
    expect(input).toBeInTheDocument();
    
    // Test actual rename submit
    fireEvent.change(input, { target: { value: 'Renamed Name' } });
    fireEvent.submit(screen.getByRole('button', { name: 'Confirm' }));
    expect(mockHandleRename).toHaveBeenCalledWith('Renamed Name');
  });

  it('renders "Edit Content" modal correctly', () => {
    const mockFile: FileNode = {
      id: 'file-1',
      name: 'file.txt',
      type: 'file',
      parentId: null,
      content: 'Initial content',
      createdAt: Date.now(),
    };

    render(
      <FileModals
        modalType="edit"
        targetType="file"
        targetNode={mockFile}
        setModalType={mockSetModalType}
        handleCreate={mockHandleCreate}
        handleRename={mockHandleRename}
        handleEditContent={mockHandleEditContent}
      />
    );

    expect(screen.getByText('Editing: file.txt')).toBeInTheDocument();
    const textarea = screen.getByDisplayValue('Initial content');
    expect(textarea).toBeInTheDocument();

    fireEvent.change(textarea, { target: { value: 'Updated content!' } });
    fireEvent.click(screen.getByText('Save File'));
    expect(mockHandleEditContent).toHaveBeenCalledWith('Updated content!');
  });
});
