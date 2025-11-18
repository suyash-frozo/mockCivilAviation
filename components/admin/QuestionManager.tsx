'use client'

import { useState, useEffect } from 'react'

interface Section {
  sectionId: string
  name: string
}

interface Question {
  id: string
  questionText: string
  optionA: string
  optionB: string
  optionC: string
  optionD: string | null
  correctAnswer: string
  explanation: string | null
  difficulty: string | null
  source: string | null
  section: {
    name: string
    sectionId: string
  }
}

interface QuestionManagerProps {
  sections: Section[]
  selectedSection: string
  onSectionChange: (sectionId: string) => void
}

export default function QuestionManager({
  sections,
  selectedSection,
  onSectionChange,
}: QuestionManagerProps) {
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Partial<Question>>({})
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  useEffect(() => {
    fetchQuestions()
  }, [selectedSection])

  const fetchQuestions = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/questions?sectionId=${selectedSection}&limit=100`)
      const data = await res.json()
      setQuestions(data.questions || [])
    } catch (error) {
      console.error('Error fetching questions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (question: Question) => {
    setEditingId(question.id)
    setEditForm({
      questionText: question.questionText,
      optionA: question.optionA,
      optionB: question.optionB,
      optionC: question.optionC,
      optionD: question.optionD,
      correctAnswer: question.correctAnswer,
      explanation: question.explanation,
      difficulty: question.difficulty,
    })
  }

  const handleSaveEdit = async (id: string) => {
    try {
      const res = await fetch(`/api/questions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      })

      if (!res.ok) {
        throw new Error('Failed to update question')
      }

      setEditingId(null)
      setEditForm({})
      fetchQuestions()
    } catch (error) {
      alert('Failed to update question')
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/questions/${id}`, {
        method: 'DELETE',
      })

      if (!res.ok) {
        throw new Error('Failed to delete question')
      }

      setDeleteConfirm(null)
      fetchQuestions()
    } catch (error) {
      alert('Failed to delete question')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Manage Questions</h2>
          <p className="text-sm text-gray-600">
            View, edit, and delete questions by section
          </p>
        </div>
        <select
          value={selectedSection}
          onChange={(e) => onSectionChange(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-aviation-blue focus:border-transparent"
        >
          {sections.map((section) => (
            <option key={section.sectionId} value={section.sectionId}>
              {section.name}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="text-center py-8 text-gray-500">Loading questions...</div>
      ) : questions.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No questions found in this section. Add questions using the "Add Question" tab.
        </div>
      ) : (
        <div className="space-y-4">
          {questions.map((question) => (
            <div
              key={question.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              {editingId === question.id ? (
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Question
                    </label>
                    <textarea
                      value={editForm.questionText || ''}
                      onChange={(e) =>
                        setEditForm({ ...editForm, questionText: e.target.value })
                      }
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">A</label>
                      <input
                        type="text"
                        value={editForm.optionA || ''}
                        onChange={(e) =>
                          setEditForm({ ...editForm, optionA: e.target.value })
                        }
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">B</label>
                      <input
                        type="text"
                        value={editForm.optionB || ''}
                        onChange={(e) =>
                          setEditForm({ ...editForm, optionB: e.target.value })
                        }
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">C</label>
                      <input
                        type="text"
                        value={editForm.optionC || ''}
                        onChange={(e) =>
                          setEditForm({ ...editForm, optionC: e.target.value })
                        }
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">D</label>
                      <input
                        type="text"
                        value={editForm.optionD || ''}
                        onChange={(e) =>
                          setEditForm({ ...editForm, optionD: e.target.value })
                        }
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <select
                      value={editForm.correctAnswer || 'A'}
                      onChange={(e) =>
                        setEditForm({ ...editForm, correctAnswer: e.target.value })
                      }
                      className="px-3 py-1 border border-gray-300 rounded text-sm"
                    >
                      <option value="A">A</option>
                      <option value="B">B</option>
                      <option value="C">C</option>
                      <option value="D">D</option>
                    </select>
                    <button
                      onClick={() => handleSaveEdit(question.id)}
                      className="px-4 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditingId(null)
                        setEditForm({})
                      }}
                      className="px-4 py-1 bg-gray-400 text-white rounded text-sm hover:bg-gray-500"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <p className="text-gray-900 font-medium flex-1">{question.questionText}</p>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handleEdit(question)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(question.id)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className={question.correctAnswer === 'A' ? 'text-green-600 font-semibold' : 'text-gray-600'}>
                      <span className="font-medium">A:</span> {question.optionA}
                    </div>
                    <div className={question.correctAnswer === 'B' ? 'text-green-600 font-semibold' : 'text-gray-600'}>
                      <span className="font-medium">B:</span> {question.optionB}
                    </div>
                    <div className={question.correctAnswer === 'C' ? 'text-green-600 font-semibold' : 'text-gray-600'}>
                      <span className="font-medium">C:</span> {question.optionC}
                    </div>
                    {question.optionD && (
                      <div className={question.correctAnswer === 'D' ? 'text-green-600 font-semibold' : 'text-gray-600'}>
                        <span className="font-medium">D:</span> {question.optionD}
                      </div>
                    )}
                  </div>
                  {question.explanation && (
                    <div className="mt-2 text-sm text-gray-600 bg-gray-50 p-2 rounded">
                      <strong>Explanation:</strong> {question.explanation}
                    </div>
                  )}
                  <div className="mt-2 flex gap-4 text-xs text-gray-500">
                    <span>Correct: {question.correctAnswer}</span>
                    {question.difficulty && <span>Difficulty: {question.difficulty}</span>}
                    {question.source && <span>Source: {question.source}</span>}
                  </div>
                </div>
              )}

              {deleteConfirm === question.id && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded">
                  <p className="text-sm text-red-800 mb-2">
                    Are you sure you want to delete this question?
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDelete(question.id)}
                      className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                    >
                      Yes, Delete
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(null)}
                      className="px-3 py-1 bg-gray-400 text-white rounded text-sm hover:bg-gray-500"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

