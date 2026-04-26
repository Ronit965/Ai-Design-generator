import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiXMark, HiSparkles, HiEnvelope, HiLockClosed, HiUser, HiEye, HiEyeSlash } from 'react-icons/hi2';
import './AuthModal.css';

// Decode the JWT credential from Google (base64url-encoded payload)
function decodeGoogleJwt(token) {
  try {
    const payload = token.split('.')[1];
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

const AuthModal = ({ isOpen, onClose, onAuth }) => {
  const [tab, setTab] = useState('login'); // 'login' | 'signup'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const googleBtnRef = useRef(null);

  // Google Sign-In handler
  const handleGoogleCredential = useCallback((response) => {
    const profile = decodeGoogleJwt(response.credential);
    if (!profile) {
      setError('Failed to verify Google account. Please try again.');
      return;
    }

    // Upsert user in localStorage
    const users = JSON.parse(localStorage.getItem('aimodel_users') || '[]');
    let existingUser = users.find((u) => u.email === profile.email);

    if (!existingUser) {
      existingUser = {
        id: Date.now(),
        name: profile.name,
        email: profile.email,
        picture: profile.picture,
        provider: 'google',
        createdAt: new Date().toISOString(),
      };
      users.push(existingUser);
      localStorage.setItem('aimodel_users', JSON.stringify(users));
    }

    const session = {
      id: existingUser.id,
      name: existingUser.name,
      email: existingUser.email,
      picture: existingUser.picture || profile.picture,
    };
    localStorage.setItem('aimodel_session', JSON.stringify(session));
    onAuth(session);
    onClose();
    resetForm();
  }, [onAuth, onClose]);

  // Initialize Google button when modal opens
  useEffect(() => {
    if (!isOpen || !GOOGLE_CLIENT_ID) return;

    const initGoogle = () => {
      if (window.google?.accounts?.id) {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleGoogleCredential,
        });

        if (googleBtnRef.current) {
          // Clear previous render
          googleBtnRef.current.innerHTML = '';
          window.google.accounts.id.renderButton(googleBtnRef.current, {
            theme: 'filled_black',
            size: 'large',
            width: '100%',
            shape: 'pill',
            text: 'continue_with',
          });
        }
      }
    };

    // GIS script might still be loading
    if (window.google?.accounts?.id) {
      initGoogle();
    } else {
      const timer = setInterval(() => {
        if (window.google?.accounts?.id) {
          clearInterval(timer);
          initGoogle();
        }
      }, 200);
      return () => clearInterval(timer);
    }
  }, [isOpen, tab, handleGoogleCredential]);

  const resetForm = () => {
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setError('');
    setShowPassword(false);
  };

  const switchTab = (newTab) => {
    setTab(newTab);
    resetForm();
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSignup = () => {
    if (!name.trim()) return setError('Please enter your name');
    if (!email.trim()) return setError('Please enter your email');
    if (!validateEmail(email)) return setError('Please enter a valid email');
    if (password.length < 6) return setError('Password must be at least 6 characters');
    if (password !== confirmPassword) return setError('Passwords do not match');

    setIsLoading(true);

    // Check if user already exists
    const users = JSON.parse(localStorage.getItem('aimodel_users') || '[]');
    if (users.find((u) => u.email === email.toLowerCase())) {
      setIsLoading(false);
      return setError('An account with this email already exists');
    }

    // Create user
    const newUser = {
      id: Date.now(),
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: password, // In production, hash this
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    localStorage.setItem('aimodel_users', JSON.stringify(users));

    // Auto-login
    const session = { id: newUser.id, name: newUser.name, email: newUser.email };
    localStorage.setItem('aimodel_session', JSON.stringify(session));

    setTimeout(() => {
      setIsLoading(false);
      onAuth(session);
      onClose();
      resetForm();
    }, 600);
  };

  const handleLogin = () => {
    if (!email.trim()) return setError('Please enter your email');
    if (!password.trim()) return setError('Please enter your password');

    setIsLoading(true);

    const users = JSON.parse(localStorage.getItem('aimodel_users') || '[]');
    const user = users.find(
      (u) => u.email === email.toLowerCase().trim() && u.password === password
    );

    if (!user) {
      setIsLoading(false);
      return setError('Invalid email or password');
    }

    const session = { id: user.id, name: user.name, email: user.email };
    localStorage.setItem('aimodel_session', JSON.stringify(session));

    setTimeout(() => {
      setIsLoading(false);
      onAuth(session);
      onClose();
      resetForm();
    }, 600);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (tab === 'signup') {
      handleSignup();
    } else {
      handleLogin();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="auth-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="auth-modal"
            initial={{ scale: 0.85, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0, y: 30 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="auth-close" onClick={onClose}>
              <HiXMark />
            </button>

            {/* Header */}
            <div className="auth-header">
              <div className="auth-logo">
                <HiSparkles />
              </div>
              <h2 className="auth-title">
                {tab === 'login' ? 'Welcome Back' : 'Create Account'}
              </h2>
              <p className="auth-subtitle">
                {tab === 'login'
                  ? 'Sign in to continue generating amazing designs'
                  : 'Sign up to start creating AI-powered designs'}
              </p>
            </div>

            {/* Tabs */}
            <div className="auth-tabs">
              <button
                className={`auth-tab ${tab === 'login' ? 'active' : ''}`}
                onClick={() => switchTab('login')}
              >
                Sign In
              </button>
              <button
                className={`auth-tab ${tab === 'signup' ? 'active' : ''}`}
                onClick={() => switchTab('signup')}
              >
                Sign Up
              </button>
            </div>

            {/* Form */}
            <form className="auth-form" onSubmit={handleSubmit}>
              <AnimatePresence mode="wait">
                {tab === 'signup' && (
                  <motion.div
                    key="name-field"
                    className="auth-field"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="field-icon">
                      <HiUser />
                    </div>
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="auth-input"
                      autoComplete="name"
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="auth-field">
                <div className="field-icon">
                  <HiEnvelope />
                </div>
                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="auth-input"
                  autoComplete="email"
                />
              </div>

              <div className="auth-field">
                <div className="field-icon">
                  <HiLockClosed />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="auth-input"
                  autoComplete={tab === 'login' ? 'current-password' : 'new-password'}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <HiEyeSlash /> : <HiEye />}
                </button>
              </div>

              <AnimatePresence mode="wait">
                {tab === 'signup' && (
                  <motion.div
                    key="confirm-field"
                    className="auth-field"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="field-icon">
                      <HiLockClosed />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Confirm Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="auth-input"
                      autoComplete="new-password"
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Error */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    className="auth-error"
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit */}
              <button
                type="submit"
                className={`auth-submit ${isLoading ? 'loading' : ''}`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="auth-spinner" />
                ) : (
                  <>
                    <HiSparkles />
                    {tab === 'login' ? 'Sign In' : 'Create Account'}
                  </>
                )}
              </button>
            </form>

            {/* Google Sign-In */}
            {GOOGLE_CLIENT_ID && (
              <div className="auth-divider-section">
                <div className="auth-divider">
                  <span>or</span>
                </div>
                <div className="google-btn-wrapper" ref={googleBtnRef} />
              </div>
            )}

            {/* Manual Google-style fallback when no Client ID is set */}
            {!GOOGLE_CLIENT_ID && (
              <div className="auth-divider-section">
                <div className="auth-divider">
                  <span>or</span>
                </div>
                <button
                  type="button"
                  className="google-fallback-btn"
                  onClick={() => setError('Google Sign-In requires a Client ID. Set VITE_GOOGLE_CLIENT_ID in your .env file.')}
                >
                  <svg className="google-icon" viewBox="0 0 24 24" width="18" height="18">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Continue with Google
                </button>
              </div>
            )}

            {/* Footer */}
            <p className="auth-footer-text">
              {tab === 'login' ? (
                <>
                  Don't have an account?{' '}
                  <button className="auth-switch" onClick={() => switchTab('signup')}>
                    Sign Up
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <button className="auth-switch" onClick={() => switchTab('login')}>
                    Sign In
                  </button>
                </>
              )}
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;
