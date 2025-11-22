'use client'

import { useState, useEffect } from 'react'
import ExamResults from './ExamResults'

interface Question {
  id: string
  questionText: string
  optionA: string
  optionB: string
  optionC: string
  optionD: string | null
  correctAnswer: string
  explanation: string | null
}

interface ExamInterfaceProps {
  sectionId: string
  onBack: () => void
}

export default function ExamInterface({ sectionId, onBack }: ExamInterfaceProps) {
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [showResults, setShowResults] = useState(false)
  const [loading, setLoading] = useState(true)
  const [timeStarted, setTimeStarted] = useState<Date | null>(null)
  const [timeElapsed, setTimeElapsed] = useState(0)

  useEffect(() => {
    fetchQuestions()
    setTimeStarted(new Date())
  }, [sectionId])

  useEffect(() => {
    if (timeStarted && !showResults) {
      const interval = setInterval(() => {
        setTimeElapsed(Math.floor((new Date().getTime() - timeStarted.getTime()) / 1000))
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [timeStarted, showResults])

  const fetchQuestions = async () => {
    try {
      const res = await fetch(`/api/questions?sectionId=${sectionId}&limit=50`)
      const data = await res.json()
      
      // Shuffle questions and take first 16 (or available)
      const shuffled = data.questions.sort(() => Math.random() - 0.5)
      const selected = shuffled.slice(0, Math.min(16, shuffled.length))
      
      setQuestions(selected)
    } catch (error) {
      console.error('Error fetching questions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAnswerSelect = (answer: string) => {
    setAnswers({
      ...answers,
      [questions[currentIndex].id]: answer,
    })
  }

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const handleSubmit = () => {
    if (window.confirm('Are you sure you want to submit? You can review your answers after submission.')) {
      setShowResults(true)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-aviation-blue mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading questions...</p>
        </div>
      </div>
    )
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-md max-w-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No Questions Available</h2>
          <p className="text-gray-600 mb-6">
            This section doesn&apos;t have any questions yet. Please check back later or contact the administrator.
          </p>
          <button
            onClick={onBack}
            className="bg-aviation-blue text-white px-6 py-2 rounded-md hover:bg-aviation-navy transition-colors"
          >
            Back to Sections
          </button>
        </div>
      </div>
    )
  }

  if (showResults) {
    return (
      <ExamResults
        questions={questions}
        answers={answers}
        timeElapsed={timeElapsed}
        onRetake={onBack}
      />
    )
  }

  const currentQuestion = questions[currentIndex]
  const currentAnswer = answers[currentQuestion.id]
  const answeredCount = Object.keys(answers).length
  const progress = ((currentIndex + 1) / questions.length) * 100

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-aviation-blue">Mock Exam</h1>
              <p className="text-sm text-gray-600">
                Question {currentIndex + 1} of {questions.length}
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">Time: {formatTime(timeElapsed)}</div>
              <div className="text-sm text-gray-600">
                Answered: {answeredCount}/{questions.length}
              </div>
            </div>
          </div>
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-aviation-blue h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
          {/* Question */}
          <div className="mb-8">
            <div className="flex items-start mb-4">
              <span className="bg-aviation-blue text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3 flex-shrink-0">
                {currentIndex + 1}
              </span>
              <h2 className="text-xl font-semibold text-gray-900 flex-1">
                {currentQuestion.questionText}
              </h2>
            </div>
          </div>

          {/* Options */}
          <div className="space-y-3 mb-8">
            {['A', 'B', 'C', 'D'].map((option) => {
              const optionText = currentQuestion[`option${option}` as keyof Question] as string
              if (!optionText) return null

              const isSelected = currentAnswer === option
              const optionKey = `option${option}` as keyof Question

              return (
                <button
                  key={option}
                  onClick={() => handleAnswerSelect(option)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    isSelected
                      ? 'border-aviation-blue bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center">
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-3 flex-shrink-0 ${
                        isSelected
                          ? 'border-aviation-blue bg-aviation-blue'
                          : 'border-gray-300'
                      }`}
                    >
                      {isSelected && (
                        <svg
                          className="w-4 h-4 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </div>
                    <span className="font-medium text-gray-700 mr-2">{option}.</span>
                    <span className="text-gray-900">{optionText}</span>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <button
              onClick={onBack}
              className="text-gray-600 hover:text-gray-900 font-medium"
            >
              ← Back to Sections
            </button>
            <div className="flex gap-4">
              <button
                onClick={handlePrevious}
                disabled={currentIndex === 0}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              {currentIndex < questions.length - 1 ? (
                <button
                  onClick={handleNext}
                  className="px-6 py-2 bg-aviation-blue text-white rounded-md hover:bg-aviation-navy transition-colors"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  Submit Exam
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Question Navigation Dots */}
        <div className="mt-6 flex flex-wrap gap-2 justify-center">
          {questions.map((q, index) => {
            const isAnswered = answers[q.id]
            const isCurrent = index === currentIndex
            return (
              <button
                key={q.id}
                onClick={() => setCurrentIndex(index)}
                className={`w-10 h-10 rounded-full border-2 transition-all ${
                  isCurrent
                    ? 'border-aviation-blue bg-aviation-blue text-white'
                    : isAnswered
                    ? 'border-green-500 bg-green-100 text-green-700'
                    : 'border-gray-300 bg-white text-gray-600 hover:border-gray-400'
                }`}
                title={`Question ${index + 1}${isAnswered ? ' (Answered)' : ''}`}
              >
                {index + 1}
              </button>
            )
          })}
        </div>
      </main>
    </div>
  )
}

