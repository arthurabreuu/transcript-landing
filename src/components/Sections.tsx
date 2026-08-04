import { motion } from 'framer-motion'

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

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
      <motion.p
        className="eyebrow-brand"
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: EASE }}
      >
        {eyebrow}
      </motion.p>
      <motion.h2
        className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl"
        initial={{ opacity: 0, y: 16, filter: 'blur(7px)' }}
        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.06, ease: EASE }}
      >
        {title}
      </motion.h2>
      {sub && (
        <motion.p
          className="mt-4 text-[15px] font-light leading-relaxed text-ink-400"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.14, ease: EASE }}
        >
          {sub}
        </motion.p>
      )}
    </div>
  )
}

/* ---------- Como funciona ---------- */

const STEPS = [
  {
    n: '01',
    title: 'Toque em gravar',
    body: 'No começo da consulta, um toque. O Transcript trabalha em silêncio enquanto você atende.',
  },
  {
    n: '02',
    title: 'Atenda olhando nos olhos',
    body: 'Nada de digitar durante o atendimento. Cada fala é transcrita com o falante identificado.',
  },
  {
    n: '03',
    title: 'Receba o documento pronto',
    body: 'Ao encerrar, a evolução clínica organizada chega em segundos. Revise, ajuste e pronto.',
  },
]

