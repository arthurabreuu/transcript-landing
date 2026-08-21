import { useEffect, useState } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import { SNAP } from '../motion/tokens'

export function Nav() {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  // fio-altímetro: quanto da página já foi percorrido, com inércia de spring
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 26,
    restDelta: 0.001,
  })

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled ? 'border-b border-ink-100 bg-white/80 backdrop-blur-md' : ''
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <a href="#" className="flex items-center gap-2.5">
          <img
            src="/brand/favicon-transcript.png"
            alt=""
            className="h-7 w-7 rounded-[8px] shadow-sm"
          />
          <span className="text-[15px] font-semibold tracking-tight text-ink-900">
            Syntria <span className="text-ink-400">Transcript</span>
          </span>
        </a>
        <nav className="flex items-center gap-3 sm:gap-6">
          <a href="#como" className="hidden text-[13px] font-medium text-ink-400 transition-colors hover:text-ink-900 sm:block">
            Como funciona
          </a>
          <a href="#estudantes" className="hidden text-[13px] font-medium text-ink-400 transition-colors hover:text-ink-900 lg:block">
            Para estudantes
          </a>
          <a href="#planos" className="hidden text-[13px] font-medium text-ink-400 transition-colors hover:text-ink-900 sm:block">
            Planos
          </a>
          <motion.a
            href="#planos"
            className="btn-brand !px-4 !py-2 text-[13px]"
            whileHover={{ y: -2, scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={SNAP}
          >
            Testar grátis
          </motion.a>
        </nav>
      </div>
      <motion.span
        aria-hidden="true"
        className={`absolute inset-x-0 bottom-0 block h-[2px] origin-left transition-opacity duration-300 ${
          scrolled ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          scaleX,
          background: 'linear-gradient(90deg, #006FF5, #88BCF5)',
        }}
      />
    </header>
  )
}
