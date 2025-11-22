'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import ExamInterface from '@/components/exam/ExamInterface'
import SectionSelector from '@/components/exam/SectionSelector'

interface Section {
  sectionId: string
  name: string
  description: string
  icon: string
  _count: {
    questions: number
  }
}

function ExamPageContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [sections, setSections] = useState<Section[]>([])
  const [selectedSection, setSelectedSection] = useState<string | null>(
    searchParams.get('section') || null
  )
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSections()
  }, [])

  const fetchSections = async () => {
    try {
      const res = await fetch('/api/sections')
      const data = await res.json()
      setSections(data.sections || [])
    } catch (error) {
      console.error('Error fetching sections:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSectionSelect = (sectionId: string) => {
    setSelectedSection(sectionId)
    router.push(`/exam?section=${sectionId}`)
  }

  const handleBackToSelection = () => {
    setSelectedSection(null)
    router.push('/exam')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-aviation-blue mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading exam sections...</p>
        </div>
      </div>
    )
  }

  if (selectedSection) {
    return (
      <ExamInterface
        sectionId={selectedSection}
        onBack={handleBackToSelection}
      />
    )
  }

  return (
    <SectionSelector
      sections={sections}
      onSelectSection={handleSectionSelect}
    />
  )
}

export default function ExamPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-aviation-blue mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading exam...</p>
          </div>
        </div>
      }
    >
      <ExamPageContent />
    </Suspense>
  )
}

