import { render, act } from '@testing-library/react';
import {
  FileSystemProvider,
  useFileSystem,
  FileSystemContextType,
} from '../FileSystemContext';

// Helper component to interact with the file system context
const TestComponent = ({
  onAction,
}: {
  onAction: (api: FileSystemContextType) => void;
}) => {
  const api = useFileSystem();
  onAction(api);
  return null;
};

describe('FileSystemContext', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('starts with default items if localStorage is empty', () => {
    let capturedApi: FileSystemContextType | undefined;
    render(
      <FileSystemProvider>
        <TestComponent
          onAction={(api) => {
            capturedApi = api;
          }}
        />
      </FileSystemProvider>,
    );

    expect(capturedApi?.nodes.length).toBe(0);
  });

  it('creates and deletes nodes correctly', () => {
    let capturedApi: FileSystemContextType | undefined;
    const { rerender } = render(
      <FileSystemProvider>
        <TestComponent
          onAction={(api) => {
            capturedApi = api;
          }}
        />
      </FileSystemProvider>,
    );

    act(() => {
      capturedApi?.createNode('New Folder', 'folder');
    });

    // Need to wait for states to update properly
    rerender(
      <FileSystemProvider>
        <TestComponent
          onAction={(api) => {
            capturedApi = api;
          }}
        />
      </FileSystemProvider>,
    );

    expect(capturedApi?.nodes.length).toBe(1);
    expect(capturedApi?.nodes[0].name).toBe('New Folder');

    const folderId = capturedApi?.nodes[0].id;
    if (folderId) {
      act(() => {
        capturedApi?.deleteNode(folderId);
      });
    }

    rerender(
      <FileSystemProvider>
        <TestComponent
          onAction={(api) => {
            capturedApi = api;
          }}
        />
      </FileSystemProvider>,
    );

    expect(capturedApi?.nodes.length).toBe(0);
  });
});
