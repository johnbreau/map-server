import React from 'react';
import { AppShell, useMantineTheme, useMantineColorScheme } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { 
  BrowserRouter as Router,
  Routes, 
  Route, 
  Navigate
} from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Import components
import { Header } from './components/Header';

// Import page components
import SearchPage from './pages/SearchPage';
import NotesListPage from './pages/NotesListPage';
import NoteViewer from './pages/NoteViewer';
import AIPage from './pages/AIPage';
import BooksPage from './pages/BooksPage';
import JournalsView from './features/journals/JournalsView';
import { HealthPage } from './pages/HealthPage';

const queryClient = new QueryClient();

// For now, we'll use the standard BrowserRouter
// The future flags warning is just informational and won't affect functionality
// We can address the v7 changes when we upgrade to React Router v7

// Custom AppShell component with proper typing
const CustomAppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { colorScheme } = useMantineColorScheme();
  
  return (
    <AppShell
      header={{ height: 60 }}
      padding={0}
      style={{
        minHeight: '100vh',
        backgroundColor: colorScheme === 'dark' ? '#1a1b1e' : '#f8f9fa',
        display: 'flex',
        flexDirection: 'column',
      }}
      styles={{
        root: {
          '--app-shell-padding': '0',
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
        },
        main: {
          padding: 0,
          margin: 0,
          flex: 1,
          overflow: 'auto',
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      <AppShell.Header 
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          border: 'none',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          backgroundColor: colorScheme === 'dark' ? '#1a1b1e' : '#fff',
        }}
      >
        <Header />
      </AppShell.Header>
      <AppShell.Main style={{ padding: 0, margin: 0 }}>
        <div style={{
          height: '100%',
          width: '100%',
          padding: '16px',
          boxSizing: 'border-box',
        }}>
          {children}
        </div>
      </AppShell.Main>
    </AppShell>
  );
};

console.log('App.tsx: Rendering App component');

const App = () => {
  console.log('App.tsx: Inside App component');
  // Theme and color scheme are available for future use if needed
  useMantineTheme();
  useMantineColorScheme();
  
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Notifications position="top-right" />
        <CustomAppShell>
          <Routes>
            <Route path="/" element={<Navigate to="/search" replace />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/notes" element={<NotesListPage />} />
            <Route path="/notes/:path" element={<NoteViewer />} />
            <Route path="/ai" element={<AIPage />} />
            <Route path="/journals" element={<JournalsView />} />
            <Route path="/books" element={<BooksPage />} />
            <Route path="/health" element={<HealthPage />} />
            <Route path="*" element={<Navigate to="/search" replace />} />
          </Routes>
        </CustomAppShell>
        {/* DevTools removed */}
      </Router>
    </QueryClientProvider>
  );
};

export default App;
