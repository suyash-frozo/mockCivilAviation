'use client'

import { useState } from 'react'

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

interface ExamResultsProps {
  questions: Question[]
  answers: Record<string, string>
  timeElapsed: number
  onRetake: () => void
}

export default function ExamResults({
  questions,
  answers,
  timeElapsed,
  onRetake,
}: ExamResultsProps) {
  const [showDetails, setShowDetails] = useState(false)
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null)

  const correctCount = questions.filter(
    (q) => answers[q.id] === q.correctAnswer
  ).length
  const totalQuestions = questions.length
  const score = Math.round((correctCount / totalQuestions) * 100)
  const percentage = ((correctCount / totalQuestions) * 100).toFixed(1)

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getScoreColor = () => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBgColor = () => {
    if (score >= 80) return 'bg-green-50 border-green-200'
    if (score >= 60) return 'bg-yellow-50 border-yellow-200'
    return 'bg-red-50 border-red-200'
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Results Summary */}
        <div className={`bg-white rounded-lg shadow-lg p-8 mb-6 border-2 ${getScoreBgColor()}`}>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Exam Results</h1>
            <div className={`text-6xl font-bold mb-4 ${getScoreColor()}`}>
              {score}%
            </div>
            <div className="text-lg text-gray-600 mb-6">
              You scored {correctCount} out of {totalQuestions} questions correctly
            </div>
            <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-aviation-blue">{correctCount}</div>
                <div className="text-sm text-gray-600">Correct</div>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-red-600">
                  {totalQuestions - correctCount}
                </div>
                <div className="text-sm text-gray-600">Incorrect</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-gray-700">{formatTime(timeElapsed)}</div>
                <div className="text-sm text-gray-600">Time</div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center mb-6">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="px-6 py-3 bg-aviation-blue text-white rounded-md hover:bg-aviation-navy transition-colors"
          >
            {showDetails ? 'Hide' : 'Show'} Detailed Results
          </button>
          <button
            onClick={onRetake}
            className="px-6 py-3 border-2 border-aviation-blue text-aviation-blue rounded-md hover:bg-aviation-blue hover:text-white transition-colors"
          >
            Retake Exam
          </button>
        </div>

        {/* Detailed Results */}
        {showDetails && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Question Review
            </h2>
            <div className="space-y-6">
              {questions.map((question, index) => {
                const userAnswer = answers[question.id]
                const isCorrect = userAnswer === question.correctAnswer
                const isExpanded = expandedQuestion === question.id

                return (
                  <div
                    key={question.id}
                    className={`border-2 rounded-lg p-4 ${
                      isCorrect
                        ? 'border-green-200 bg-green-50'
                        : 'border-red-200 bg-red-50'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start">
                        <span
                          className={`w-8 h-8 rounded-full flex items-center justify-center font-bold mr-3 flex-shrink-0 ${
                            isCorrect
                              ? 'bg-green-500 text-white'
                              : 'bg-red-500 text-white'
                          }`}
                        >
                          {index + 1}
                        </span>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">
                            {question.questionText}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() =>
                          setExpandedQuestion(
                            isExpanded ? null : question.id
                          )
                        }
                        className="text-aviation-blue hover:text-aviation-navy ml-4"
                      >
                        {isExpanded ? 'Hide' : 'Show'} Details
                      </button>
                    </div>

                    {isExpanded && (
                      <div className="ml-11 space-y-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {['A', 'B', 'C', 'D'].map((option) => {
                            const optionText = question[
                              `option${option}` as keyof Question
                            ] as string
                            if (!optionText) return null

                            const isCorrectOption = option === question.correctAnswer
                            const isUserAnswer = option === userAnswer

                            return (
                              <div
                                key={option}
                                className={`p-3 rounded border ${
                                  isCorrectOption
                                    ? 'bg-green-100 border-green-300'
                                    : isUserAnswer && !isCorrect
                                    ? 'bg-red-100 border-red-300'
                                    : 'bg-gray-50 border-gray-200'
                                }`}
                              >
                                <div className="flex items-center">
                                  <span className="font-medium mr-2">{option}.</span>
                                  <span>{optionText}</span>
                                  {isCorrectOption && (
                                    <span className="ml-2 text-green-600 font-bold">
                                      ✓ Correct
                                    </span>
                                  )}
                                  {isUserAnswer && !isCorrectOption && (
                                    <span className="ml-2 text-red-600 font-bold">
                                      ✗ Your Answer
                                    </span>
                                  )}
                                </div>
                              </div>
                            )
                          })}
                        </div>
                        {question.explanation && (
                          <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded">
                            <p className="text-sm font-medium text-blue-900 mb-1">
                              Explanation:
                            </p>
                            <p className="text-sm text-blue-800">
                              {question.explanation}
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="mt-3 ml-11 text-sm">
                      <span className="font-medium">
                        Your Answer: {userAnswer || 'Not answered'}
                      </span>
                      {!isCorrect && (
                        <span className="ml-4 text-red-600">
                          Correct Answer: {question.correctAnswer}
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

