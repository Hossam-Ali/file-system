import FileSystemExplorer from '@/components/FileSystemExplorer';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 pl-1">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
            File System
          </h1>
          <p className="text-gray-500 mt-2 font-medium">
            Manage your files and directories flawlessly.
          </p>
        </header>
        <FileSystemExplorer />
      </div>
    </main>
  );
}
