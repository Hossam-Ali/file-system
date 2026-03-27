import React, { Suspense, lazy } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import FileSystemExplorer from '../FileSystemExplorer';
import { FileSystemProvider } from '@/context/FileSystemContext';

// Mock dynamic import correctly without using require()
jest.mock('next/dynamic', () => ({
  __esModule: true,
  default: (
    loader: () => Promise<{ default: React.ComponentType<Record<string, unknown>> }>,
  ) => {
    const Component = lazy(loader);
    return (props: Record<string, unknown>) => (
      <Suspense fallback={null}>
        <Component {...props} />
      </Suspense>
    );
  },
}));

describe('FileSystemExplorer', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders and displays default content', async () => {
    render(
      <FileSystemProvider>
        <FileSystemExplorer />
      </FileSystemProvider>,
    );

    // Should render headers and buttons
    expect(await screen.findByText('New Folder')).toBeInTheDocument();
    expect(await screen.findByText('New File')).toBeInTheDocument();
  });

  it('navigates to folders on click', async () => {
    render(
      <FileSystemProvider>
        <FileSystemExplorer />
      </FileSystemProvider>,
    );

    // Initial folder should be empty since we cleaned up the initialNodes
    // Let's create one folder
    fireEvent.click(await screen.findByText('New Folder'));
    const input = await screen.findByPlaceholderText('e.g., Documents');
    fireEvent.change(input, { target: { value: 'Projects' } });
    fireEvent.submit(screen.getByRole('button', { name: 'Confirm' }));

    // Now Projects should be visible in the grid
    expect(await screen.findByText('Projects')).toBeInTheDocument();

    // Click Projects to navigate in
    fireEvent.click(screen.getByText('Projects'));

    // Breadcrumbs should update
    expect(await screen.findByTitle('Projects')).toBeInTheDocument();

    // Grid should show empty state inside the folder
    expect(await screen.findByText('This folder is empty')).toBeInTheDocument();
  });

  it('opens create modal correctly', async () => {
    render(
      <FileSystemProvider>
        <FileSystemExplorer />
      </FileSystemProvider>,
    );

    fireEvent.click(await screen.findByText('New Folder'));
    expect(await screen.findByText('Create New Folder')).toBeInTheDocument();

    // Close and open file modal using the Cancel button
    fireEvent.click(screen.getByText('Cancel'));

    fireEvent.click(await screen.findByText('New File'));
    expect(await screen.findByText('Create New File')).toBeInTheDocument();
  });
});
