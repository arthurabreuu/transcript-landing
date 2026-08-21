import { useEffect, useRef, useState, type CSSProperties } from 'react'
import {
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion'
import { RISE, SOFT } from '../motion/tokens'
import { useMediaQuery, useSectionLive } from '../motion/hooks'
import { CountUp, DrawPath, Rise } from '../motion/primitives'

function Head({
  eyebrow,
  title,
  sub,
}: {
  eyebrow: string
  title: React.ReactNode
  sub?: string
}) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <Rise dist={12} className="inline-block w-full">
        <p className="eyebrow-brand">{eyebrow}</p>
      </Rise>
      <Rise dist={18} delay={0.06}>
        <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl">
          {title}
        </h2>
      </Rise>
      {sub && (
        <Rise dist={14} delay={0.14}>
          <p className="mt-4 text-[15px] font-light leading-relaxed text-ink-400">
            {sub}
          </p>
        </Rise>
      )}
    </div>
  )
}

/* ---------- Como funciona ---------- */

const STEPS = [
  {
    n: '01',
    title: 'Toque em gravar',
    body: 'No começo da consulta, da reunião, da aula ou da palestra: um toque. O Transcript trabalha em silêncio.',
  },
  {
    n: '02',
    title: 'Esteja inteiro na conversa',
    body: 'Nada de anotar enquanto falam com você. Cada fala é transcrita com o falante identificado.',
  },
  {
    n: '03',
    title: 'Receba o resultado certo',
    body: 'Ao encerrar, chega o que aquele contexto pede: evolução clínica, ata com tarefas, resumo da aula ou notas da palestra.',
  },
]

export function HowItWorks() {
  const ref = useRef<HTMLElement>(null)
  useSectionLive(ref)
  return (
    <section ref={ref} id="como" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-24">
      <Head
        eyebrow="Como funciona"
        title={
          <>
            <span className="font-light">Um toque no início. </span>
            <span className="gradient-text">Tudo pronto no fim.</span>
          </>
        }
      />
      <div className="relative mt-12 grid gap-3 sm:grid-cols-3">
        {/* a rota do dado: do toque em gravar até o documento */}
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-[8%] top-1/2 hidden h-[60px] -translate-y-1/2 sm:block"
          viewBox="0 0 1000 60"
          preserveAspectRatio="none"
          fill="none"
        >
          <DrawPath
            d="M0,30 C250,10 750,50 1000,30"
            stroke="rgba(0,111,245,0.25)"
            strokeWidth="1.5"
            duration={1.3}
            delay={0.35}
          />
        </svg>
        {STEPS.map((s, i) => (
          <Rise
            key={s.n}
            className="glass glass-top-light hover-card rounded-[24px] border p-6"
            delay={i * 0.14}
            dist={36}
            margin="-60px"
          >
            <span
              className="float-bob font-mono text-[12px] text-brand"
              style={{ '--bob-delay': `${i * 0.9}s`, '--bob-dur': '5s' } as CSSProperties}
            >
              {s.n}
            </span>
            <h3 className="mt-3 text-[16px] font-semibold text-ink-900">{s.title}</h3>
            <p className="mt-2 text-[13.5px] font-light leading-relaxed text-ink-400">
              {s.body}
            </p>
          </Rise>
        ))}
      </div>
    </section>
  )
}

/* ---------- De conversa a documento ---------- */

const PAIRS = [
  { from: 'Consulta', to: 'evolução pronta' },
  { from: 'Reunião', to: 'ata com tarefas' },
  { from: 'Aula', to: 'resumo de estudo' },
  { from: 'Palestra', to: 'notas e citações' },
  { from: 'Entrevista', to: 'ficha comparável' },
  { from: 'Treinamento', to: 'manual do processo' },
]

