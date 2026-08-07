import { notFound } from 'next/navigation';
import { getBlogPostBySlug, getBlogPosts } from '@/lib/blog';
import { Metadata } from 'next';
import { Calendar, Clock, User, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

// Generate static params for all blog posts
export async function generateStaticParams() {
  const posts = getBlogPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

// Generate dynamic metadata for SEO
export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const post = getBlogPostBySlug(params.slug);
  
  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
    }
  };
}

export default async function BlogPostPage(props: Props) {
  const params = await props.params;
  const post = getBlogPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  // Schema.org JSON-LD for the Article
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "description": post.excerpt,
    "author": {
      "@type": "Person",
      "name": post.author
    },
    "datePublished": new Date(post.date).toISOString(),
    "publisher": {
      "@type": "Organization",
      "name": "Rankify DTU",
      "logo": {
        "@type": "ImageObject",
        "url": "https://rankify-dtu.vercel.app/logo.png"
      }
    }
  };

  return (
    <main className="container mx-auto px-4 sm:px-6 py-16 max-w-3xl">
      <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8">
        <ArrowLeft className="h-4 w-4" />
        Back to Insights
      </Link>
      
      <article>
        <header className="mb-10">
          <div className="flex items-center gap-2 text-primary font-medium text-sm mb-4">
            {post.category}
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6 leading-tight">
            {post.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground border-y py-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-4 w-4 text-primary" />
              </div>
              <span className="font-medium text-slate-700 dark:text-slate-300">{post.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{post.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{post.readTime}</span>
            </div>
          </div>
        </header>

        {/* Placeholder for Hero Image */}
        <div className="w-full aspect-[21/9] bg-slate-100 dark:bg-slate-800 rounded-xl mb-12 flex items-center justify-center text-slate-400 dark:text-slate-500 font-medium">
          Hero Image Placeholder
        </div>

        <div 
          className="prose prose-slate dark:prose-invert prose-lg max-w-none prose-headings:font-bold prose-a:text-primary"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>

      {/* JSON-LD injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </main>
  );
}
