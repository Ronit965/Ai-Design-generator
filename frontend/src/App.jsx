import { useState, useRef, useCallback, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import PromptInput from './components/PromptInput';
import DesignGallery from './components/DesignGallery';
import Features from './components/Features';
import HowItWorks from './components/HowItWorks';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import './App.css';

function App() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDesigns, setGeneratedDesigns] = useState([]);
  const [error, setError] = useState(null);
  const [isLoadingDesigns, setIsLoadingDesigns] = useState(true);
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const promptRef = useRef(null);

  // Restore session on mount
  useEffect(() => {
    const session = localStorage.getItem('aimodel_session');
    if (session) {
      try {
        setUser(JSON.parse(session));
      } catch {
        localStorage.removeItem('aimodel_session');
      }
    }
  }, []);

  // Load saved designs from MongoDB and localStorage on page load
  useEffect(() => {
    async function loadSavedDesigns() {
      try {
        // First load from localStorage for immediate display and safety
        const localSaved = localStorage.getItem('aimodel_designs');
        if (localSaved) {
          try {
            setGeneratedDesigns(JSON.parse(localSaved));
          } catch (e) {
            console.error('Failed to parse local designs');
          }
        }

        const response = await fetch('https://ai-design-generator-one.vercel.app/api/designs/');
        const data = await response.json();

        if (data.success && data.designs && data.designs.length > 0) {
          const saved = data.designs.map((d) => ({
            id: d.id,
            prompt: d.prompt,
            style: d.style,
            gradient: getRandomGradient(),
            overlayElements: ['hero-text', 'stat-cards'],
            likes: Math.floor(Math.random() * 200) + 50,
            timeAgo: formatTimeAgo(d.created_at),
            isNew: false,
            aiGeneratedCode: {
              htmlCode: d.htmlCode,
              cssCode: d.cssCode,
              fullHtml: d.fullHtml,
            },
          }));
          
          setGeneratedDesigns((prev) => {
            const merged = [...prev];
            saved.forEach(apiDesign => {
              if (!merged.find(localDesign => localDesign.id === apiDesign.id)) {
                merged.push(apiDesign);
              }
            });
            localStorage.setItem('aimodel_designs', JSON.stringify(merged));
            return merged;
          });
        }
      } catch (err) {
        console.warn('Could not load saved designs from API:', err.message);
      } finally {
        setIsLoadingDesigns(false);
      }
    }

    loadSavedDesigns();
  }, []);

  const handleScrollToPrompt = useCallback(() => {
    const promptSection = document.getElementById('prompt');
    if (promptSection) {
      promptSection.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const handleGenerate = useCallback(async (prompt, style) => {
    // Gate behind auth — if not logged in, show auth modal
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch('https://ai-design-generator-one.vercel.app/api/generate/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt, style }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to generate design');
      }

      const newDesign = {
        id: data.designId || Date.now(),
        prompt: data.prompt,
        style: data.style,
        gradient: getRandomGradient(),
        overlayElements: ['hero-text', 'stat-cards'],
        likes: Math.floor(Math.random() * 200) + 50,
        timeAgo: 'Just now',
        isNew: true,
        // Real AI-generated code from the backend
        aiGeneratedCode: {
          htmlCode: data.htmlCode,
          cssCode: data.cssCode,
          fullHtml: data.fullHtml,
        },
      };

      setGeneratedDesigns((prev) => {
        const updated = [newDesign, ...prev];
        localStorage.setItem('aimodel_designs', JSON.stringify(updated));
        return updated;
      });

      // Scroll to gallery
      setTimeout(() => {
        const gallery = document.getElementById('gallery');
        if (gallery) {
          gallery.scrollIntoView({ behavior: 'smooth' });
        }
      }, 300);

      return data;

    } catch (err) {
      console.error('Generation error:', err);
      const errorMessage = err.message || 'Something went wrong. Please try again.';
      setError(errorMessage);
      throw err;
    } finally {
      setIsGenerating(false);
    }
  }, [user]);

  const handleAuth = (session) => {
    setUser(session);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('aimodel_session');
  };

  const handleLoginClick = () => {
    setShowAuthModal(true);
  };

  return (
    <div className="app">
      <Navbar
        user={user}
        onLoginClick={handleLoginClick}
        onLogout={handleLogout}
      />
      <main>
        <PromptInput
          onGenerate={handleGenerate}
          isGenerating={isGenerating}
          error={error}
          onClearError={() => setError(null)}
          isLoggedIn={!!user}
          onLoginClick={handleLoginClick}
        />
        <Hero onScrollToPrompt={handleScrollToPrompt} />
        <DesignGallery
          generatedDesigns={generatedDesigns}
          isLoading={isLoadingDesigns}
        />
        <Features />
        <HowItWorks />
      </main>
      <Footer />

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuth={handleAuth}
      />
    </div>
  );
}

// Gradient presets for design card backgrounds
function getRandomGradient() {
  const gradients = [
    'linear-gradient(135deg, #1e1b4b, #312e81, #4c1d95)',
    'linear-gradient(135deg, #0c0a09, #1c1917, #44403c)',
    'linear-gradient(135deg, #0f172a, #1e293b, #334155)',
    'linear-gradient(135deg, #14043a, #2d0a6e, #4a1c9e)',
    'linear-gradient(135deg, #0a0a0a, #1a0533, #0d0d2b)',
  ];
  return gradients[Math.floor(Math.random() * gradients.length)];
}

// Format ISO date to relative time
function formatTimeAgo(isoDate) {
  if (!isoDate) return '';

  const now = new Date();
  const date = new Date(isoDate);
  const seconds = Math.floor((now - date) / 1000);

  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;

  return date.toLocaleDateString();
}

export default App;