export function HowItWorks() {
  return (
    <section id="como" className="mx-auto max-w-6xl px-5 py-24">
      <Head
        eyebrow="Como funciona"
        title={
          <>
            <span className="font-light">Um toque no início. </span>
            <span className="gradient-text">Tudo pronto no fim.</span>
          </>
        }
      />
      <div className="mt-12 grid gap-3 sm:grid-cols-3">
        {STEPS.map((s, i) => (
          <motion.div
            key={s.n}
            className="glass glass-top-light hover-card rounded-[24px] border p-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.55, delay: i * 0.09, ease: EASE }}
          >
            <span className="font-mono text-[12px] text-brand">{s.n}</span>
            <h3 className="mt-3 text-[16px] font-semibold text-ink-900">{s.title}</h3>
            <p className="mt-2 text-[13.5px] font-light leading-relaxed text-ink-400">
              {s.body}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

/* ---------- Tempo (a conta) ---------- */

export function TimeMath() {
  return (
    <section className="px-4 pb-24">
      <motion.div
        className="relative mx-auto max-w-6xl overflow-hidden rounded-[32px] text-white"
        style={{
          background:
            'radial-gradient(120% 130% at 50% 0%, #12335A 0%, #0A1628 55%, #0A0F1A 100%)',
        }}
        initial={{ opacity: 0, y: 24, filter: 'blur(7px)' }}
        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.65, ease: EASE }}
      >
        <div
          className="pointer-events-none absolute -top-28 left-1/2 h-80 w-[520px] -translate-x-1/2"
          style={{
            background:
              'radial-gradient(50% 50% at 50% 50%, rgba(0,111,245,0.22) 0%, rgba(0,111,245,0.06) 55%, transparent 75%)',
          }}
        />
        <img
          src="/brand/brain-white.png"
          alt=""
          className="pointer-events-none absolute -right-14 -top-8 w-64 opacity-[0.05]"
        />
        <div className="px-6 py-16 text-center sm:px-12 sm:py-20">
          <p className="eyebrow text-brand-300">Faça a conta</p>
          <h2 className="mx-auto mt-3 max-w-3xl font-display text-3xl font-semibold tracking-tight sm:text-[40px]">
            <span className="font-light">Dez minutos de prontuário por consulta são </span>
            <span className="gradient-text-dark font-semibold">
              duas semanas do seu ano.
            </span>
          </h2>
          <div className="mx-auto mt-12 grid max-w-3xl gap-3 sm:grid-cols-3">
            {[
              { big: '10 min', small: 'de registro manual por consulta' },
              { big: '× 16', small: 'consultas por dia, todos os dias' },
              { big: '≈ 88h', small: 'por ano viram tempo de atendimento' },
            ].map((s, i) => (
              <motion.div
                key={s.big}
                className="rounded-2xl border border-white/10 bg-white/[0.04] p-6"
                initial={{ opacity: 0, y: 20, scale: 0.96 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: 0.1 + i * 0.08, ease: EASE }}
              >
                <p className="font-display text-3xl font-bold sm:text-4xl">{s.big}</p>
                <p className="mt-2 text-[12.5px] font-light text-white/45">{s.small}</p>
              </motion.div>
            ))}
          </div>
          <motion.p
            className="mx-auto mt-8 max-w-xl text-[13.5px] font-light leading-relaxed text-white/50"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.35 }}
          >
            Com o Transcript, o registro acontece durante a consulta, não depois
            dela. Você fecha o dia com os prontuários no lugar e a cabeça livre.
          </motion.p>
        </div>
      </motion.div>
    </section>
  )
}

/* ---------- Recursos ---------- */

const FEATURES = [
  {
    title: 'Falantes identificados',
    body: 'Quem disse o quê, separado automaticamente: profissional de um lado, paciente do outro.',
  },
  {
    title: 'Documentos clínicos prontos',
    body: 'Evolução e anamnese estruturadas a partir da conversa, no seu padrão.',
  },
  {
    title: 'Modo Clínico e modo Geral',
    body: 'Consultas com vocabulário clínico, reuniões e aulas com transcrição direta. Ou os dois no Completo.',
  },
  {
    title: 'Pacientes organizados',
    body: 'Cada gravação no histórico do paciente certo. Busque qualquer coisa que foi dita.',
  },
  {
    title: 'Copiloto por voz',
    body: 'Converse com o assistente sobre seus atendimentos: criar paciente, buscar, resumir.',
  },
  {
    title: 'Privacidade por padrão',
    body: 'O áudio é apagado após a transcrição. Excluiu, apagou de verdade.',
  },
]

export function Features() {
  return (
    <section className="mx-auto max-w-6xl px-5 pb-24">
      <Head
        eyebrow="O que vem junto"
        title={
          <>
            <span className="font-light">Mais que transcrição: </span>
            <span className="gradient-text">o consultório em ordem.</span>
          </>
        }
      />
      <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f, i) => (
          <motion.div
            key={f.title}
            className="glass-subtle glass-top-light hover-card rounded-[22px] border p-6"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, delay: (i % 3) * 0.08, ease: EASE }}
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand/10 text-brand">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 12.5 9.5 18 20 6" />
              </svg>
            </span>
            <h3 className="mt-4 text-[15px] font-semibold text-ink-900">{f.title}</h3>
            <p className="mt-1.5 text-[13px] font-light leading-relaxed text-ink-400">
              {f.body}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

/* ---------- Segurança ---------- */

export function Security() {
  return (
    <section className="mx-auto max-w-4xl px-5 pb-24">
      <motion.div
        className="glass glass-top-light relative overflow-hidden rounded-[28px] p-8 text-center sm:p-12"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.6, ease: EASE }}
      >
        <div
          className="pointer-events-none absolute -top-24 left-1/2 h-72 w-[460px] -translate-x-1/2"
          style={{
            background:
              'radial-gradient(50% 50% at 50% 50%, rgba(0,111,245,0.14) 0%, transparent 72%)',
          }}
        />
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-brand/10 text-brand">
          <svg className="h-[22px] w-[22px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3l7 3v5c0 4.5-3 8.5-7 10-4-1.5-7-5.5-7-10V6l7-3z" />
            <path d="M9 12l2 2 4-4.5" />
          </svg>
        </span>
        <h2 className="mt-5 font-display text-2xl font-semibold tracking-tight text-ink-900 sm:text-3xl">
          <span className="font-light">A consulta é do paciente. </span>
          <span className="gradient-text">E fica entre vocês.</span>
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-[14px] font-light leading-relaxed text-ink-400">
          O áudio é processado e apagado: fica só o texto, criptografado. Excluir
          uma sessão remove tudo, inclusive o áudio, de verdade. Seus dados não
          treinam modelos de terceiros.
        </p>
      </motion.div>
    </section>
  )
}
