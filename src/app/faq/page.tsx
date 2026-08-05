import { Metadata } from 'next';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const metadata: Metadata = {
  title: 'Frequently Asked Questions',
  description: 'Answers to common questions about Rankify DTU, data sources, and how to use the platform.',
};

export default function FAQPage() {
  const faqs = [
    {
      question: "Where does Rankify DTU get its data?",
      answer: "Our data is compiled from official university result PDFs and placement lists that are made publicly available or distributed among the student body. We parse these documents and aggregate the data into a searchable, sortable format."
    },
    {
      question: "How often is the data updated?",
      answer: "We strive to update our databases as soon as new semester results are officially declared or major placement seasons conclude. However, because data extraction is sometimes a manual process, there might be a slight delay between official release and our updates."
    },
    {
      question: "I found an error in my CGPA or placement details. How can I fix it?",
      answer: "Optical Character Recognition (OCR) errors can occasionally happen when parsing complex PDFs. If you spot an inaccuracy in your data, please reach out to us via the Contact page with your correct details, and we will update it immediately."
    },
    {
      question: "Is Rankify DTU affiliated with the university administration?",
      answer: "No. Rankify DTU is an independent, student-led project built by students, for students. It is not an official university platform."
    },
    {
      question: "Can I remove my name from the search results?",
      answer: "The data we display is part of the public domain within the university context. However, if you have strong privacy concerns, please contact us and we can review requests on a case-by-case basis."
    },
    {
      question: "What is planned for future updates?",
      answer: "In upcoming phases, we plan to introduce features like Rank Prediction, Placement Eligibility Checkers, User Accounts, and deeper analytics for individual student performance."
    }
  ];

  return (
    <main className="container mx-auto px-4 sm:px-6 py-16 max-w-3xl">
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-slate-500 dark:text-slate-400">
            Got questions? We have answers.
          </p>
        </div>

        <div className="mt-12">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left font-semibold text-lg">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-slate-600 dark:text-slate-300 text-base leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
      
      {/* FAQ Schema for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faqs.map(faq => ({
              "@type": "Question",
              "name": faq.question,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
              }
            }))
          })
        }}
      />
    </main>
  );
}
