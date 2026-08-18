import { useRef, useState, type CSSProperties } from 'react'
import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion'
import { EASE, RISE, SNAP, SOFT } from '../motion/tokens'
import { useMagnetic, useSectionLive } from '../motion/hooks'
import { MaskRise, Rise } from '../motion/primitives'

/* ---------- Planos ---------- */

// Preços e horas em sincronia com o backend (PLAN_CATALOG em
// app/services/professional_entitlement.py), a fonte da verdade. Não inventar
// números aqui: qualquer mudança de preço/franquia acontece lá primeiro.
const PLANS = [
  {
    name: 'Geral',
    desc: 'Reuniões, aulas, palestras e entrevistas com transcrição automática',
    monthly: 19.9,
    annualMonthly: 9.9,
    features: [
      'Transcrição automática de reuniões, aulas, palestras e entrevistas',
      '12 horas de áudio por mês (mais, com créditos avulsos)',
      'Brainstorm e próximos passos pela IA',
      'Assistente de IA',
    ],
    highlight: false,
  },
  {
    name: 'Clínico',
    desc: 'Consultas e atendimentos com transcrição clínica',
    monthly: 24.9,
    annualMonthly: 12.9,
    features: [
      'Transcrição clínica de consultas e atendimentos',
      '15 horas de áudio por mês (mais, com créditos avulsos)',
      'Pacientes e prontuário',
      'Resumo clínico pela IA',
      'Assistente de IA',
    ],
    highlight: false,
  },
  {
    name: 'Completo',
    desc: 'Clínico e Geral juntos, num só plano',
    monthly: 34.9,
    annualMonthly: 17.9,
    features: [
      'Modos Clínico e Geral (tudo incluso)',
      '20 horas de áudio por mês (mais, com créditos avulsos)',
      'Pacientes, prontuário e resumo clínico',
      'Brainstorm de ideias e próximos passos',
      'Assistente de IA',
    ],
    highlight: true,
  },
]

