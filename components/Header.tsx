'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-aviation-blue rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">✈</span>
            </div>
            <span className="text-xl font-bold text-aviation-blue">Aviation Mock Exam</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-6">
            <Link href="#sections" className="text-gray-700 hover:text-aviation-blue transition">Sections</Link>
            <Link href="#ppl-info" className="text-gray-700 hover:text-aviation-blue transition">About PPL</Link>
            <Link href="#features" className="text-gray-700 hover:text-aviation-blue transition">Features</Link>
            <a 
              href="https://play.google.com/store/apps/details?id=com.suyash.mockcivilaviationexam" 
              target="_blank"
              rel="noopener noreferrer"
              className="bg-aviation-blue text-white px-6 py-2 rounded-lg hover:bg-aviation-navy transition"
            >
              Download App
            </a>
          </div>

          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden mt-4 space-y-2">
            <Link href="#sections" className="block py-2 text-gray-700">Sections</Link>
            <Link href="#ppl-info" className="block py-2 text-gray-700">About PPL</Link>
            <Link href="#features" className="block py-2 text-gray-700">Features</Link>
            <a 
              href="https://play.google.com/store/apps/details?id=com.suyash.mockcivilaviationexam" 
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-aviation-blue text-white px-6 py-2 rounded-lg text-center"
            >
              Download App
            </a>
          </div>
        )}
      </nav>
    </header>
  )
}

