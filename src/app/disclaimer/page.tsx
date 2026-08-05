import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Disclaimer',
  description: 'Disclaimer statement regarding data accuracy and usage on Rankify DTU.',
};

export default function DisclaimerPage() {
  return (
    <main className="container mx-auto px-4 sm:px-6 py-16 max-w-4xl">
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4">
            Disclaimer
          </h1>
          <p className="text-xl text-slate-500 dark:text-slate-400">
            Important information regarding the data presented on this platform.
          </p>
        </div>

        <div className="prose prose-slate dark:prose-invert max-w-none">
          <p>
            The information contained on Rankify DTU (the "Service") is for general information purposes only. Rankify DTU assumes no responsibility for errors or omissions in the contents of the Service.
          </p>

          <h2>1. Unofficial Platform</h2>
          <p>
            <strong>Rankify DTU is an independent, student-led initiative and is NOT officially affiliated, associated, authorized, endorsed by, or in any way officially connected with Delhi Technological University (DTU).</strong> All university names, marks, emblems, and images are registered trademarks of their respective owners.
          </p>

          <h2>2. Data Accuracy</h2>
          <p>
            The academic results, CGPA data, and placement statistics displayed on this website are aggregated from publicly available documents, university notice boards, and student-shared records. We do our best to parse and present this data accurately, but optical character recognition (OCR) errors or manual entry mistakes can occur. 
          </p>
          <p>
            If you notice an error in your data, please contact us for correction. However, for any official verification, transcripts, or university-related disputes, always refer to the official records provided by the DTU administration.
          </p>

          <h2>3. No Professional Advice</h2>
          <p>
            The placement data, company hiring trends, and package details are intended to provide insights and help students prepare. They should not be considered as professional career advice or a guarantee of employment. Market conditions and company hiring policies change frequently.
          </p>

          <h2>4. "As Is" Basis</h2>
          <p>
            All information is provided "as is", with no guarantee of completeness, accuracy, timeliness, or of the results obtained from the use of this information, and without warranty of any kind, express or implied.
          </p>
        </div>
      </div>
    </main>
  );
}
