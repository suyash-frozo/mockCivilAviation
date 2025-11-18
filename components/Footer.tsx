import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-aviation-navy text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Aviation Mock Exam</h3>
            <p className="text-gray-300">
              Your comprehensive preparation tool for PPL, CPL, and ATPL exams.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-300">
              <li><Link href="#sections" className="hover:text-white">Exam Sections</Link></li>
              <li><Link href="#ppl-info" className="hover:text-white">About PPL</Link></li>
              <li><Link href="#features" className="hover:text-white">Features</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Exam Sections</h4>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li>Air Law</li>
              <li>Meteorology</li>
              <li>Principles of Flight</li>
              <li>Aircraft General</li>
              <li>Human Performance</li>
              <li>Operational Procedures</li>
              <li>Navigation</li>
              <li>Communication</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Download</h4>
            <a
              href="https://play.google.com/store/apps/details?id=com.suyash.mockcivilaviationexam"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-white text-aviation-blue px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Get Android App
            </a>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
          <p>&copy; {new Date().getFullYear()} Civil Aviation Mock Exam. All rights reserved.</p>
          <p className="mt-2 text-sm">
            Prepare for your pilot license exams with confidence. Practice makes perfect.
          </p>
        </div>
      </div>
    </footer>
  )
}

