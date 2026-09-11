import { MotionConfig } from 'framer-motion'
import { AmbientBackground } from './components/AmbientBackground'
import { Nav } from './components/Nav'
import { Hero } from './components/Hero'
import {
  HowItWorks,
  UseCaseStrip,
  Audience,
  TimeMath,
  Features,
  Security,
} from './components/Sections'
import { Students } from './components/Students'
import { Pricing, Faq, FinalCta, Footer } from './components/Closing'
import { FloatingWhatsApp } from './components/FloatingWhatsApp'

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <AmbientBackground />
      <Nav />
      <main>
        <Hero />
        <HowItWorks />
        <UseCaseStrip />
        <Students />
        <Audience />
        <TimeMath />
        <Features />
        <Security />
        <Pricing />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </MotionConfig>
  )
}
