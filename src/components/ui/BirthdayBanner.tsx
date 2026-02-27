"use client";

import { useEffect, useState, useCallback } from "react";
import Confetti from "react-confetti";
import { X, PartyPopper } from "lucide-react";
import { Officer } from "@/types/officer";

interface BirthdayBannerProps {
    officers: Officer[];
    onClose: () => void;
}

export default function BirthdayBanner({ officers, onClose }: BirthdayBannerProps) {
    const [showConfetti, setShowConfetti] = useState(true);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    const updateDimensions = useCallback(() => {
        setDimensions({ width: window.innerWidth, height: window.innerHeight });
    }, []);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        updateDimensions();
        window.addEventListener("resize", updateDimensions);

        const timer = setTimeout(() => setShowConfetti(false), 5000);

        document.body.style.overflow = "hidden";
        return () => {
            window.removeEventListener("resize", updateDimensions);
            clearTimeout(timer);
            document.body.style.overflow = "";
        };
    }, [updateDimensions]);

    // Safety check just in case it renders without officers
    if (!officers || officers.length === 0) return null;

    return (
        <>
            {/* Confetti Layer */}
            {showConfetti && (
                <Confetti
                    width={dimensions.width}
                    height={dimensions.height}
                    numberOfPieces={300}
                    recycle={false}
                    colors={["#15803d", "#16a34a", "#22c55e", "#4ade80", "#86efac", "#fbbf24", "#f59e0b", "#ef4444", "#3b82f6"]}
                    style={{ position: "fixed", top: 0, left: 0, zIndex: 100 }}
                />
            )}

            {/* Modal Overlay */}
            <div
                className="fixed inset-0 z-[90] flex items-center justify-center p-4"
                onClick={onClose}
            >
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in" />

                <div
                    className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-modal-in"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Close */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-red-50 text-slate-400 hover:text-red-500 transition-all duration-200 z-10 cursor-pointer"
                    >
                        <X size={18} />
                    </button>

                    {/* Colorful Header */}
                    <div className="bg-gradient-to-br from-yellow-400 via-orange-400 to-pink-500 py-10 px-6 text-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjE1KSIvPjwvc3ZnPg==')] opacity-60" />
                        <div className="relative">
                            <div className="text-6xl mb-3 animate-bounce">🎂</div>
                            <h2 className="text-3xl font-extrabold text-white drop-shadow-md">
                                Happy Birthday!
                            </h2>
                        </div>
                    </div>

                    {/* Body */}
                    <div className="px-6 py-6 text-center max-h-[60vh] overflow-y-auto">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-50 mb-4">
                            <PartyPopper size={30} className="text-green-600" />
                        </div>
                        <p className="text-xl font-bold text-slate-800 mb-4">
                            🎉 Celebrating Today:
                        </p>

                        <div className="space-y-4 mb-6 text-left">
                            {officers.map((officer) => (
                                <div key={officer.id} className="flex items-center gap-4 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                                    <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-200 border-2 border-white shadow-sm flex-shrink-0">
                                        {officer.photo_url ? (
                                            <img
                                                src={officer.photo_url}
                                                alt={officer.full_name}
                                                className={`w-full h-full object-cover ${officer.photo_position || 'object-top'}`}
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-green-100 text-green-600 font-bold text-xl">
                                                {officer.full_name.charAt(0)}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-lg font-extrabold text-green-700 leading-tight">
                                            {officer.full_name}
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            from the <span className="font-semibold text-green-600">{officer.current_mda}</span>
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={onClose}
                            className="w-full px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:from-green-700 hover:to-emerald-600 transition-all duration-300 cursor-pointer"
                        >
                            🎊 Celebrate!
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
