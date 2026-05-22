"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const IMAGES = [
    // Verified high-quality professional/corporate images
    "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2000&auto=format&fit=crop", // Team collaboration
    "https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=2000&auto=format&fit=crop", // Professional woman in tech/office
    "https://images.unsplash.com/photo-1556761175-5973dc0f32d7?q=80&w=2000&auto=format&fit=crop", // Business team in meeting
    "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2000&auto=format&fit=crop", // Modern office
    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2000&auto=format&fit=crop", // Team working on table
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
        <div className="absolute inset-0 z-0 bg-[#064e3b]"> {/* green-950 base */}
            {IMAGES.map((src, index) => (
                <div
                    key={src}
                    className={`absolute inset-0 transition-opacity duration-[1500ms] ease-in-out ${
                        index === currentIndex ? "opacity-60" : "opacity-0"
                    }`}
                >
                    <Image
                        src={src}
                        alt="Background"
                        fill
                        className="object-cover object-[center_30%]"
                        priority={index === 0}
                    />
                </div>
            ))}
            {/* 
              This gradient ensures the white text remains 100% readable 
              while allowing the vibrant images to show through clearly.
            */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#064e3b] via-[#064e3b]/70 to-[#064e3b]/40 mix-blend-multiply" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#064e3b]/80 via-transparent to-transparent" />
        </div>
    );
}
