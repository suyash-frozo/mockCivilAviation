'use client'

import { useState } from 'react'
import AIQuestionReview from './AIQuestionReview'

interface PDFUploadProps {
  onUploadSuccess?: () => void
  sections?: Array<{ sectionId: string; name: string }>
}

export default function PDFUpload({ onUploadSuccess, sections = [] }: PDFUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')
  const [useAI, setUseAI] = useState(true)
  const [reviewQuestions, setReviewQuestions] = useState<any[]>([])
  const [showReview, setShowReview] = useState(false)
  const [sourceName, setSourceName] = useState('')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setResult(null)
      setError('')
    }
  }

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a PDF file')
      return
    }

    setUploading(true)
    setError('')
    setResult(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const endpoint = useAI ? '/api/upload-pdf-ai' : '/api/upload-pdf'
      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed')
      }

      if (useAI && data.questions) {
        // AI extraction - show review interface
        setReviewQuestions(data.questions)
        setSourceName(file.name)
        setShowReview(true)
        setFile(null)
        
        // Reset file input
        const fileInput = document.getElementById('pdf-file') as HTMLInputElement
        if (fileInput) fileInput.value = ''
      } else {
        // Regular extraction - auto-saved
        setResult(data)
        setFile(null)
        
        // Reset file input
        const fileInput = document.getElementById('pdf-file') as HTMLInputElement
        if (fileInput) fileInput.value = ''

        if (onUploadSuccess) {
          onUploadSuccess()
        }
      }
    } catch (err: any) {
      setError(err.message || 'Failed to upload PDF')
    } finally {
      setUploading(false)
    }
  }

  const handleSaveReviewed = async (questions: any[]) => {
    setUploading(true)
    setError('')
    
    try {
      const response = await fetch('/api/questions/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questions, source: sourceName }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save questions')
      }

      setResult(data)
      setShowReview(false)
      setReviewQuestions([])

      if (onUploadSuccess) {
        onUploadSuccess()
      }
    } catch (err: any) {
      setError(err.message || 'Failed to save questions')
    } finally {
      setUploading(false)
    }
  }

  const handleCancelReview = () => {
    setShowReview(false)
    setReviewQuestions([])
    setSourceName('')
  }

  // If showing review, render review component
  if (showReview) {
    return (
      <AIQuestionReview
        questions={reviewQuestions}
        source={sourceName}
        sections={sections}
        onSave={handleSaveReviewed}
        onCancel={handleCancelReview}
      />
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Upload PDF</h2>
        <p className="text-sm text-gray-600">
          Upload a PDF file containing mock exam questions. The system will automatically
          extract questions, classify them by section, and store them in the database.
        </p>
      </div>

      {/* AI Toggle */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-semibold text-blue-900 mb-1">
              🤖 AI-Powered Extraction {useAI && <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded ml-2">RECOMMENDED</span>}
            </div>
            <p className="text-sm text-blue-700">
              {useAI
                ? 'Uses ChatGPT to intelligently extract questions with high accuracy. Questions will be reviewed before saving.'
                : 'Uses pattern matching to extract questions. Questions are auto-saved (less accurate).'}
            </p>
          </div>
          <button
            onClick={() => setUseAI(!useAI)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              useAI ? 'bg-blue-600' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                useAI ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
        <div className="text-center">
          <input
            id="pdf-file"
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="hidden"
          />
          <label
            htmlFor="pdf-file"
            className="cursor-pointer inline-flex items-center px-4 py-2 bg-aviation-blue text-white rounded-md hover:bg-aviation-navy transition-colors"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            Select PDF File
          </label>
          {file && (
            <div className="mt-4">
              <p className="text-sm text-gray-700">
                Selected: <span className="font-medium">{file.name}</span> (
                {(file.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            </div>
          )}
        </div>
      </div>

      {file && (
        <button
          onClick={handleUpload}
          disabled={uploading}
          className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {uploading ? 'Processing PDF...' : 'Upload and Process PDF'}
        </button>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <strong>Error:</strong> {error}
        </div>
      )}

      {result && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded">
          <div className="font-semibold mb-2">Upload Successful!</div>
          <div className="text-sm space-y-1">
            <div>Questions processed: {result.details?.savedQuestions || 0}</div>
            {result.details?.errors?.length > 0 && (
              <div className="mt-2">
                <div className="font-medium">Errors ({result.details.errors.length}):</div>
                <ul className="list-disc list-inside text-xs mt-1">
                  {result.details.errors.slice(0, 5).map((err: string, idx: number) => (
                    <li key={idx}>{err}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

