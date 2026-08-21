import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useInView, useReducedMotion } from 'framer-motion'
import { EASE, RISE, SNAP } from '../motion/tokens'
import { useSectionLive } from '../motion/hooks'
import { Rise } from '../motion/primitives'

/**
 * O ATO DO ESTUDANTE: a mesma gravação que vira documento também vira
 * conversa. A esquerda mostra a aula virando texto (a fonte), a direita
 * mostra a pergunta virando resposta (o que se faz com o texto depois).
 * Verbos exclusivos desta seção: GRIFAR (a aula se marca sozinha),
 * PERGUNTAR (o balão sobe do canto) e DIGITAR (o console se escreve na
 * frente de quem lê).
 */

const LECTURE: Array<{ t: string; k?: boolean }> = [
  { t: 'A fotossíntese acontece dentro do ' },
  { t: 'cloroplasto', k: true },
  { t: '. Ela tem duas fases: a ' },
  { t: 'fase clara', k: true },
  { t: ', que depende de luz, e o ' },
  { t: 'ciclo de Calvin', k: true },
  { t: ', que não depende diretamente dela.' },
]

const LECTURE_META = ['42 min de aula', '0 anotação na mão']

/** O que sai da aula: cada linha é derivável da fala mostrada acima. */
const LECTURE_SUMMARY = [
  'A fotossíntese acontece dentro do cloroplasto',
  'Fase clara: depende de luz',
  'Ciclo de Calvin: não depende diretamente da luz',
]

const STUDY_QA = [
  {
    q: '3 pontos principais',
    lines: [
      '1. A fotossíntese acontece no cloroplasto, principalmente nas folhas.',
      '2. Ela transforma luz em energia química e libera oxigênio.',
      '3. São duas fases: a fase clara, que depende de luz, e o ciclo de Calvin.',
    ],
  },
  {
    q: 'Monte 5 perguntas de revisão',
    lines: [
      '1. Onde ocorre a fotossíntese dentro da célula?',
      '2. O que a planta produz e o que ela libera?',
      '3. O que diferencia a fase clara do ciclo de Calvin?',
      '4. Qual é o papel da clorofila no processo?',
      '5. Por que a fase clara depende de luz e a outra não?',
    ],
  },
  {
    q: 'Resuma em um parágrafo',
    lines: [
      'A professora explicou como a planta transforma luz em energia química.',
      'Tudo acontece no cloroplasto, em duas etapas: uma que depende de luz e outra que não depende dela diretamente.',
      'No fim do processo, a planta produz glicose e libera oxigênio.',
    ],
  },
  {
    q: 'Em que minuto ela fala de clorofila?',
    lines: [
      'Aos 12:40, quando ela explica por que a folha é verde.',
      'É o trecho em que a clorofila aparece absorvendo luz na fase clara.',
    ],
  },
]

const QA_DUR = 6200
const QA_RESUME_MS = 14000

const AI_PROMPT =
  'Me dá insights sobre essa aula. Quero fixar o conteúdo e ir além do que foi ensinado.'

const AI_ANSWER = [
  {
    k: 'Conexão',
    t: 'a respiração celular é o caminho inverso da fotossíntese. Vale colocar as duas equações lado a lado.',
  },
  {
    k: 'Aplicação',
    t: 'o princípio da fase clara, captar luz e converter em energia, é o mesmo de um painel solar.',
  },
  {
    k: 'Teste seu entendimento',
    t: 'o que aconteceria com a fotossíntese num ambiente sem CO₂?',
  },
]

const AI_CLOSER =
  'É assim que você sai da decoreba e entende o porquê do processo, não só o que cai na prova.'

const STUDY_TAGS = [
  'Cursos online',
  'Aulas gravadas',
  'Faculdade e cursinho',
  'Grupos de estudo',
  'Revisão para a prova',
]

/* ---------- a aula que se grifa sozinha ---------- */

