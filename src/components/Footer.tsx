export function Footer() {
  return (
    <footer className="w-full bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 py-8 mt-auto animate-in fade-in duration-1000">
      <div className="container mx-auto px-4 sm:px-6 flex flex-col items-center justify-center text-center gap-2">
        <p className="text-slate-900 dark:text-slate-200">
          Developed & Maintained by{' '}
          <a 
            href="https://www.linkedin.com/in/aditya-raj-054bb1205/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary font-medium hover:text-blue-700 dark:hover:text-blue-400 hover:underline underline-offset-4 transition-all duration-300"
          >
            Aditya Raj
          </a>
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          © 2026 Rankify DTU. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
