const features = [
  {
    icon: '📱',
    title: 'Mobile App Available',
    description: 'Download our Android app for offline practice. Take exams anywhere, anytime.',
  },
  {
    icon: '📊',
    title: 'Performance Analytics',
    description: 'Track your progress with detailed analytics. Identify weak areas and improve your scores.',
  },
  {
    icon: '📚',
    title: 'Study Materials',
    description: 'Access comprehensive study materials and external references for each section.',
  },
  {
    icon: '✅',
    title: 'Detailed Explanations',
    description: 'Get detailed explanations for every question. Understand why answers are correct or incorrect.',
  },
  {
    icon: '🔄',
    title: 'Progress Tracking',
    description: 'Sync your progress across devices. Track your exam history and improvement over time.',
  },
  {
    icon: '🎯',
    title: 'Personalized Recommendations',
    description: 'Receive personalized study recommendations based on your performance and weak areas.',
  },
]

export default function Features() {
  return (
    <section id="features" className="py-20 bg-gradient-to-br from-blue-50 to-aviation-sky/10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-aviation-blue mb-4">Key Features</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to prepare for your pilot exams
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="text-5xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-aviation-blue mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

