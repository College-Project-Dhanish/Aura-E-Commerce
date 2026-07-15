import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import SmoothScroll from './SmoothScroll';

export default function Layout({ children }) {
  return (
    <SmoothScroll>
      <div className="flex flex-col min-h-screen bg-background">
        <Navbar />
        <main className="flex-1 w-full pt-[80px]">
          {children}
        </main>
        <Footer />
      </div>
    </SmoothScroll>
  );
}
