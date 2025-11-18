import Image from 'next/image'

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-aviation-blue via-aviation-sky to-blue-400 text-white">
      <div className="absolute inset-0 bg-black opacity-20"></div>
      <div className="relative container mx-auto px-4 py-20 md:py-32">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Master Your <span className="text-yellow-300">Pilot Exams</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Comprehensive mock exam preparation for PPL, CPL, and ATPL. Practice with real exam-style questions across all 8 essential sections.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a 
                href="https://play.google.com/store/apps/details?id=com.suyash.mockcivilaviationexam"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-aviation-blue px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-50 transition text-center"
              >
                Download for Android
              </a>
              <a 
                href="#sections"
                className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-aviation-blue transition text-center"
              >
                Explore Sections
              </a>
            </div>
          </div>
            <div className="relative h-64 md:h-96 rounded-lg overflow-hidden shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80"
              alt="Aircraft in flight over clouds"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

