import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]
const SCENE_MS = 7200
const WORD_MS = 80

/**
 * Palco duplo do hero: os dois mundos do produto AO MESMO TEMPO.
 * Esquerda "Na clínica" (consulta → evolução/anamnese), direita
 * "No trabalho" (reunião → ata/tarefas, brainstorm → ideias).
 * Cada painel roda seu próprio loop, defasados entre si.
 */

interface Scene {
  speaker: string
  /** a fala em partes; k = trecho que a IA captura (pode haver vários) */
  parts: Array<{ t: string; k?: boolean }>
  artifacts: string[]
  note: string
}

const CLINIC_SCENES: Scene[] = [
  {
    speaker: 'Paciente',
    parts: [
      { t: 'Esse mês ' },
      { t: 'cheguei aos 82 quilos', k: true },
      { t: ', mas ' },
      { t: 'ando pulando o café da manhã', k: true },
      { t: '.' },
    ],
    artifacts: ['Antropometria: 82 kg · IMC 27,1', 'Anamnese: omissão do desjejum'],
    note: 'a fala vira dado clínico estruturado',
  },
  {
    speaker: 'Paciente',
    parts: [
      { t: 'No café da manhã ' },
      { t: 'como pão com manteiga e café com leite', k: true },
      { t: ', ' },
      { t: 'quase todo dia', k: true },
      { t: '.' },
    ],
    artifacts: ['R24h: pão c/ manteiga + café c/ leite', 'Frequência: diária'],
    note: 'o recordatório se monta durante a conversa',
  },
  {
    speaker: 'Paciente',
    parts: [
      { t: 'A dor começou ' },
      { t: 'há uns três dias', k: true },
      { t: ' e ' },
      { t: 'piora à noite', k: true },
      { t: ', principalmente ' },
      { t: 'quando deito', k: true },
      { t: '.' },
    ],
    artifacts: ['HDA: dor há 3 dias, noturna', 'Piora em decúbito'],
    note: 'linguagem leiga vira registro técnico',
  },
  {
    speaker: 'Dra. Ana',
    parts: [
      { t: 'Os exames vieram ótimos: ' },
      { t: 'vamos manter a dose', k: true },
      { t: ' e ' },
      { t: 'repetir em três meses', k: true },
      { t: '.' },
    ],
    artifacts: ['Conduta: manter posologia', 'Retorno + exames em 90 dias'],
    note: 'cada decisão vira registro',
  },
]

