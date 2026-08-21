import { Fragment, useEffect, useRef, useState } from 'react'
import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion'
import { EASE, SNAP, SOFT } from '../motion/tokens'
import { useLite, useMediaQuery, useSectionLive, useTilt } from '../motion/hooks'
import { MaskRise } from '../motion/primitives'
import { CONTEXTS } from './hero/contexts'
import { useSceneClock } from './hero/useSceneClock'
import { RecorderChrome, Sentence } from './hero/SpeechBar'
import { DocSheet, SheetStack } from './hero/DocSheet'

const MANUAL_RESUME_MS = 14000

/**
 * Palco DocStage do hero: a MESMA gravação vira um DOCUMENTO DIFERENTE
 * por contexto. O gravador no topo é constante de propósito (o input não
 * muda); a folha embaixo é o protagonista, e cada uma nasce com um verbo
 * de animação exclusivo: carimbar, dar dono e prazo, virar, ampliar,
 * redigir, etiquetar, desenhar a espinha, convergir e selar. As cenas só
 * ORGANIZAM o que foi falado; nada de enviar, avaliar ou inventar.
 */

/** Trilho de chips: vitrine das 8 saídas diferentes, com ícone por documento. */
function ContextRail({
  active,
  onSelect,
  running,
  showProgress,
  cycleKey,
  duration,
}: {
  active: number
  onSelect: (i: number) => void
  running: boolean
  showProgress: boolean
  cycleKey: string
  duration: number
}) {
  const railRef = useRef<HTMLDivElement>(null)
  const chipRefs = useRef<Array<HTMLButtonElement | null>>([])
  const lastUserRef = useRef(0)

  // rola SÓ o trilho (nunca a página) até centralizar o chip
  const center = (i: number) => {
    const rail = railRef.current
    const chip = chipRefs.current[i]
    if (!rail || !chip) return
    if (rail.scrollWidth <= rail.clientWidth) return
    rail.scrollTo({
      left: chip.offsetLeft - (rail.clientWidth - chip.offsetWidth) / 2,
      behavior: 'smooth',
    })
  }

  // o autoplay centraliza, mas não briga com quem está rolando o trilho
  useEffect(() => {
    if (Date.now() - lastUserRef.current < 3000) return
    center(active)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active])

  const markUser = () => {
    lastUserRef.current = Date.now()
  }

  const pick = (i: number) => {
    onSelect(i)
    center(i)
    chipRefs.current[i]?.focus({ preventScroll: true })
  }

  return (
    <motion.div
      ref={railRef}
      role="tablist"
      aria-label="Contextos de gravação"
      onPointerDown={markUser}
      onWheel={markUser}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') {
          e.preventDefault()
          pick((active + 1) % CONTEXTS.length)
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault()
          pick((active - 1 + CONTEXTS.length) % CONTEXTS.length)
        } else if (e.key === 'Home') {
          e.preventDefault()
          pick(0)
        } else if (e.key === 'End') {
          e.preventDefault()
          pick(CONTEXTS.length - 1)
        }
      }}
      className="no-scrollbar relative -mx-5 flex snap-x items-center gap-1.5 overflow-x-auto px-5 pb-1 [mask-image:linear-gradient(90deg,transparent,black_20px,black_calc(100%-20px),transparent)] md:mx-0 md:flex-wrap md:justify-center md:overflow-x-visible md:px-0 md:[mask-image:none]"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3, ease: EASE }}
    >
      {CONTEXTS.map((c, i) => {
        const isActive = i === active
        return (
          <button
            key={c.id}
            ref={(el) => {
              chipRefs.current[i] = el
            }}
            type="button"
            role="tab"
            id={`chip-${c.id}`}
            aria-selected={isActive}
            aria-controls="hero-stage"
            tabIndex={isActive ? 0 : -1}
            onClick={() => pick(i)}
            className={`relative flex shrink-0 snap-center items-center gap-1.5 rounded-pill px-3.5 py-2 font-mono text-[11px] uppercase tracking-[0.08em] transition-colors duration-300 ${
              isActive ? 'text-white' : 'glass-flat text-ink-400 hover:text-ink-900'
            }`}
          >
            {isActive && (
              <motion.span
                layoutId="context-chip"
                className="absolute inset-0 rounded-pill bg-brand shadow-glow"
                transition={SNAP}
              />
            )}
            {isActive && showProgress && (
              <span className="absolute inset-x-3 bottom-[3px] z-[1] h-[2px] overflow-hidden rounded-pill bg-white/25">
                <span
                  key={cycleKey}
                  className="chip-progress block h-full rounded-pill bg-white/80"
                  style={{
                    animationDuration: `${duration}ms`,
                    animationPlayState: running ? 'running' : 'paused',
                  }}
                />
              </span>
            )}
            <span className="relative z-[2] flex items-center gap-1.5">
              {c.icon}
              {c.label}
            </span>
          </button>
        )
      })}
    </motion.div>
  )
}

