import React from 'react';
import styles from './Button.module.css';

export default function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  isLoading,
  ...props 
}) {
  const btnClass = `${styles.button} ${styles[variant]} ${styles[size]} ${className}`;

  return (
    <button className={btnClass} disabled={isLoading || props.disabled} {...props}>
      {isLoading ? <span className={styles.loader}></span> : children}
    </button>
  );
}
