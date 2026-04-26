import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiArrowDownTray, HiHeart, HiShare, HiArrowsPointingOut, HiXMark, HiCodeBracket } from 'react-icons/hi2';
import CodeViewer from './CodeViewer';
import { generateCode } from '../utils/codeGenerator';
import './DesignGallery.css';

/**
 * Renders AI-generated HTML inside a sandboxed iframe.
 * Used for both card thumbnails (scaled) and lightbox (full-size).
 */
const DesignPreview = ({ fullHtml, className = '', style = {}, allowScroll = false }) => {
  const iframeRef = useRef(null);

  useEffect(() => {
    if (iframeRef.current && fullHtml) {
      const doc = iframeRef.current.contentDocument;
      if (doc) {
        doc.open();
        doc.write(fullHtml);
        doc.close();
      }
    }
  }, [fullHtml]);

  if (!fullHtml) return null;

  return (
    <iframe
      ref={iframeRef}
      className={`design-preview-iframe ${className}`}
      style={style}
      title="Design Preview"
      sandbox="allow-same-origin"
      scrolling={allowScroll ? 'yes' : 'no'}
    />
  );
};

// Simulated generated designs with gradient placeholders
const mockDesigns = [
  {
    id: 1,
    prompt: "Futuristic dashboard with neon gradients",
    style: "modern",
    gradient: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)",
    overlayElements: ['chart-bars', 'stat-cards', 'sidebar'],
    likes: 234,
    timeAgo: "2 min ago",
  },
  {
    id: 2,
    prompt: "Minimalist meditation app, dark mode",
    style: "minimal",
    gradient: "linear-gradient(135deg, #1a1a2e, #16213e, #0f3460)",
    overlayElements: ['circle-timer', 'text-center'],
    likes: 189,
    timeAgo: "5 min ago",
  },
  {
    id: 3,
    prompt: "E-commerce sneaker product page",
    style: "bold",
    gradient: "linear-gradient(135deg, #0d0d0d, #1a0a2e, #2d1b69)",
    overlayElements: ['product-hero', 'price-tag'],
    likes: 312,
    timeAgo: "8 min ago",
  },
  {
    id: 4,
    prompt: "SaaS analytics landing page, purple theme",
    style: "glassmorphism",
    gradient: "linear-gradient(135deg, #13111c, #1e1b4b, #312e81)",
    overlayElements: ['hero-text', 'feature-grid'],
    likes: 156,
    timeAgo: "12 min ago",
  },
  {
    id: 5,
    prompt: "Music player with waveform visualization",
    style: "modern",
    gradient: "linear-gradient(135deg, #0c0c1d, #1a0533, #2d0a4e)",
    overlayElements: ['waveform', 'controls'],
    likes: 278,
    timeAgo: "15 min ago",
  },
  {
    id: 6,
    prompt: "Social media profile with stories grid",
    style: "modern",
    gradient: "linear-gradient(135deg, #1b1b2f, #162447, #1f4068)",
    overlayElements: ['avatar', 'grid-photos'],
    likes: 198,
    timeAgo: "20 min ago",
  },
];

