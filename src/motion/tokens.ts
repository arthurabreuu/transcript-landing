import type { Transition } from 'framer-motion'

/**
 * Física EMPUXO da landing: o mundo é uma coluna de líquido, nada cai,
 * tudo emerge. Três springs cobrem a página inteira.
 */

export const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

/** Entrada universal: sobe com overshoot de bolha e assenta. */
export const RISE: Transition = { type: 'spring', stiffness: 130, damping: 15, mass: 1 }

/** Interação e layoutId (mesmo spring do context-chip do hero). */
export const SNAP: Transition = { type: 'spring', stiffness: 420, damping: 34 }

/** Spring de scroll com inércia que dorme de verdade. */
export const SOFT = { stiffness: 70, damping: 22, restDelta: 0.001 }