function Lecture() {
  const ref = useRef<HTMLDivElement>(null)
  const on = useInView(ref, { once: true, amount: 0.5 })
  let mark = 0

  return (
    <div ref={ref}>
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-brand">
          Aula · Biologia
        </span>
        <span className="flex items-center gap-1.5">
          <span className="rec-dot h-1.5 w-1.5 rounded-full bg-rec" />
          <span className="font-mono text-[9.5px] uppercase tracking-[0.16em] text-ink-400">
            rec
          </span>
        </span>
      </div>
      <span className="mt-3 inline-block rounded-pill bg-ink-100/80 px-2.5 py-1 font-mono text-[9.5px] uppercase tracking-[0.12em] text-ink-400">
        Professora
      </span>
      <p className="mt-3 rounded-2xl bg-brand-50 p-4 text-[13.5px] font-light leading-relaxed text-ink-500">
        <span className="text-ink-200">“</span>
        {LECTURE.map((p, i) => {
          if (!p.k) return <span key={i}>{p.t}</span>
          const delay = 0.35 + mark++ * 0.45
          return (
            <span key={i} className="relative whitespace-pre-wrap">
              <motion.span
                aria-hidden="true"
                className="absolute inset-x-[-3px] inset-y-[-1px] -z-0 rounded-[5px] bg-brand/15"
                style={{ originX: 0 }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: on ? 1 : 0 }}
                transition={{ duration: 0.5, delay: on ? delay : 0, ease: EASE }}
              />
              <span
                className={`relative font-semibold transition-colors duration-500 ${
                  on ? 'text-brand-600' : 'text-ink-500'
                }`}
                style={{ transitionDelay: on ? `${delay * 1000}ms` : '0ms' }}
              >
                {p.t}
              </span>
            </span>
          )
        })}
        <span className="text-ink-200">”</span>
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1.5">
        {LECTURE_META.map((t, i) => (
          <span key={t} className="flex items-center gap-2">
            {i > 0 && <span className="text-brand-300">·</span>}
            <motion.span
              className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-ink-400"
              initial={{ opacity: 0, y: 6 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...RISE, delay: 1.2 + i * 0.12 }}
            >
              {t}
            </motion.span>
          </span>
        ))}
      </div>

      {/* a saída: a folha de estudo que nasce da mesma aula */}
      <motion.div
        className="mt-5 rounded-2xl border border-ink-100 bg-white p-4 shadow-sm"
        initial={{ opacity: 0, y: 18 }}
        animate={on ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
        transition={{ ...RISE, delay: on ? 1.5 : 0 }}
      >
        <div className="flex items-center justify-between border-b border-ink-50 pb-2.5">
          <span className="flex min-w-0 items-center gap-2">
            <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-brand/10 text-brand">
              <svg
                className="h-3 w-3"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="7" y="3" width="14" height="11" rx="2" />
                <path d="M3 8v9a3 3 0 0 0 3 3h10" />
              </svg>
            </span>
            <span className="truncate font-mono text-[9.5px] uppercase tracking-[0.14em] text-ink-500">
              Resumo de estudo · Biologia
            </span>
          </span>
          <span className="shrink-0 pl-2 font-mono text-[9px] text-ink-400">
            no fim da aula
          </span>
        </div>
        <div className="mt-3 space-y-1.5">
          {LECTURE_SUMMARY.map((b, i) => (
            <div key={b} className="flex gap-2">
              <motion.span
                className="mt-[6px] h-1.5 w-1.5 shrink-0 rounded-full bg-brand"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={on ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
                transition={{ ...SNAP, delay: on ? 1.75 + i * 0.16 : 0 }}
              />
              <span className="block overflow-hidden">
                <motion.span
                  className="block text-[12.5px] font-light leading-snug text-ink-700"
                  initial={{ y: '110%' }}
                  animate={on ? { y: 0 } : { y: '110%' }}
                  transition={{ ...RISE, delay: on ? 1.82 + i * 0.16 : 0 }}
                >
                  {b}
                </motion.span>
              </span>
            </div>
          ))}
        </div>
        <motion.span
          className="mt-3 inline-flex items-center gap-1.5 rounded-pill bg-brand/10 px-2.5 py-1 font-mono text-[9.5px] uppercase tracking-[0.12em] text-brand-600"
          initial={{ opacity: 0, scale: 0.7 }}
          animate={on ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.7 }}
          transition={{ ...SNAP, delay: on ? 2.45 : 0 }}
        >
          <svg
            className="h-3 w-3"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 12.5 9.5 18 20 6" />
          </svg>
          pontos-chave marcados
        </motion.span>
      </motion.div>
    </div>
  )
}

/* ---------- a conversa sobre a aula ---------- */

