const sections = [
  {
    id: 'air_law',
    name: 'Air Law',
    description: 'Regulations, rules, and legal aspects of aviation. Learn about ICAO Annexes, EASA regulations, and airspace classifications.',
    icon: '⚖️',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&q=80',
  },
  {
    id: 'meteorology',
    name: 'Meteorology',
    description: 'Weather patterns, atmospheric conditions, and forecasting. Understand clouds, fronts, and weather systems affecting flight.',
    icon: '🌤️',
    image: 'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=400&q=80',
  },
  {
    id: 'principles_of_flight',
    name: 'Principles of Flight',
    description: 'Aerodynamics, flight mechanics, and aircraft performance. Master lift, drag, thrust, and weight relationships.',
    icon: '✈️',
    image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400&q=80',
  },
  {
    id: 'aircraft_general',
    name: 'Aircraft General',
    description: 'Aircraft systems, structures, and general knowledge. Learn about engines, electrical systems, and flight controls.',
    icon: '🔧',
    image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=400&q=80',
  },
  {
    id: 'human_performance',
    name: 'Human Performance & Limitations',
    description: 'Human factors, physiology, and psychological aspects. Understand hypoxia, fatigue, and decision-making in aviation.',
    icon: '🧠',
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&q=80',
  },
  {
    id: 'operational_procedures',
    name: 'Operational Procedures',
    description: 'Standard operating procedures and best practices. Master emergency procedures and operational safety.',
    icon: '📋',
    image: 'https://images.unsplash.com/photo-1556388158-158ea5ccacbd?w=400&q=80',
  },
  {
    id: 'navigation',
    name: 'Navigation',
    description: 'Navigation systems, charts, and flight planning. Learn VOR, NDB, GPS, and traditional navigation methods.',
    icon: '🧭',
    image: 'https://images.unsplash.com/photo-1502134249126-9f3755a50d78?w=400&q=80',
  },
  {
    id: 'communication',
    name: 'Communication',
    description: 'Radio procedures, phraseology, and communication protocols. Master ICAO phraseology and radio communication.',
    icon: '📻',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&q=80',
  },
]

export default function Sections() {
  return (
    <section id="sections" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-aviation-blue mb-4">Exam Sections</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive coverage of all 8 essential sections required for PPL, CPL, and ATPL exams
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {sections.map((section) => (
            <div
              key={section.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100"
            >
              <div className="relative h-48">
                <img
                  src={section.image}
                  alt={`${section.name} - Aviation exam section`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-4xl">{section.icon}</div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-aviation-blue mb-2">{section.name}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{section.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

