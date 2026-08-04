import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

/**
 * Orbe de gravação: port do RecordingOrb do app (gradiente #FF6B6B→#EF4444,
 * equalizador radial de 32 traços, ondas concêntricas) com o morph
 * vermelho→verde do CaptureSuccessOrb quando o documento fica pronto.
 */
function RecOrb({ size = 46, ok }: { size?: number; ok: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const okRef = useRef(ok)
  okRef.current = ok

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const dpr = Math.min(2, window.devicePixelRatio || 1)
    const field = size * 2.2
    canvas.width = field * dpr
    canvas.height = field * dpr
    canvas.style.width = `${field}px`
    canvas.style.height = `${field}px`
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    const c = field / 2
    const core = size / 2
    let raf = 0
    let okT = okRef.current ? 1 : 0
    let last = performance.now()
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const lerp = (a: number, b: number, p: number) => a + (b - a) * p

    const draw = (now: number) => {
      raf = requestAnimationFrame(draw)
      const t = now / 1000
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      okT += ((okRef.current ? 1 : 0) - okT) * Math.min(1, dt * 7)

      ctx.clearRect(0, 0, field, field)

      // cor: vermelho gravação → verde sucesso
      const r1 = Math.round(lerp(255, 16, okT))
      const g1 = Math.round(lerp(107, 185, okT))
      const b1 = Math.round(lerp(107, 129, okT))
      const r2 = Math.round(lerp(239, 5, okT))
      const g2 = Math.round(lerp(68, 150, okT))
      const b2 = Math.round(lerp(68, 105, okT))

      const amp = reduced ? 0.4 : 0.55 + 0.45 * Math.sin(t * 2.6)

      // ondas concêntricas (só gravando)
      if (okT < 0.95 && !reduced) {
        for (let k = 0; k < 3; k++) {
          const phase = (t / 1.8 + k / 3) % 1
          const rr = core + phase * (field / 2 - core) * (0.72 + 0.28 * amp)
          ctx.strokeStyle = `rgba(${r2},${g2},${b2},${(1 - phase) * 0.16 * (1 - okT)})`
          ctx.lineWidth = 2
          ctx.beginPath()
          ctx.arc(c, c, rr, 0, Math.PI * 2)
          ctx.stroke()
        }
        // equalizador radial de 32 traços
        for (let i = 0; i < 32; i++) {
          const a = (i / 32) * Math.PI * 2
          const osc = Math.max(0, Math.sin(2 * 2 * Math.PI * (t * 0.5) + i * 0.55))
          const len = field * (0.018 + (0.02 + 0.11 * amp) * osc) * (1 - okT)
          const inner = core * 1.22
          ctx.strokeStyle = `rgba(${r2},${g2},${b2},${(0.45 + 0.45 * amp * osc) * (1 - okT)})`
          ctx.lineWidth = 2
          ctx.lineCap = 'round'
          ctx.beginPath()
          ctx.moveTo(c + Math.cos(a) * inner, c + Math.sin(a) * inner)
          ctx.lineTo(c + Math.cos(a) * (inner + len), c + Math.sin(a) * (inner + len))
          ctx.stroke()
        }
      }

      // núcleo
      const g = ctx.createRadialGradient(c - core * 0.3, c - core * 0.35, 0, c, c, core)
      g.addColorStop(0, `rgb(${r1},${g1},${b1})`)
      g.addColorStop(1, `rgb(${r2},${g2},${b2})`)
      ctx.fillStyle = g
      ctx.beginPath()
      ctx.arc(c, c, core * (1 + 0.03 * amp * (1 - okT)), 0, Math.PI * 2)
      ctx.fill()

      // ícone: quadrado de stop (gravando) → check (pronto)
      ctx.strokeStyle = 'rgba(255,255,255,0.95)'
      ctx.fillStyle = 'rgba(255,255,255,0.95)'
      if (okT < 0.5) {
        const s = core * 0.5 * (1 - okT * 2 * 0.4)
        ctx.globalAlpha = 1 - okT * 2
        ctx.beginPath()
        ctx.roundRect(c - s / 2, c - s / 2, s, s, s * 0.22)
        ctx.fill()
        ctx.globalAlpha = 1
      } else {
        const p = (okT - 0.5) * 2
        ctx.lineWidth = core * 0.16
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'
        ctx.beginPath()
        const x0 = c - core * 0.34
        const y0 = c + core * 0.02
        const x1 = c - core * 0.08
        const y1 = c + core * 0.28
        const x2 = c + core * 0.38
        const y2 = c - core * 0.24
        if (p < 0.5) {
          const q = p / 0.5
          ctx.moveTo(x0, y0)
          ctx.lineTo(x0 + (x1 - x0) * q, y0 + (y1 - y0) * q)
        } else {
          const q = (p - 0.5) / 0.5
          ctx.moveTo(x0, y0)
          ctx.lineTo(x1, y1)
          ctx.lineTo(x1 + (x2 - x1) * q, y1 + (y2 - y1) * q)
        }
        ctx.stroke()
      }

      if (reduced && Math.abs(okT - (okRef.current ? 1 : 0)) < 0.01) {
        cancelAnimationFrame(raf)
      }
    }
    raf = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(raf)
  }, [size])

  return <canvas ref={canvasRef} aria-hidden="true" />
}

/* Falas da consulta demonstrativa */
const LINES = [
  { who: 'Dra. Ana', doc: true, text: 'Me conta desde quando começou essa dor.' },
  { who: 'Paciente', doc: false, text: 'Faz uns três dias. E piora à noite.' },
  { who: 'Dra. Ana', doc: true, text: 'Vamos ajustar a medicação e reavaliar em uma semana.' },
]