function StudyChat() {
  const [active, setActive] = useState(0)
  const [manual, setManual] = useState(false)
  const [hovered, setHovered] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { amount: 0.4 })
  const reduced = useReducedMotion() ?? false
  const running = inView && !hovered && !manual && !reduced

  useEffect(() => {
    if (!running) return
    const id = window.setTimeout(
      () => setActive((a) => (a + 1) % STUDY_QA.length),
      QA_DUR,
    )
    return () => clearTimeout(id)
  }, [running, active])

  useEffect(() => {
    if (!manual) return
    const id = window.setTimeout(() => setManual(false), QA_RESUME_MS)
    return () => clearTimeout(id)
  }, [manual, active])

  const pick = (i: number) => {
    setActive(i)
    setManual(true)
  }

  const qa = STUDY_QA[active]

  return (
    <div
      ref={ref}
      className="relative flex h-full flex-col overflow-hidden rounded-[24px] p-5 text-white shadow-card sm:p-6"
      style={{
        background:
          'radial-gradient(120% 130% at 100% 0%, #14294B 0%, #0A1628 55%, #0A0F1A 100%)',
      }}
      onPointerEnter={(e) => {
        if (e.pointerType === 'mouse') setHovered(true)
      }}
      onPointerLeave={(e) => {
        if (e.pointerType === 'mouse') setHovered(false)
      }}
    >
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-brand-300">
          Assistente · sobre essa aula
        </span>
        <span className="flex items-center gap-1.5">
          <span className="rec-dot h-1.5 w-1.5 rounded-full bg-ok" />
          <span className="font-mono text-[9.5px] uppercase tracking-[0.16em] text-white/40">
            online
          </span>
        </span>
      </div>

      <div
        role="tablist"
        aria-label="Perguntas sobre a aula"
        className="mt-4 flex flex-wrap gap-1.5"
      >
        {STUDY_QA.map((item, i) => {
          const isActive = i === active
          return (
            <button
              key={item.q}
              type="button"
              role="tab"
              aria-selected={isActive}
              tabIndex={isActive ? 0 : -1}
              onClick={() => pick(i)}
              className={`relative rounded-pill px-3 py-1.5 text-[11.5px] font-medium transition-colors duration-300 ${
                isActive
                  ? 'text-white'
                  : 'border border-white/15 bg-white/[0.06] text-white/60 hover:text-white'
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId="study-chip"
                  className="absolute inset-0 rounded-pill bg-brand shadow-glow"
                  transition={SNAP}
                />
              )}
              <span className="relative z-[1]">{item.q}</span>
            </button>
          )
        })}
      </div>

      <div className="mt-5 flex min-h-[196px] flex-1 flex-col gap-2.5">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={qa.q}
            className="flex flex-col gap-2.5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.14 }}
          >
            <motion.p
              className="max-w-[88%] self-end rounded-2xl rounded-br-[6px] bg-brand px-3.5 py-2.5 text-[12.5px] leading-snug"
              initial={{ opacity: 0, x: 18, y: 8 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ ...SNAP, delay: 0.04 }}
            >
              {qa.q.endsWith('?') ? qa.q : `${qa.q}?`}
            </motion.p>
            {/* o balão sobe junto com as linhas: nada de caixa vazia na troca */}
            <motion.div
              className="max-w-[92%] self-start rounded-2xl rounded-bl-[6px] border border-white/10 bg-white/[0.07] px-3.5 py-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...SNAP, delay: 0.14 }}
            >
              {qa.lines.map((l, i) => (
                <motion.p
                  key={l}
                  className="text-[12.5px] font-light leading-relaxed text-white/80 [&+&]:mt-1.5"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...RISE, delay: 0.2 + i * 0.07 }}
                >
                  {l}
                </motion.p>
              ))}
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      <p className="mt-4 flex items-center gap-2 border-t border-white/10 pt-3 text-[11px] font-light text-white/40">
        <svg
          className="h-3.5 w-3.5 shrink-0 text-brand-300"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 3l7 3v5c0 4.5-3 8.5-7 10-4-1.5-7-5.5-7-10V6l7-3z" />
        </svg>
        A aula que você gravou é sua. O áudio é apagado depois de virar texto.
      </p>
    </div>
  )
}

/* ---------- o console que se escreve sozinho ---------- */

function AiConsole() {
  const ref = useRef<HTMLDivElement>(null)
  const started = useInView(ref, { once: true, amount: 0.45 })
  const reduced = useReducedMotion() ?? false
  const [typed, setTyped] = useState(0)

  useEffect(() => {
    if (!started) return
    if (reduced) {
      setTyped(AI_PROMPT.length)
      return
    }
    const id = window.setInterval(() => {
      setTyped((v) => {
        if (v >= AI_PROMPT.length) {
          clearInterval(id)
          return v
        }
        return v + 1
      })
    }, 24)
    return () => clearInterval(id)
  }, [started, reduced])

  const done = typed >= AI_PROMPT.length

  return (
    <div ref={ref} className="mx-auto mt-8 max-w-2xl">
      <div className="glass-strong glass-top-light rounded-[26px] p-5 shadow-card sm:p-6">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-brand">
            Assistente de IA · Syntria
          </span>
          <motion.span
            className="font-mono text-[9.5px] uppercase tracking-[0.16em] text-ink-400"
            animate={{ opacity: done ? 1 : 0.45 }}
            transition={{ duration: 0.4 }}
          >
            {done ? 'respondendo' : 'ouvindo'}
          </motion.span>
        </div>

        <div className="mt-4 flex items-center gap-3 rounded-pill border border-white/70 bg-white/70 py-2.5 pl-3 pr-2.5">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand/10 text-brand">
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="9" y="3" width="6" height="11" rx="3" />
              <path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
            </svg>
          </span>
          <p className="min-h-[20px] flex-1 text-left text-[13px] font-light leading-snug text-ink-900 sm:text-[13.5px]">
            {AI_PROMPT.slice(0, typed)}
            {!done && (
              <span className="caret ml-0.5 inline-block h-[13px] w-[2px] translate-y-[2px] rounded-pill bg-brand" />
            )}
          </p>
          <motion.span
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand text-white shadow-glow"
            animate={done ? { scale: [1, 0.88, 1] } : { scale: 1 }}
            transition={{ duration: 0.4, ease: EASE }}
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </motion.span>
        </div>

        <motion.div
          className="overflow-hidden"
          initial={false}
          animate={{ height: done ? 'auto' : 0, opacity: done ? 1 : 0 }}
          transition={{ duration: 0.5, delay: done ? 0.35 : 0, ease: EASE }}
        >
          <div
            className="mt-4 rounded-[20px] p-5 text-left"
            style={{
              background:
                'radial-gradient(120% 130% at 0% 0%, #14294B 0%, #0A1628 60%, #0A0F1A 100%)',
            }}
          >
            {AI_ANSWER.map((b, i) => (
              <motion.p
                key={b.k}
                className="flex gap-2.5 text-[12.5px] font-light leading-relaxed text-white/75 [&+&]:mt-2.5"
                initial={{ opacity: 0, y: 10 }}
                animate={done ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                transition={{ ...RISE, delay: done ? 0.55 + i * 0.14 : 0 }}
              >
                <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-brand-300" />
                <span>
                  <span className="font-semibold text-white">{b.k}:</span> {b.t}
                </span>
              </motion.p>
            ))}
            <motion.p
              className="mt-4 border-t border-white/10 pt-3 text-[12px] font-light leading-relaxed text-white/45"
              initial={{ opacity: 0 }}
              animate={{ opacity: done ? 1 : 0 }}
              transition={{ duration: 0.5, delay: done ? 1.1 : 0 }}
            >
              {AI_CLOSER}
            </motion.p>
          </div>
        </motion.div>

        <p className="mt-4 text-center font-mono text-[9.5px] uppercase tracking-[0.16em] text-ink-300">
          você pergunta em voz alta · o assistente responde sobre a sua gravação
        </p>
      </div>
    </div>
  )
}

/* ---------- a seção ---------- */

export function Students() {
  const ref = useRef<HTMLElement>(null)
  useSectionLive(ref)

  return (
    <section
      ref={ref}
      id="estudantes"
      className="mx-auto max-w-6xl scroll-mt-20 px-5 pb-24"
    >
      <div className="mx-auto max-w-2xl text-center">
        <Rise dist={12}>
          <p className="eyebrow-brand">Estude melhor</p>
        </Rise>
        <Rise dist={18} delay={0.06}>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl">
            <span className="font-light">Grave a aula. Pergunte depois. </span>
            <span className="gradient-text">Fixe de verdade.</span>
          </h2>
        </Rise>
        <Rise dist={14} delay={0.14}>
          <p className="mt-4 text-[15px] font-light leading-relaxed text-ink-400">
            Curso online, aula da faculdade, live do professor: grave com o
            Transcript e depois converse com a IA sobre o conteúdo. Revisar,
            montar pergunta, tirar dúvida do que passou batido. Estudar de novo,
            não só arquivar.
          </p>
        </Rise>
      </div>

      <Rise
        className="glass glass-top-light mt-12 rounded-[32px] p-5 sm:p-8"
        dist={38}
        margin="-70px"
      >
        <div className="grid gap-4 lg:grid-cols-[1.05fr_1fr]">
          <Rise
            className="rounded-[24px] border border-ink-100 bg-white/95 p-5 shadow-card sm:p-6"
            dist={26}
            delay={0.08}
          >
            <Lecture />
          </Rise>
          <Rise dist={26} delay={0.16} className="h-full">
            <StudyChat />
          </Rise>
        </div>

        <div className="mt-8 border-t border-white/60 pt-7 text-center">
          <Rise dist={16}>
            <p className="mx-auto max-w-xl font-display text-xl font-semibold leading-snug tracking-tight sm:text-2xl">
              <span className="font-light text-ink-900">Insight de verdade, </span>
              <span className="gradient-text">tirado do que foi dito ali.</span>
            </p>
          </Rise>
          <AiConsole />
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {STUDY_TAGS.map((t, i) => (
            <motion.span
              key={t}
              className="glass-flat rounded-pill border px-3 py-1.5 text-[12px] text-ink-500"
              initial={{ opacity: 0, scale: 0.85, y: 8 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              whileHover={{ y: -3 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 18,
                delay: i * 0.05,
              }}
            >
              {t}
            </motion.span>
          ))}
        </div>
      </Rise>
    </section>
  )
}
