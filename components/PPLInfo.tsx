export default function PPLInfo() {
  return (
    <section id="ppl-info" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-aviation-blue mb-4">What is PPL?</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Private Pilot License (PPL) is the first step in your aviation journey. Learn about the requirements and exam structure.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative h-80 rounded-lg overflow-hidden shadow-xl">
            <img
              src="https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80"
              alt="Pilot in cockpit preparing for flight"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold text-aviation-blue mb-3">Private Pilot License (PPL)</h3>
              <p className="text-gray-700 leading-relaxed">
                A Private Pilot License (PPL) allows you to fly aircraft for personal and recreational purposes. 
                It&apos;s the foundation of your aviation career and requires passing comprehensive theoretical and practical exams.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h4 className="text-xl font-semibold mb-4 text-aviation-navy">PPL Exam Structure</h4>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-aviation-blue mr-2">✓</span>
                  <span><strong>Air Law:</strong> Regulations, rules, and legal aspects of aviation</span>
                </li>
                <li className="flex items-start">
                  <span className="text-aviation-blue mr-2">✓</span>
                  <span><strong>Meteorology:</strong> Weather patterns and atmospheric conditions</span>
                </li>
                <li className="flex items-start">
                  <span className="text-aviation-blue mr-2">✓</span>
                  <span><strong>Principles of Flight:</strong> Aerodynamics and flight mechanics</span>
                </li>
                <li className="flex items-start">
                  <span className="text-aviation-blue mr-2">✓</span>
                  <span><strong>Aircraft General:</strong> Aircraft systems and structures</span>
                </li>
                <li className="flex items-start">
                  <span className="text-aviation-blue mr-2">✓</span>
                  <span><strong>Human Performance:</strong> Human factors and limitations</span>
                </li>
                <li className="flex items-start">
                  <span className="text-aviation-blue mr-2">✓</span>
                  <span><strong>Operational Procedures:</strong> Standard operating procedures</span>
                </li>
                <li className="flex items-start">
                  <span className="text-aviation-blue mr-2">✓</span>
                  <span><strong>Navigation:</strong> Navigation systems and flight planning</span>
                </li>
                <li className="flex items-start">
                  <span className="text-aviation-blue mr-2">✓</span>
                  <span><strong>Communication:</strong> Radio procedures and phraseology</span>
                </li>
              </ul>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-aviation-blue">
              <p className="text-gray-700">
                <strong>Exam Format:</strong> Each section contains multiple-choice questions. Our mock exam app provides 
                16 questions per section, matching the real exam format. Practice regularly to build confidence and improve your scores.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

