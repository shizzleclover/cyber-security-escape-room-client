'use client';

import Link from 'next/link';
import { Shield, ArrowUpRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-[#FAF9F5] text-zinc-700 relative z-10">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center text-white shadow-sm">
                <Shield strokeWidth={2.25} className="w-4 h-4 text-emerald-400" />
              </div>
              <span className="text-[16px] font-bold tracking-tight text-zinc-900">
                CyberEscape
              </span>
            </Link>
            <p className="text-zinc-600 text-[14px] leading-relaxed max-w-sm">
              Interactive cyber awareness training developed to build instinctive defence habits for everyday digital life in Ireland.
            </p>
            <div className="pt-2">
              <span className="inline-flex items-center gap-2 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                100% Free &amp; Open Education
              </span>
            </div>
          </div>

          {/* Escape Rooms */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 mb-4">Escape Rooms</h4>
            <div className="flex flex-col gap-2.5 text-sm">
              <Link href="/rooms/phishing" className="text-zinc-600 hover:text-zinc-900 transition-colors">Phishing Lab</Link>
              <Link href="/rooms/passwords" className="text-zinc-600 hover:text-zinc-900 transition-colors">Password Security</Link>
              <Link href="/rooms/social-engineering" className="text-zinc-600 hover:text-zinc-900 transition-colors">Social Engineering</Link>
              <Link href="/hub" className="hover:text-zinc-900 transition-colors font-semibold text-zinc-900">All Rooms Hub →</Link>
            </div>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 mb-4">Platform</h4>
            <div className="flex flex-col gap-2.5 text-sm">
              <Link href="/quiz?type=pre" className="text-zinc-600 hover:text-zinc-900 transition-colors">Pre-Assessment</Link>
              <Link href="/dashboard" className="text-zinc-600 hover:text-zinc-900 transition-colors">Progress Dashboard</Link>
              <Link href="/resources" className="text-zinc-600 hover:text-zinc-900 transition-colors">Security Resources</Link>
              <Link href="/about" className="text-zinc-600 hover:text-zinc-900 transition-colors">About the Project</Link>
            </div>
          </div>

          {/* Ireland Support Resources */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 mb-4">Irish Resources</h4>
            <div className="flex flex-col gap-2.5 text-sm">
              <a href="https://www.ncsc.gov.ie" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-zinc-600 hover:text-zinc-900 transition-colors">
                NCSC Ireland <ArrowUpRight className="w-3.5 h-3.5 text-zinc-500" />
              </a>
              <a href="https://www.garda.ie" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-zinc-600 hover:text-zinc-900 transition-colors">
                Garda Cyber Crime <ArrowUpRight className="w-3.5 h-3.5 text-zinc-500" />
              </a>
              <a href="https://www.fraudsmart.ie" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-zinc-600 hover:text-zinc-900 transition-colors">
                FraudSMART.ie <ArrowUpRight className="w-3.5 h-3.5 text-zinc-500" />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Metadata */}
        <div className="mt-14 pt-6 border-t border-zinc-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>© {new Date().getFullYear()} CyberEscape. MSc Research Project.</p>
          <p className="text-zinc-500">Designed for intuitive cyber safety education in Ireland.</p>
        </div>
      </div>
    </footer>
  );
}
