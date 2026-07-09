import React from 'react';

export default function ErrorAlert({ message, className = '' }) {
  if (!message) return null;
  
  return (
    <div 
      className={className}
      style={{
        backgroundColor: '#fef2f2',
        color: '#991b1b',
        padding: '1rem',
        borderRadius: 'var(--radius-md)',
        border: '1px solid #f87171',
        marginBottom: '1rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
      }}
    >
      <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
      <span>{message}</span>
    </div>
  );
}
