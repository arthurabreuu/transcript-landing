import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useInView, useReducedMotion } from 'framer-motion'

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]
const SCENE_MS = 7200
const WORD_MS = 80
const MANUAL_RESUME_MS = 14000

/**
 * Palco vivo do hero: UM palco, muitos contextos. Um trilho de chips
 * (Consulta, Reunião, Aula, Palestra...) controla qual cena o palco
 * encena; o autoplay avança sozinho com barra de progresso no chip
 * ativo, e qualquer clique assume o controle na hora.
 */

interface Scene {
  speaker: string
  /** a fala em partes; k = trecho que a IA captura (pode haver vários) */
  parts: Array<{ t: string; k?: boolean }>
  artifacts: string[]
  note: string
}

interface Context {
  id: string
  label: string
  mode: 'Clínico' | 'Geral'
  scene: Scene
}

const CONTEXTS: Context[] = [
  {
    id: 'consulta',
    label: 'Consulta',
    mode: 'Clínico',
    scene: {
      speaker: 'Paciente',
      parts: [
        { t: 'Esse mês ' },
        { t: 'cheguei aos 82 quilos', k: true },
        { t: ', mas ' },
        { t: 'ando pulando o café da manhã', k: true },
        { t: '.' },
      ],
      artifacts: ['Antropometria: peso atual 82 kg', 'Anamnese: omissão do desjejum'],
      note: 'a fala vira dado clínico estruturado',
    },
  },
  {
    id: 'reuniao',
    label: 'Reunião',
    mode: 'Geral',
    scene: {
      speaker: 'Você',
      parts: [
        { t: 'Então ficou combinado: ' },
        { t: 'proposta revisada até sexta', k: true },
        { t: ' e ' },
        { t: 'o Léo fecha com o fornecedor', k: true },
        { t: '.' },
      ],
      artifacts: ['Ata da reunião', 'Tarefa: proposta · sexta', 'Tarefa: fornecedor · Léo'],
      note: 'ata e tarefas geradas na hora',
    },
  },
  {
    id: 'aula',
    label: 'Aula',
    mode: 'Geral',
    scene: {
      speaker: 'Professora',
      parts: [
        { t: 'Guardem isso: ' },
        { t: 'a fotossíntese transforma luz em energia química', k: true },
        { t: ', e ' },
        { t: 'isso cai na prova', k: true },
        { t: '.' },
      ],
      artifacts: ['Resumo da aula', 'Ponto de prova: fotossíntese'],
      note: 'a aula vira material de estudo',
    },
  },
  {
    id: 'palestra',
    label: 'Palestra',
    mode: 'Geral',
    scene: {
      speaker: 'Palestrante',
      parts: [
        { t: 'Nossos dados mostram: ' },
        { t: '70% dos clientes decidem', k: true },
        { t: ' nos ' },
        { t: 'primeiros 8 segundos', k: true },
        { t: ' da experiência.' },
      ],
      artifacts: ['Principais insights', 'Citação: 8 segundos'],
      note: 'a palestra vira notas prontas',
    },
  },
  {
    id: 'apresentacao',
    label: 'Apresentação',
    mode: 'Geral',
    scene: {
      speaker: 'Você',
      parts: [
        { t: 'Nossa proposta ' },
        { t: 'reduz o custo em 18%', k: true },
        { t: ' já no ' },
        { t: 'primeiro trimestre', k: true },
        { t: '.' },
      ],
      artifacts: ['Resumo executivo', 'Follow-up: enviar números'],
      note: 'o pitch vira follow-up',
    },
  },
  {
    id: 'entrevista',
    label: 'Entrevista',
    mode: 'Geral',
    scene: {
      speaker: 'Candidata',
      parts: [
        { t: 'Eu ' },
        { t: 'liderei a migração do sistema', k: true },
        { t: ' com um ' },
        { t: 'time de seis pessoas', k: true },
        { t: '.' },
      ],
      artifacts: ['Ficha da candidata', 'Destaque: liderança em migração'],
      note: 'a entrevista vira avaliação comparável',
    },
  },
  {
    id: 'treinamento',
    label: 'Treinamento',
    mode: 'Geral',
    scene: {
      speaker: 'Instrutor',
      parts: [
        { t: 'Primeiro a gente ' },
        { t: 'valida o pedido', k: true },
        { t: ', só depois ' },
        { t: 'libera o estoque', k: true },
        { t: '.' },
      ],
      artifacts: ['Passo a passo do processo', 'Checklist de onboarding'],
      note: 'o treinamento vira manual',
    },
  },
  {
    id: 'conversa',
    label: 'Conversa importante',
    mode: 'Geral',
    scene: {
      speaker: 'Você',
      parts: [
        { t: 'Então combinado: ' },
        { t: 'eu cuido da documentação', k: true },
        { t: ' e você ' },
        { t: 'fala com o contador até terça', k: true },
        { t: '.' },
      ],
      artifacts: ['Acordos registrados', 'Lembrete: contador · terça'],
      note: 'o combinado não se perde',
    },
  },
]

