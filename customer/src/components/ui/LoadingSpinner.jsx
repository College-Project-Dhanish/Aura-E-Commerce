import React from 'react';

export default function LoadingSpinner({ size = '2rem', color = 'var(--accent-color)', fullScreen = false }) {
  const spinnerStyle = {
    width: size,
    height: size,
    border: `3px solid ${color}40`, // 40 is hex for 25% opacity
    borderBottomColor: color,
    borderRadius: '50%',
    display: 'inline-block',
    animation: 'rotation 1s linear infinite'
  };

  const wrapperStyle = fullScreen ? {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    width: '100%'
  } : {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem'
  };

  return (
    <div style={wrapperStyle}>
      <span style={spinnerStyle}></span>
      <style>
        {`
          @keyframes rotation {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}
