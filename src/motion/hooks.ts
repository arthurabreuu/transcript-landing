import { useEffect, useState, type PointerEvent, type RefObject } from 'react'
import {
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'framer-motion'

/** matchMedia reativo: acompanha mudanças da preferência com a aba aberta. */
export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches)
  useEffect(() => {
    const mq = window.matchMedia(query)
    const on = () => setMatches(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [query])
  return matches
}

/** Chave-geral do modo leve: desliga tilt, magnetismo, orbes e parallax. */
export function useLite() {
  const coarse = useMediaQuery('(pointer: coarse)')
  const reduced = useReducedMotion() ?? false
  return coarse || reduced
}

/**
 * Marca a seção com data-live conforme entra/sai da viewport; a regra CSS
 * [data-live='false'] pausa todos os loops (.float-bob, .orb, .minute, .phonon).
 */
export function useSectionLive(ref: RefObject<HTMLElement | null>) {
  const inView = useInView(ref, { amount: 0.15 })
  useEffect(() => {
    ref.current?.setAttribute('data-live', String(inView))
  }, [inView, ref])
}

/**
 * Tilt de profundidade: devolve rotateX/rotateY com spring. SEMPRE aplicar
 * num wrapper INTERNO ao vidro; o backdrop-filter nunca deve se mover.
 * Só reage a mouse (touch é ignorado) e a reduced motion o desliga.
 */
export function useTilt(maxDeg = 3) {
  const reduced = useReducedMotion() ?? false
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [maxDeg, -maxDeg]), {
    stiffness: 150,
    damping: 18,
  })
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-maxDeg, maxDeg]), {
    stiffness: 150,
    damping: 18,
  })
  const onPointerMove = (e: PointerEvent<HTMLElement>) => {
    if (reduced || e.pointerType !== 'mouse') return
    const r = e.currentTarget.getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width - 0.5)
    my.set((e.clientY - r.top) / r.height - 0.5)
  }
  const reset = () => {
    mx.set(0)
    my.set(0)
  }
  return { rotateX, rotateY, onPointerMove, reset }
}

/** Poço gravitacional de CTA: o botão desliza alguns px na direção do cursor. */
export function useMagnetic(pull = 0.22, max = 6) {
  const reduced = useReducedMotion() ?? false
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const x = useSpring(mx, { stiffness: 200, damping: 18 })
  const y = useSpring(my, { stiffness: 200, damping: 18 })
  const onPointerMove = (e: PointerEvent<HTMLElement>) => {
    if (reduced || e.pointerType !== 'mouse') return
    const r = e.currentTarget.getBoundingClientRect()
    const clamp = (v: number) => Math.max(-max, Math.min(max, v * pull))
    mx.set(clamp(e.clientX - (r.left + r.width / 2)))
    my.set(clamp(e.clientY - (r.top + r.height / 2)))
  }
  const reset = () => {
    mx.set(0)
    my.set(0)
  }
  return { x, y, onPointerMove, reset }
}
