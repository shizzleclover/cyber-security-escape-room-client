'use client';

import Link from 'next/link';
import { Shield } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-zinc-200/60 bg-white">
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 bg-zinc-900 rounded-[4px] flex items-center justify-center">
                <Shield className="w-3.5 h-3.5 text-white" strokeWidth={2} />
              </div>
              <span className="text-sm font-semibold tracking-tight text-zinc-900">
                CyberEscape
              </span>
            </Link>
            <p className="text-zinc-500 text-[13px] leading-relaxed max-w-sm">
              Interactive cybersecurity training designed to build digital confidence.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-[13px] font-semibold text-zinc-900 mb-3">Navigate</h4>
            <div className="flex flex-col gap-2">
              <Link href="/about" className="text-[13px] text-zinc-500 hover:text-zinc-900 transition-colors">About</Link>
              <Link href="/resources" className="text-[13px] text-zinc-500 hover:text-zinc-900 transition-colors">Resources</Link>
              <Link href="/hub" className="text-[13px] text-zinc-500 hover:text-zinc-900 transition-colors">Escape Rooms</Link>
            </div>
          </div>

          {/* Project */}
          <div>
            <h4 className="text-[13px] font-semibold text-zinc-900 mb-3">Legal</h4>
            <div className="flex flex-col gap-2">
              <span className="text-[13px] text-zinc-400">Privacy Policy</span>
              <span className="text-[13px] text-zinc-400">Terms of Service</span>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-6 border-t border-zinc-100 flex items-center justify-between">
          <p className="text-xs text-zinc-400 font-mono">
            © {new Date().getFullYear()} CyberEscape
          </p>
          <p className="text-xs text-zinc-400">
            MSc Project
          </p>
        </div>
      </div>
    </footer>
  );
}
