import React from 'react';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.container}`}>
        <p className={styles.text}>&copy; {new Date().getFullYear()} Aura E-Commerce. All rights reserved.</p>
      </div>
    </footer>
  );
}
