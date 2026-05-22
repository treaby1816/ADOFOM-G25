"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const DESKTOP_IMAGES = [
    "/HERO1.jpg",
    "/HERO2.jpg",
    "/HERO 3.jpg",
    "/HERO4.jpg",
    "/slide2.jpg", // Keeping slide2 as requested (removed 1 and 3)
];

const MOBILE_IMAGES = [
    "/ADR1.jpg",
    "/ADR2.jpg",
    "/ADR3.jpg",
    "/ADR4.jpg",
    "/ADR5.jpg",
];

export default function ImageSlider() {
    const [desktopIndex, setDesktopIndex] = useState(0);
    const [mobileIndex, setMobileIndex] = useState(0);

    useEffect(() => {
        const timerDesktop = setInterval(() => {
            setDesktopIndex((prev) => (prev + 1) % DESKTOP_IMAGES.length);
        }, 6000);
        
        const timerMobile = setInterval(() => {
            setMobileIndex((prev) => (prev + 1) % MOBILE_IMAGES.length);
        }, 6000);

        return () => {
            clearInterval(timerDesktop);
            clearInterval(timerMobile);
        };
    }, []);

    return (
        <div className="absolute inset-0 z-0 bg-[#064e3b]"> {/* green-950 base */}
            
            {/* Desktop Carousel (Hidden on Mobile) */}
            <div className="hidden md:block absolute inset-0">
                {DESKTOP_IMAGES.map((src, index) => (
                    <div
                        key={`desktop-${src}`}
                        className={`absolute inset-0 transition-opacity duration-[1500ms] ease-in-out ${
                            index === desktopIndex ? "opacity-60" : "opacity-0"
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
            </div>

            {/* Mobile Carousel (Hidden on Desktop) */}
            <div className="block md:hidden absolute inset-0">
                {MOBILE_IMAGES.map((src, index) => (
                    <div
                        key={`mobile-${src}`}
                        className={`absolute inset-0 transition-opacity duration-[1500ms] ease-in-out ${
                            index === mobileIndex ? "opacity-60" : "opacity-0"
                        }`}
                    >
                        <Image
                            src={src}
                            alt="Background"
                            fill
                            className="object-cover object-top"
                            priority={index === 0}
                        />
                    </div>
                ))}
            </div>

            {/* 
              This gradient ensures the white text remains 100% readable 
              while allowing the vibrant images to show through clearly.
            */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#064e3b] via-[#064e3b]/70 to-[#064e3b]/40 mix-blend-multiply" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#064e3b]/80 via-transparent to-transparent" />
        </div>
    );
}
