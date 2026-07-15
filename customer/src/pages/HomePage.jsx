import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

const FLOATING_SHIRTS = [
  "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1780&auto=format&fit=crop", 
  "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=1887&auto=format&fit=crop", 
  "https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=1964&auto=format&fit=crop", 
  "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?q=80&w=2069&auto=format&fit=crop", 
  "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=2070&auto=format&fit=crop", 
  "https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=1887&auto=format&fit=crop", 
  "https://images.unsplash.com/photo-1562157873-818bc0726f68?q=80&w=1854&auto=format&fit=crop", 
  "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=1915&auto=format&fit=crop", 
  "https://images.unsplash.com/photo-1527719327859-c6ce80353573?q=80&w=1964&auto=format&fit=crop", 
  "https://images.unsplash.com/photo-1504198458649-3128b932f49e?q=80&w=1887&auto=format&fit=crop", 
  "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=2070&auto=format&fit=crop", 
  "https://images.unsplash.com/photo-1528228377194-2faca82540e4?q=80&w=1887&auto=format&fit=crop", 
  "https://images.unsplash.com/photo-1618354691792-d1d42acfd860?q=80&w=1915&auto=format&fit=crop", 
  "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=2070&auto=format&fit=crop", 
  "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1887&auto=format&fit=crop", 
  "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=1936&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1564859228273-274232fdb516?q=80&w=1887&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1574180566232-aaad1b5b8450?q=80&w=1887&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1622470953794-aa9c70b0fb9d?q=80&w=1887&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1554568218-0f1715e72254?q=80&w=1887&auto=format&fit=crop"
].map((src, i) => ({
  id: i + 1,
  src,
  top: `${Math.random() * 80 + 10}%`,
  left: `${Math.random() * 80 + 10}%`,
  scale: Math.random() * 0.5 + 0.3,
  depth: Math.random() * 0.8 + 0.2, 
  rotate: (Math.random() - 0.5) * 40
}));

