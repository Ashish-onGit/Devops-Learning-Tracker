import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';

// Import Providers
import { ThemeProvider } from './providers/ThemeProvider';
import { ToastProvider } from './providers/ToastProvider';
import { ModalProvider } from './providers/ModalProvider';
import { SearchProvider } from './providers/SearchProvider';
import { AIProvider } from './providers/AIProvider';

// Import Views
import Landing from './features/landing/Landing';
import Dashboard from './features/dashboard/Dashboard';
import Roadmap from './features/roadmap/Roadmap';
import TopicDetail from './features/topics/TopicDetail';
import Notes from './features/notes/Notes';
import Tools from './features/tools/Tools';
import Projects from './features/projects/Projects';
import Interviews from './features/interviews/Interviews';
import Certifications from './features/certifications/Certifications';
import Career from './features/career/Career';
import Resources from './features/resources/Resources';
import ChatInterface from './features/ai/ChatInterface';

function App() {
  return (
    <Router>
      <ThemeProvider>
        <ToastProvider>
          <ModalProvider>
            <AIProvider>
              <SearchProvider>
                <Routes>
                  <Route path="/" element={<Landing />} />

                  <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
                  <Route path="/roadmap" element={<Layout><Roadmap /></Layout>} />
                  <Route path="/topics/:id" element={<Layout><TopicDetail /></Layout>} />
                  <Route path="/notes" element={<Layout><Notes /></Layout>} />
                  <Route path="/tools" element={<Layout><Tools /></Layout>} />
                  <Route path="/projects" element={<Layout><Projects /></Layout>} />
                  <Route path="/interviews" element={<Layout><Interviews /></Layout>} />
                  <Route path="/certifications" element={<Layout><Certifications /></Layout>} />
                  <Route path="/career" element={<Layout><Career /></Layout>} />
                  <Route path="/resources" element={<Layout><Resources /></Layout>} />
                  <Route path="/ai-assistant" element={<Layout><ChatInterface /></Layout>} />

                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </SearchProvider>
            </AIProvider>
          </ModalProvider>
        </ToastProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
