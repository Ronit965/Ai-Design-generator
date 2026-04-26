import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiSparkles, HiArrowPath, HiPhoto, HiClipboard, HiCodeBracket, HiExclamationTriangle } from 'react-icons/hi2';
import { RiMagicLine, RiLayoutMasonryLine, RiPaletteLine } from 'react-icons/ri';
import CodeViewer from './CodeViewer';
import './PromptInput.css';

const samplePrompts = [
  "A futuristic dashboard with neon gradients and glassmorphism",
  "Minimalist mobile app for a meditation platform, dark mode",
  "E-commerce product page for sneakers with bold typography",
  "Landing page for a SaaS analytics tool, purple and dark theme",
  "Social media app profile page with stories and grid layout",
  "Music player interface with waveform visualization",
];

const styleOptions = [
  { id: 'modern', label: 'Modern', icon: <RiLayoutMasonryLine /> },
  { id: 'minimal', label: 'Minimal', icon: <RiPaletteLine /> },
  { id: 'bold', label: 'Bold', icon: <HiPhoto /> },
  { id: 'glassmorphism', label: 'Glass', icon: <RiMagicLine /> },
];

const PromptInput = ({ onGenerate, isGenerating, error, onClearError }) => {
  const [prompt, setPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('modern');
  const [charCount, setCharCount] = useState(0);
  const [showCode, setShowCode] = useState(false);
  const [generatedCode, setGeneratedCode] = useState(null);
  const textareaRef = useRef(null);
  const maxChars = 5000;

  const handlePromptChange = (e) => {
    const value = e.target.value;
    if (value.length <= maxChars) {
      setPrompt(value);
      setCharCount(value.length);
      // Clear previous error when user types
      if (error && onClearError) {
        onClearError();
      }
    }
  };

  const handleSubmit = async () => {
    if (prompt.trim() && !isGenerating) {
      try {
        // Call the real backend API via the parent component
        const result = await onGenerate(prompt, selectedStyle);

        // If we got real AI-generated code back, show it
        if (result && result.htmlCode) {
          setGeneratedCode({
            htmlCode: result.htmlCode,
            cssCode: result.cssCode,
          });
          setShowCode(true);
        }
      } catch (err) {
        // Error is handled by the parent (App.jsx) and passed via error prop
        console.error('Generation failed:', err);
      }
    }
  };

  const handleSampleClick = (sample) => {
    setPrompt(sample);
    setCharCount(sample.length);
    textareaRef.current?.focus();
    if (error && onClearError) {
      onClearError();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSubmit();
    }
  };

  const handleCodeToggle = () => {
    setShowCode(!showCode);
  };

  return (
    <section className="prompt-section" id="prompt">
      <div className="prompt-container">
        <motion.div
          className="prompt-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="prompt-title">
            Describe Your <span className="gradient-text">Design</span>
          </h2>
          <p className="prompt-subtitle">
            Write a detailed prompt and our AI will generate a unique design for you.
            Be specific about colors, layout, and style.
          </p>
        </motion.div>

        <motion.div
          className="prompt-card"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          {/* Style selector */}
          <div className="style-selector">
            <span className="style-label">Design Style:</span>
            <div className="style-options">
              {styleOptions.map((style) => (
                <button
                  key={style.id}
                  className={`style-option ${selectedStyle === style.id ? 'active' : ''}`}
                  onClick={() => setSelectedStyle(style.id)}
                >
                  {style.icon}
                  {style.label}
                </button>
              ))}
              {/* Code toggle button */}
              {generatedCode && (
                <button
                  className={`style-option code-option ${showCode ? 'active' : ''}`}
                  onClick={handleCodeToggle}
                  title="View generated HTML/CSS code"
                >
                  <HiCodeBracket />
                  Code
                </button>
              )}
            </div>
          </div>

          {/* Textarea */}
          <div className="prompt-input-wrapper">
            <textarea
              ref={textareaRef}
              id="design-prompt-input"
              className="prompt-textarea"
              placeholder="Describe the design you want to create..."
              value={prompt}
              onChange={handlePromptChange}
              onKeyDown={handleKeyDown}
              rows={4}
            />
            <div className="prompt-input-footer">
              <span className="char-count">
                <span className={charCount > maxChars * 0.9 ? 'char-warn' : ''}>
                  {charCount}
                </span>
                /{maxChars}
              </span>
              <span className="shortcut-hint">⌘ + Enter to generate</span>
            </div>
          </div>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                className="prompt-error"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <HiExclamationTriangle />
                <span>{error}</span>
                <button className="error-dismiss" onClick={onClearError}>✕</button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Generate button */}
          <button
            className={`generate-btn ${isGenerating ? 'generating' : ''}`}
            onClick={handleSubmit}
            disabled={!prompt.trim() || isGenerating}
            id="generate-design-btn"
          >
            <AnimatePresence mode="wait">
              {isGenerating ? (
                <motion.div
                  key="loading"
                  className="btn-loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <HiArrowPath className="loading-spinner" />
                  <span>AI is generating your design...</span>
                </motion.div>
              ) : (
                <motion.div
                  key="default"
                  className="btn-default"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <HiSparkles />
                  <span>Generate Design</span>
                </motion.div>
              )}
            </AnimatePresence>
          </button>

          {/* Code Viewer Section — shows AI-generated code */}
          <AnimatePresence>
            {showCode && generatedCode && (
              <motion.div
                className="prompt-code-section"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="prompt-code-label">
                  <HiCodeBracket />
                  <span>AI-Generated Code for: <em>"{prompt.length > 60 ? prompt.slice(0, 60) + '...' : prompt}"</em></span>
                </div>
                <CodeViewer htmlCode={generatedCode.htmlCode} cssCode={generatedCode.cssCode} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Sample prompts */}
          <div className="sample-prompts">
            <span className="sample-label">
              <HiClipboard />
              Try a sample:
            </span>
            <div className="sample-list">
              {samplePrompts.map((sample, index) => (
                <button
                  key={index}
                  className="sample-chip"
                  onClick={() => handleSampleClick(sample)}
                >
                  {sample.length > 50 ? sample.slice(0, 50) + '...' : sample}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PromptInput;
