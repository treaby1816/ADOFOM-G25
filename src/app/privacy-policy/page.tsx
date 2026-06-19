'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 px-4 py-10 sm:px-6">
      <div className="max-w-3xl mx-auto">

        <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors mb-8">
          <ArrowLeft size={16} /> Back
        </Link>

        <div className="bg-white dark:bg-zinc-900 rounded-[2rem] border border-slate-200 dark:border-zinc-800 shadow-xl p-8 sm:p-12 space-y-8">

          <div className="border-b border-slate-100 dark:border-zinc-800 pb-6">
            <h1 className="text-3xl font-black text-slate-900 dark:text-zinc-100 tracking-tight mb-2">
              Privacy Policy
            </h1>
            <p className="text-sm text-slate-500 dark:text-zinc-400">
              <strong>ADOFOM E-PLATFORM</strong> &nbsp;·&nbsp; Effective Date: June 19, 2026 &nbsp;·&nbsp; Developed by Treabyn Inc.
            </p>
          </div>

          <section className="space-y-4">
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/50 rounded-2xl p-5">
              <p className="text-sm text-amber-800 dark:text-amber-300 font-medium leading-relaxed">
                <strong>Disclaimer of Affiliation:</strong> This App is a personal and professional initiative. It is <strong>not</strong> affiliated with, endorsed by, or an official application of the Ondo State Government or any of its agencies, and it does not represent or act on behalf of any government authority.
              </p>
            </div>
          </section>

          {[
            {
              num: '1', title: 'Introduction',
              body: 'This Privacy Policy applies to the ADOFOM E-PLATFORM application ("the App"), developed as an independent digital platform for the Administrative Officers\u2019 Forum (ADOFOM), Ondo State.'
            },
            {
              num: '2', title: 'Purpose of the App',
              body: 'The App is designed to provide secure access to an administrative officers\u2019 directory, support internal communication within the cadre, facilitate professional networking among members, and offer authenticated access to cadre-related information.'
            },
            {
              num: '3', title: 'User Accounts and Authentication',
              body: 'The App uses Supabase for secure login and authentication. When users register or log in, the App may collect and process: full name, email address, username or staff identifier, and password (stored securely using industry-standard encryption). Passwords are never stored in plain text. Login activity (such as timestamps) may be logged for security purposes.'
            },
            {
              num: '4', title: 'Information Displayed in the App',
              body: 'Depending on your access level, the App may display professional directory information including: names of administrative officers, job titles and designations, ministries/departments or units, official office contact numbers, official email addresses, and profile photographs (if provided or authorised). This information is used strictly for professional and administrative networking within the cadre.'
            },
            {
              num: '5', title: 'Data Collection and Usage',
              body: 'The App collects only the information necessary to create and manage authenticated user accounts, provide secure login access, display relevant directory information, and improve internal communication among members. The App does not collect unnecessary personal data and does not track users for advertising or commercial purposes.'
            },
            {
              num: '6', title: 'Data Storage and Security',
              body: 'We implement robust technical safeguards including encrypted password storage, secure authentication systems, and Row Level Security (RLS) to control access to directory data. While we strive to protect your personal information, no digital system is completely secure, and we cannot guarantee absolute protection against unauthorised access.'
            },
            {
              num: '7', title: 'Data Sharing',
              body: 'The App does not sell, rent, or trade user data. Information is only accessible to authorised, logged-in users within the platform and is used strictly for cadre-related communication. We do not share personal data with third-party advertisers or data brokers.'
            },
            {
              num: '8', title: 'Data Source and Accuracy',
              body: 'Information displayed in the App may be sourced from internal administrative records, official cadre listings, or verified contributions directly from members. We strive to ensure accuracy but do not guarantee that all directory information is always current or error-free.'
            },
            {
              num: '9', title: 'Third-Party Services',
              body: 'The App does not intentionally use third-party advertising or analytics services. If such services are introduced in future updates, this Privacy Policy will be amended accordingly.'
            },
            {
              num: '10', title: 'User Rights',
              body: 'Users maintain the right to request access to their personal account information, request correction of inaccurate directory data, and request deletion of their account (subject to administrative requirements). Requests can be made via the contact information below.'
            },
            {
              num: '11', title: 'Consent',
              body: 'By creating an account or using the App, you agree to the terms outlined in this Privacy Policy. If you do not agree, you should not use the App.'
            },
            {
              num: '12', title: 'Changes to This Privacy Policy',
              body: 'This Privacy Policy may be updated from time to time. Updates will be posted within the App and on its official hosting page.'
            },
          ].map(({ num, title, body }) => (
            <section key={num} className="space-y-2">
              <h2 className="text-lg font-black text-slate-800 dark:text-zinc-100">
                {num}. {title}
              </h2>
              <p className="text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">{body}</p>
            </section>
          ))}

          <section className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700/50 rounded-2xl p-6 space-y-2">
            <h2 className="text-lg font-black text-slate-800 dark:text-zinc-100">13. Contact Information</h2>
            <div className="text-sm text-slate-600 dark:text-zinc-400 space-y-1">
              <p><strong>Developer:</strong> Adewole Felix Bamidele</p>
              <p><strong>Brand:</strong> Treabyn Inc.</p>
              <p><strong>Email:</strong>{' '}
                <a href="mailto:felixadewole16@gmail.com" className="text-emerald-600 dark:text-emerald-400 hover:underline font-semibold">
                  felixadewole16@gmail.com
                </a>
              </p>
              <p><strong>Country:</strong> Nigeria</p>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
