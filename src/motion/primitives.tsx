import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react'
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type Transition,
} from 'framer-motion'
import { EASE, RISE } from './tokens'

/**
 * EMERGIR, a entrada universal da página: o elemento sobe para o lugar
 * com spring que passa do alvo e assenta. Substitui os fade+y+blur.
 */
export function Rise({
  children,
  className,
  style,
  delay = 0,
  dist = 26,
  drift = 0,
  rotate = 0,
  spring = RISE,
  once = true,
  margin = '-50px',
  finalY = 0,
  hoverY,
}: {
  children: ReactNode
  className?: string
  style?: CSSProperties
  delay?: number
  dist?: number
  drift?: number
  rotate?: number
  spring?: Transition
  once?: boolean
  margin?: string
  finalY?: number
  hoverY?: number
}) {
  return (
    <motion.div
      className={className}
      style={style}
      initial={{ opacity: 0, y: dist, x: drift, rotate, scale: 0.98 }}
      whileInView={{ opacity: 1, y: finalY, x: 0, rotate: 0, scale: 1 }}
      whileHover={hoverY != null ? { y: hoverY } : undefined}
      viewport={{ once, margin }}
      transition={{ ...spring, delay }}
    >
      {children}
    </motion.div>
  )
}

/** O padrão do H1 do hero: texto sobe por trás de uma máscara. */
export function MaskRise({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode
  delay?: number
  className?: string
}) {
  return (
    <span
      className={`-mb-[0.22em] inline-block overflow-hidden pb-[0.22em] align-bottom ${className ?? ''}`}
    >
      <motion.span
        className="inline-block"
        initial={{ y: '112%' }}
        whileInView={{ y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.75, delay, ease: EASE }}
      >
        {children}
      </motion.span>
    </span>
  )
}

/**
 * Contador que sobe de zero: escreve direto no DOM via motion value,
 * zero re-render por frame. Reduced motion renderiza o valor final.
 */
export function CountUp({
  to,
  duration = 1.4,
  delay = 0,
  format = (v: number) => String(Math.round(v)),
  className,
}: {
  to: number
  duration?: number
  delay?: number
  format?: (v: number) => string
  className?: string
}) {
  const reduced = useReducedMotion() ?? false
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.5 })
  const mv = useMotionValue(0)
  const text = useTransform(mv, (v) => format(v))
  useEffect(() => {
    if (!inView) return
    if (reduced) {
      mv.set(to)
      return
    }
    const controls = animate(mv, to, { duration, delay, ease: [0.16, 1, 0.3, 1] })
    return () => controls.stop()
  }, [inView, reduced, to, duration, delay, mv])
  return (
    <motion.span ref={ref} className={className}>
      {text}
    </motion.span>
  )
}

/**
 * Traço que se desenha via pathLength. `whenInView` (default) desenha ao
 * entrar na viewport; senão obedece a `play` (máquinas de fase).
 * Paint one-shot: nunca usar em loop.
 */
export function DrawPath({
  d,
  delay = 0,
  duration = 0.8,
  whenInView = true,
  play = false,
  ...svgProps
}: {
  d: string
  delay?: number
  duration?: number
  whenInView?: boolean
  play?: boolean
} & React.ComponentProps<typeof motion.path>) {
  // pathLength fica fora do MotionConfig reducedMotion: zerar aqui
  const reduced = useReducedMotion() ?? false
  const dur = reduced ? 0 : duration
  const del = reduced ? 0 : delay
  const target = { pathLength: 1, opacity: 1 }
  const transition: Transition = {
    pathLength: { duration: dur, delay: del, ease: 'easeInOut' },
    opacity: { duration: 0.01, delay: del },
  }
  if (whenInView) {
    return (
      <motion.path
        d={d}
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={target}
        viewport={{ once: true }}
        transition={transition}
        {...svgProps}
      />
    )
  }
  return (
    <motion.path
      d={d}
      initial={{ pathLength: 0, opacity: 0 }}
      animate={play ? target : { pathLength: 0, opacity: 0 }}
      transition={transition}
      {...svgProps}
    />
  )
}
