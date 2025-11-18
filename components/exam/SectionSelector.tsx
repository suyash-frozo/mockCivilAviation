'use client'

interface Section {
  sectionId: string
  name: string
  description: string
  icon: string
  _count: {
    questions: number
  }
}

interface SectionSelectorProps {
  sections: Section[]
  onSelectSection: (sectionId: string) => void
}

export default function SectionSelector({ sections, onSelectSection }: SectionSelectorProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-aviation-blue mb-4">
            Mock Exam Practice
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Select a section to begin your practice exam. Each section contains multiple-choice questions to test your knowledge.
          </p>
        </div>

        {/* Sections Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {sections.map((section) => (
            <button
              key={section.sectionId}
              onClick={() => onSelectSection(section.sectionId)}
              className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-2 border-transparent hover:border-aviation-blue group"
            >
              <div className="text-center">
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">
                  {section.icon}
                </div>
                <h3 className="text-xl font-bold text-aviation-blue mb-2">
                  {section.name}
                </h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {section.description}
                </p>
                <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <span>{section._count.questions} questions</span>
                </div>
                <div className="mt-4">
                  <span className="inline-block bg-aviation-blue text-white px-4 py-2 rounded-md text-sm font-medium group-hover:bg-aviation-navy transition-colors">
                    Start Exam
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Info Box */}
        <div className="mt-12 bg-white rounded-lg shadow-md p-6 max-w-3xl mx-auto">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            📝 Exam Instructions
          </h3>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-start">
              <span className="text-aviation-blue mr-2">•</span>
              <span>Select a section to begin your practice exam</span>
            </li>
            <li className="flex items-start">
              <span className="text-aviation-blue mr-2">•</span>
              <span>Answer all questions to the best of your ability</span>
            </li>
            <li className="flex items-start">
              <span className="text-aviation-blue mr-2">•</span>
              <span>Review your answers before submitting</span>
            </li>
            <li className="flex items-start">
              <span className="text-aviation-blue mr-2">•</span>
              <span>See explanations for each question after completion</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

