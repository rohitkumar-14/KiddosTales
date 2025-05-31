import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Pages
import Home from './pages/Home';
import Explore from './pages/Explore';
import StoryViewer from './pages/StoryViewer';
import NotFound from './pages/NotFound';

// Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Context Providers
import { ThemeProvider } from './context/ThemeContext';
import { ApiKeyProvider } from './context/ApiKeyContext';
import { StoriesProvider } from './context/StoriesContext';

function App() {
  return (
    <Router>
      <ApiKeyProvider>
        <ThemeProvider>
          <StoriesProvider>
            <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 transition-colors duration-300">
              <Navbar />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/explore" element={<Explore />} />
                  <Route path="/story/:id" element={<StoryViewer />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <Footer />
              <ToastContainer position="bottom-right" theme="colored" />
            </div>
          </StoriesProvider>
        </ThemeProvider>
      </ApiKeyProvider>
    </Router>
  );
}

export default App;