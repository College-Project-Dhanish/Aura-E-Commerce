import React from 'react';
import styles from './Card.module.css';

export default function Card({ children, className = '', noPadding = false }) {
  return (
    <div className={`${styles.card} ${noPadding ? styles.noPadding : ''} ${className}`}>
      {children}
    </div>
  );
}