/** Resumo escaneável do palco do hero, para quem não espera a animação. */
export function UseCaseStrip() {
  const ref = useRef<HTMLElement>(null)
  useSectionLive(ref)
  return (
    <section ref={ref} className="mx-auto max-w-5xl px-5 pb-24">
      <Rise dist={12}>
        <p className="eyebrow-brand text-center">De conversa a documento</p>
      </Rise>
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        {PAIRS.map((p, i) => (
          <span
            key={p.from}
            className="float-bob"
            style={
              {
                '--bob-delay': `${(i * 0.7) % 4}s`,
                '--bob-dur': `${4.5 + ((i * 61) % 20) / 10}s`,
              } as CSSProperties
            }
          >
            {/* bolhas afloram de lados alternados e assentam com overshoot */}
            <motion.span
              className="glass-flat glass-top-light flex items-center gap-2 rounded-pill border px-4 py-2 font-mono text-[12px]"
              initial={{ opacity: 0, y: 20, x: i % 2 ? 10 : -10, rotate: i % 2 ? 3 : -3 }}
              whileInView={{ opacity: 1, y: 0, x: 0, rotate: 0 }}
              whileHover={{ y: -4 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ ...RISE, delay: i * 0.06 }}
            >
              <span className="text-ink-500">{p.from}</span>
              <svg
                className="h-3 w-3 shrink-0 text-brand"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <DrawPath
                  d="M5 12h14M13 6l6 6-6 6"
                  delay={i * 0.06 + 0.25}
                  duration={0.35}
                />
              </svg>
              <span className="font-medium text-brand-600">{p.to}</span>
            </motion.span>
          </span>
        ))}
      </div>
    </section>
  )
}

/* ---------- Para quem é ---------- */

const AUDIENCES = [
  {
    title: 'Estudantes',
    body: 'Aula, curso online e videoaula viram resumo de estudo. Depois, o assistente responde suas dúvidas sobre o que foi gravado.',
    featured: false,
  },
  {
    title: 'Nutricionistas',
    body: 'Recordatório, antropometria e anamnese alimentar organizados a partir da conversa com o paciente. A consulta rende o dobro.',
    featured: true,
  },
  {
    title: 'Médicos e clínicas',
    body: 'Queixa, evolução e conduta registradas no padrão do prontuário, com cada falante identificado.',
    featured: false,
  },
  {
    title: 'Psicólogos e terapeutas',
    body: 'O registro da sessão sem tirar os olhos de quem fala. O áudio é apagado depois de transcrito.',
    featured: false,
  },
  {
    title: 'Times e negócios',
    body: 'Reuniões viram atas, calls viram briefings, brainstorms viram planos com dono e prazo.',
    featured: false,
  },
  {
    title: 'Professores e palestrantes',
    body: 'Aula, workshop e palestra viram material de apoio, com notas e citações prontas para reaproveitar.',
    featured: false,
  },
]

const ALSO = [
  'Mentorias',
  'Reuniões 1:1',
  'Entrevistas',
  'Defesas e bancas',
  'Podcasts',
  'Aquela conversa com o contador',
]

export function Audience() {
  const reduced = useReducedMotion() ?? false
  return (
    <section className="mx-auto max-w-6xl px-5 pb-24">
      <Head
        eyebrow="Para quem é"
        title={
          <>
            <span className="font-light">Feito para quem </span>
            <span className="gradient-text">vive de ouvir e de estudar.</span>
          </>
        }
      />
      <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {AUDIENCES.map((a, i) => {
          // o cardume: o featured emerge primeiro, os outros pela distância no grid
          const dist = Math.floor(i / 3) + (i % 3)
          return (
            <Rise
              key={a.title}
              className={`glass-top-light hover-card rounded-[22px] border p-6 ${
                a.featured
                  ? 'glass-strong isolate !border-brand/35 border-2'
                  : 'glass-subtle'
              }`}
              delay={dist * 0.09}
              dist={30}
              hoverY={-4}
            >
              {a.featured && (
                <motion.div
                  aria-hidden="true"
                  className="pointer-events-none absolute -inset-1 -z-10 rounded-[24px]"
                  style={{ boxShadow: '0 0 40px rgba(0,111,245,0.25)' }}
                  initial={{ opacity: 0.4 }}
                  whileInView={reduced ? { opacity: 0.7 } : { opacity: [0.4, 1, 0.4] }}
                  viewport={{ once: false }}
                  transition={
                    reduced
                      ? { duration: 0 }
                      : { duration: 4, repeat: Infinity, ease: 'easeInOut' }
                  }
                />
              )}
              {a.featured && (
                <span className="mb-3 inline-block rounded-pill bg-brand/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-brand">
                  Ecossistema Syntria
                </span>
              )}
              <h3 className="text-[15px] font-semibold text-ink-900">{a.title}</h3>
              <p className="mt-1.5 text-[13px] font-light leading-relaxed text-ink-400">
                {a.body}
              </p>
            </Rise>
          )
        })}
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
        <motion.span
          className="text-[12px] font-light text-ink-300"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          e também:
        </motion.span>
        {ALSO.map((t, i) => (
          <motion.span
            key={t}
            className="glass-subtle rounded-pill px-3 py-1.5 text-[12px] text-ink-500"
            initial={{ opacity: 0, scale: 0.85, y: 8 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 18,
              delay: 0.4 + i * 0.045,
            }}
          >
            {t}
          </motion.span>
        ))}
      </div>
      <motion.p
        className="mt-5 text-center text-[13.5px] font-light text-ink-400"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        Se a conversa importa,{' '}
        <span className="font-semibold text-ink-900">o Transcript escreve.</span>
      </motion.p>
    </section>
  )
}

