import { render, screen, fireEvent } from '@testing-library/react';
import ActionBar from '../ActionBar';
import { FileNode } from '@/context/FileSystemContext';

const mockNavigateTo = jest.fn();
const mockOpenCreateModal = jest.fn();

const mockBreadcrumbs: FileNode[] = [
  {
    id: 'folder-1',
    name: 'Folder 1',
    type: 'folder',
    parentId: null,
    createdAt: Date.now(),
  },
];

describe('ActionBar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with breadcrumbs', () => {
    render(
      <ActionBar
        breadcrumbs={mockBreadcrumbs}
        navigateTo={mockNavigateTo}
        openCreateModal={mockOpenCreateModal}
      />,
    );

    expect(screen.getByText('Folder 1')).toBeInTheDocument();
    expect(screen.getByText('New Folder')).toBeInTheDocument();
    expect(screen.getByText('New File')).toBeInTheDocument();
  });

  it('calls navigateTo(null) when home button is clicked', () => {
    render(
      <ActionBar
        breadcrumbs={[]}
        navigateTo={mockNavigateTo}
        openCreateModal={mockOpenCreateModal}
      />,
    );

    // The home button is the first one
    const homeBtn = screen.getByRole('button', { name: /back to home/i });
    fireEvent.click(homeBtn);
    expect(mockNavigateTo).toHaveBeenCalledWith(null);
  });

  it('calls openCreateModal with correct type', () => {
    render(
      <ActionBar
        breadcrumbs={[]}
        navigateTo={mockNavigateTo}
        openCreateModal={mockOpenCreateModal}
      />,
    );

    fireEvent.click(screen.getByText('New Folder'));
    expect(mockOpenCreateModal).toHaveBeenCalledWith('folder');

    fireEvent.click(screen.getByText('New File'));
    expect(mockOpenCreateModal).toHaveBeenCalledWith('file');
  });
});