const WORK_SCENES: Scene[] = [
  {
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
  {
    speaker: 'Time',
    parts: [
      { t: 'E se a gente ' },
      { t: 'lançasse o plano anual', k: true },
      { t: ' com ' },
      { t: 'dois meses grátis', k: true },
      { t: '?' },
    ],
    artifacts: ['Ideia: plano anual −2 meses', 'Hipótese para validar'],
    note: 'ideias organizadas do jeito que saíram',
  },
  {
    speaker: 'Cliente',
    parts: [
      { t: 'Nosso orçamento é ' },
      { t: 'vinte mil', k: true },
      { t: ', com ' },
      { t: 'entrega em outubro', k: true },
      { t: '.' },
    ],
    artifacts: ['Briefing: verba R$ 20 mil', 'Deadline: outubro'],
    note: 'a call inteira vira briefing',
  },
]

/* Waveform viva: alturas determinísticas por índice */
function Waveform({ dim }: { dim: boolean }) {
  const bars = useMemo(
    () =>
      Array.from({ length: 30 }, (_, i) => ({
        h: 7 + ((i * 7919) % 20),
        delay: ((i * 137) % 900) / 1000,
        dur: 0.9 + ((i * 61) % 50) / 100,
      })),
    [],
  )
  return (
    <div
      className={`flex h-8 items-center justify-center gap-[3px] transition-opacity duration-500 ${
        dim ? 'opacity-25' : 'opacity-100'
      }`}
    >
      {bars.map((b, i) => (
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

function SceneView({
  scene,
  reduced,
  startDelay = 0,
}: {
  scene: Scene
  reduced: boolean
  startDelay?: number
}) {
  const [phase, setPhase] = useState<'typing' | 'insight' | 'artifacts'>(
    reduced ? 'artifacts' : 'typing',
  )

  const words = useMemo(() => {
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
  }, [scene])

  const typeDone = startDelay + words.length * WORD_MS + 350

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
    <div className="flex min-h-[228px] flex-col">
      <div className="flex items-center justify-between">
        <span className="rounded-pill bg-ink-100/80 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-ink-400">
          {scene.speaker}
        </span>
        <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-300">
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
            transition={{ duration: 0.16, delay: reduced ? 0 : 0.3 + startDelay / 1000 + (i * WORD_MS) / 1000 }}
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
      <div className="mt-2.5 flex min-h-[40px] flex-wrap items-start justify-center gap-2">
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
        className="mt-1.5 text-center font-mono text-[9.5px] uppercase tracking-[0.16em] text-ink-300"
        initial={{ opacity: 0 }}
        animate={{ opacity: artifactsOn ? 1 : 0 }}
        transition={{ duration: 0.4, delay: reduced ? 0 : 0.4 }}
      >
        {scene.note}
      </motion.p>
    </div>
  )
}

/** Um painel do palco: cicla suas próprias cenas, com defasagem inicial. */
function StagePanel({
  label,
  scenes,
  offsetMs,
  reduced,
  entryDelay,
}: {
  label: string
  scenes: Scene[]
  offsetMs: number
  reduced: boolean
  entryDelay: number
}) {
  const [scene, setScene] = useState(0)
  const [cycles, setCycles] = useState(0)

  // o primeiro ciclo dura SCENE_MS + offset (a defasagem entra no relógio,
  // sem remontar o painel no meio da cena)
  useEffect(() => {
    if (reduced) return
    const id = window.setTimeout(
      () => {
        setScene((s) => (s + 1) % scenes.length)
        setCycles((c) => c + 1)
      },
      cycles === 0 ? SCENE_MS + offsetMs : SCENE_MS,
    )
    return () => clearTimeout(id)
  }, [scene, cycles, scenes.length, offsetMs, reduced])

  return (
    <motion.div
      className="glass-strong glass-top-light w-full rounded-[26px] p-5 text-left shadow-card sm:p-6"
      initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.7, delay: entryDelay, ease: EASE }}
    >
      <p className="eyebrow-brand mb-4 border-b border-ink-100 pb-3 text-center">
        {label}
      </p>
      <AnimatePresence mode="wait">
        <motion.div
          key={scene}
          initial={{ opacity: 0, y: 14, filter: 'blur(5px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -10, filter: 'blur(5px)' }}
          transition={{ duration: 0.4, ease: EASE }}
        >
          <SceneView scene={scenes[scene]} reduced={reduced} startDelay={cycles === 0 ? offsetMs : 0} />
        </motion.div>
      </AnimatePresence>
    </motion.div>
  )
}

export function Hero() {
  const reduced = useMemo(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  )

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
          Na clínica ou no trabalho: o Transcript ouve, identifica quem falou e
          transforma a conversa em documentos, atas e ideias.
        </motion.p>

        {/* palco duplo: os dois mundos ao mesmo tempo */}
        <div className="mt-9 grid w-full gap-3 md:grid-cols-2">
          <StagePanel
            label="Na clínica"
            scenes={CLINIC_SCENES}
            offsetMs={0}
            entryDelay={0.35}
            reduced={reduced}
          />
          <StagePanel
            label="No trabalho"
            scenes={WORK_SCENES}
            offsetMs={3600}
            entryDelay={0.47}
            reduced={reduced}
          />
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
          className="mt-4 text-[12px] font-light text-ink-300"
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
            'Para saúde, negócios e estudo',
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
