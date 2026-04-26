import { HiSparkles } from 'react-icons/hi2';
import { RiGithubLine, RiTwitterXLine, RiLinkedinLine, RiHeart2Fill } from 'react-icons/ri';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-glow" />
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-brand">
            <a href="/" className="footer-logo">
              <div className="footer-logo-icon">
                <HiSparkles />
              </div>
              <span className="footer-logo-text">
                Design<span className="logo-accent">AI</span>
              </span>
            </a>
            <p className="footer-tagline">
              Transform your ideas into stunning designs with the power of AI.
            </p>
          </div>

          <div className="footer-links-group">
            <h4>Product</h4>
            <a href="#features">Features</a>
            <a href="#gallery">Gallery</a>
            <a href="#how-it-works">How It Works</a>
            <a href="#">Pricing</a>
          </div>

          <div className="footer-links-group">
            <h4>Resources</h4>
            <a href="#">Documentation</a>
            <a href="#">API Reference</a>
            <a href="#">Tutorials</a>
            <a href="#">Blog</a>
          </div>

          <div className="footer-links-group">
            <h4>Company</h4>
            <a href="#">About</a>
            <a href="#">Careers</a>
            <a href="#">Contact</a>
            <a href="#">Privacy</a>
          </div>
        </div>

        <div className="footer-divider" />

        <div className="footer-bottom">
          <p className="footer-copy">
            © 2026 DesignAI. Made with <RiHeart2Fill className="heart-icon" /> by Ronit Kumar
          </p>
          <div className="footer-socials">
            <a href="#" className="social-link" aria-label="GitHub">
              <RiGithubLine />
            </a>
            <a href="#" className="social-link" aria-label="Twitter">
              <RiTwitterXLine />
            </a>
            <a href="#" className="social-link" aria-label="LinkedIn">
              <RiLinkedinLine />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
