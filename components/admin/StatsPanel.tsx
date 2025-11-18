'use client'

interface Section {
  sectionId: string
  name: string
  _count: {
    questions: number
  }
}

interface StatsPanelProps {
  sections: Section[]
}

export default function StatsPanel({ sections }: StatsPanelProps) {
  const totalQuestions = sections.reduce((sum, section) => sum + section._count.questions, 0)

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">Total Questions</div>
            <div className="text-2xl font-bold text-aviation-blue">{totalQuestions}</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">Sections</div>
            <div className="text-2xl font-bold text-green-600">{sections.length}</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">Average per Section</div>
            <div className="text-2xl font-bold text-purple-600">
              {sections.length > 0 ? Math.round(totalQuestions / sections.length) : 0}
            </div>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2">
          {sections.map((section) => (
            <div key={section.sectionId} className="bg-gray-50 p-2 rounded text-center">
              <div className="text-xs text-gray-600 truncate">{section.name}</div>
              <div className="text-lg font-semibold text-gray-800">
                {section._count.questions}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

