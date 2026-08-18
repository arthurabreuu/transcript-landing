import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { RISE } from '../../motion/tokens'
import type { HeroContext } from './contexts'

/**
 * A FOLHA: o protagonista do palco. Papel branco sólido (sem
 * backdrop-filter, livre para se mover), com cabeçalho padrão que se
 * estampa e corpo 100% específico por contexto. Emerge de baixo com
 * RISE e se arquiva na saída.
 */
export function DocSheet({
  ctx,
  children,
}: {
  ctx: HeroContext
  children: ReactNode
}) {
  return (
    <motion.div
      className="relative z-[1] flex min-h-[284px] flex-col rounded-2xl border border-ink-100 bg-white/95 p-4 shadow-card sm:min-h-[248px] sm:p-5"
      initial={{ opacity: 0, y: 24, rotate: -1.5 }}
      animate={{ opacity: 1, y: 0, rotate: 0 }}
      exit={{ opacity: 0, y: 18, scale: 0.96, rotate: 1.5 }}
      transition={{ ...RISE, delay: 0.06 }}
    >
      <div className="mb-3 flex items-center justify-between border-b border-ink-50 pb-2.5">
        <div className="flex min-w-0 items-center gap-2">
          <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-brand/10 text-brand">
            {ctx.icon}
          </span>
          <span className="truncate font-mono text-[10px] uppercase tracking-[0.14em] text-ink-500">
            {ctx.docTitle}
          </span>
        </div>
        <span className="shrink-0 pl-2 font-mono text-[9.5px] text-ink-400">
          hoje · {ctx.time}
        </span>
      </div>
      {/* flex-1 relative: absolutos dos corpos (carimbo) ancoram no pé do papel */}
      <div className="relative flex-1">{children}</div>
    </motion.div>
  )
}

/** A PILHA: bordas de folhas espiando atrás da ativa, com a tarja do
 *  próximo contexto. Estáticas, sem loop, sem blur: a metáfora física
 *  do produto acumulando documentos ao longo do dia. */
export function SheetStack({
  next,
  nextNext,
}: {
  next: HeroContext
  nextNext: HeroContext
}) {
  return (
    <>
      <div
        aria-hidden="true"
        className="absolute inset-x-6 top-0 hidden -translate-y-4 rotate-[-1.6deg] rounded-2xl border border-ink-100 bg-white/60 px-4 py-1.5 sm:block"
      >
        <span className="flex items-center gap-2 opacity-60">
          <span className="grid h-5 w-5 place-items-center rounded-md bg-ink-50 text-ink-300">
            {nextNext.icon}
          </span>
          <span className="truncate font-mono text-[9px] uppercase tracking-[0.14em] text-ink-300">
            {nextNext.docTitle}
          </span>
        </span>
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-x-3 top-0 -translate-y-2 rotate-[1.2deg] rounded-2xl border border-ink-100 bg-white/75 px-4 py-1.5"
      >
        <span className="flex items-center gap-2 opacity-70">
          <span className="grid h-5 w-5 place-items-center rounded-md bg-ink-50 text-ink-400">
            {next.icon}
          </span>
          <span className="truncate font-mono text-[9px] uppercase tracking-[0.14em] text-ink-400">
            {next.docTitle}
          </span>
        </span>
      </div>
    </>
  )
}
