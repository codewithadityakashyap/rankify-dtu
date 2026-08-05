export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  author: string;
  readTime: string;
  category: string;
}

const mockPosts: BlogPost[] = [
  {
    slug: 'dtu-placement-statistics-2026',
    title: 'DTU Placement Statistics 2026: An Early Look',
    excerpt: 'Analyzing the early hiring trends, top recruiters, and compensation packages for the DTU Class of 2026.',
    content: `
      <h2>The Hiring Landscape</h2>
      <p>The 2026 placement season has kicked off with robust participation from top tech and core companies. Despite broader macroeconomic headwinds, DTU students continue to secure competitive offers across Software Engineering, Data Science, and Core Engineering roles.</p>
      
      <h2>Top Recruiters</h2>
      <p>Companies like Google, Microsoft, Atlassian, and Sprinklr have led the charge in the tech domain, offering packages exceeding 40 LPA. On the core side, Texas Instruments, Bajaj Auto, and ExxonMobil have hired significantly from ECE, EE, and ME branches.</p>

      <h2>Branch-wise Trends</h2>
      <ul>
        <li><strong>COE & IT:</strong> Maintain the highest average CTCs, primarily driven by SDE roles.</li>
        <li><strong>ECE & EE:</strong> Seeing an uptick in roles related to VLSI, embedded systems, and EV technologies.</li>
        <li><strong>Core Branches:</strong> Companies are increasingly looking for a blend of core knowledge and analytical programming skills.</li>
      </ul>
      
      <p>Stay tuned as we update the dashboard with more verified placement data throughout the semester.</p>
    `,
    date: 'August 15, 2025',
    author: 'Rankify DTU Team',
    readTime: '4 min read',
    category: 'Placements'
  },
  {
    slug: 'cgpa-improvement-guide',
    title: 'The Ultimate Guide to Improving Your CGPA at DTU',
    excerpt: 'Actionable strategies for mid-semester turnarounds, leveraging electives, and mastering university exams.',
    content: `
      <h2>Understanding the Credit System</h2>
      <p>At DTU, your CGPA is heavily influenced by high-credit core subjects. A 4-credit course has double the impact of a 2-credit lab. Always prioritize subjects based on their credit weightage when planning your study schedule.</p>
      
      <h2>Mid-Semester Strategy</h2>
      <p>Mid-terms (mid-sems) often account for 20-30% of your final grade but cover only half the syllabus. Scoring high here creates a massive buffer for the end-sems, which are typically harder and more comprehensive.</p>

      <h2>Choosing Electives Wisely</h2>
      <p>In your 3rd and 4th years, Departmental and Open Electives play a crucial role. Talk to seniors about the scoring patterns of specific professors. A well-chosen elective can easily boost your SGPA by 0.2 to 0.4 points.</p>
      
      <h2>Previous Year Questions (PYQs)</h2>
      <p>DTU professors frequently repeat patterns from PYQs. Solving the last 3-5 years of question papers is arguably the most efficient way to prepare for end-semester exams.</p>
    `,
    date: 'September 2, 2025',
    author: 'Rankify DTU Academics',
    readTime: '6 min read',
    category: 'Academics'
  },
  {
    slug: 'branch-wise-analysis-cse-vs-it',
    title: 'Branch Analysis: COE vs IT at DTU',
    excerpt: 'A data-backed comparison of the curriculum, placement outcomes, and overall experience between COE and IT branches.',
    content: `
      <h2>Curriculum Differences</h2>
      <p>Computer Engineering (COE) and Information Technology (IT) share about 70-80% of their curriculum. COE leans slightly more towards hardware-software integration (microprocessors, computer architecture), while IT focuses more on software systems, web technologies, and data management.</p>
      
      <h2>Placement Parity</h2>
      <p>When it comes to placements, the distinction is practically non-existent. Over 95% of tech companies that visit DTU open their roles equally to COE, IT, and Software Engineering (SE) students. The average package differences are statistically insignificant and depend entirely on individual student skills.</p>

      <h2>Which One Should You Choose?</h2>
      <p>If you have a strong preference for understanding the complete computing stack down to the hardware, COE might be more fulfilling. If you want to focus purely on software applications and IT infrastructure, IT is an excellent choice. Ultimately, your personal projects, DSA skills, and internships matter far more than the specific tag of COE vs IT.</p>
    `,
    date: 'September 10, 2025',
    author: 'Rankify DTU Team',
    readTime: '5 min read',
    category: 'Analysis'
  }
];

export function getBlogPosts(): BlogPost[] {
  return mockPosts;
}

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return mockPosts.find((post) => post.slug === slug);
}
