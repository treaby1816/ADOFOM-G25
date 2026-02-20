"use client";

import { useState, useEffect } from "react";
import { ArrowUp, ArrowDown } from "lucide-react";

export default function ScrollButtons() {
    const [isVisible, setIsVisible] = useState(false);
    const [isAtBottom, setIsAtBottom] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            // Show buttons if we've scrolled down a bit
            if (window.scrollY > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }

            // Check if we're near the bottom of the page
            if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 50) {
                setIsAtBottom(true);
            } else {
                setIsAtBottom(false);
            }
        };

        window.addEventListener("scroll", toggleVisibility);
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    const scrollToBottom = () => {
        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: "smooth"
        });
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 animate-fade-in">
            <button
                onClick={scrollToTop}
                className="p-3 rounded-full bg-white text-green-700 shadow-[0_4px_20px_-4px_rgba(21,128,61,0.3)] border border-green-100/50 hover:bg-green-50 hover:-translate-y-1 hover:shadow-[0_8px_25px_-4px_rgba(21,128,61,0.4)] active:scale-95 transition-all duration-300"
                title="Scroll to Top"
            >
                <ArrowUp size={24} />
            </button>

            {!isAtBottom && (
                <button
                    onClick={scrollToBottom}
                    className="p-3 rounded-full bg-green-700 text-white shadow-[0_4px_20px_-4px_rgba(21,128,61,0.3)] border border-green-600 hover:bg-green-600 hover:translate-y-1 hover:shadow-[0_8px_25px_-4px_rgba(21,128,61,0.4)] active:scale-95 transition-all duration-300"
                    title="Scroll to Bottom"
                >
                    <ArrowDown size={24} />
                </button>
            )}
        </div>
    );
}
