"use client";

import Link from 'next/link';

export function Footer() {
  return (
    <footer className="w-full bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 py-6 mt-auto animate-in fade-in duration-1000">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row justify-between gap-6 mb-6">
          <div className="md:w-1/3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Rankify <span className="text-primary font-light">DTU</span></h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Empowering DTU students with transparent, data-driven insights into academics and placements.
            </p>
          </div>
          
          <div className="flex gap-8 sm:gap-16">
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2 text-sm">Product</h3>
              <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                <li><Link href="/" className="hover:text-primary transition-colors">Results Dashboard</Link></li>
                <li><Link href="/placement" className="hover:text-primary transition-colors">Placement Statistics</Link></li>
                <li><Link href="/blog" className="hover:text-primary transition-colors">Insights Hub</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2 text-sm">Company</h3>
              <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
                <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
                <li><Link href="/faq" className="hover:text-primary transition-colors">FAQ</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2 text-sm">Legal</h3>
              <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
                <li><Link href="/disclaimer" className="hover:text-primary transition-colors">Disclaimer</Link></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            © {new Date().getFullYear()} Rankify DTU. All rights reserved.
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Developed and maintained by{" "}
            <a
              href="https://www.linkedin.com/in/aditya-raj0311"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-medium transition-all"
            >
              Aditya Raj
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
