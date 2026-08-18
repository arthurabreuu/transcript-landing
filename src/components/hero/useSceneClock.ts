import { useEffect, useRef, useState } from 'react'

/**
 * Relógio de fases da cena: devolve 0..milestones.length conforme o tempo
 * passa. Pausas (hover, drag, fora da viewport) acumulam o decorrido e a
 * retomada reagenda só os marcos restantes, mesmo padrão do autoplay.
 * Com reduced motion devolve direto a fase máxima: o estado final da
 * coreografia é o próprio estado reduzido, sem branch separado.
 */
export function useSceneClock(
  milestones: number[],
  running: boolean,
  sceneKey: string,
  reduced: boolean,
) {
  const [phase, setPhase] = useState(reduced ? milestones.length : 0)
  const elapsedRef = useRef(0)
  const startedRef = useRef(0)

  // nova cena zera o relógio e a fase
  useEffect(() => {
    elapsedRef.current = 0
    setPhase(reduced ? milestones.length : 0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sceneKey, reduced])

  useEffect(() => {
    if (reduced || !running) return
    startedRef.current = Date.now()
    const ids = milestones
      .map((t, i) => ({ t: t - elapsedRef.current, p: i + 1 }))
      .filter((m) => m.t > 0)
      .map((m) =>
        window.setTimeout(() => setPhase((cur) => Math.max(cur, m.p)), m.t),
      )
    return () => {
      ids.forEach(clearTimeout)
      elapsedRef.current += Date.now() - startedRef.current
    }
  }, [running, sceneKey, reduced, milestones])

  return phase
}
