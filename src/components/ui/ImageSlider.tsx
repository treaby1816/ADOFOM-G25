"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const IMAGES = [
    "https://images.unsplash.com/photo-1577962917302-cd87494e3139?q=80&w=2000&auto=format&fit=crop", // Professional meeting
    "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=2000&auto=format&fit=crop", // Business signing
    "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2000&auto=format&fit=crop", // Modern office
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2000&auto=format&fit=crop", // Corporate building
    "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2000&auto=format&fit=crop", // Team collaboration
];

export default function ImageSlider() {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % IMAGES.length);
        }, 6000); // Change image every 6 seconds
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="absolute inset-0 z-0 bg-green-950">
            {IMAGES.map((src, index) => (
                <div
                    key={src}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentIndex ? "opacity-30" : "opacity-0"
                        }`}
                >
                    <Image
                        src={src}
                        alt="Background"
                        fill
                        className="object-cover object-center mix-blend-luminosity"
                        priority={index === 0}
                    />
                </div>
            ))}
            <div className="absolute inset-0 bg-gradient-to-t from-green-900 via-emerald-800/80 to-green-900/60" />
        </div>
    );
}
