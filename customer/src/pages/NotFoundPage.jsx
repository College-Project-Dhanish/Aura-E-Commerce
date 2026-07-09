import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

export default function NotFoundPage() {
  return (
    <div className="container" style={{ textAlign: 'center', padding: '4rem 0' }}>
      <h1 style={{ fontSize: '4rem', marginBottom: '1rem' }}>404</h1>
      <p style={{ fontSize: '1.25rem', marginBottom: '2rem' }}>Oops! The page you are looking for does not exist.</p>
      <Link to="/">
        <Button size="lg">Go Home</Button>
      </Link>
    </div>
  );
}
