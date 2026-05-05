'use client';

import { useState, useEffect } from 'react';
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
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#020617] overflow-hidden">
      {/* Left: Carousel Half */}
      <div className="relative w-full md:w-1/2 h-[40vh] md:h-screen overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
            } transition-transform duration-[5000ms]`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent z-10" />
            <img
              src={slide.image}
              alt={slide.tagline}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
        
        {/* Carousel Indicators */}
        <div className="absolute bottom-8 left-8 z-20 flex gap-2">
          {slides.map((_, i) => (
            <div
              key={i}
              className={`h-1 transition-all duration-300 rounded-full ${
                i === currentSlide ? 'w-8 bg-yellow-500' : 'w-2 bg-white/30'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Right: Content Half */}
      <div className="w-full md:w-1/2 h-[60vh] md:h-screen flex flex-col justify-center items-center px-8 md:px-16 lg:px-24 bg-hero-gradient relative overflow-hidden">
        {/* Background ambient light */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px]" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-yellow-500/10 rounded-full blur-[100px]" />

        <div className="max-w-xl w-full space-y-12 z-10 text-center md:text-left">
          {/* Logo Section */}
          <div className="flex justify-center md:justify-start">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-yellow-500 to-emerald-500 rounded-full blur opacity-40 group-hover:opacity-75 transition duration-1000 group-hover:duration-200 animate-pulse" />
              <div className="relative w-32 h-32 md:w-44 md:h-44 bg-white rounded-full p-3 shadow-2xl overflow-hidden border-4 border-white/20">
                <img src="/logo2.jpg" alt="ADOFOM Logo" className="w-full h-full object-contain rounded-full transform group-hover:scale-105 transition-transform duration-500" />
              </div>
            </div>
          </div>

          {/* Dynamic Text Section */}
          <div className="space-y-8 min-h-[220px]">
            <h1 
              key={`tag-${currentSlide}`}
              className="text-4xl md:text-5xl lg:text-7xl font-black text-white leading-[1.1] animate-slide-up tracking-tight"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-600">
                {slides[currentSlide].tagline}
              </span>
            </h1>
            <p 
              key={`sub-${currentSlide}`}
              className="text-xl md:text-2xl text-slate-100 font-medium animate-fade-in leading-relaxed max-w-2xl border-l-4 border-yellow-500 pl-6"
            >
              {slides[currentSlide].subtext}
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-8">
            <Link 
              href="/signup" 
              className="flex-1 group flex items-center justify-center gap-3 px-8 py-4 btn-gold rounded-2xl shadow-xl hover:shadow-yellow-500/40 transition-all text-lg"
            >
              <UserPlus className="w-5 h-5" />
              <span>Get Started</span>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link 
              href="/login" 
              className="flex-1 group flex items-center justify-center gap-3 px-8 py-4 bg-white/5 backdrop-blur-md border border-white/10 text-white rounded-2xl hover:bg-white/10 transition-all text-lg shadow-xl"
            >
              <LogIn className="w-5 h-5 text-emerald-400" />
              <span>Login</span>
            </Link>
          </div>

          {/* Footer Info */}
          <p className="text-slate-500 text-xs tracking-widest uppercase font-bold pt-8">
            Ondo State Administrative Officers Cadre • Professionalism & Excellence
          </p>
        </div>
      </div>
    </div>
  );
}
