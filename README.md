# 📁 React File System Explorer

A modern, high-performance, and accessible file system UI built with **Next.js 16**, **React 19**, **TypeScript**, and **Lucide Icons**.

## ✨ Features

- 🏗️ **Full CRUD Ops**: Create, Rename, and Delete folders and files.
- 📂 **Nested Navigation**: Deep folder hierarchy with breadcrumb navigation.
- 💾 **Persistent Storage**: Changes are automatically saved to `localStorage`.
- ⚡ **Optimized Performance**: Maximum code splitting using `next/dynamic` to ensure lightning-fast initial page loads.
- ♿ **Pro Accessibility**: Full WAI-ARIA compliance, keyboard navigation support (Enter/Space to open, Esc to close), and screen reader-friendly labels.

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- npm / yarn / pnpm

### Installation

```bash
git clone <repository-url>
cd file-system
npm install
```

### Running Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Running Tests

```bash
npm run test
```

## 🛠️ Technology Stack

- **Core**: Next.js 16 (App Router), React 19, TypeScript
- **State**: React Context (Simplified with derived state logic)
- **Styling**: Vanilla CSS Variables & Tailwind Utility classes
- **Icons**: Lucide React
- **Testing**: Jest, React Testing Library

## 📂 Project Structure

- `src/app`: Next.js App Router for layout and pages.
- `src/context`: Simplified FileSystemContext with optimized delete/navigation logic.
- `src/components`:
  - `FileSystemExplorer.tsx`: Main entry point with dynamic component imports.
  - `explorer/`: Isolated, accessible UI components (ActionBar, FileGrid, FileModals).
- `src/**/__tests__`: Comprehensive unit and integration tests.
