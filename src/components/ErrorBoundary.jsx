import { Component } from 'react';
import PropTypes from 'prop-types';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[Swastya+] Uncaught runtime error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--background)', padding: '2rem' }}>
          <div style={{ background: 'var(--error-container)', color: 'var(--on-error-container)', padding: '2rem', borderRadius: '1.5rem', maxWidth: 400, textAlign: 'center' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 48, color: 'var(--error)', marginBottom: 16 }}>warning</span>
            <h1 className="font-editorial" style={{ fontSize: '2rem', fontStyle: 'italic', marginBottom: 8 }}>Something went wrong</h1>
            <p style={{ fontSize: '0.9375rem', lineHeight: 1.5 }}>
              We encountered an unexpected error. Your clinical and private data remains secure.
            </p>
            <button 
              onClick={() => window.location.reload()} 
              style={{ marginTop: 24, padding: '0.75rem 1.5rem', background: 'var(--error)', color: '#fff', border: 'none', borderRadius: 999, fontWeight: 600, cursor: 'pointer' }}
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired
};
