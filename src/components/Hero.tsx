import { motion } from 'framer-motion'
import { RecStage } from './RecStage'

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-28 sm:pt-32">
      {/* cérebro carimbo */}
      <img
        src="/brand/brain.png"
        alt=""
        className="pointer-events-none absolute -right-20 top-14 -z-10 w-[380px] opacity-[0.05]"
      />

      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 pb-20 lg:grid-cols-2 lg:gap-10">
        <div>
          <motion.p
            className="eyebrow-brand"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: EASE }}
          >
            Syntria Transcript
          </motion.p>
          <h1 className="mt-4 text-4xl font-semibold leading-[1.12] tracking-tight text-ink-900 sm:text-5xl lg:text-[54px]">
            <span className="inline-block overflow-hidden pb-[0.1em] align-bottom">
              <motion.span
                className="inline-block"
                initial={{ y: '112%' }}
                animate={{ y: 0 }}
                transition={{ duration: 0.75, delay: 0.08, ease: EASE }}
              >
                <span className="font-light">Você cuida da consulta.</span>
              </motion.span>
            </span>
            <br />
            <span className="inline-block overflow-hidden pb-[0.1em] align-bottom">
              <motion.span
                className="inline-block"
                initial={{ y: '112%' }}
                animate={{ y: 0 }}
                transition={{ duration: 0.75, delay: 0.18, ease: EASE }}
              >
                <span className="gradient-text font-semibold">
                  O prontuário se escreve sozinho.
                </span>
              </motion.span>
            </span>
          </h1>
          <motion.p
            className="mt-5 max-w-lg text-[15.5px] font-light leading-relaxed text-ink-500 sm:text-lg"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: EASE }}
          >
            Grave o atendimento e receba a transcrição com cada falante
            identificado e o documento clínico pronto ao fim da consulta.
          </motion.p>
          <motion.div
            className="mt-8 flex flex-wrap items-center gap-3"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: EASE }}
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
            transition={{ duration: 0.6, delay: 0.55 }}
          >
            3 transcrições grátis para testar. Assine quando quiser.
          </motion.p>

          <motion.div
            className="mt-10 flex flex-wrap gap-x-7 gap-y-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.65 }}
          >
            {[
              'Falantes identificados automaticamente',
              'Áudio apagado após a transcrição',
              'Feito para consultas em português',
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

        <motion.div
          className="flex justify-center lg:justify-end"
          initial={{ opacity: 0, y: 26, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.75, delay: 0.35, ease: EASE }}
        >
          <RecStage />
        </motion.div>
      </div>
    </section>
  )
}