function Word({ children, delay }: { children: string; delay: number }) {
  return (
    <motion.span
      className="inline"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.18, delay }}
    >
      {children}{' '}
    </motion.span>
  )
}

/**
 * Palco vivo do hero: gravando → transcrição com falantes → documento pronto.
 * Roda em loop contínuo.
 */
export function RecStage() {
  const reduced = useMemo(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  )
  const [phase, setPhase] = useState<'rec' | 'doc'>(reduced ? 'doc' : 'rec')
  const [cycle, setCycle] = useState(0)
  const [secs, setSecs] = useState(0)

  // máquina de estados do loop
  useEffect(() => {
    if (reduced) return
    let alive = true
    const run = () => {
      if (!alive) return
      setPhase('rec')
      setSecs(0)
      const toDoc = window.setTimeout(() => alive && setPhase('doc'), 5200)
      const next = window.setTimeout(() => {
        if (!alive) return
        setCycle((c) => c + 1)
        run()
      }, 9200)
      cleanup = () => {
        clearTimeout(toDoc)
        clearTimeout(next)
      }
    }
    let cleanup = () => {}
    run()
    return () => {
      alive = false
      cleanup()
    }
  }, [reduced])

  // cronômetro da gravação
  useEffect(() => {
    if (reduced || phase !== 'rec') return
    const id = window.setInterval(() => setSecs((s) => s + 1), 1000)
    return () => clearInterval(id)
  }, [phase, reduced, cycle])

  const mm = String(Math.floor(secs / 60)).padStart(2, '0')
  const ss = String(secs % 60).padStart(2, '0')

  return (
    <div className="glass-strong glass-top-light w-full max-w-xl rounded-[28px] p-5 shadow-card sm:p-6">
      {/* cabeçalho */}
      <div className="flex items-center gap-3 border-b border-ink-100 pb-3">
        <div className="-m-4 shrink-0 scale-[0.55]">
          <RecOrb ok={phase === 'doc'} />
        </div>
        <div className="min-w-0">
          <AnimatePresence mode="wait">
            <motion.p
              key={phase}
              className="text-[14px] font-semibold text-ink-900"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: EASE }}
            >
              {phase === 'rec' ? 'Gravando a consulta' : 'Evolução clínica pronta'}
            </motion.p>
          </AnimatePresence>
          <p className="text-[11px] text-ink-300">
            {phase === 'rec' ? 'transcrevendo em tempo real' : 'gerada ao fim do atendimento'}
          </p>
        </div>
        <span className="ml-auto font-mono text-[12px] tabular-nums text-ink-400">
          {phase === 'rec' ? `${mm}:${ss}` : '✓ 6s'}
        </span>
      </div>

      {/* corpo */}
      <div className="relative mt-4 min-h-[190px]">
        <AnimatePresence mode="wait">
          {phase === 'rec' ? (
            <motion.div
              key={`rec-${cycle}`}
              className="space-y-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, filter: 'blur(4px)' }}
              transition={{ duration: 0.35 }}
            >
              {LINES.map((l, li) => {
                const lineDelay = 0.4 + li * 1.5
                return (
                  <motion.div
                    key={li}
                    className="flex items-start gap-2.5"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: lineDelay, ease: EASE }}
                  >
                    <span
                      className={`mt-0.5 shrink-0 rounded-pill px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.1em] ${
                        l.doc ? 'bg-brand/10 text-brand' : 'bg-ink-100 text-ink-400'
                      }`}
                    >
                      {l.who}
                    </span>
                    <p className="text-[13.5px] leading-relaxed text-ink-700">
                      {l.text.split(' ').map((w, wi) => (
                        <Word key={wi} delay={lineDelay + 0.15 + wi * 0.09}>
                          {w}
                        </Word>
                      ))}
                      {li === LINES.length - 1 && (
                        <span className="caret ml-0.5 inline-block h-[14px] w-[2px] translate-y-[2px] bg-brand" />
                      )}
                    </p>
                  </motion.div>
                )
              })}
            </motion.div>
          ) : (
            <motion.div
              key={`doc-${cycle}`}
              initial={{ opacity: 0, y: 14, filter: 'blur(5px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, filter: 'blur(4px)' }}
              transition={{ duration: 0.5, ease: EASE }}
            >
              <div className="rounded-2xl border border-ink-100 bg-white/70 p-4">
                <p className="eyebrow">Evolução · consulta de hoje</p>
                <div className="mt-2.5 space-y-2 text-[13px] leading-relaxed text-ink-700">
                  <p>
                    <span className="font-semibold text-ink-900">Queixa:</span>{' '}
                    dor há 3 dias, com piora noturna.
                  </p>
                  <p>
                    <span className="font-semibold text-ink-900">Conduta:</span>{' '}
                    ajuste de medicação. Reavaliação em 7 dias.
                  </p>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {['Transcrição completa', 'Anamnese', 'Evolução'].map((d, i) => (
                  <motion.span
                    key={d}
                    className="flex items-center gap-1.5 rounded-pill bg-ok/10 px-3 py-1.5 text-[11.5px] font-semibold text-[#0B7A55]"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.35, delay: 0.25 + i * 0.1, ease: EASE }}
                  >
                    <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 12.5 9.5 18 20 6" />
                    </svg>
                    {d}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <p className="mt-4 text-center font-mono text-[10px] uppercase tracking-[0.18em] text-ink-300">
        Demonstração do fluxo real
      </p>
    </div>
  )
}
