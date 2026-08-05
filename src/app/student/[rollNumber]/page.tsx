import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import resultsData from '../../../../src/data/results.json';
import transcriptsData from '../../../../src/data/transcripts.json';
import { Award, TrendingUp, BookOpen, ChevronLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { BackButton } from '@/components/BackButton';
import { CGPAPredictor } from '@/components/dashboard/CGPAPredictor';
import { PlacementPredictor } from '@/components/dashboard/PlacementPredictor';
import placementData from '../../../../src/data/placement_data.json';

// Using JSON-LD structured data
export async function generateMetadata({ params }: { params: { rollNumber: string } }): Promise<Metadata> {
  const { rollNumber } = await params;
  const decodedRoll = decodeURIComponent(rollNumber);
  const student = resultsData.find((s: any) => s.rollNumber === decodedRoll);

  if (!student) {
    return { title: 'Student Not Found' };
  }

  const title = `${student.name} - DTU Result & Placement Analytics`;
  const description = `View the academic profile, CGPA (${student.cgpa.toFixed(3)}), branch rank (#${student.branchRank}), and detailed transcript for ${student.name} (${student.rollNumber}) at Delhi Technological University.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'profile',
      url: `https://rankifydtu.com/student/${encodeURIComponent(decodedRoll)}`,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    }
  };
}

