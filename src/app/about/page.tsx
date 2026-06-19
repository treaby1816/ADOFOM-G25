'use client';

import Link from 'next/link';
import { ArrowLeft, Shield, Users, Search, Newspaper, Award, Lock } from 'lucide-react';

const features = [
  { icon: Lock,     label: 'Secure user login and authentication' },
  { icon: Users,    label: 'Administrative officers\u2019 directory access' },
  { icon: Search,   label: 'Search and filter functionality' },
  { icon: Newspaper,label: 'Cadre-focused news and announcements' },
  { icon: Award,    label: 'Leadership showcase and cadre information' },
  { icon: Shield,   label: 'Structured professional listings' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 px-4 py-10 sm:px-6">
      <div className="max-w-3xl mx-auto space-y-6">

        <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
          <ArrowLeft size={16} /> Back to Directory
        </Link>

        {/* Header */}
        <div className="bg-gradient-to-br from-emerald-900 to-[#001f3f] rounded-[2rem] p-8 text-white shadow-2xl">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/20 bg-white/10 flex-shrink-0">
              <img src="/logo2.jpg" alt="ADOFOM Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight">ADOFOM E-PLATFORM</h1>
              <p className="text-emerald-300 text-sm font-medium">Administrative Officers&apos; Forum, Ondo State</p>
            </div>
          </div>
          <p className="text-white/80 text-sm leading-relaxed">
            A secure digital platform designed to support communication, collaboration, and
            information sharing among administrative officers within the cadre.
          </p>
        </div>

        {/* Disclaimer */}
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-300 dark:border-amber-600/50 rounded-2xl p-6">
          <div className="flex gap-3">
            <Shield className="text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" size={20} />
            <div>
              <h2 className="text-sm font-black text-amber-800 dark:text-amber-300 uppercase tracking-wider mb-2">
                Important Disclaimer
              </h2>
              <p className="text-sm text-amber-700 dark:text-amber-400 leading-relaxed">
                This application is an independent personal project and is <strong>not affiliated with,
                endorsed by, or officially connected to the Ondo State Government or any of its agencies.</strong>{' '}
                All information provided is intended strictly for professional and informational purposes
                within the administrative cadre.
              </p>
            </div>
          </div>
        </div>

        {/* Purpose */}
        <div className="bg-white dark:bg-zinc-900 rounded-[2rem] border border-slate-200 dark:border-zinc-800 shadow-lg p-8 space-y-4">
          <h2 className="text-xl font-black text-slate-800 dark:text-zinc-100">Purpose of the Platform</h2>
          <p className="text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
            The ADOFOM E-PLATFORM is an independent initiative developed by a member of the
            Administrative Officers&apos; cadre to improve accessibility, coordination, and digital
            efficiency within the professional community.
          </p>
          <ul className="space-y-2 text-sm text-slate-600 dark:text-zinc-400">
            {[
              'Strengthen communication among administrative officers.',
              'Provide secure access to cadre information.',
              'Improve coordination within ministries and departments.',
              'Support digital transformation within administrative operations.',
              'Serve as a professional reference tool for registered members.',
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="text-emerald-500 font-black mt-0.5">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Key Features */}
        <div className="bg-white dark:bg-zinc-900 rounded-[2rem] border border-slate-200 dark:border-zinc-800 shadow-lg p-8 space-y-4">
          <h2 className="text-xl font-black text-slate-800 dark:text-zinc-100">Key Features</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {features.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-zinc-800/50">
                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                  <Icon size={16} className="text-emerald-600 dark:text-emerald-400" />
                </div>
                <span className="text-sm font-medium text-slate-700 dark:text-zinc-300">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Data & Privacy */}
        <div className="bg-white dark:bg-zinc-900 rounded-[2rem] border border-slate-200 dark:border-zinc-800 shadow-lg p-8 space-y-3">
          <h2 className="text-xl font-black text-slate-800 dark:text-zinc-100">Data &amp; Privacy</h2>
          <p className="text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
            User data is handled responsibly and securely. The application only collects information
            necessary for authentication and platform functionality. No data is sold or used for
            advertising purposes.
          </p>
          <Link
            href="/privacy-policy"
            className="inline-flex items-center gap-2 text-sm font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            Read our full Privacy Policy →
          </Link>
        </div>

        {/* Contact */}
        <div className="bg-white dark:bg-zinc-900 rounded-[2rem] border border-slate-200 dark:border-zinc-800 shadow-lg p-8 space-y-3">
          <h2 className="text-xl font-black text-slate-800 dark:text-zinc-100">Contact</h2>
          <div className="text-sm text-slate-600 dark:text-zinc-400 space-y-1.5">
            <p><span className="font-bold text-slate-700 dark:text-zinc-300">Developer:</span> Adewole Felix Bamidele</p>
            <p><span className="font-bold text-slate-700 dark:text-zinc-300">Brand:</span> Treabyn Inc.</p>
            <p>
              <span className="font-bold text-slate-700 dark:text-zinc-300">Email:</span>{' '}
              <a href="mailto:felixadewole16@gmail.com" className="text-emerald-600 dark:text-emerald-400 hover:underline font-semibold">
                felixadewole16@gmail.com
              </a>
            </p>
            <p><span className="font-bold text-slate-700 dark:text-zinc-300">Country:</span> Nigeria</p>
          </div>
        </div>

        <p className="text-center text-xs text-slate-400 dark:text-zinc-600 font-medium pb-6">
          ADOFOM E-Platform · Powered by Treabyn Inc. · Independent of Ondo State Government
        </p>

      </div>
    </div>
  );
}
