import { useState } from 'react'
import { motion } from 'framer-motion'

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

/* ---------- Planos ---------- */

const PLANS = [
  {
    name: 'Clínico',
    desc: 'Consultas e atendimentos com transcrição clínica',
    monthly: 49.9,
    features: [
      'Transcrições clínicas ilimitadas',
      'Falantes identificados',
      'Evolução e anamnese prontas',
      'Histórico por paciente',
    ],
    highlight: false,
  },
  {
    name: 'Geral',
    desc: 'Reuniões, aulas e capturas com transcrição automática',
    monthly: 39.9,
    features: [
      'Transcrições gerais ilimitadas',
      'Falantes identificados',
      'Resumos automáticos',
      'Busca em tudo que foi dito',
    ],
    highlight: false,
  },
  {
    name: 'Completo',
    desc: 'Clínico e Geral juntos, com o copiloto por voz',
    monthly: 69.9,
    features: [
      'Tudo do Clínico e do Geral',
      'Copiloto por voz',
      'Prioridade no processamento',
      'Acesso antecipado a novidades',
    ],
    highlight: true,
  },
]

const fmt = (v: number) =>
  v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export function Pricing() {
  const [annual, setAnnual] = useState(true)
  return (
    <section id="planos" className="mx-auto max-w-5xl px-5 pb-24">
      <div className="mx-auto max-w-2xl text-center">
        <motion.p
          className="eyebrow-brand"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          Planos
        </motion.p>
        <motion.h2
          className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl"
          initial={{ opacity: 0, y: 16, filter: 'blur(7px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.06, ease: EASE }}
        >
          <span className="font-light">Escolha o seu modo. </span>
          <span className="gradient-text">Comece com 3 grátis.</span>
        </motion.h2>
        <motion.p
          className="mt-4 text-[14px] font-light text-ink-400"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.14 }}
        >
          Você ganha 3 transcrições grátis para testar. Assine quando quiser,
          cancele quando quiser.
        </motion.p>
      </div>

      {/* toggle mensal/anual */}
      <div className="mt-8 flex justify-center">
        <div className="glass-strong flex items-center gap-1 rounded-pill p-1">
          <button
            type="button"
            onClick={() => setAnnual(false)}
            className={`rounded-pill px-4 py-1.5 text-[12.5px] font-semibold transition-colors ${
              !annual ? 'bg-brand text-white' : 'text-ink-400 hover:text-ink-900'
            }`}
          >
            Mensal
          </button>
          <button
            type="button"
            onClick={() => setAnnual(true)}
            className={`flex items-center gap-1.5 rounded-pill px-4 py-1.5 text-[12.5px] font-semibold transition-colors ${
              annual ? 'bg-brand text-white' : 'text-ink-400 hover:text-ink-900'
            }`}
          >
            Anual
            <span
              className={`rounded-pill px-1.5 py-0.5 text-[10px] ${
                annual ? 'bg-white/20 text-white' : 'bg-brand/10 text-brand'
              }`}
            >
              2 meses grátis
            </span>
          </button>
        </div>
      </div>

      <div className="mt-8 grid gap-3 lg:grid-cols-3">
        {PLANS.map((p, i) => {
          const monthlyShown = annual ? (p.monthly * 10) / 12 : p.monthly
          const yearTotal = p.monthly * 10
          return (
            <motion.div
              key={p.name}
              className={`glass-top-light relative flex flex-col overflow-hidden rounded-[26px] p-7 ${
                p.highlight
                  ? 'glass-strong border-2 !border-brand/40'
                  : 'glass'
              }`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.55, delay: i * 0.08, ease: EASE }}
            >
              {p.highlight && (
                <div
                  className="pointer-events-none absolute -top-20 left-1/2 h-56 w-96 -translate-x-1/2"
                  style={{
                    background:
                      'radial-gradient(50% 50% at 50% 50%, rgba(0,111,245,0.14) 0%, transparent 72%)',
                  }}
                />
              )}
              <div className="flex h-7 items-center justify-between">
                <p className="text-[15px] font-semibold text-ink-900">{p.name}</p>
                {p.highlight && (
                  <span className="rounded-pill bg-brand px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-white">
                    Mais completo
                  </span>
                )}
              </div>
              <p className="mt-0.5 min-h-[36px] text-[12px] font-light text-ink-400">
                {p.desc}
              </p>
              <p className="mt-4 font-mono text-3xl font-medium text-ink-900">
                R$ {fmt(monthlyShown)}
                <span className="text-[14px] text-ink-300">
                  {annual ? ' /mês no anual' : ' /mês'}
                </span>
              </p>
              <p className="mt-1 min-h-[34px] text-[11.5px] font-light text-ink-300">
                {annual
                  ? `R$ ${fmt(yearTotal)} cobrados uma vez por ano`
                  : 'Cobrado mês a mês, cancele quando quiser'}
              </p>
              <ul className="mt-4 flex-1 space-y-2.5 text-[13px] text-ink-500">
                {p.features.map((t) => (
                  <li key={t} className="flex items-start gap-2.5">
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
                  </li>
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
    q: 'Preciso avisar o paciente que estou gravando?',
    a: 'Sim, e recomendamos sempre. O consentimento do paciente é seu, e o app foi desenhado para esse fluxo: a gravação é explícita, visível durante toda a consulta e o áudio é apagado após a transcrição.',
  },
  {
    q: 'O que acontece com o áudio da consulta?',
    a: 'Ele existe só até a transcrição terminar. Depois, é apagado: fica apenas o texto, criptografado. Excluir uma sessão remove tudo de verdade.',
  },
  {
    q: 'Funciona para outras profissões além da saúde?',
    a: 'Sim. O modo Geral transcreve reuniões, aulas, entrevistas e qualquer conversa, com falantes identificados e resumo. O modo Clínico é otimizado para consultas.',
  },
  {
    q: 'A transcrição é boa mesmo em português?',
    a: 'O Transcript é feito para o português do Brasil, incluindo vocabulário clínico. Termos técnicos, medicamentos e posologia são o dia a dia dele.',
  },
  {
    q: 'Como funcionam as 3 transcrições grátis?',
    a: 'Ao criar a conta, você ganha 3 transcrições completas, sem cartão. Deu pra sentir o valor, você escolhe o plano.',
  },
  {
    q: 'Posso cancelar quando quiser?',
    a: 'Sim, direto no app, sem multa e sem fidelidade. O plano mensal é mensal de verdade.',
  },
]

export function Faq() {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <section className="mx-auto max-w-3xl px-5 pb-24">
      <div className="mx-auto max-w-2xl text-center">
        <motion.p
          className="eyebrow-brand"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          Perguntas frequentes
        </motion.p>
      </div>
      <div className="mt-8 space-y-2.5">
        {FAQS.map((f, i) => (
          <motion.div
            key={f.q}
            className="glass glass-top-light overflow-hidden rounded-2xl"
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.45, delay: i * 0.05, ease: EASE }}
          >
            <button
              type="button"
              onClick={() => setOpen(open === i ? null : i)}
              className="flex w-full items-center justify-between px-5 py-4 text-left"
            >
              <span className="pr-4 text-[14px] font-medium text-ink-900">{f.q}</span>
              <svg
                className={`h-4 w-4 shrink-0 text-ink-300 transition-transform duration-200 ${open === i ? 'rotate-45' : ''}`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M12 5v14M5 12h14" />
              </svg>
            </button>
            <div
              className="grid transition-[grid-template-rows] duration-300 ease-out"
              style={{ gridTemplateRows: open === i ? '1fr' : '0fr' }}
            >
              <div className="overflow-hidden">
                <p className="px-5 pb-4 text-[13px] font-light leading-relaxed text-ink-400">
                  {f.a}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

/* ---------- CTA final + rodapé ---------- */

export function FinalCta() {
  return (
    <section className="relative overflow-hidden px-5 py-28 text-center">
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(70% 90% at 50% 100%, rgba(136,188,245,0.25), transparent 70%)',
        }}
      />
      <motion.img
        src="/brand/brain.png"
        alt=""
        className="mx-auto h-14 w-14"
        initial={{ opacity: 0, y: 16, filter: 'blur(6px)' }}
        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: EASE }}
      />
      <motion.h2
        className="mx-auto mt-6 max-w-2xl font-display text-3xl font-semibold tracking-tight text-ink-900 sm:text-[40px]"
        initial={{ opacity: 0, y: 18, filter: 'blur(7px)' }}
        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        viewport={{ once: true }}
        transition={{ duration: 0.65, delay: 0.08, ease: EASE }}
      >
        <span className="font-light">Sua próxima consulta já pode ser </span>
        <span className="gradient-text">sem digitação.</span>
      </motion.h2>
      <motion.div
        className="mt-8 flex justify-center"
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.55, delay: 0.2, ease: EASE }}
      >
        <a href="#planos" className="btn-brand cta-glow !px-8 !py-3.5 text-[15px]">
          Testar grátis agora
        </a>
      </motion.div>
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
          O Syntria Transcript apoia o registro clínico. O conteúdo gerado deve
          ser revisado pelo profissional responsável antes de integrar o
          prontuário.
        </p>
        <p className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-300">
          © 2026 Syntria.ai
        </p>
      </div>
    </footer>
  )
}
