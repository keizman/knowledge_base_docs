import React, { useState, useEffect } from 'react';
import { useLocation } from '@docusaurus/router';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './styles.module.css';

export default function ProtectedContent({ children }) {
  const location = useLocation();
  const {siteConfig} = useDocusaurusContext();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  
  // Paths that require protection
  const protectedPaths = siteConfig.customFields?.protectedPaths || ['/docs/Unpublic'];
  
  // Check if current path is protected
  const isProtectedPath = () => {
    return protectedPaths.some(path => location.pathname.startsWith(path));
  };

  // Enhanced authentication check with expiration
  const checkAuth = () => {
    try {
      const authData = JSON.parse(localStorage.getItem('docusaurus-protected-content-auth') || '{}');
      const now = new Date().getTime();
      
      // Check if auth exists and hasn't expired (24 hours expiration example)
      if (authData.authenticated && authData.timestamp && 
          now - authData.timestamp < 60 * 60 * 1000 * 24) {
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  };

  // Enhanced auth storage
  const setAuth = () => {
    const authData = {
      authenticated: true,
      timestamp: new Date().getTime(),
    };
    localStorage.setItem('docusaurus-protected-content-auth', JSON.stringify(authData));
  };

  // Check authentication on component mount and path change
  useEffect(() => {
    setIsAuthenticated(checkAuth());
  }, [location.pathname]);

  // Handle password submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const correctPassword = siteConfig.customFields?.protectedContentPassword || 'your-fallback-code';
    
    if (password === correctPassword) {
      setAuth();
      setIsAuthenticated(true);
      setError(null);
    } else {
      setError('Incorrect access code. Please try again.');
    }
  };

  // If not a protected path or already authenticated, show content
  if (!isProtectedPath() || isAuthenticated) {
    return <>{children}</>;
  }

  // Otherwise show password prompt
  return (
    <div className={styles.protectedContentWrapper}>
      <div className={styles.protectedContentPrompt}>
        <h2>Protected Content</h2>
        <p>This content requires an access code.</p>
        
        {error && <div className={styles.error}>{error}</div>}
        
        <form onSubmit={handleSubmit} className={styles.authForm}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter access code"
            className={styles.passwordInput}
          />
          <button type="submit" className={styles.submitButton}>
            Access Content
          </button>
        </form>
      </div>
    </div>
  );
}