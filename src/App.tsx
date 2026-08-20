import { useEffect, useState, type CSSProperties } from 'react'
import { MotionConfig, motion, useScroll, useSpring, useTransform } from 'framer-motion'
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
import { Pricing, Faq, FinalCta, Footer } from './components/Closing'
import { FloatingWhatsApp } from './components/FloatingWhatsApp'
import { SOFT } from './motion/tokens'
import { useLite } from './motion/hooks'

const BASE_GRADIENT = 'linear-gradient(180deg, #FFFFFF 0%, #F4F7FB 34%, #EDF3FA 100%)'

const BLOBS = [
  {
    size: 1120,
    left: '12%',
    top: '6%',
    color: 'rgba(136,188,245,0.35)',
    dur: 26,
    delay: 0,
  },
  {
    size: 1040,
    left: '88%',
    top: '28%',
    color: 'rgba(0,111,245,0.14)',
    dur: 34,
    delay: 3,
  },
  {
    size: 1240,
    left: '20%',
    top: '92%',
    color: 'rgba(77,159,255,0.16)',
    dur: 30,
    delay: 7,
  },
]

const ORBS = Array.from({ length: 6 }, (_, i) => ({
  left: `${(i * 137 + 40) % 100}%`,
  size: 3 + ((i * 61) % 4),
  dur: 18 + ((i * 7919) % 22),
  delay: -((i * 137) % 18),
  drift: ((i * 53) % 60) - 30,
}))

/**
 * Luz ambiente com correnteza vertical: as auroras derivam em ciclos longos,
 * o conjunto sofre contra-parallax do scroll com inércia (a página é uma
 * coluna de líquido) e orbes de luz sobem do rodapé ao topo. Só transform
 * e opacity: zero paint. No modo leve, vira a pintura estática original.
 */
function AmbientBackground() {
  const lite = useLite()
  const { scrollY } = useScroll()
  const [range, setRange] = useState(3000)
  useEffect(() => {
    const measure = () =>
      setRange(
        Math.max(1000, document.documentElement.scrollHeight - window.innerHeight),
      )
    measure()
    // ResizeObserver cobre mudanças de altura sem resize (FAQ abrindo, fontes)
    const ro = new ResizeObserver(measure)
    ro.observe(document.documentElement)
    window.addEventListener('resize', measure)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [])
  const parallaxY = useSpring(useTransform(scrollY, [0, range], [0, -140]), SOFT)

  if (lite) {
    return (
      <div
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background: [
            'radial-gradient(560px circle at 12% 6%, rgba(136,188,245,0.35), transparent 70%)',
            'radial-gradient(520px circle at 88% 28%, rgba(0,111,245,0.14), transparent 70%)',
            'radial-gradient(620px circle at 20% 92%, rgba(77,159,255,0.16), transparent 72%)',
            BASE_GRADIENT,
          ].join(', '),
        }}
      />
    )
  }

  return (
    <div
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      style={{ background: BASE_GRADIENT }}
    >
      <motion.div className="absolute inset-0" style={{ y: parallaxY }}>
        {BLOBS.map((b, i) => (
          <div
            key={i}
            className="blob"
            style={
              {
                width: b.size,
                height: b.size,
                left: b.left,
                top: b.top,
                marginLeft: -b.size / 2,
                marginTop: -b.size / 2,
                background: `radial-gradient(closest-side, ${b.color}, transparent 70%)`,
                '--dur': `${b.dur}s`,
                '--delay': `${b.delay}s`,
              } as CSSProperties
            }
          />
        ))}
        {ORBS.map((o, i) => (
          <span
            key={i}
            className="orb"
            style={
              {
                left: o.left,
                width: o.size,
                height: o.size,
                background: 'radial-gradient(circle, rgba(0,111,245,0.55), rgba(0,111,245,0))',
                '--dur': `${o.dur}s`,
                '--delay': `${o.delay}s`,
                '--drift': `${o.drift}px`,
              } as CSSProperties
            }
          />
        ))}
      </motion.div>
    </div>
  )
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <AmbientBackground />
      <Nav />
      <main>
        <Hero />
        <HowItWorks />
        <UseCaseStrip />
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
