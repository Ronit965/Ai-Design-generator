import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiXMark, HiSparkles, HiEnvelope, HiLockClosed, HiUser, HiEye, HiEyeSlash } from 'react-icons/hi2';
import './AuthModal.css';

const AuthModal = ({ isOpen, onClose, onAuth }) => {
  const [tab, setTab] = useState('login'); // 'login' | 'signup'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