/** matchMedia reativo: acompanha mudanças da preferência com a aba aberta */
function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches)
  useEffect(() => {
    const mq = window.matchMedia(query)
    const on = () => setMatches(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [query])
  return matches
}

/* Waveform viva: alturas determinísticas por índice */
const WAVE_BARS = Array.from({ length: 30 }, (_, i) => ({
  h: 7 + ((i * 7919) % 20),
  delay: ((i * 137) % 900) / 1000,
  dur: 0.9 + ((i * 61) % 50) / 100,
}))

function Waveform({ dim }: { dim: boolean }) {
  return (
    <div
      aria-hidden="true"
      className={`flex h-8 items-center justify-center gap-[3px] transition-opacity duration-500 ${
        dim ? 'opacity-25' : 'opacity-100'
      }`}
    >
      {WAVE_BARS.map((b, i) => (
        <span
          key={i}
          className="wv w-[3px] rounded-pill bg-brand/60"
          style={{
            height: b.h,
            animationDelay: `${b.delay}s`,
            animationDuration: `${b.dur}s`,
          }}
        />
      ))}
    </div>
  )
}

function SceneView({ scene, reduced }: { scene: Scene; reduced: boolean }) {
  const [phase, setPhase] = useState<'typing' | 'insight' | 'artifacts'>(
    reduced ? 'artifacts' : 'typing',
  )

  const words = (() => {
    const raw = scene.parts.flatMap((part) =>
      part.t
        .split(' ')
        .filter(Boolean)
        .map((w) => ({ w, k: !!part.k })),
    )
    // pontuação órfã (", " no início de uma parte) cola na palavra anterior
    const merged: typeof raw = []
    for (const t of raw) {
      const prev = merged[merged.length - 1]
      if (prev && /^[,.;:!?]+$/.test(t.w)) prev.w += t.w
      else merged.push({ ...t })
    }
    return merged
  })()

  const typeDone = words.length * WORD_MS + 350

  useEffect(() => {
    if (reduced) return
    const t1 = window.setTimeout(() => setPhase('insight'), typeDone)
    const t2 = window.setTimeout(() => setPhase('artifacts'), typeDone + 700)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [typeDone, reduced])

  const artifactsOn = phase === 'artifacts'

  return (
    <div className="flex min-h-[276px] flex-col sm:min-h-[228px]">
      <div className="flex items-center justify-between">
        <span className="rounded-pill bg-ink-100/80 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-ink-400">
          {scene.speaker}
        </span>
        <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-400">
          <span className="rec-dot h-2 w-2 rounded-full bg-rec" />
          rec
        </span>
      </div>

      {/* a fala */}
      <p className="mt-4 flex-1 font-display text-[17px] font-light leading-snug tracking-tight text-ink-900 sm:text-[19px]">
        <span className="text-ink-200">“</span>
        {words.map((t, i) => (
          <motion.span
            key={i}
            className="inline"
            initial={{ opacity: reduced ? 1 : 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.16, delay: reduced ? 0 : 0.3 + (i * WORD_MS) / 1000 }}
          >
            {t.k ? (
              <span className="relative inline whitespace-pre-wrap">
                <motion.span
                  className="absolute inset-x-[-2px] inset-y-[1px] -z-0 rounded-[4px] bg-brand/15"
                  style={{ originX: 0 }}
                  initial={{ scaleX: reduced ? 1 : 0 }}
                  animate={{ scaleX: phase === 'typing' ? 0 : 1 }}
                  transition={{ duration: 0.55, ease: EASE }}
                />
                <span
                  className={`relative transition-colors duration-500 ${
                    phase === 'typing' ? '' : 'font-semibold text-brand-600'
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
        {phase === 'typing' && (
          <span className="caret ml-0.5 inline-block h-[15px] w-[2px] translate-y-[2px] rounded-pill bg-brand" />
        )}
      </p>

      <Waveform dim={artifactsOn} />

      {/* artefatos */}
      <div className="mt-2.5 flex min-h-[104px] flex-wrap items-start justify-center gap-2 sm:min-h-[40px]">
        {artifactsOn &&
          scene.artifacts.map((a, i) => (
            <motion.span
              key={a}
              className="flex items-center gap-1.5 rounded-pill bg-ok/10 px-3 py-1.5 text-[11.5px] font-semibold text-[#0B7A55]"
              initial={{ opacity: 0, y: 12, scale: 0.85 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                delay: reduced ? 0 : i * 0.12,
                type: 'spring',
                stiffness: 320,
                damping: 20,
              }}
            >
              <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 12.5 9.5 18 20 6" />
              </svg>
              {a}
            </motion.span>
          ))}
      </div>
      <motion.p
        className="mt-1.5 text-center font-mono text-[9.5px] uppercase tracking-[0.16em] text-ink-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: artifactsOn ? 1 : 0 }}
        transition={{ duration: 0.4, delay: reduced ? 0 : 0.4 }}
      >
        {scene.note}
      </motion.p>
    </div>
  )
}

/** Trilho de chips: o índice sempre visível dos contextos do palco. */
function ContextRail({
  active,
  onSelect,
  running,
  showProgress,
  cycleKey,
}: {
  active: number
  onSelect: (i: number) => void
  running: boolean
  showProgress: boolean
  cycleKey: string
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

  return (
    <motion.div
      ref={railRef}
      role="tablist"
      aria-label="Contextos de gravação"
      onPointerDown={markUser}
      onWheel={markUser}
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
            onClick={() => {
              onSelect(i)
              center(i)
            }}
            className={`relative shrink-0 snap-center rounded-pill px-3.5 py-2 font-mono text-[11px] uppercase tracking-[0.08em] transition-colors duration-300 ${
              isActive ? 'text-white' : 'glass-flat text-ink-400 hover:text-ink-900'
            }`}
          >
            {isActive && (
              <motion.span
                layoutId="context-chip"
                className="absolute inset-0 rounded-pill bg-brand shadow-glow"
                transition={{ type: 'spring', stiffness: 420, damping: 34 }}
              />
            )}
            {isActive && showProgress && (
              <span className="absolute inset-x-3 bottom-[3px] z-[1] h-[2px] overflow-hidden rounded-pill bg-white/25">
                <span
                  key={cycleKey}
                  className="chip-progress block h-full rounded-pill bg-white/80"
                  style={{
                    animationDuration: `${SCENE_MS}ms`,
                    animationPlayState: running ? 'running' : 'paused',
                  }}
                />
              </span>
            )}
            <span className="relative z-[2]">{c.label}</span>
          </button>
        )
      })}
    </motion.div>
  )
}

export function Hero() {
  const reduced = useReducedMotion() ?? false
  const coarse = useMediaQuery('(pointer: coarse)')

  const [active, setActive] = useState(0)
  const [manual, setManual] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [dragging, setDragging] = useState(false)
  // cada interação bumpa o stamp para reiniciar os relógios do zero
  const [stamp, setStamp] = useState(0)
  const stageRef = useRef<HTMLDivElement>(null)
  const inView = useInView(stageRef, { amount: 0.3 })
  // pausar (hover, drag, fora da viewport) preserva o restante da cena
  const elapsedRef = useRef(0)
  const startedRef = useRef(0)

  const running = !reduced && inView && !manual && !hovered && !dragging

  // nova cena zera o tempo já decorrido
  useEffect(() => {
    elapsedRef.current = 0
  }, [active, stamp])

  // relógio único do autoplay
  useEffect(() => {
    if (!running) return
    startedRef.current = Date.now()
    const id = window.setTimeout(
      () => setActive((a) => (a + 1) % CONTEXTS.length),
      Math.max(400, SCENE_MS - elapsedRef.current),
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

  const ctx = CONTEXTS[active]

  return (
    <section className="relative overflow-hidden pt-24 sm:pt-28">
      <img
        src="/brand/brain.png"
        alt=""
        className="pointer-events-none absolute -right-20 top-14 -z-10 w-[380px] opacity-[0.05]"
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
        <h1 className="mt-4 font-display text-4xl font-semibold leading-[1.1] tracking-tight text-ink-900 sm:text-5xl lg:text-[56px]">
          <span className="-mb-[0.22em] inline-block overflow-hidden pb-[0.22em] align-bottom">
            <motion.span
              className="inline-block"
              initial={{ y: '112%' }}
              animate={{ y: 0 }}
              transition={{ duration: 0.75, delay: 0.08, ease: EASE }}
            >
              <span className="font-light">Você só aperta gravar.</span>
            </motion.span>
          </span>{' '}
          <span className="-mb-[0.22em] inline-block overflow-hidden pb-[0.22em] align-bottom">
            <motion.span
              className="inline-block"
              initial={{ y: '112%' }}
              animate={{ y: 0 }}
              transition={{ duration: 0.75, delay: 0.18, ease: EASE }}
            >
              <span className="gradient-text font-semibold">O resto se escreve.</span>
            </motion.span>
          </span>
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

        {/* palco vivo: um palco, muitos contextos */}
        <div className="mt-9 w-full">
          <ContextRail
            active={active}
            onSelect={select}
            running={running}
            showProgress={!reduced}
            cycleKey={`${active}-${stamp}`}
          />
          <motion.div
            ref={stageRef}
            id="hero-stage"
            role="tabpanel"
            aria-labelledby={`chip-${ctx.id}`}
            className="glass-strong glass-top-light mx-auto mt-4 w-full max-w-2xl rounded-[26px] p-5 text-left shadow-card sm:p-6"
            initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.7, delay: 0.4, ease: EASE }}
            onPointerEnter={(e) => {
              if (e.pointerType === 'mouse') setHovered(true)
            }}
            onPointerLeave={(e) => {
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
            <div className="mb-4 flex justify-center border-b border-ink-100 pb-3">
              <AnimatePresence mode="wait">
                <motion.p
                  key={ctx.id}
                  className="eyebrow-brand"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.3, ease: EASE }}
                >
                  {ctx.label} · Modo {ctx.mode}
                </motion.p>
              </AnimatePresence>
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={ctx.id}
                initial={{ opacity: 0, y: 14, filter: 'blur(5px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -10, filter: 'blur(5px)' }}
                transition={{ duration: 0.4, ease: EASE }}
              >
                <SceneView scene={ctx.scene} reduced={reduced} />
              </motion.div>
            </AnimatePresence>
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
