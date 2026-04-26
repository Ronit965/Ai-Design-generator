import { useState } from 'react';
import { motion } from 'framer-motion';
import { HiSparkles, HiArrowRightOnRectangle, HiUserCircle } from 'react-icons/hi2';
import { RiMenuLine, RiCloseLine } from 'react-icons/ri';
import './Navbar.css';

const Navbar = ({ user, onLoginClick, onLogout }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <motion.nav
      className="navbar"
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="navbar-inner">
        <a href="/" className="navbar-logo">
          <div className="logo-icon">
            <HiSparkles />
          </div>
          <span className="logo-text">
            Design<span className="logo-accent">AI</span>
          </span>
        </a>

        <div className={`navbar-links ${mobileOpen ? 'open' : ''}`}>
          <a href="#features" className="nav-link" onClick={() => setMobileOpen(false)}>Features</a>
          <a href="#gallery" className="nav-link" onClick={() => setMobileOpen(false)}>Gallery</a>
          <a href="#how-it-works" className="nav-link" onClick={() => setMobileOpen(false)}>How It Works</a>
        </div>

        <div className="navbar-actions">
          {user ? (
            <div className="nav-user-area">
              <div className="nav-user-badge">
                <HiUserCircle className="user-avatar-icon" />
                <span className="nav-user-name">{user.name}</span>
              </div>
              <button className="nav-logout-btn" onClick={onLogout} title="Sign Out">
                <HiArrowRightOnRectangle />
              </button>
            </div>
          ) : (
            <button className="nav-cta" onClick={onLoginClick}>
              <HiSparkles className="cta-icon" />
              Get Started
            </button>
          )}
          <button
            className="mobile-toggle"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <RiCloseLine /> : <RiMenuLine />}
          </button>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
