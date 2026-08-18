import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { EASE } from '../../motion/tokens'
import type { SpeechPart } from './contexts'

const WORD_MS = 45

/**
 * A FONTE: faixa de gravador no topo do palco, propositalmente idêntica
 * em todas as cenas (o input é constante, o output é que muda).
 * O chrome (REC, timer, waveform) é persistente e nunca remonta; a
 * sentença vive dentro da cena e troca com ela.
 */

const CHROME_BARS = Array.from({ length: 12 }, (_, i) => ({
  h: 5 + ((i * 7919) % 11),
  delay: ((i * 137) % 900) / 1000,
  dur: 0.9 + ((i * 61) % 50) / 100,
}))

export function RecorderChrome({
  running,
  sceneId,
  reduced,
}: {
  running: boolean
  sceneId: string
  reduced: boolean
}) {
  const [seconds, setSeconds] = useState(0)
  const elapsedRef = useRef(0)
  const startedRef = useRef(0)

  // o timer zera a cada cena e conta como o relógio da cena: pausas
  // acumulam o decorrido, sem perder frações de segundo
  useEffect(() => {
    elapsedRef.current = 0
    setSeconds(0)
  }, [sceneId])
  useEffect(() => {
    if (!running) return
    startedRef.current = Date.now()
    const tick = () =>
      setSeconds(
        Math.floor((elapsedRef.current + Date.now() - startedRef.current) / 1000),
      )
    tick()
    const id = window.setInterval(tick, 250)
    return () => {
      clearInterval(id)
      elapsedRef.current += Date.now() - startedRef.current
    }
  }, [running, sceneId])

  return (
    <div className="pointer-events-none absolute right-4 top-4 flex items-center gap-2 sm:right-6 sm:top-5">
      <span className="relative flex h-2 w-2">
        <span className="rec-dot h-2 w-2 rounded-full bg-rec" />
        {/* anel que escapa a cada troca de contexto */}
        {!reduced && (
          <motion.span
            key={sceneId}
            aria-hidden="true"
            className="absolute inset-0 rounded-full border border-rec/60"
            initial={{ scale: 1, opacity: 0.5 }}
            animate={{ scale: 2.4, opacity: 0 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
          />
        )}
      </span>
      <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-400">
        rec
      </span>
      <span className="w-8 font-mono text-[10px] tabular-nums text-ink-400">
        0:{String(seconds).padStart(2, '0')}
      </span>
      <span
        aria-hidden="true"
        className="hidden h-4 items-center gap-[2px] sm:flex"
      >
        {CHROME_BARS.map((b, i) => (
          <span
            key={i}
            className="wv w-[2px] rounded-pill bg-brand/50"
            style={{
              height: b.h,
              animationDelay: `${b.delay}s`,
              animationDuration: `${b.dur}s`,
            }}
          />
        ))}
      </span>
    </div>
  )
}

/** A sentença da cena: digitada palavra a palavra, encolhe quando o
 *  documento assume o palco. */
export function Sentence({
  speaker,
  parts,
  phase,
  reduced,
}: {
  speaker: string
  parts: SpeechPart[]
  phase: number
  reduced: boolean
}) {
  const raw = parts.flatMap((part) =>
    part.t
      .split(' ')
      .filter(Boolean)
      .map((w) => ({ w, k: !!part.k })),
  )
  // pontuação órfã (", " no início de uma parte) cola na palavra anterior
  const words: typeof raw = []
  for (const t of raw) {
    const prev = words[words.length - 1]
    if (prev && /^[,.;:!?]+$/.test(t.w)) prev.w += t.w
    else words.push({ ...t })
  }

  const typing = !reduced && phase < 1

  return (
    <div className="flex min-h-[52px] items-start gap-2 pr-[104px] sm:min-h-[36px] sm:items-center sm:pr-[190px]">
      <span className="shrink-0 rounded-pill bg-ink-100/80 px-2.5 py-1 font-mono text-[9.5px] uppercase tracking-[0.12em] text-ink-400">
        {speaker}
      </span>
      <motion.p
        className="line-clamp-2 min-w-0 flex-1 text-left text-[13px] font-light leading-snug tracking-tight text-ink-900 sm:line-clamp-1 sm:text-[14.5px]"
        style={{ originX: 0 }}
        animate={{
          scale: phase >= 2 ? 0.94 : 1,
          opacity: phase >= 2 ? 0.55 : 1,
        }}
        transition={{ duration: 0.4, ease: EASE }}
      >
        <span className="text-ink-200">“</span>
        {words.map((t, i) => (
          <motion.span
            key={i}
            initial={{ opacity: reduced ? 1 : 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 0.14,
              delay: reduced ? 0 : 0.15 + (i * WORD_MS) / 1000,
            }}
          >
            {t.k ? (
              <span className="relative whitespace-pre-wrap">
                <motion.span
                  className="absolute inset-x-[-2px] inset-y-0 -z-0 rounded-[4px] bg-brand/15"
                  style={{ originX: 0 }}
                  initial={{ scaleX: reduced ? 1 : 0 }}
                  animate={{ scaleX: phase >= 1 ? 1 : 0 }}
                  transition={{ duration: 0.5, ease: EASE }}
                />
                <span
                  className={`relative transition-colors duration-500 ${
                    phase >= 1 ? 'font-semibold text-brand-600' : ''
                  }`}
                >
                  {t.w}
                </span>
              </span>
            ) : (
              t.w
            )}{' '}
          </motion.span>
        ))}
        <span className="text-ink-200">”</span>
        {typing && (
          <span className="caret ml-0.5 inline-block h-[12px] w-[2px] translate-y-[2px] rounded-pill bg-brand" />
        )}
      </motion.p>
    </div>
  )
}
