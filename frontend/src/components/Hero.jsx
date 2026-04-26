import { motion } from 'framer-motion';
import { HiSparkles, HiArrowRight } from 'react-icons/hi2';
import { RiMagicLine } from 'react-icons/ri';
import './Hero.css';

const Hero = ({ onScrollToPrompt }) => {
  return (
    <section className="hero">
      {/* Ambient background effects */}
      <div className="hero-bg">
        <div className="hero-orb hero-orb-1" />
        <div className="hero-orb hero-orb-2" />
        <div className="hero-orb hero-orb-3" />
        <div className="hero-grid" />
      </div>

      <div className="hero-content">
        <motion.div
          className="hero-badge"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <RiMagicLine className="badge-icon" />
          <span>AI-Powered Design Generation</span>
          <div className="badge-dot" />
        </motion.div>

        <motion.h1
          className="hero-title"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
        >
          Transform Your Ideas Into
          <br />
          <span className="hero-title-accent">Stunning Designs</span>
        </motion.h1>

        <motion.p
          className="hero-description"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          Describe your vision in words and watch our AI bring it to life.
          Generate beautiful UI designs, illustrations, and creative assets
          in seconds — no design skills required.
        </motion.p>

        <motion.div
          className="hero-actions"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.65 }}
        >
          <button className="hero-btn-primary" onClick={onScrollToPrompt}>
            <HiSparkles />
            Start Creating
            <HiArrowRight className="btn-arrow" />
          </button>
          <button className="hero-btn-secondary">
            View Examples
          </button>
        </motion.div>

        <motion.div
          className="hero-stats"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <div className="hero-stat">
            <span className="stat-number">50K+</span>
            <span className="stat-label">Designs Generated</span>
          </div>
          <div className="stat-divider" />
          <div className="hero-stat">
            <span className="stat-number">10K+</span>
            <span className="stat-label">Active Users</span>
          </div>
          <div className="stat-divider" />
          <div className="hero-stat">
            <span className="stat-number">4.9★</span>
            <span className="stat-label">User Rating</span>
          </div>
        </motion.div>
      </div>

      {/* Floating showcase mockup */}
      <motion.div
        className="hero-showcase"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        <div className="showcase-frame">
          <div className="showcase-header">
            <div className="showcase-dots">
              <span /><span /><span />
            </div>
            <span className="showcase-title">DesignAI Studio</span>
          </div>
          <div className="showcase-body">
            <div className="showcase-prompt-preview">
              <div className="prompt-typing">
                <span className="typing-label">Prompt:</span>
                <span className="typing-text">"A modern dashboard with dark theme and analytics charts..."</span>
                <span className="typing-cursor" />
              </div>
            </div>
            <div className="showcase-result-grid">
              <div className="result-card result-card-1">
                <div className="result-shimmer" />
              </div>
              <div className="result-card result-card-2">
                <div className="result-shimmer" />
              </div>
              <div className="result-card result-card-3">
                <div className="result-shimmer" />
              </div>
              <div className="result-card result-card-4">
                <div className="result-shimmer" />
              </div>
            </div>
          </div>
        </div>
        <div className="showcase-glow" />
      </motion.div>
    </section>
  );
};

export default Hero;
