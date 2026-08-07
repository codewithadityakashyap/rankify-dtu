import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms & Conditions',
  description: 'Terms and Conditions for using Rankify DTU.',
};

export default function TermsPage() {
  return (
    <main className="container mx-auto px-4 sm:px-6 py-16 max-w-4xl">
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4">
            Terms & Conditions
          </h1>
          <p className="text-xl text-slate-500 dark:text-slate-400">
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </p>
        </div>

        <div className="prose prose-slate dark:prose-invert max-w-none">
          <p>
            Welcome to Rankify DTU! These terms and conditions outline the rules and regulations for the use of Rankify DTU's Website, located at https://rankify-dtu.vercel.app.
          </p>
          <p>
            By accessing this website we assume you accept these terms and conditions. Do not continue to use Rankify DTU if you do not agree to take all of the terms and conditions stated on this page.
          </p>

          <h2>1. License & Intellectual Property</h2>
          <p>
            Unless otherwise stated, Rankify DTU and/or its licensors own the intellectual property rights for all material (design, UI, layout) on Rankify DTU. All intellectual property rights are reserved. You may access this from Rankify DTU for your own personal use subjected to restrictions set in these terms and conditions.
          </p>
          <p>You must not:</p>
          <ul>
            <li>Republish material from Rankify DTU</li>
            <li>Sell, rent, or sub-license material from Rankify DTU</li>
            <li>Reproduce, duplicate, or copy material from Rankify DTU</li>
            <li>Redistribute content from Rankify DTU (unless content is specifically made for redistribution)</li>
          </ul>

          <h2>2. Data Usage & Accuracy</h2>
          <p>
            The academic and placement data provided on this platform is for informational purposes only. While we strive to present accurate and up-to-date data, we make no warranties about the completeness, reliability, or accuracy of this information. The official university records remain the sole source of absolute truth.
          </p>

          <h2>3. Acceptable Use</h2>
          <p>
            You must not use this website in any way that causes, or may cause, damage to the website or impairment of the availability or accessibility of Rankify DTU; or in any way which is unlawful, illegal, fraudulent, or harmful. Automated scraping, data mining, or programmatic extraction of data without prior written consent is strictly prohibited.
          </p>

          <h2>4. Limitations of Liability</h2>
          <p>
            In no event shall Rankify DTU, nor any of its developers or affiliates, be held liable for anything arising out of or in any way connected with your use of this Website. We shall not be held liable for any indirect, consequential, or special liability arising out of or in any way related to your use of this Website or decisions made based on its data.
          </p>

          <h2>5. Amendments</h2>
          <p>
            We reserve the right to amend these terms and conditions at any time. By continuing to use the Website, you agree to be bound by the current version of these terms and conditions.
          </p>
        </div>
      </div>
    </main>
  );
}
