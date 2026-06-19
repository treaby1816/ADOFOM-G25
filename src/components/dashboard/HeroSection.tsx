import ImageSlider from "@/components/ui/ImageSlider";
import NotificationDrawer from "@/components/ui/NotificationDrawer";

interface HeroSectionProps {
  totalOfficers: number;
  totalMdas: number;
}

export default function HeroSection({ totalOfficers, totalMdas }: HeroSectionProps) {
  return (
    <header className="relative overflow-hidden text-white shadow-2xl min-h-[400px] md:min-h-[500px] xl:min-h-[600px] flex flex-col justify-center">
      <ImageSlider />
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-50">
        <NotificationDrawer />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 text-center w-full z-10">
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="w-20 h-20 rounded-full flex items-center justify-center border border-white/20 shadow-2xl animate-float p-1 overflow-hidden" style={{ backgroundColor: "white" }}>
            <img src="/logo2.jpg" alt="Secondary Logo" className="w-full h-full object-cover rounded-full bg-white" />
          </div>
        </div>

        <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 leading-[1.1] py-2 overflow-visible">
          Administrative <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-green-200 to-teal-100 drop-shadow-sm inline-block px-2 pb-2 -mx-2 -mb-2 overflow-visible">
            Officers E-Platform
          </span>
        </h1>
        
        <p className="text-green-50/90 text-lg md:text-xl max-w-2xl mx-auto italic font-serif font-light tracking-wide mb-12 leading-relaxed drop-shadow-sm">
          "Excellence in service, integrity in administration. Connect with the cadre driving Ondo State forward."
        </p>

        {/* Stats Bar */}
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-12 bg-black/20 backdrop-blur-2xl px-10 py-6 rounded-[2.5rem] border border-white/10 w-fit mx-auto shadow-2xl">
          <div className="flex flex-col items-center">
            <span className="text-3xl font-black text-emerald-300">{totalOfficers || "---"}</span>
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/50">Officers</span>
          </div>
          <div className="w-px h-10 bg-white/10 hidden sm:block" />
          <div className="flex flex-col items-center">
            <span className="text-3xl font-black text-emerald-300">
              {totalMdas || "---"}
            </span>
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/50">Ministries</span>
          </div>
          <div className="w-px h-10 bg-white/10 hidden sm:block" />
          <div className="flex flex-col items-center">
            <span className="text-3xl font-black text-emerald-300">18</span>
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/50">LGAs</span>
          </div>
        </div>
      </div>

      {/* Decorative Wave */}
      <div className="absolute bottom-0 left-0 right-0 z-10 pointer-events-none">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto text-slate-50 dark:text-zinc-950 fill-current">
          <path d="M0 120V60C240 30 480 30 720 60C960 90 1200 90 1440 60V120H0Z" opacity="0.5" />
          <path d="M0 120V80C240 50 480 50 720 80C960 110 1200 110 1440 80V120H0Z" />
        </svg>
      </div>
    </header>
  );
}
