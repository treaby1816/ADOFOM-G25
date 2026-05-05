'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight, LogIn, UserPlus } from 'lucide-react';

const slides = [
  {
    image: '/slide1.jpg',
    tagline: 'Driving Excellence in Administration',
    subtext: 'ADOFOM is the Ondo State Administrative Officers Forum for Administrative Officers.'
  },
  {
    image: '/slide2.jpg',
    tagline: 'Empowering Professional Leadership',
    subtext: 'Fostering integrity, innovation, and service across the Ondo State Civil Service.'
  },
  {
    image: '/slide3.jpg',
    tagline: 'United for a Stronger Future',
    subtext: 'Building a legacy of administrative brilliance through collaboration and unity.'
  }
];

export default function WelcomeScreen() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#020617] overflow-hidden">
      {/* Left: Carousel Half */}
      <section 
        className="relative w-full md:w-1/2 h-[45vh] md:h-screen overflow-hidden"
        aria-label="Professional showcase carousel"
      >
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
            } transition-transform duration-[6000ms]`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-transparent z-10" />
            <Image
              src={slide.image}
              alt={slide.tagline}
              fill
              priority={index === 0}
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        ))}
        
        {/* Carousel Indicators */}
        <div className="absolute bottom-10 left-10 z-20 flex gap-2.5">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-1.5 transition-all duration-500 rounded-full cursor-pointer ${
                i === currentSlide ? 'w-10 bg-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.5)]' : 'w-3 bg-white/20 hover:bg-white/40'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Right: Content Half */}
      <main className="w-full md:w-1/2 h-[55vh] md:h-screen flex flex-col justify-center items-center px-6 md:px-16 lg:px-24 bg-hero-gradient relative overflow-hidden">
        {/* Background ambient light effects */}
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] bg-yellow-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-xl w-full space-y-10 z-10 text-center md:text-left">
          {/* Logo Section */}
          <div className="flex justify-center md:justify-start items-center gap-8 md:gap-12">
            {/* Logo 1: ADOFOM */}
            <div className="relative group">
              <div className="absolute -inset-2 bg-gradient-to-r from-yellow-400 via-yellow-600 to-emerald-500 rounded-full blur opacity-40 group-hover:opacity-80 transition duration-1000 animate-pulse" />
              <div className="relative w-32 h-32 md:w-44 md:h-44 bg-white rounded-full p-3 shadow-2xl overflow-hidden border-4 border-white/20 animate-float">
                <Image 
                  src="/logo2.jpg" 
                  alt="ADOFOM Official Logo" 
                  fill
                  className="object-contain p-3 transform group-hover:scale-110 transition-transform duration-700"
                />
              </div>
            </div>

            {/* Logo 2: Ondo State Seal */}
            <div className="relative group">
              <div className="absolute -inset-2 bg-gradient-to-r from-emerald-500 via-green-600 to-yellow-500 rounded-full blur opacity-40 group-hover:opacity-80 transition duration-1000 animate-pulse delay-700" />
              <div className="relative w-32 h-32 md:w-44 md:h-44 bg-white rounded-full p-1 shadow-2xl overflow-hidden border-4 border-white/20 animate-float" style={{ animationDelay: "1s" }}>
                <Image 
                  src="/ondo-seal.png" 
                  alt="Ondo State Seal" 
                  fill
                  className="object-contain transform group-hover:scale-110 transition-transform duration-700"
                />
              </div>
            </div>
          </div>

          {/* Dynamic Text Section */}
          <div className="space-y-8 min-h-[240px] flex flex-col justify-center">
            <h1 
              key={`tag-${currentSlide}`}
              className="text-4xl md:text-5xl lg:text-7xl font-black text-white leading-[1.1] animate-slide-up tracking-tighter"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-500 to-yellow-600 drop-shadow-sm">
                {slides[currentSlide].tagline}
              </span>
            </h1>
            <p 
              key={`sub-${currentSlide}`}
              className="text-lg md:text-xl lg:text-2xl text-slate-100/90 font-medium animate-fade-in leading-relaxed max-w-2xl border-l-[6px] border-yellow-500 pl-8"
            >
              {slides[currentSlide].subtext}
            </p>
          </div>

          {/* CTA Buttons */}
          <nav className="flex flex-col sm:flex-row gap-5 pt-6">
            <Link 
              href="/signup" 
              className="flex-1 group flex items-center justify-center gap-3 px-10 py-5 btn-gold rounded-[1.5rem] shadow-2xl hover:shadow-yellow-500/40 transition-all text-xl"
            >
              <UserPlus className="w-6 h-6" />
              <span>Get Started</span>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
            </Link>
            
            <Link 
              href="/login" 
              className="flex-1 group flex items-center justify-center gap-3 px-10 py-5 bg-white/5 backdrop-blur-xl border border-white/10 text-white rounded-[1.5rem] hover:bg-white/10 transition-all text-xl shadow-2xl"
            >
              <LogIn className="w-6 h-6 text-emerald-400 group-hover:scale-110 transition-transform" />
              <span>Login</span>
            </Link>
          </nav>

          {/* Footer Info */}
          <footer className="pt-10 flex flex-col gap-2 opacity-60">
            <p className="text-slate-400 text-[10px] tracking-[0.3em] uppercase font-black">
              Ondo State Administrative Officers Cadre
            </p>
            <div className="h-px w-20 bg-gradient-to-r from-yellow-500/50 to-transparent mx-auto md:mx-0" />
          </footer>
        </div>
      </main>
    </div>
  );
}
