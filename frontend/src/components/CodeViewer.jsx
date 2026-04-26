import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiClipboard, HiCheck, HiCodeBracket } from 'react-icons/hi2';
import './CodeViewer.css';

const CodeViewer = ({ htmlCode, cssCode }) => {
  const [activeTab, setActiveTab] = useState('html');
  const [copied, setCopied] = useState(false);

  const code = activeTab === 'html' ? htmlCode : cssCode;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = code;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="code-viewer">
      <div className="code-viewer-header">
        <div className="code-tabs">
          <button
            className={`code-tab ${activeTab === 'html' ? 'active' : ''}`}
            onClick={() => setActiveTab('html')}
          >
            <HiCodeBracket />
            HTML
          </button>
          <button
            className={`code-tab ${activeTab === 'css' ? 'active' : ''}`}
            onClick={() => setActiveTab('css')}
          >
            <HiCodeBracket />
            CSS
          </button>
        </div>
        <button
          className={`copy-btn ${copied ? 'copied' : ''}`}
          onClick={handleCopy}
        >
          <AnimatePresence mode="wait">
            {copied ? (
              <motion.span
                key="check"
                className="copy-inner"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <HiCheck />
                Copied!
              </motion.span>
            ) : (
              <motion.span
                key="copy"
                className="copy-inner"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <HiClipboard />
                Copy Code
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      <div className="code-viewer-body">
        <div className="line-numbers">
          {code.split('\n').map((_, i) => (
            <span key={i}>{i + 1}</span>
          ))}
        </div>
        <pre className="code-content">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
};

export default CodeViewer;