const FEATURED_PRODUCTS = [
  { id: 1, name: "The Essential Heavyweight", price: "$45", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1780&auto=format&fit=crop" },
  { id: 2, name: "Pima Cotton Crew", price: "$55", image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=1887&auto=format&fit=crop" },
  { id: 3, name: "Vintage Wash Tee", price: "$50", image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=2070&auto=format&fit=crop" },
  { id: 4, name: "Signature Drop Shoulder", price: "$65", image: "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?q=80&w=2069&auto=format&fit=crop" },
  { id: 5, name: "Organic Blank", price: "$40", image: "https://images.unsplash.com/photo-1562157873-818bc0726f68?q=80&w=1854&auto=format&fit=crop" }
];

export default function HomePage() {
  const masterRef = useRef(null);
  const cursorRef = useRef(null);
  const cursorLightRef = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: masterRef.current,
        start: "top top",
        end: "+=1200%", // Very long scroll for the full experience
        scrub: 1,
        pin: true,
      }
    });

    // SCENE 1: HERO DIVE
    // 0 - 1.5: Dive through the shirts
    tl.to('.floating-shirt', {
      scale: (i, target) => parseFloat(target.dataset.scale) * 15,
      opacity: 0,
      stagger: 0.02,
      duration: 2,
      ease: "power2.in"
    }, 0);
    
    tl.to('.hero-word span', {
      y: "-120%",
      opacity: 0,
      stagger: 0.1,
      duration: 1,
      ease: "power2.in"
    }, 0);

    // SCENE 2: GLASSMORPHISM & PRODUCTS
    // 2.0 - 4.0: Glass window expands, products rise
    tl.to('.scene-products', { opacity: 1, duration: 0.1 }, 1.8);
    tl.to('.glass-morphism-bg', {
      width: "100vw",
      height: "100vh",
      borderRadius: "0%",
      duration: 2,
      ease: "power3.inOut"
    }, 2);
    tl.from('.product-card', {
      y: "100vh",
      rotation: (i) => (i % 2 === 0 ? 10 : -10),
      opacity: 0,
      stagger: 0.1,
      duration: 2,
      ease: "power3.out"
    }, 2.5);

    // SCENE 3: HORIZONTAL SCRUB
    // 4.5 - 7.5: Scroll horizontally
    tl.to('.horizontal-track', {
      x: () => {
        const track = document.querySelector('.horizontal-track');
        return -(track.scrollWidth - window.innerWidth + 100);
      },
      ease: "none",
      duration: 3
    }, 4.5);

    // SCENE 4: FABRIC ZOOM & PHILOSOPHY
    // 8.0 - 10.0: Transition to fabric texture and text
    tl.to('.scene-philosophy', { opacity: 1, duration: 0.1 }, 7.8);
    tl.to('.scene-products', { opacity: 0, duration: 1 }, 8);
    tl.to('.fabric-overlay', {
      opacity: 0.5,
      scale: 1.5,
      duration: 2,
      ease: "none"
    }, 8);
    
    tl.to('.philosophy-word', {
      opacity: 1,
      y: 0,
      rotateX: 0,
      stagger: 0.1,
      duration: 1.5,
      ease: "back.out(1.7)"
    }, 8.5);

    // SCENE 5: NEWSLETTER MORPH
    // 10.5 - 12.0: Morph to newsletter
    tl.to('.philosophy-word', {
      opacity: 0,
      y: -50,
      stagger: 0.05,
      duration: 1,
      ease: "power2.in"
    }, 10.5);
    
    tl.to('.scene-newsletter', { opacity: 1, duration: 0.1 }, 11);
    tl.to('.newsletter-orb', {
      scale: 250,
      duration: 1.5,
      ease: "power3.inOut"
    }, 11.2);
    
    tl.to('.newsletter-content', {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 1,
      ease: "power2.out"
    }, 11.5);


    // Ambient infinite animations (independent of scroll)
    gsap.to('.floating-shirt', {
      y: "+=30",
      x: "+=15",
      rotation: "+=5",
      yoyo: true,
      repeat: -1,
      duration: 4,
      ease: "sine.inOut",
      stagger: {
        each: 0.1,
        from: "random"
      }
    });

  }, { scope: masterRef });

  // Custom Cursor logic
  useEffect(() => {
    const moveCursor = (e) => {
      gsap.to(cursorRef.current, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.15,
        ease: "power2.out"
      });
      gsap.to(cursorLightRef.current, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.8,
        ease: "power3.out"
      });
    };
    window.addEventListener("mousemove", moveCursor);
    return () => window.removeEventListener("mousemove", moveCursor);
  }, []);

  return (
    <div className="bg-black text-white cursor-none">
      <div ref={masterRef} className="master-container w-full h-screen relative overflow-hidden hidden-scrollbar">
        
        {/* Custom Cursors */}
        <div ref={cursorRef} className="fixed top-0 left-0 w-4 h-4 bg-white rounded-full pointer-events-none z-[100] mix-blend-difference -translate-x-1/2 -translate-y-1/2 hidden md:block"></div>
        <div ref={cursorLightRef} className="fixed top-0 left-0 w-[40vw] h-[40vw] bg-accent/10 rounded-full blur-[100px] pointer-events-none z-0 -translate-x-1/2 -translate-y-1/2 hidden md:block"></div>

        {/* Ambient Noise Background */}
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none mix-blend-overlay mesh-bg"></div>

        {/* --- SCENE 1: HERO DIVE --- */}
        <div className="scene-hero absolute inset-0 w-full h-full z-10 flex items-center justify-center">
          <div className="absolute inset-0 perspective-1000">
            {FLOATING_SHIRTS.map((shirt) => (
              <div 
                key={shirt.id} 
                className="floating-shirt absolute will-change-transform shadow-2xl rounded-2xl overflow-hidden"
                data-scale={shirt.scale}
                style={{
                  top: shirt.top, 
                  left: shirt.left,
                  transform: `scale(${shirt.scale}) rotate(${shirt.rotate}deg)`,
                  zIndex: Math.floor(shirt.depth * 10),
                  filter: `blur(${Math.max(0, (0.5 - shirt.depth) * 8)}px)`
                }}
              >
                <img src={shirt.src} alt="" className="w-48 md:w-64 h-auto object-cover opacity-80" />
              </div>
            ))}
          </div>
          <div className="hero-text-content absolute z-30 flex flex-col items-center pointer-events-none text-center">
            <h1 className="text-[15vw] md:text-[12vw] font-bold tracking-tighter leading-[0.85] mix-blend-difference text-white">
              <div className="hero-word overflow-hidden"><span className="block">DEFINE</span></div>
              <div className="hero-word overflow-hidden"><span className="block">YOUR</span></div>
              <div className="hero-word overflow-hidden"><span className="block text-transparent bg-clip-text bg-gradient-to-r from-accent via-yellow-200 to-accent">AURA.</span></div>
            </h1>
          </div>
        </div>

        {/* --- SCENE 2 & 3: GLASSMORPHISM & PRODUCTS --- */}
        <div className="scene-products absolute inset-0 w-full h-full z-20 pointer-events-none flex items-center justify-center opacity-0">
          <div className="glass-morphism-bg absolute w-[5vw] h-[5vw] rounded-full glass-morph flex items-center justify-center overflow-hidden">
             
             {/* Horizontal Track inside the glass window */}
             <div className="absolute inset-0 flex items-center w-full h-full">
               <div className="horizontal-track flex gap-8 md:gap-16 px-[50vw] h-[60vh] items-center w-max">
                 {FEATURED_PRODUCTS.map(p => (
                    <Link to="/products" key={p.id} className="product-card w-[70vw] md:w-[25vw] h-[50vh] md:h-[35vw] rounded-3xl overflow-hidden relative pointer-events-auto shrink-0 group shadow-2xl">
                       <img src={p.image} alt={p.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"/>
                       <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
                          <h3 className="text-3xl font-bold text-white mb-2">{p.name}</h3>
                          <p className="text-accent text-xl mb-6">{p.price}</p>
                          <span className="px-8 py-3 bg-white text-black rounded-full w-max font-semibold text-sm tracking-wider uppercase hover:bg-accent hover:text-white transition-colors flex items-center gap-2">
                            Explore <ArrowUpRight className="w-4 h-4"/>
                          </span>
                       </div>
                    </Link>
                 ))}
                 <div className="shrink-0 w-[50vw] flex items-center justify-center flex-col pointer-events-auto">
                    <h3 className="text-4xl md:text-7xl font-bold tracking-tighter text-white/50 mb-8">VIEW MORE</h3>
                    <Link to="/products" className="w-24 h-24 md:w-32 md:h-32 rounded-full border border-white/30 flex items-center justify-center hover:bg-white hover:text-black transition-all duration-500 group">
                      <ArrowRight className="w-8 h-8 md:w-12 md:h-12 group-hover:scale-125 transition-transform" />
                    </Link>
                 </div>
               </div>
             </div>
             
          </div>
        </div>

        {/* --- SCENE 4: FABRIC & PHILOSOPHY --- */}
        <div className="scene-philosophy absolute inset-0 w-full h-full z-30 flex items-center justify-center pointer-events-none opacity-0">
          <div className="fabric-overlay absolute inset-0 bg-[url('https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=1972&auto=format&fit=crop')] bg-cover bg-center opacity-0 mix-blend-luminosity"></div>
          
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black/90 pointer-events-none"></div>

          <h2 className="philosophy-text text-4xl md:text-7xl font-serif font-light leading-[1.1] tracking-tight max-w-6xl text-center px-6 mix-blend-screen text-white relative z-10 flex flex-wrap justify-center gap-x-4 gap-y-2">
             {"True luxury is not just what you wear, it is how you feel when you wear it.".split(" ").map((w,i) => (
                <span key={i} className="philosophy-word inline-block opacity-0 translate-y-20 origin-bottom" style={{ transform: "rotateX(-45deg)" }}>{w}</span>
             ))}
          </h2>
        </div>

        {/* --- SCENE 5: NEWSLETTER / OUTRO --- */}
        <div className="scene-newsletter absolute inset-0 w-full h-full z-40 flex items-center justify-center pointer-events-none opacity-0">
          <div className="newsletter-orb w-8 h-8 bg-accent rounded-full absolute mix-blend-screen"></div>
          
          <div className="newsletter-content glass-panel-dark p-10 md:p-20 rounded-3xl relative max-w-4xl w-[90%] text-center border border-white/20 opacity-0 pointer-events-auto scale-90 backdrop-blur-3xl shadow-2xl">
            <h2 className="text-4xl md:text-7xl font-bold tracking-tighter text-white mb-6">
              JOIN THE <span className="text-accent italic">CLUB.</span>
            </h2>
            <p className="text-gray-300 mb-12 max-w-2xl mx-auto text-lg md:text-xl font-light">
              Subscribe to receive exclusive access to limited drops, private sales, and the latest from our design studio.
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="flex-1 bg-white/5 border border-white/20 rounded-full px-8 py-4 md:py-5 text-white placeholder:text-gray-400 focus:outline-none focus:border-accent focus:bg-white/10 transition-all text-lg"
              />
              <button className="bg-white text-black px-10 py-4 md:py-5 rounded-full font-bold hover:bg-accent hover:text-white transition-colors duration-300 text-lg uppercase tracking-wider">
                Subscribe
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
