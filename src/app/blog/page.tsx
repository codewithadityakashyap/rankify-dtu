import { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Calendar, Clock, User } from 'lucide-react';
import { getBlogPosts } from '@/lib/blog';

export const metadata: Metadata = {
  title: 'Insights & Blog',
  description: 'Data-driven insights, placement analyses, and academic trends for DTU students.',
};

export default function BlogPage() {
  const posts = getBlogPosts();

  return (
    <main className="container mx-auto px-4 sm:px-6 py-16 max-w-5xl">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4">
          Insights Hub
        </h1>
        <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
          Deep dives into placement statistics, academic performance trends, and guides to help you navigate your journey at DTU.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="group h-full flex">
            <Card className="flex flex-col h-full hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/50 overflow-hidden w-full bg-card">
              <div className="aspect-video w-full bg-slate-100 dark:bg-slate-800 relative overflow-hidden">
                {/* Placeholder for Hero Image */}
                <div className="absolute inset-0 flex items-center justify-center text-slate-400 dark:text-slate-600 font-medium">
                  {post.category}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <CardHeader className="flex-none pb-4">
                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                  <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {post.date}</span>
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {post.readTime}</span>
                </div>
                <CardTitle className="text-xl group-hover:text-primary transition-colors line-clamp-2">
                  {post.title}
                </CardTitle>
                <CardDescription className="line-clamp-2 pt-2">
                  {post.excerpt}
                </CardDescription>
              </CardHeader>
              <CardContent className="mt-auto pt-0 flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-3 w-3 text-primary" />
                  </div>
                  <span className="font-medium">{post.author}</span>
                </div>
                <span className="text-primary font-medium flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Read <ArrowRight className="h-4 w-4" />
                </span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </main>
  );
}
