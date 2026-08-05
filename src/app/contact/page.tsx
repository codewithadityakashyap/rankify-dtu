import { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Github, Linkedin, Send } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with the Rankify DTU team for feedback, data corrections, or partnership inquiries.',
};

export default function ContactPage() {
  return (
    <main className="container mx-auto px-4 sm:px-6 py-16 max-w-4xl">
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4">
            Contact Us
          </h1>
          <p className="text-xl text-slate-500 dark:text-slate-400">
            Have a question, spotted a data error, or want to contribute? We&apos;d love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-4">Get in Touch</h2>
              <p className="text-slate-600 dark:text-slate-300 mb-6">
                Whether you&apos;re a student looking for help, or a recruiter interested in our data, feel free to drop us a message. We typically respond within 24-48 hours.
              </p>
            </div>
            
            <div className="space-y-4">
              <a href="mailto:contact@rankifydtu.com" className="flex items-center gap-3 text-slate-600 dark:text-slate-300 hover:text-primary transition-colors">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Mail className="h-5 w-5" />
                </div>
                <span>contact@rankifydtu.com</span>
              </a>
              <a href="https://github.com/adityakashyaptxt" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-slate-600 dark:text-slate-300 hover:text-primary transition-colors">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Github className="h-5 w-5" />
                </div>
                <span>GitHub</span>
              </a>
              <a href="https://linkedin.com/in/adityakashyaptxt" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-slate-600 dark:text-slate-300 hover:text-primary transition-colors">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Linkedin className="h-5 w-5" />
                </div>
                <span>LinkedIn</span>
              </a>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-card border shadow-sm rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-6">Send a Message</h2>
            <form className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">Name</label>
                <Input id="name" placeholder="John Doe" className="bg-background" />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">Email</label>
                <Input id="email" type="email" placeholder="john@example.com" className="bg-background" />
              </div>
              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-medium">Subject</label>
                <Input id="subject" placeholder="How can we help?" className="bg-background" />
              </div>
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium">Message</label>
                <Textarea id="message" placeholder="Your message here..." className="min-h-[120px] bg-background" />
              </div>
              <Button type="button" className="w-full gap-2">
                <Send className="h-4 w-4" />
                Send Message
              </Button>
              <p className="text-xs text-muted-foreground text-center mt-4">
                Note: This form is currently in demo mode. Please use email for direct communication.
              </p>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