/* ---------- Tempo (a conta) ---------- */

/* Fagulhas-minuto: os minutos escapando do ano, subindo no card escuro */
const MINUTES = Array.from({ length: 16 }, (_, i) => ({
  left: `${(i * 7919) % 100}%`,
  dur: 7 + ((i * 61) % 5),
  delay: -((i * 137) % 9),
}))

export function TimeMath() {
  const sectionRef = useRef<HTMLElement>(null)
  useSectionLive(sectionRef)
  const reduced = useReducedMotion() ?? false
  const coarse = useMediaQuery('(pointer: coarse)')
  const minuteCount = reduced ? 0 : coarse ? 8 : 16

  // parallax interno: o glow e o cérebro derivam contra o scroll
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })
  const sp = useSpring(scrollYProgress, SOFT)
  const brainY = useTransform(sp, [0, 1], [12, -12])
  const glowY = useTransform(sp, [0, 1], [0, -22])

  const tiles = [
    {
      key: 'dez',
      node: <CountUp to={10} duration={0.9} format={(v) => `${Math.round(v)} min`} />,
      small: 'de registro manual por conversa',
    },
    {
      key: 'vezes',
      node: (
        <motion.span
          className="inline-block"
          initial={{ scale: 0.6, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', stiffness: 320, damping: 16, delay: 0.55 }}
        >
          × 8
        </motion.span>
      ),
      small: 'conversas por dia',
    },
    {
      key: 'horas',
      node: (
        <CountUp to={290} duration={1.4} delay={0.25} format={(v) => `≈ ${Math.round(v)}h`} />
      ),
      small: 'por ano de volta para o seu trabalho (ou para os seus estudos)',
    },
  ]

  return (
    <section ref={sectionRef} className="px-4 pb-24">
      <Rise
        className="relative mx-auto max-w-6xl overflow-hidden rounded-[32px] text-white"
        style={{
          background:
            'radial-gradient(120% 130% at 50% 0%, #12335A 0%, #0A1628 55%, #0A0F1A 100%)',
        }}
        dist={44}
        spring={{ type: 'spring', stiffness: 110, damping: 14 }}
        margin="-80px"
      >
        <motion.div
          className="pointer-events-none absolute -top-28 left-1/2 h-80 w-[520px] -translate-x-1/2"
          style={{
            ...(reduced || coarse ? {} : { y: glowY }),
            background:
              'radial-gradient(50% 50% at 50% 50%, rgba(0,111,245,0.22) 0%, rgba(0,111,245,0.06) 55%, transparent 75%)',
          }}
        />
        <motion.img
          src="/brand/brain-white.png"
          alt=""
          className="pointer-events-none absolute -right-14 -top-8 w-64 opacity-[0.05]"
          style={reduced || coarse ? undefined : { y: brainY }}
        />
        {Array.from({ length: minuteCount }, (_, i) => (
          <span
            key={i}
            aria-hidden="true"
            className="minute"
            style={
              {
                left: MINUTES[i].left,
                '--dur': `${MINUTES[i].dur}s`,
                '--delay': `${MINUTES[i].delay}s`,
              } as CSSProperties
            }
          />
        ))}
        <div className="px-6 py-16 text-center sm:px-12 sm:py-20">
          <p className="eyebrow text-brand-300">Faça a conta</p>
          <h2 className="mx-auto mt-3 max-w-3xl font-display text-3xl font-semibold tracking-tight sm:text-[40px]">
            <span className="font-light">Dez minutos de anotações por conversa são </span>
            <span className="gradient-text-dark font-semibold">
              sete semanas do seu ano.
            </span>
          </h2>
          <div className="mx-auto mt-12 grid max-w-3xl gap-3 sm:grid-cols-3">
            {tiles.map((s, i) => (
              <Rise
                key={s.key}
                className="rounded-2xl border border-white/10 bg-white/[0.04] p-6"
                delay={0.15 + i * 0.12}
                dist={24}
                spring={{ type: 'spring', stiffness: 240, damping: 18 }}
              >
                <p className="font-display text-3xl font-bold sm:text-4xl">{s.node}</p>
                <p className="mt-2 text-[12.5px] font-light text-white/60">{s.small}</p>
              </Rise>
            ))}
          </div>
          <motion.p
            className="mx-auto mt-8 max-w-xl text-[13.5px] font-light leading-relaxed text-white/50"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.35 }}
          >
            Com o Transcript, o registro acontece durante a conversa, não depois
            dela. Você fecha o dia, ou a aula, com tudo documentado e a cabeça
            livre.
          </motion.p>
        </div>
      </Rise>
    </section>
  )
}

