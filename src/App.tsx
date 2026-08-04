import { Nav } from './components/Nav'
import { Hero } from './components/Hero'
import { HowItWorks, TimeMath, Features, Security } from './components/Sections'
import { Pricing, Faq, FinalCta, Footer } from './components/Closing'

/** Luz ambiente fixa: auroras que o liquid glass refrata (receita do Hub). */
function AmbientBackground() {
  return (
    <div
      className="pointer-events-none fixed inset-0 -z-10"
      style={{
        background: [
          'radial-gradient(560px circle at 12% 6%, rgba(136,188,245,0.35), transparent 70%)',
          'radial-gradient(520px circle at 88% 28%, rgba(0,111,245,0.14), transparent 70%)',
          'radial-gradient(620px circle at 20% 92%, rgba(77,159,255,0.16), transparent 72%)',
          'linear-gradient(180deg, #FFFFFF 0%, #F4F7FB 34%, #EDF3FA 100%)',
        ].join(', '),
      }}
    />
  )
}

export default function App() {
  return (
    <>
      <AmbientBackground />
      <Nav />
      <main>
        <Hero />
        <HowItWorks />
        <TimeMath />
        <Features />
        <Security />
        <Pricing />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </>
  )
}
