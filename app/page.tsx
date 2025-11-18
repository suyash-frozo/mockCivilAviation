import Header from '@/components/Header'
import Hero from '@/components/Hero'
import Sections from '@/components/Sections'
import Features from '@/components/Features'
import PPLInfo from '@/components/PPLInfo'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <PPLInfo />
      <Sections />
      <Features />
      <Footer />
    </main>
  )
}