/** Os 3 passos do produto em uma tira: o que é, antes de ver o palco. */
const QUICK_STEPS = [
  {
    t: 'Você grava a conversa',
    icon: (
      <>
        <rect x="9" y="3" width="6" height="11" rx="3" />
        <path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
      </>
    ),
  },
  {
    t: 'A IA transcreve e separa as vozes',
    icon: (
      <>
        <path d="M12 4.5 13.3 8l3.5 1.3-3.5 1.3L12 14l-1.3-3.4L7.2 9.3 10.7 8z" />
        <path d="M18 14.5l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7z" />
      </>
    ),
  },
  {
    t: 'Você recebe o documento pronto',
    icon: (
      <>
        <path d="M6 3.5h7.5L18 8v12.5H6z" />
        <path d="M13 3.5V8h5M9 12h6M9 16h4" />
      </>
    ),
  },
]

function QuickSteps() {
  return (
    <>
      <motion.div
        className="glass-flat glass-top-light mt-7 flex w-full max-w-4xl flex-col items-stretch gap-1 rounded-[22px] border px-4 py-3 sm:flex-row sm:items-center sm:justify-center sm:gap-2.5 sm:rounded-pill sm:px-6"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.42, ease: EASE }}
      >
        {QUICK_STEPS.map((s, i) => (
          <Fragment key={s.t}>
            {i > 0 && (
              <motion.span
                aria-hidden="true"
                className="flex items-center justify-start py-0.5 pl-[11px] text-brand-300 sm:justify-center sm:py-0 sm:pl-0"
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ ...SNAP, delay: 0.62 + i * 0.14 }}
              >
                <svg
                  className="h-3.5 w-3.5 rotate-90 sm:rotate-0"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </motion.span>
            )}
            <motion.span
              className="flex items-center gap-2.5 text-left text-[12.5px] font-medium text-ink-700 sm:whitespace-nowrap sm:text-[13px]"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...SNAP, delay: 0.5 + i * 0.14 }}
            >
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand/10 text-brand">
                <svg
                  className="h-3.5 w-3.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.9"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {s.icon}
                </svg>
              </span>
              {s.t}
            </motion.span>
          </Fragment>
        ))}
      </motion.div>
      <motion.p
        className="mt-2.5 text-[12px] font-light text-ink-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.9 }}
      >
        É basicamente isso: sem digitar, sem gravador separado, sem perder o fio
        da conversa.
      </motion.p>
    </>
  )
}

