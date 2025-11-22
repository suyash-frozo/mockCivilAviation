'use client'

import { useState } from 'react'

interface ReviewQuestion {
  questionText: string
  optionA: string
  optionB: string
  optionC: string
  optionD?: string | null
  correctAnswer: string
  explanation?: string | null
  suggestedSection: string
  confidence: number
  selected?: boolean
  editedSection?: string
}

interface AIQuestionReviewProps {
  questions: ReviewQuestion[]
  source: string
  onSave: (questions: any[]) => void
  onCancel: () => void
  sections: Array<{ sectionId: string; name: string }>
}

export default function AIQuestionReview({
  questions: initialQuestions,
  source,
  onSave,
  onCancel,
  sections,
}: AIQuestionReviewProps) {
  const [questions, setQuestions] = useState<ReviewQuestion[]>(
    initialQuestions.map((q) => ({ ...q, selected: q.confidence >= 80, editedSection: q.suggestedSection }))
  )
  const [selectAll, setSelectAll] = useState(true)

  const handleSelectAll = () => {
    const newSelectAll = !selectAll
    setSelectAll(newSelectAll)
    setQuestions(questions.map((q) => ({ ...q, selected: newSelectAll })))
  }

  const handleToggleQuestion = (index: number) => {
    const updated = [...questions]
    updated[index].selected = !updated[index].selected
    setQuestions(updated)
    setSelectAll(updated.every((q) => q.selected))
  }

  const handleSectionChange = (index: number, sectionId: string) => {
    const updated = [...questions]
    updated[index].editedSection = sectionId
    setQuestions(updated)
  }

  const handleSaveSelected = () => {
    const selectedQuestions = questions
      .filter((q) => q.selected)
      .map((q) => ({
        sectionId: q.editedSection || q.suggestedSection,
        questionText: q.questionText,
        optionA: q.optionA,
        optionB: q.optionB,
        optionC: q.optionC,
        optionD: q.optionD,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        difficulty: 'medium',
      }))

    onSave(selectedQuestions)
  }

  const selectedCount = questions.filter((q) => q.selected).length
  const averageConfidence = Math.round(
    questions.reduce((sum, q) => sum + q.confidence, 0) / questions.length
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">
          AI Extracted Questions - Review Required
        </h3>
        <p className="text-sm text-blue-700">
          AI extracted <strong>{questions.length} questions</strong> from <strong>{source}</strong>
        </p>
        <p className="text-sm text-blue-600 mt-1">
          Average confidence: <strong>{averageConfidence}%</strong> • Selected: <strong>{selectedCount}</strong>
        </p>
      </div>

      {/* Controls */}
      <div className="flex justify-between items-center">
        <button
          onClick={handleSelectAll}
          className="text-sm text-aviation-blue hover:text-aviation-navy font-medium"
        >
          {selectAll ? '☑ Deselect All' : '☐ Select All'}
        </button>
        <div className="space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveSelected}
            disabled={selectedCount === 0}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save Selected ({selectedCount})
          </button>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-4 max-h-[600px] overflow-y-auto">
        {questions.map((question, index) => (
          <div
            key={index}
            className={`border rounded-lg p-4 ${
              question.selected ? 'border-green-500 bg-green-50' : 'border-gray-300 bg-white'
            }`}
          >
            {/* Question Header */}
            <div className="flex items-start gap-3 mb-3">
              <input
                type="checkbox"
                checked={question.selected}
                onChange={() => handleToggleQuestion(index)}
                className="mt-1 h-5 w-5 text-green-600 rounded"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-gray-500">Question {index + 1}</span>
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      question.confidence >= 90
                        ? 'bg-green-100 text-green-800'
                        : question.confidence >= 70
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    Confidence: {question.confidence}%
                  </span>
                </div>
                <p className="font-medium text-gray-900 mb-3">{question.questionText}</p>

                {/* Options */}
                <div className="space-y-1 mb-3">
                  <div className="flex items-start">
                    <span
                      className={`font-semibold mr-2 ${
                        question.correctAnswer === 'A' ? 'text-green-600' : 'text-gray-600'
                      }`}
                    >
                      A.
                    </span>
                    <span className="text-gray-700">{question.optionA}</span>
                  </div>
                  <div className="flex items-start">
                    <span
                      className={`font-semibold mr-2 ${
                        question.correctAnswer === 'B' ? 'text-green-600' : 'text-gray-600'
                      }`}
                    >
                      B.
                    </span>
                    <span className="text-gray-700">{question.optionB}</span>
                  </div>
                  <div className="flex items-start">
                    <span
                      className={`font-semibold mr-2 ${
                        question.correctAnswer === 'C' ? 'text-green-600' : 'text-gray-600'
                      }`}
                    >
                      C.
                    </span>
                    <span className="text-gray-700">{question.optionC}</span>
                  </div>
                  {question.optionD && (
                    <div className="flex items-start">
                      <span
                        className={`font-semibold mr-2 ${
                          question.correctAnswer === 'D' ? 'text-green-600' : 'text-gray-600'
                        }`}
                      >
                        D.
                      </span>
                      <span className="text-gray-700">{question.optionD}</span>
                    </div>
                  )}
                </div>

                {/* Correct Answer */}
                <div className="text-sm mb-3">
                  <span className="font-semibold text-green-700">Correct Answer: {question.correctAnswer}</span>
                  {question.explanation && (
                    <p className="text-gray-600 mt-1 italic">{question.explanation}</p>
                  )}
                </div>

                {/* Section Selector */}
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-700">Section:</label>
                  <select
                    value={question.editedSection || question.suggestedSection}
                    onChange={(e) => handleSectionChange(index, e.target.value)}
                    className="text-sm border border-gray-300 rounded px-2 py-1"
                  >
                    {sections.map((section) => (
                      <option key={section.sectionId} value={section.sectionId}>
                        {section.name}
                      </option>
                    ))}
                  </select>
                  {question.editedSection !== question.suggestedSection && (
                    <span className="text-xs text-orange-600">(Modified)</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="border-t pt-4 flex justify-end space-x-3">
        <button
          onClick={onCancel}
          className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={handleSaveSelected}
          disabled={selectedCount === 0}
          className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Save {selectedCount} Questions to Database
        </button>
      </div>
    </div>
  )
}