export default async function StudentProfilePage({ params }: { params: { rollNumber: string } }) {
  const { rollNumber } = await params;
  const decodedRoll = decodeURIComponent(rollNumber);
  const student = resultsData.find((s: any) => s.rollNumber === decodedRoll);

  if (!student) {
    notFound();
  }

  let graduationBatch = 'Unknown Batch';
  let isLateralEntry = false;
  
  const rNo = student.rollNumber.toUpperCase();
  if (rNo.startsWith('23/') || rNo.startsWith('2K23/')) {
    graduationBatch = 'Class of 2027';
  } else if (rNo.startsWith('24/') || rNo.startsWith('2K24/')) {
    graduationBatch = 'Class of 2027';
    isLateralEntry = true;
  } else if (rNo.startsWith('22/') || rNo.startsWith('2K22/')) {
    graduationBatch = 'Class of 2026';
  } else if (rNo.startsWith('21/') || rNo.startsWith('2K21/')) {
    graduationBatch = 'Class of 2025';
  }

  // Find transcript
  const transcript = (transcriptsData as any)[decodedRoll];

  // Transform data for charting on client side or simply render server side
  const chartData = [
    { name: 'Sem 1', sgpa: student.sgpa.sem1 || null },
    { name: 'Sem 2', sgpa: student.sgpa.sem2 || null },
    { name: 'Sem 3', sgpa: student.sgpa.sem3 || null },
    { name: 'Sem 4', sgpa: student.sgpa.sem4 || null },
    { name: 'Sem 5', sgpa: student.sgpa.sem5 || null },
    { name: 'Sem 6', sgpa: student.sgpa.sem6 || null },
  ].filter(d => d.sgpa !== null);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    mainEntity: {
      '@type': 'Person',
      name: student.name,
      identifier: student.rollNumber,
      affiliation: {
        '@type': 'EducationalOrganization',
        name: 'Delhi Technological University'
      },
      hasCredential: {
        '@type': 'EducationalOccupationalCredential',
        credentialCategory: 'degree',
        educationalLevel: 'Bachelor of Technology',
        recognizingAuthority: {
          '@type': 'EducationalOrganization',
          name: 'Delhi Technological University'
        }
      }
    }
  };

  return (
    <div className="container mx-auto px-2 sm:px-4 py-6 sm:py-8 max-w-4xl min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <BackButton />
      
      <div className="bg-card rounded-2xl shadow-sm border p-3 sm:p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold font-sans text-foreground tracking-tight">{student.name}</h1>
            <div className="flex flex-wrap items-center gap-3 mt-3">
              <Badge variant="outline" className="font-mono text-sm bg-muted/50">{student.rollNumber}</Badge>
              <span className="text-muted-foreground text-sm font-medium">{student.branch} Core</span>
              <span className="text-muted-foreground text-sm font-medium border-l pl-3 ml-1">{graduationBatch}</span>
              {isLateralEntry && (
                <Badge variant="secondary" className="bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20 text-xs ml-1">
                  Lateral Entry
                </Badge>
              )}
            </div>
          </div>
          <div className="text-left md:text-right bg-primary/5 p-4 rounded-xl border border-primary/10">
            <div className="text-4xl md:text-5xl font-bold text-primary">{student.cgpa.toFixed(3)}</div>
            <div className="text-xs text-muted-foreground uppercase tracking-widest font-bold mt-1">Aggregate CGPA</div>
          </div>
        </div>

        <div className="py-8 space-y-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-muted/50 to-muted/10 rounded-xl p-4 text-center border shadow-sm">
              <div className="text-3xl font-semibold mb-1">#{student.overallRank}</div>
              <div className="text-xs uppercase text-muted-foreground font-bold tracking-widest flex items-center justify-center gap-1.5">
                <Award className="w-4 h-4" /> Overall Rank
              </div>
            </div>
            <div className="bg-gradient-to-br from-muted/50 to-muted/10 rounded-xl p-4 text-center border shadow-sm">
              <div className="text-3xl font-semibold mb-1">#{student.branchRank}</div>
              <div className="text-xs uppercase text-muted-foreground font-bold tracking-widest flex items-center justify-center gap-1.5">
                <Award className="w-4 h-4 text-accent" /> Branch Rank
              </div>
            </div>
            <div className="bg-gradient-to-br from-muted/50 to-muted/10 rounded-xl p-4 text-center border shadow-sm">
              <div className="text-3xl font-semibold mb-1">#{student.semesterRank || 'N/A'}</div>
              <div className="text-xs uppercase text-muted-foreground font-bold tracking-widest flex items-center justify-center gap-1.5">
                <Award className="w-4 h-4 text-purple-500" /> Sem Rank
              </div>
            </div>
            <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 rounded-xl p-4 text-center border border-emerald-500/20 shadow-sm">
              <div className="text-3xl font-semibold mb-1 text-emerald-600 dark:text-emerald-400">
                {student.improvement > 0 ? '+' : ''}{student.improvement?.toFixed(2) || '0.00'}
              </div>
              <div className="text-xs uppercase text-emerald-600/80 dark:text-emerald-400/80 font-bold tracking-widest flex items-center justify-center gap-1.5">
                <TrendingUp className="w-4 h-4" /> Improvement
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-primary inline-block shadow-[0_0_8px_rgba(37,99,235,0.6)]"></span>
              Semester Summary
            </h4>
            <div className="flex flex-wrap gap-2 md:gap-3">
              {chartData.map((d) => (
                <Badge key={d.name} variant="secondary" className="px-4 py-2 font-mono text-sm shadow-sm border border-muted-foreground/10">
                  {d.name}: {d.sgpa.toFixed(2)}
                </Badge>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <CGPAPredictor student={student} />
          </div>

          <div className="pt-2">
            <PlacementPredictor student={student} placementData={placementData} />
          </div>

          <div className="pt-4">
            <h4 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2 border-b pb-4">
              <BookOpen className="w-5 h-5 text-primary" />
              Detailed Transcript
            </h4>
            
            {transcript && transcript.semesters ? (
              <div className="space-y-6">
                {Object.keys(transcript.semesters).map((semKey) => {
                  const semData = transcript.semesters[semKey];
                  if (!semData || !semData.subjects) return null;
                  
                  return (
                    <div key={semKey} className="border bg-muted/10 rounded-xl overflow-hidden shadow-sm">
                      <div className="bg-muted/50 px-5 py-4 border-b flex items-center justify-between">
                        <h3 className="font-bold text-lg">Semester {semKey.replace('sem', '')}</h3>
                        <Badge variant="outline" className="font-mono bg-background text-sm px-3 py-1 shadow-sm">
                          SGPA: {semData.sgpa.toFixed(3)}
                        </Badge>
                      </div>
                      <div className="p-0 overflow-x-auto">
                        <table className="w-full text-sm text-left">
                          <thead className="bg-background text-muted-foreground font-semibold border-b">
                            <tr>
                              <th className="px-1 sm:px-5 py-2 sm:py-3 whitespace-nowrap text-[10px] sm:text-sm">Subject Code</th>
                              <th className="px-1 sm:px-5 py-2 sm:py-3 w-full text-xs sm:text-sm">Subject Name</th>
                              <th className="px-1 sm:px-5 py-2 sm:py-3 text-center whitespace-nowrap text-[10px] sm:text-sm">Credits</th>
                              <th className="px-1 sm:px-5 py-2 sm:py-3 text-center whitespace-nowrap text-[10px] sm:text-sm">Grade</th>
                            </tr>
                          </thead>
                          <tbody className="bg-card">
                            {semData.subjects.map((sub: any, idx: number) => (
                              <tr key={idx} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                                <td className="px-1 sm:px-5 py-2 sm:py-3 font-mono text-[9px] sm:text-xs text-muted-foreground whitespace-nowrap">{sub.code}</td>
                                <td className="px-1 sm:px-5 py-2 sm:py-3 text-[10px] sm:text-sm font-medium min-w-[80px] sm:min-w-[140px] max-w-[140px] sm:max-w-none break-words whitespace-normal leading-snug">{sub.name}</td>
                                <td className="px-1 sm:px-5 py-2 sm:py-3 text-center text-[10px] sm:text-sm text-muted-foreground">{sub.credits}</td>
                                <td className="px-1 sm:px-5 py-2 sm:py-3 text-center text-[10px] sm:text-sm font-bold text-primary">{sub.grade}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground py-12 text-center bg-muted/10 rounded-xl border border-dashed">
                Detailed transcript not available for this student yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