export function Hero() {
  const reduced = useReducedMotion() ?? false
  const coarse = useMediaQuery('(pointer: coarse)')
  const lite = useLite()

  const [active, setActive] = useState(0)
  const [manual, setManual] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [dragging, setDragging] = useState(false)
  // cada interação bumpa o stamp para reiniciar os relógios do zero
  const [stamp, setStamp] = useState(0)
  const sectionRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const inView = useInView(stageRef, { amount: 0.3 })
  useSectionLive(sectionRef)
  // pausar (hover, drag, fora da viewport) preserva o restante da cena
  const elapsedRef = useRef(0)
  const startedRef = useRef(0)

  // tilt de profundidade: o vidro fica parado, só o MIOLO inclina
  const tilt = useTilt(3)

  // despedida em parallax: ao rolar para fora, o palco sobe mais rápido
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })
  const exitProgress = useSpring(scrollYProgress, SOFT)
  const stageY = useTransform(exitProgress, [0, 1], [0, -40])
  const brainY = useTransform(exitProgress, [0, 1], [0, 28])

  // dois sinais: a cena escolhida toca na hora (playing); o clique só
  // suspende o AVANÇO automático por 14s (running)
  const playing = !reduced && inView && !hovered && !dragging
  const running = playing && !manual
  const ctx = CONTEXTS[active]
  const sceneKey = `${ctx.id}-${stamp}`
  const phase = useSceneClock(ctx.milestones, playing, sceneKey, reduced)

  // nova cena zera o tempo já decorrido
  useEffect(() => {
    elapsedRef.current = 0
  }, [active, stamp])

  // relógio único do autoplay (a duração é da cena)
  useEffect(() => {
    if (!running) return
    startedRef.current = Date.now()
    const id = window.setTimeout(
      () => setActive((a) => (a + 1) % CONTEXTS.length),
      Math.max(400, CONTEXTS[active].dur - elapsedRef.current),
    )
    return () => {
      clearTimeout(id)
      elapsedRef.current += Date.now() - startedRef.current
    }
  }, [active, running, stamp])

  // depois de uma interação manual, o autoplay retoma sozinho
  useEffect(() => {
    if (!manual) return
    const id = window.setTimeout(() => setManual(false), MANUAL_RESUME_MS)
    return () => clearTimeout(id)
  }, [manual, stamp])

  const select = (i: number) => {
    setActive(i)
    setManual(true)
    setStamp((s) => s + 1)
  }
  const step = (dir: 1 | -1) =>
    select((active + dir + CONTEXTS.length) % CONTEXTS.length)

  const Body = ctx.Body

  return (
    <section ref={sectionRef} className="relative overflow-hidden pt-24 sm:pt-28">
      <motion.img
        src="/brand/brain.png"
        alt=""
        className="pointer-events-none absolute -right-20 top-14 -z-10 w-[380px] opacity-[0.05]"
        style={lite ? undefined : { y: brainY }}
      />

      <div className="mx-auto flex max-w-5xl flex-col items-center px-5 pb-16 text-center">
        <motion.p
          className="eyebrow-brand"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: EASE }}
        >
          Syntria Transcript
        </motion.p>
        <motion.p
          className="mt-2 font-display text-[15px] font-light tracking-tight text-ink-500 sm:text-[17px]"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.05, ease: EASE }}
        >
          A <span className="font-semibold text-ink-900">transcrição perfeita</span>{' '}
          com ajuda de IA
        </motion.p>
        <h1 className="mt-4 font-display text-4xl font-semibold leading-[1.1] tracking-tight text-ink-900 sm:text-5xl lg:text-[56px]">
          <MaskRise delay={0.08}>
            <span className="font-light">Você só aperta gravar.</span>
          </MaskRise>{' '}
          <MaskRise delay={0.18}>
            <span className="gradient-text font-semibold">O resto se escreve.</span>
          </MaskRise>
        </h1>
        <motion.p
          className="mt-4 max-w-xl text-[15px] font-light leading-relaxed text-ink-500 sm:text-lg"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: EASE }}
        >
          Consulta, reunião, aula, palestra ou entrevista: o Transcript ouve,
          identifica quem falou e devolve o documento que aquele momento pede.
        </motion.p>

        <QuickSteps />

        {/* palco DocStage: um gravador, oito documentos */}
        <div className="mt-9 w-full">
          <ContextRail
            active={active}
            onSelect={select}
            running={running}
            showProgress={!reduced}
            cycleKey={`${active}-${stamp}`}
            duration={ctx.dur}
          />
          <motion.div style={lite ? undefined : { y: stageY }}>
            <motion.div
              ref={stageRef}
              id="hero-stage"
              role="tabpanel"
              aria-labelledby={`chip-${ctx.id}`}
              className="glass-strong glass-top-light mx-auto mt-4 w-full max-w-2xl rounded-[26px] p-4 text-left shadow-card sm:p-6"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4, ease: EASE }}
              onPointerMove={tilt.onPointerMove}
              onPointerEnter={(e) => {
                if (e.pointerType === 'mouse') setHovered(true)
              }}
              onPointerLeave={(e) => {
                tilt.reset()
                if (e.pointerType === 'mouse') setHovered(false)
              }}
              drag={coarse ? 'x' : false}
              dragDirectionLock
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.15}
              onDragStart={() => setDragging(true)}
              onDragEnd={(_, info) => {
                setDragging(false)
                const dx = info.offset.x
                if (Math.abs(dx) <= Math.abs(info.offset.y)) return
                if (dx < -48 && (dx < -80 || info.velocity.x < -200)) step(1)
                else if (dx > 48 && (dx > 80 || info.velocity.x > 200)) step(-1)
              }}
            >
              {/* o miolo inclina dentro do vidro parado */}
              <motion.div
                className="relative"
                style={{
                  rotateX: tilt.rotateX,
                  rotateY: tilt.rotateY,
                  transformPerspective: 900,
                }}
              >
                <RecorderChrome
                  running={playing}
                  sceneId={sceneKey}
                  reduced={reduced}
                />

                {/* a fonte: a fala, igual em toda cena de propósito */}
                <div className="min-h-[52px]">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={sceneKey}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.22, ease: EASE }}
                    >
                      <Sentence
                        speaker={ctx.speaker}
                        parts={ctx.parts}
                        phase={phase}
                        reduced={reduced}
                      />
                    </motion.div>
                  </AnimatePresence>
                </div>
                <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.16em] text-ink-400">
                  você só grava · o Transcript escreve
                </p>

                {/* o protagonista: a folha que nasce diferente por contexto */}
                <div className="relative mt-6">
                  <SheetStack
                    next={CONTEXTS[(active + 1) % CONTEXTS.length]}
                    nextNext={CONTEXTS[(active + 2) % CONTEXTS.length]}
                  />
                  <AnimatePresence mode="wait" initial={false}>
                    <DocSheet key={sceneKey} ctx={ctx}>
                      <Body phase={phase} lite={lite} />
                    </DocSheet>
                  </AnimatePresence>
                </div>
                <motion.p
                  className="mt-2 min-h-[18px] text-center font-mono text-[9.5px] uppercase tracking-[0.16em] text-ink-400"
                  animate={{ opacity: phase >= 3 ? 1 : 0 }}
                  transition={{ duration: 0.4 }}
                >
                  {ctx.note}
                </motion.p>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        {/* CTAs */}
        <motion.div
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55, ease: EASE }}
        >
          <a href="#planos" className="btn-brand cta-glow">
            Testar grátis
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </a>
          <a href="#como" className="btn-ghost">
            Ver como funciona
          </a>
        </motion.div>
        <motion.p
          className="mt-4 text-[12px] font-light text-ink-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.67 }}
        >
          3 transcrições grátis para testar. Assine quando quiser.
        </motion.p>

        <motion.div
          className="mt-8 flex flex-wrap justify-center gap-x-7 gap-y-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.77 }}
        >
          {[
            'Falantes identificados automaticamente',
            'Áudio apagado após a transcrição',
            'Para qualquer conversa que não pode se perder',
          ].map((t) => (
            <span key={t} className="flex items-center gap-2 text-[12px] text-ink-400">
              <svg className="h-3.5 w-3.5 shrink-0 text-brand" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 12.5 9.5 18 20 6" />
              </svg>
              {t}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