const fmt = (v: number) =>
  v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export function Pricing() {
  const [annual, setAnnual] = useState(true)
  const sectionRef = useRef<HTMLElement>(null)
  useSectionLive(sectionRef)
  const reduced = useReducedMotion() ?? false
  return (
    <section
      ref={sectionRef}
      id="planos"
      className="mx-auto max-w-5xl scroll-mt-20 px-5 pb-24"
    >
      <div className="mx-auto max-w-2xl text-center">
        <Rise dist={12}>
          <p className="eyebrow-brand">Planos</p>
        </Rise>
        <Rise dist={18} delay={0.06}>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl">
            <span className="font-light">Escolha o seu modo. </span>
            <span className="gradient-text">Comece com 3 grátis.</span>
          </h2>
        </Rise>
        <Rise dist={14} delay={0.14}>
          <p className="mt-4 text-[14px] font-light text-ink-400">
            Você ganha 3 transcrições grátis para testar. Assine quando quiser,
            cancele quando quiser.
          </p>
        </Rise>
      </div>

      {/* toggle mensal/anual: a pill desliza, mesma língua do trilho do hero */}
      <div className="mt-8 flex justify-center">
        <div className="glass-strong flex items-center gap-1 rounded-pill p-1">
          <button
            type="button"
            onClick={() => setAnnual(false)}
            className={`relative rounded-pill px-4 py-1.5 text-[12.5px] font-semibold transition-colors ${
              !annual ? 'text-white' : 'text-ink-400 hover:text-ink-900'
            }`}
          >
            {!annual && (
              <motion.span
                layoutId="billing-pill"
                className="absolute inset-0 rounded-pill bg-brand"
                transition={SNAP}
              />
            )}
            <span className="relative z-10">Mensal</span>
          </button>
          <button
            type="button"
            onClick={() => setAnnual(true)}
            className={`relative flex items-center gap-1.5 rounded-pill px-4 py-1.5 text-[12.5px] font-semibold transition-colors ${
              annual ? 'text-white' : 'text-ink-400 hover:text-ink-900'
            }`}
          >
            {annual && (
              <motion.span
                layoutId="billing-pill"
                className="absolute inset-0 rounded-pill bg-brand"
                transition={SNAP}
              />
            )}
            <span className="relative z-10">Anual</span>
            <motion.span
              key={annual ? 'wobble-on' : 'wobble-off'}
              className={`relative z-10 rounded-pill px-1.5 py-0.5 text-[10px] ${
                annual ? 'bg-ink-900/25 text-white' : 'bg-brand/10 text-brand-700'
              }`}
              initial={{ rotate: 0, scale: 1 }}
              whileInView={{ rotate: [0, -5, 4, 0], scale: [1, 1.08, 1] }}
              viewport={{ once: true }}
              transition={{ duration: 0.45 }}
            >
              quase metade do preço
            </motion.span>
          </button>
        </div>
      </div>

      {/* doca de embarque: cápsulas sobem; o Completo assenta 6px acima */}
      <div className="mt-8 grid gap-3 lg:grid-cols-3">
        {PLANS.map((p, i) => {
          const monthlyShown = annual ? p.annualMonthly : p.monthly
          const yearTotal = p.annualMonthly * 12
          return (
            <motion.div
              key={p.name}
              className={`glass-top-light relative flex flex-col overflow-hidden rounded-[26px] p-7 ${
                p.highlight
                  ? 'glass-strong border-2 !border-brand/40'
                  : 'glass'
              }`}
              initial={{ opacity: 0, y: 34, scale: 0.98 }}
              whileInView={{ opacity: 1, y: p.highlight ? -6 : 0, scale: 1 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{
                ...(p.highlight
                  ? { type: 'spring', stiffness: 210, damping: 14 }
                  : RISE),
                delay: i * 0.1,
              }}
            >
              {p.highlight && (
                <motion.div
                  aria-hidden="true"
                  className="pointer-events-none absolute -top-20 left-1/2 h-56 w-96 -translate-x-1/2"
                  style={{
                    background:
                      'radial-gradient(50% 50% at 50% 50%, rgba(0,111,245,0.14) 0%, transparent 72%)',
                  }}
                  initial={{ opacity: 0.6 }}
                  whileInView={reduced ? { opacity: 0.8 } : { opacity: [0.6, 1, 0.6] }}
                  viewport={{ once: false }}
                  transition={
                    reduced
                      ? { duration: 0 }
                      : { duration: 4, repeat: Infinity, ease: 'easeInOut' }
                  }
                />
              )}
              <div className="flex h-7 items-center justify-between">
                <p className="text-[15px] font-semibold text-ink-900">{p.name}</p>
                {p.highlight && (
                  <span
                    className="float-bob rounded-pill bg-brand px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-white"
                    style={{ '--bob-dur': '4.5s' } as CSSProperties}
                  >
                    Mais completo
                  </span>
                )}
              </div>
              <p className="mt-0.5 min-h-[36px] text-[12px] font-light text-ink-400">
                {p.desc}
              </p>
              {/* troca de preço em peso zero: o antigo evapora, o novo aflora */}
              <p className="mt-4 font-mono text-3xl font-medium text-ink-900">
                <span className="relative inline-flex min-w-[8ch] overflow-hidden align-bottom">
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.span
                      key={annual ? 'a' : 'm'}
                      className="inline-block whitespace-nowrap"
                      initial={{ y: '70%', opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: '-70%', opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 26 }}
                    >
                      R$ {fmt(monthlyShown)}
                    </motion.span>
                  </AnimatePresence>
                </span>
                <span className="text-[14px] text-ink-300">
                  {annual ? ' /mês no anual' : ' /mês'}
                </span>
              </p>
              <motion.p
                key={annual ? 'total-a' : 'total-m'}
                className="mt-1 min-h-[34px] text-[11.5px] font-light text-ink-300"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                {annual
                  ? `R$ ${fmt(yearTotal)} cobrados uma vez por ano`
                  : 'Cobrado mês a mês, cancele quando quiser'}
              </motion.p>
              <ul className="mt-4 flex-1 space-y-2.5 text-[13px] text-ink-500">
                {p.features.map((t, j) => (
                  <motion.li
                    key={t}
                    className="flex items-start gap-2.5"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ ...RISE, delay: 0.2 + j * 0.04 }}
                  >
                    <svg
                      className={`mt-0.5 h-4 w-4 shrink-0 ${p.highlight ? 'text-brand' : 'text-ink-300'}`}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M4 12.5 9.5 18 20 6" />
                    </svg>
                    {t}
                  </motion.li>
                ))}
              </ul>
              <a
                href="#"
                className={
                  p.highlight
                    ? 'btn-brand cta-glow mt-6 w-full'
                    : 'btn-ghost mt-6 w-full'
                }
              >
                Testar grátis
              </a>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}

/* ---------- FAQ ---------- */

const FAQS = [
  {
    q: 'Serve só para consultas e reuniões?',
    a: 'Não. O modo Geral transcreve aulas, palestras, apresentações, treinamentos, entrevistas e qualquer conversa importante, com falantes identificados e o resumo que aquele contexto pede. O modo Clínico é otimizado para consultas e atendimentos.',
  },
  {
    q: 'Preciso avisar que estou gravando?',
    a: 'Recomendamos sempre avisar. Vale para pacientes e também para participantes de reuniões, aulas e entrevistas. O app foi desenhado para esse fluxo: a gravação é explícita, visível o tempo todo e o áudio é apagado após a transcrição.',
  },
  {
    q: 'O que acontece com o áudio da gravação?',
    a: 'Ele existe só até a transcrição terminar. Depois, é apagado: fica apenas o texto. Excluir uma sessão remove tudo de verdade.',
  },
  {
    q: 'A transcrição é boa mesmo em português?',
    a: 'O Transcript é feito para o português do Brasil, do vocabulário clínico ao das reuniões, aulas e entrevistas. Termos técnicos, siglas, medicamentos e posologia são o dia a dia dele.',
  },
  {
    q: 'Como funcionam as 3 transcrições grátis?',
    a: 'Ao criar a conta, você ganha 3 transcrições completas, sem cartão. Deu pra sentir o valor, você escolhe o plano.',
  },
  {
    q: 'Posso cancelar quando quiser?',
    a: 'Sim, sem multa e sem fidelidade. O plano mensal é mensal de verdade.',
  },
]

export function Faq() {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <section className="mx-auto max-w-3xl px-5 pb-24">
      <div className="mx-auto max-w-2xl text-center">
        <Rise dist={12}>
          <p className="eyebrow-brand">Perguntas frequentes</p>
        </Rise>
      </div>
      <div className="mt-8 space-y-2.5">
        {FAQS.map((f, i) => (
          <motion.div
            key={f.q}
            className="relative"
            initial={{ opacity: 0, y: 18, x: i % 2 ? 8 : -8 }}
            whileInView={{ opacity: 1, y: 0, x: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ ...RISE, delay: i * 0.05 }}
          >
            {/* a boia: o ponto de luz nada até a pergunta aberta */}
            {open === i && (
              <motion.span
                layoutId="faq-dot"
                aria-hidden="true"
                className="absolute left-[-4px] top-[21px] z-10 h-2 w-2 rounded-full bg-brand shadow-glow"
                transition={SNAP}
              />
            )}
            <motion.div
              className={`glass glass-top-light overflow-hidden rounded-2xl ${
                open === i ? 'shadow-card' : ''
              }`}
              animate={{ y: open === i ? -2 : 0 }}
              transition={SNAP}
            >
              <button
                type="button"
                aria-expanded={open === i}
                onClick={() => setOpen(open === i ? null : i)}
                className="flex w-full items-center justify-between px-5 py-4 text-left"
              >
                <span className="pr-4 text-[14px] font-medium text-ink-900">{f.q}</span>
                <motion.svg
                  className="h-4 w-4 shrink-0 text-ink-300"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  animate={{ rotate: open === i ? 45 : 0 }}
                  transition={{ type: 'spring', stiffness: 380, damping: 16 }}
                >
                  <path d="M12 5v14M5 12h14" />
                </motion.svg>
              </button>
              <div
                className="grid transition-[grid-template-rows] duration-300 ease-out"
                style={{ gridTemplateRows: open === i ? '1fr' : '0fr' }}
              >
                <div className="overflow-hidden">
                  {/* a resposta sobe para dentro do espaço que se abre */}
                  <motion.p
                    className="px-5 pb-4 text-[13px] font-light leading-relaxed text-ink-400"
                    animate={{
                      opacity: open === i ? 1 : 0,
                      y: open === i ? 0 : 6,
                    }}
                    transition={{
                      duration: 0.3,
                      delay: open === i ? 0.08 : 0,
                      ease: EASE,
                    }}
                  >
                    {f.a}
                  </motion.p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

/* ---------- CTA final + rodapé ---------- */

export function FinalCta() {
  const sectionRef = useRef<HTMLElement>(null)
  useSectionLive(sectionRef)
  const inView = useInView(sectionRef, { amount: 0.4 })
  const reduced = useReducedMotion() ?? false
  const floating = inView && !reduced
  const magnetic = useMagnetic()

  // o glow do rodapé infla conforme a seção entra, como aurora final
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end end'],
  })
  const glowProgress = useSpring(scrollYProgress, SOFT)
  const glowScale = useTransform(glowProgress, [0, 1], [0.6, 1])
  const glowOpacity = useTransform(glowProgress, [0, 1], [0.4, 1])

  return (
    <section ref={sectionRef} className="relative overflow-hidden px-5 py-28 text-center">
      <motion.div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          ...(reduced
            ? {}
            : { scaleY: glowScale, opacity: glowOpacity, originY: 1 }),
          background:
            'radial-gradient(70% 90% at 50% 100%, rgba(136,188,245,0.25), transparent 70%)',
        }}
      />
      {/* o único objeto em levitação franca: cérebro + sombra em contra-fase */}
      <Rise dist={16} className="mx-auto w-fit">
        <motion.img
          src="/brand/brain.png"
          alt=""
          className="mx-auto h-14 w-14"
          animate={floating ? { y: [0, -8, 0] } : { y: 0 }}
          transition={
            floating
              ? { duration: 5, repeat: Infinity, ease: 'easeInOut' }
              : { duration: 0.4 }
          }
        />
        <motion.span
          aria-hidden="true"
          className="mx-auto mt-2 block h-2 w-12 rounded-full bg-ink-900/10 blur-[3px]"
          animate={
            floating
              ? { scaleX: [1, 0.72, 1], opacity: [0.5, 0.3, 0.5] }
              : { scaleX: 1, opacity: 0.5 }
          }
          transition={
            floating
              ? { duration: 5, repeat: Infinity, ease: 'easeInOut' }
              : { duration: 0.4 }
          }
        />
      </Rise>
      <h2 className="mx-auto mt-6 max-w-2xl font-display text-3xl font-semibold tracking-tight text-ink-900 sm:text-[40px]">
        <MaskRise delay={0.08}>
          <span className="font-light">Sua próxima conversa já pode ser </span>
        </MaskRise>{' '}
        <MaskRise delay={0.18}>
          <span className="gradient-text">sem digitação.</span>
        </MaskRise>
      </h2>
      <Rise dist={14} delay={0.2} className="mt-8 flex justify-center">
        {/* poço gravitacional: o único magnetismo da página, na conversão */}
        <motion.a
          href="#planos"
          className="btn-brand cta-glow !px-8 !py-3.5 text-[15px]"
          style={{ x: magnetic.x, y: magnetic.y }}
          whileTap={{ scale: 0.97 }}
          onPointerMove={magnetic.onPointerMove}
          onPointerLeave={magnetic.reset}
        >
          Testar grátis agora
        </motion.a>
      </Rise>
      <motion.p
        className="mt-4 text-[12px] font-light text-ink-300"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.35 }}
      >
        3 transcrições grátis. Sem cartão.
      </motion.p>
    </section>
  )
}

export function Footer() {
  return (
    <footer className="border-t border-ink-100 bg-white/60">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-5 px-5 py-10 text-center sm:flex-row sm:justify-between sm:text-left">
        <div className="flex items-center gap-2.5">
          <img
            src="/brand/favicon-transcript.png"
            alt=""
            className="h-6 w-6 rounded-[7px]"
          />
          <span className="text-[13.5px] font-semibold text-ink-900">
            Syntria <span className="text-ink-400">Transcript</span>
          </span>
        </div>
        <p className="max-w-md text-[11px] font-light leading-relaxed text-ink-300">
          O Syntria Transcript apoia o registro de conversas importantes. No uso
          clínico, o conteúdo gerado deve ser revisado pelo profissional
          responsável antes de integrar o prontuário.
        </p>
        <p className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-300">
          © 2026 Syntria.ai
        </p>
      </div>
    </footer>
  )
}
