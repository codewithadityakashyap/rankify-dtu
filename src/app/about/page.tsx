import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn about Rankify DTU, our mission, and how we analyze placement and academic data for Delhi Technological University students.',
};

export default function AboutPage() {
  return (
    <main className="container mx-auto px-4 sm:px-6 py-16 max-w-4xl">
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4">
            About Rankify DTU
          </h1>
          <p className="text-xl text-slate-500 dark:text-slate-400">
            Empowering DTU students with transparent, data-driven insights into academics and placements.
          </p>
        </div>

        <div className="prose prose-slate dark:prose-invert max-w-none">
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">Why Rankify DTU Exists</h2>
            <p className="mb-4">
              Navigating university life, tracking academic performance, and understanding placement trends can often feel overwhelming. Traditionally, this data has been scattered across multiple PDFs, notice boards, and informal channels, making it difficult for students to gauge where they stand and what to expect.
            </p>
            <p className="mb-4">
              <strong>Rankify DTU</strong> was built to solve this problem. We aggregate, analyze, and visualize public academic results and placement statistics for Delhi Technological University (DTU) students, providing a clear, unified dashboard to help you make informed decisions about your career and studies.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">What Problems We Solve</h2>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li><strong>Data Accessibility:</strong> We transform raw, difficult-to-read result PDFs into searchable, sortable tables.</li>
              <li><strong>Performance Tracking:</strong> Easily track your CGPA/SGPA progression across semesters.</li>
              <li><strong>Placement Insights:</strong> Understand branch-wise hiring trends, top recruiters, and compensation benchmarks to set realistic career goals.</li>
              <li><strong>Peer Benchmarking:</strong> View university and branch rankings to understand your relative academic standing.</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">How Data is Presented</h2>
            <p className="mb-4">
              Our platform focuses on clarity and speed. We use interactive charts, heatmaps, and comprehensive data tables. All data is anonymized where appropriate and strictly derived from publicly available or officially distributed lists within the university. We do not alter grades or placement figures.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">Our Future Vision</h2>
            <p className="mb-4">
              This is just Phase 1. In the future, Rankify DTU aims to introduce predictive analytics (Rank and Placement predictors), authenticated student profiles, company eligibility checkers, and deeper alumni insights. We are committed to evolving alongside the needs of the DTU student community, continuously refining our platform to be the ultimate university companion.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