const DesignGallery = ({ generatedDesigns = [] }) => {
  const [lightboxDesign, setLightboxDesign] = useState(null);
  const [likedDesigns, setLikedDesigns] = useState(new Set());
  const [expandedCode, setExpandedCode] = useState(null); // track which card's code is open
  const [lightboxTab, setLightboxTab] = useState('preview'); // 'preview' | 'code'

  const allDesigns = [...generatedDesigns, ...mockDesigns];

  const handleLike = (id, e) => {
    e.stopPropagation();
    setLikedDesigns((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleToggleCode = (id, e) => {
    e.stopPropagation();
    setExpandedCode((prev) => (prev === id ? null : id));
  };

  const openLightbox = (design, tab = 'preview') => {
    setLightboxDesign(design);
    setLightboxTab(tab);
  };

  const getDesignCode = (design) => {
    // Use AI-generated code from backend if available, otherwise fall back to local generator
    if (design.aiGeneratedCode) {
      return design.aiGeneratedCode;
    }
    return generateCode(design.prompt, design.style);
  };

  return (
    <section className="gallery-section" id="gallery">
      <div className="gallery-container">
        <motion.div
          className="gallery-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="gallery-title">
            Design <span className="gradient-text">Gallery</span>
          </h2>
          <p className="gallery-subtitle">
            Explore recent AI-generated designs. Click any design to view it in full detail or view the generated code.
          </p>
        </motion.div>

        <div className="gallery-grid">
          {allDesigns.map((design, index) => {
            const code = getDesignCode(design);
            const isCodeOpen = expandedCode === design.id;

            return (
              <motion.div
                key={design.id}
                className={`gallery-card ${design.isNew ? 'is-new' : ''}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                onClick={() => openLightbox(design)}
              >
                <div
                  className="card-preview"
                  style={{ background: design.gradient }}
                >
                  {/* Show real AI-generated preview if available */}
                  {design.aiGeneratedCode?.fullHtml ? (
                    <div className="card-iframe-wrapper">
                      <DesignPreview
                        fullHtml={design.aiGeneratedCode.fullHtml}
                        className="card-iframe-thumbnail"
                      />
                    </div>
                  ) : (
                    /* Fallback: simulated UI elements for mock designs */
                    <div className="card-ui-elements">
                      {design.overlayElements?.includes('chart-bars') && (
                        <div className="ui-chart-bars">
                          <div className="bar bar-1" /><div className="bar bar-2" />
                          <div className="bar bar-3" /><div className="bar bar-4" />
                          <div className="bar bar-5" />
                        </div>
                      )}
                      {design.overlayElements?.includes('stat-cards') && (
                        <div className="ui-stat-cards">
                          <div className="mini-card" /><div className="mini-card" /><div className="mini-card" />
                        </div>
                      )}
                      {design.overlayElements?.includes('circle-timer') && (
                        <div className="ui-circle-timer" />
                      )}
                      {design.overlayElements?.includes('product-hero') && (
                        <div className="ui-product-hero">
                          <div className="product-blob" />
                          <div className="product-lines"><div /><div /><div /></div>
                        </div>
                      )}
                      {design.overlayElements?.includes('hero-text') && (
                        <div className="ui-hero-text">
                          <div className="text-line long" /><div className="text-line short" />
                          <div className="text-btn" />
                        </div>
                      )}
                      {design.overlayElements?.includes('waveform') && (
                        <div className="ui-waveform">
                          {Array.from({ length: 20 }).map((_, i) => (
                            <div key={i} className="wave-bar" style={{ height: `${Math.random() * 40 + 10}px` }} />
                          ))}
                        </div>
                      )}
                      {design.overlayElements?.includes('avatar') && (
                        <div className="ui-avatar" />
                      )}
                      {design.overlayElements?.includes('grid-photos') && (
                        <div className="ui-grid-photos">
                          <div /><div /><div /><div /><div /><div />
                        </div>
                      )}
                    </div>
                  )}

                  <div className="card-overlay">
                    <button className="overlay-btn" onClick={(e) => { e.stopPropagation(); openLightbox(design); }}>
                      <HiArrowsPointingOut />
                    </button>
                  </div>

                  {design.isNew && <div className="new-badge">NEW</div>}
                </div>

                <div className="card-info">
                  <p className="card-prompt">{design.prompt}</p>
                  <div className="card-meta">
                    <div className="card-actions">
                      <button
                        className={`action-btn like-btn ${likedDesigns.has(design.id) ? 'liked' : ''}`}
                        onClick={(e) => handleLike(design.id, e)}
                      >
                        <HiHeart />
                        <span>{design.likes + (likedDesigns.has(design.id) ? 1 : 0)}</span>
                      </button>
                      <button
                        className={`action-btn code-toggle-btn ${isCodeOpen ? 'active' : ''}`}
                        onClick={(e) => handleToggleCode(design.id, e)}
                        title="View Code"
                      >
                        <HiCodeBracket />
                        <span>Code</span>
                      </button>
                      <button className="action-btn" onClick={(e) => e.stopPropagation()}>
                        <HiShare />
                      </button>
                      <button className="action-btn" onClick={(e) => e.stopPropagation()}>
                        <HiArrowDownTray />
                      </button>
                    </div>
                    <span className="card-time">{design.timeAgo}</span>
                  </div>
                </div>

                {/* Inline Code Section */}
                <AnimatePresence>
                  {isCodeOpen && (
                    <motion.div
                      className="card-code-section"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <CodeViewer htmlCode={code.htmlCode} cssCode={code.cssCode} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxDesign && (
          <motion.div
            className="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxDesign(null)}
          >
            <motion.div
              className="lightbox-content"
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: 'spring', damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="lightbox-close" onClick={() => setLightboxDesign(null)}>
                <HiXMark />
              </button>

              {/* Lightbox Tabs */}
              <div className="lightbox-tabs">
                <button
                  className={`lightbox-tab ${lightboxTab === 'preview' ? 'active' : ''}`}
                  onClick={() => setLightboxTab('preview')}
                >
                  <HiArrowsPointingOut />
                  Preview
                </button>
                <button
                  className={`lightbox-tab ${lightboxTab === 'code' ? 'active' : ''}`}
                  onClick={() => setLightboxTab('code')}
                >
                  <HiCodeBracket />
                  Code
                </button>
              </div>

              {lightboxTab === 'preview' ? (
                <>
                  <div
                    className="lightbox-preview"
                    style={{ background: lightboxDesign.aiGeneratedCode?.fullHtml ? '#0a0a0a' : lightboxDesign.gradient }}
                  >
                    {lightboxDesign.aiGeneratedCode?.fullHtml ? (
                      <DesignPreview
                        fullHtml={lightboxDesign.aiGeneratedCode.fullHtml}
                        className="lightbox-iframe-preview"
                        allowScroll={true}
                      />
                    ) : (
                      <div className="lightbox-ui-label">AI Generated Design Preview</div>
                    )}
                  </div>

                </>
              ) : (
                <div className="lightbox-code-area">
                  <div className="lightbox-code-header">
                    <h3>Generated Code</h3>
                    <p className="lightbox-code-prompt">
                      Prompt: "{lightboxDesign.prompt}"
                    </p>
                  </div>
                  <CodeViewer
                    htmlCode={getDesignCode(lightboxDesign).htmlCode}
                    cssCode={getDesignCode(lightboxDesign).cssCode}
                  />
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default DesignGallery;
