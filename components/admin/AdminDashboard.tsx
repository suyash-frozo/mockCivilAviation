'use client'

import { useState, useEffect } from 'react'
import PDFUpload from './PDFUpload'
import QuestionManager from './QuestionManager'
import QuestionForm from './QuestionForm'
import StatsPanel from './StatsPanel'

interface Section {
  sectionId: string
  name: string
  _count: {
    questions: number
  }
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'upload' | 'add' | 'manage'>('upload')
  const [sections, setSections] = useState<Section[]>([])
  const [selectedSection, setSelectedSection] = useState<string>('')

  useEffect(() => {
    fetchSections()
  }, [])

  const fetchSections = async () => {
    try {
      const res = await fetch('/api/sections')
      const data = await res.json()
      setSections(data.sections || [])
      if (data.sections?.length > 0 && !selectedSection) {
        setSelectedSection(data.sections[0].sectionId)
      }
    } catch (error) {
      console.error('Error fetching sections:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-aviation-blue">Admin Console</h1>
              <p className="text-sm text-gray-600">Manage questions and upload PDFs</p>
            </div>
            <a
              href="/"
              className="text-aviation-blue hover:text-aviation-navy text-sm font-medium"
            >
              ← Back to Website
            </a>
          </div>
        </div>
      </header>

      {/* Stats Panel */}
      <StatsPanel sections={sections} />

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('upload')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'upload'
                  ? 'border-aviation-blue text-aviation-blue'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              📄 Upload PDF
            </button>
            <button
              onClick={() => setActiveTab('add')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'add'
                  ? 'border-aviation-blue text-aviation-blue'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              ➕ Add Question
            </button>
            <button
              onClick={() => setActiveTab('manage')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'manage'
                  ? 'border-aviation-blue text-aviation-blue'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              📋 Manage Questions
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          {activeTab === 'upload' && (
            <PDFUpload onUploadSuccess={fetchSections} />
          )}
          {activeTab === 'add' && (
            <QuestionForm
              sections={sections}
              selectedSection={selectedSection}
              onSectionChange={setSelectedSection}
              onSuccess={fetchSections}
            />
          )}
          {activeTab === 'manage' && (
            <QuestionManager
              sections={sections}
              selectedSection={selectedSection}
              onSectionChange={setSelectedSection}
            />
          )}
        </div>
      </div>
    </div>
  )
}

