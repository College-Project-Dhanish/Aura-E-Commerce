import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import styles from './Navbar.module.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className={styles.navbar}>
      <div className={`container ${styles.navContainer}`}>
        <Link to="/" className={styles.brand}>
          <span className={styles.logoText}>Aura</span>
        </Link>
        
        <nav className={styles.navLinks}>
          <Link to="/" className={styles.link}>Shop</Link>
          {user ? (
            <>
              <Link to="/cart" className={styles.link}>Cart</Link>
              <Link to="/orders" className={styles.link}>Orders</Link>
              <Link to="/profile" className={styles.link}>Profile</Link>
              <button onClick={handleLogout} className={styles.logoutBtn}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className={styles.link}>Login</Link>
              <Link to="/register" className={`${styles.link} ${styles.registerBtn}`}>Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