/* ---------- Recursos ---------- */

const FEATURES = [
  {
    title: 'Falantes identificados',
    body: 'Quem disse o quê, separado automaticamente, seja consulta, reunião, aula ou entrevista.',
  },
  {
    title: 'Resumo pronto pro seu padrão',
    body: 'Anamnese e evolução na clínica; ata, briefing e tarefas na reunião; resumo e pontos-chave na aula ou palestra.',
  },
  {
    title: 'Modo Clínico e modo Geral',
    body: 'Consultas com vocabulário clínico; reuniões, aulas, palestras e entrevistas com transcrição direta. Ou os dois no Completo.',
  },
  {
    title: 'Tudo organizado por pessoa',
    body: 'Cada gravação no histórico certo: paciente, cliente, matéria ou projeto. Busque qualquer coisa que foi dita.',
  },
  {
    title: 'Assistente por voz',
    body: 'Converse com o assistente sobre suas gravações: buscar um trecho, resumir, gerar pergunta de revisão a partir do que foi dito.',
  },
  {
    title: 'Privacidade por padrão',
    body: 'O áudio é apagado após a transcrição. Excluiu, apagou de verdade.',
  },
]

export function Features() {
  const ref = useRef<HTMLElement>(null)
  useSectionLive(ref)
  return (
    <section ref={ref} className="mx-auto max-w-6xl px-5 pb-24">
      <Head
        eyebrow="O que vem junto"
        title={
          <>
            <span className="font-light">Mais que transcrição: </span>
            <span className="gradient-text">seu dia em ordem.</span>
          </>
        }
      />
      <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f, i) => {
          // onda diagonal: canto superior esquerdo primeiro
          const d = (Math.floor(i / 3) + (i % 3)) * 0.08
          return (
            <motion.div
              key={f.title}
              className="glass-subtle glass-top-light hover-card rounded-[22px] border p-6"
              initial={{ opacity: 0, y: 26, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              whileHover={{
                y: -5,
                transition: { type: 'spring', stiffness: 260, damping: 22 },
              }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ ...RISE, delay: d }}
            >
              {/* o instrumento atraca 90ms depois do card */}
              <motion.span
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand/10 text-brand"
                initial={{ opacity: 0, y: 14, rotate: -8 }}
                whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{
                  type: 'spring',
                  stiffness: 320,
                  damping: 15,
                  delay: d + 0.09,
                }}
              >
                <span
                  className="float-bob"
                  style={
                    { '--bob-delay': `${i * 0.8}s`, '--bob-dur': '4.6s' } as CSSProperties
                  }
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 12.5 9.5 18 20 6" />
                  </svg>
                </span>
              </motion.span>
              <h3 className="mt-4 text-[15px] font-semibold text-ink-900">{f.title}</h3>
              <p className="mt-1.5 text-[13px] font-light leading-relaxed text-ink-400">
                {f.body}
              </p>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}

/* ---------- Segurança ---------- */

/* Mini-waveform da cena: 12 barras que colapsam quando o áudio "morre" */
const SEC_BARS = Array.from({ length: 12 }, (_, i) => ({
  h: 8 + ((i * 7919) % 14),
  delay: ((i * 137) % 900) / 1000,
  dur: 0.9 + ((i * 61) % 50) / 100,
}))

/**
 * A promessa encenada uma única vez: o áudio (waveform) colapsa e evapora
 * em partículas, o escudo se desenha no lugar e um anel de luz lacra.
 * "O áudio é processado e apagado: fica só o texto", sem tocar na copy.
 */
export function Security() {
  const ref = useRef<HTMLElement>(null)
  useSectionLive(ref)
  const cardRef = useRef<HTMLDivElement>(null)
  const started = useInView(cardRef, { once: true, amount: 0.5 })
  const reduced = useReducedMotion() ?? false
  const [phase, setPhase] = useState<'idle' | 'wave' | 'dissolve' | 'shield' | 'done'>(
    'idle',
  )

  useEffect(() => {
    if (!started) return
    if (reduced) {
      setPhase('done')
      return
    }
    setPhase('wave')
    const t1 = window.setTimeout(() => setPhase('dissolve'), 900)
    const t2 = window.setTimeout(() => setPhase('shield'), 1700)
    const t3 = window.setTimeout(() => setPhase('done'), 2400)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
    }
  }, [started, reduced])

  const collapsed = phase === 'dissolve' || phase === 'shield' || phase === 'done'
  const shieldOn = phase === 'shield' || phase === 'done'

  return (
    <section ref={ref} className="mx-auto max-w-4xl px-5 pb-24">
      <motion.div
        ref={cardRef}
        className="glass glass-top-light relative overflow-hidden rounded-[28px] p-8 text-center sm:p-12"
        initial={{ opacity: 0, y: 26, scale: 0.98 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={RISE}
      >
        <motion.div
          className="pointer-events-none absolute -top-24 left-1/2 h-72 w-[460px] -translate-x-1/2"
          style={{
            background:
              'radial-gradient(50% 50% at 50% 50%, rgba(0,111,245,0.14) 0%, transparent 72%)',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: shieldOn ? 1 : 0 }}
          transition={{ duration: 0.8 }}
        />

        {/* o áudio vivo, prestes a ser apagado */}
        <div
          aria-hidden="true"
          className="relative mx-auto mb-4 flex h-6 items-center justify-center gap-[3px]"
        >
          {SEC_BARS.map((b, i) => (
            // donos separados do transform: o wrapper framer colapsa, o filho
            // interno .wv ondula em CSS; o colapso multiplica a onda congelada
            <motion.span
              key={i}
              className="flex items-center"
              animate={
                collapsed
                  ? { scaleY: 0.05, opacity: 0 }
                  : { scaleY: 1, opacity: 1 }
              }
              transition={{ delay: collapsed ? i * 0.05 : 0, duration: 0.35 }}
            >
              <span
                className="wv w-[3px] rounded-pill bg-brand/60"
                style={{
                  height: b.h,
                  animationDelay: `${b.delay}s`,
                  animationDuration: `${b.dur}s`,
                  animationPlayState: collapsed ? 'paused' : 'running',
                }}
              />
            </motion.span>
          ))}
          {/* o áudio evapora em partículas que sobem */}
          {(phase === 'dissolve' || phase === 'shield') &&
            !reduced &&
            SEC_BARS.map((_, i) => (
              <motion.span
                key={`p-${i}`}
                aria-hidden="true"
                className="absolute top-1/2 h-[3px] w-[3px] rounded-full bg-brand/70"
                style={{ left: `calc(50% + ${(i - 6) * 6}px)` }}
                initial={{ y: 0, opacity: 0 }}
                animate={{
                  y: -56 - ((i * 13) % 28),
                  x: i % 2 ? 8 : -8,
                  opacity: [0, 0.7, 0],
                }}
                transition={{ duration: 1.2, delay: i * 0.05, ease: 'easeOut' }}
              />
            ))}
        </div>

        {/* o escudo se desenha no lugar do áudio */}
        <motion.span
          className="relative mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-brand/10 text-brand"
          initial={false}
          animate={{ scale: shieldOn ? 1 : 0.9 }}
          transition={{ type: 'spring', stiffness: 320, damping: 15 }}
        >
          <svg className="h-[22px] w-[22px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <DrawPath
              d="M12 3l7 3v5c0 4.5-3 8.5-7 10-4-1.5-7-5.5-7-10V6l7-3z"
              whenInView={false}
              play={shieldOn}
              duration={0.7}
            />
            <DrawPath
              d="M9 12l2 2 4-4.5"
              whenInView={false}
              play={shieldOn}
              delay={0.5}
              duration={0.35}
            />
          </svg>
          {/* o lacre: um anel de luz escapa */}
          {shieldOn && !reduced && (
            <motion.span
              aria-hidden="true"
              className="absolute inset-0 rounded-2xl border border-brand/50"
              initial={{ opacity: 0, scale: 1 }}
              animate={{ opacity: [0, 0.6, 0], scale: [1, 1.9, 1.9] }}
              transition={{ duration: 0.9, delay: 0.9, times: [0, 0.3, 1] }}
            />
          )}
        </motion.span>

        <h2 className="mt-5 font-display text-2xl font-semibold tracking-tight text-ink-900 sm:text-3xl">
          <span className="font-light">O que foi dito </span>
          <span className="gradient-text">fica entre vocês.</span>
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-[14px] font-light leading-relaxed text-ink-400">
          O áudio é processado e apagado: fica só o texto. Excluir uma sessão
          remove tudo, inclusive o áudio, de verdade. Seus dados não treinam
          modelos de terceiros. Vale para uma sessão clínica, uma reunião ou a
          aula que você gravou.
        </p>
      </motion.div>
    </section>
  )
}
