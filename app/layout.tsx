import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Civil Aviation Mock Exam - PPL, CPL, ATPL Preparation | Practice Tests',
  description: 'Comprehensive mock exam app for Civil Aviation pilots. Practice PPL, CPL, and ATPL exams with 8 sections: Air Law, Meteorology, Principles of Flight, Aircraft General, Human Performance, Operational Procedures, Navigation, and Communication. Free practice tests with detailed explanations.',
  keywords: 'civil aviation mock exam, PPL exam, CPL exam, ATPL exam, pilot exam preparation, aviation test practice, air law, meteorology, navigation, flight principles, pilot license exam',
  authors: [{ name: 'Civil Aviation Mock Exam' }],
  openGraph: {
    title: 'Civil Aviation Mock Exam - Professional Pilot Exam Preparation',
    description: 'Master your pilot exams with comprehensive mock tests covering all 8 essential sections. Practice with real exam-style questions and detailed explanations.',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Civil Aviation Mock Exam",
    "applicationCategory": "EducationalApplication",
    "operatingSystem": "Android",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "description": "Comprehensive mock exam preparation app for PPL, CPL, and ATPL pilots",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "150"
    }
  }

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#1e40af" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}

