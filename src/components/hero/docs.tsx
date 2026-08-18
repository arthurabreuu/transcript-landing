import { type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { RISE, SNAP } from '../../motion/tokens'
import { CountUp, DrawPath } from '../../motion/primitives'

/**
 * Os 8 corpos de documento do palco. Cada um tem um verbo de animação
 * EXCLUSIVO: carimbar, marcar checkbox, virar flashcard 3D, ampliar
 * tipografia, enviar e-mail, encher barras, desenhar espinha, convergir
 * e selar. Nenhum par de cenas compartilha o verbo principal.
 * Contrato: phase 0..5 (com reduced motion a fase já chega no máximo).
 */
export interface DocBodyProps {
  phase: number
  lite: boolean
}

/* ---------- helpers compartilhados ---------- */

/** Aparece com pop de spring quando `on`. */
function Pop({
  on,
  delay = 0,
  className,
  children,
}: {
  on: boolean
  delay?: number
  className?: string
  children?: ReactNode
}) {
  return (
    <motion.span
      className={className}
      initial={{ opacity: 0, scale: 0.6 }}
      animate={on ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.6 }}
      transition={{ ...SNAP, delay: on ? delay : 0 }}
    >
      {children}
    </motion.span>
  )
}

/** Texto que sobe por trás de uma máscara quando `on` (eco do H1). */
function MaskLine({
  on,
  delay = 0,
  className,
  children,
}: {
  on: boolean
  delay?: number
  className?: string
  children: ReactNode
}) {
  return (
    <span className={`block overflow-hidden ${className ?? ''}`}>
      <motion.span
        className="block"
        initial={{ y: '110%' }}
        animate={{ y: on ? 0 : '110%' }}
        transition={{ ...RISE, delay: on ? delay : 0 }}
      >
        {children}
      </motion.span>
    </span>
  )
}

/** Linha que se digita palavra a palavra quando `on`; reserva o espaço. */
function TypedLine({
  words,
  on,
  speed = 0.035,
  className,
}: {
  words: Array<{ w: string; k?: boolean }>
  on: boolean
  speed?: number
  className?: string
}) {
  if (!on) {
    // placeholder com a MESMA métrica (semibold incluso) para não reflowar
    return (
      <span className={className} style={{ visibility: 'hidden' }}>
        {words.map((t, i) => (
          <span key={i} className={t.k ? 'font-semibold' : undefined}>
            {t.w}{' '}
          </span>
        ))}
      </span>
    )
  }
  return (
    <span className={className}>
      {words.map((t, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.12, delay: i * speed }}
          className={t.k ? 'font-semibold text-brand-600' : undefined}
        >
          {t.w}{' '}
        </motion.span>
      ))}
    </span>
  )
}

/* ---------- 1. Consulta · Prontuário (verbo: CARIMBAR) ---------- */

function Field({
  label,
  value,
  on,
  lite,
}: {
  label: string
  value: string
  on: boolean
  lite: boolean
}) {
  return (
    <div>
      <p className="mb-1 font-mono text-[9px] uppercase tracking-[0.14em] text-ink-400">
        {label}
      </p>
      <div className="relative rounded-lg border border-ink-100 bg-ink-50/60 px-3 py-2">
        <Pop on={on} className="block text-[13px] font-semibold text-ink-900">
          {value}
        </Pop>
        {/* sublinhado que se desenha antes do valor pousar */}
        <motion.span
          className="absolute inset-x-2 bottom-1 h-px bg-brand/50"
          style={{ originX: 0 }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: on ? 1 : 0 }}
          transition={{ duration: 0.35 }}
        />
        {/* flash de foco, como um input real recebendo o dado */}
        {on && !lite && (
          <motion.span
            className="pointer-events-none absolute inset-0 rounded-lg ring-2 ring-brand/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 0.45 }}
          />
        )}
      </div>
    </div>
  )
}

export function DocProntuario({ phase, lite }: DocBodyProps) {
  // sem relative aqui: o carimbo ancora no pé do papel (wrapper do DocSheet)
  return (
    <div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Peso atual" value="82 kg" on={phase >= 2} lite={lite} />
        <Field
          label="Hábito relatado"
          value="pula o café da manhã"
          on={phase >= 3}
          lite={lite}
        />
      </div>
      {/* o relato entra organizado na anamnese */}
      <motion.div
        className="mt-3 inline-flex items-center gap-1.5 rounded-pill bg-brand/10 px-2.5 py-1 text-[10.5px] font-semibold text-brand-700"
        initial={{ opacity: 0, y: 10 }}
        animate={phase >= 4 ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
        transition={RISE}
      >
        <svg className="h-2.5 w-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="5" y="4" width="14" height="17" rx="2" />
          <path d="M9 10h6M9 14h6" />
        </svg>
        Anamnese: omissão do desjejum
      </motion.div>
      {/* o único thunk físico da demo */}
      <motion.div
        className="absolute bottom-0 right-0 grid h-14 w-14 place-items-center rounded-full border-2 border-ok/70 text-[#0B7A55]"
        initial={{ opacity: 0, scale: 1.6, rotate: -14 }}
        animate={
          phase >= 5
            ? { opacity: 1, scale: 1, rotate: -8 }
            : { opacity: 0, scale: 1.6, rotate: -14 }
        }
        transition={{ type: 'spring', stiffness: 500, damping: 22 }}
      >
        <span className="flex flex-col items-center">
          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 12.5 9.5 18 20 6" />
          </svg>
          <span className="mt-0.5 font-mono text-[7px] uppercase tracking-[0.16em]">
            registrado
          </span>
        </span>
      </motion.div>
    </div>
  )
}

/* ---------- 2. Reunião · Ata com tarefas (verbo: MARCAR) ---------- */

const TASKS = [
  { text: 'Revisar proposta comercial', who: 'VC', when: 'sexta' },
  { text: 'Fechar com o fornecedor', who: 'LÉ', when: 'semana' },
]

export function DocAta({ phase, lite }: DocBodyProps) {
  return (
    <div>
      <p className="border-b border-ink-100 pb-1.5 font-mono text-[9px] uppercase tracking-[0.14em] text-ink-400">
        Decisões e tarefas
      </p>
      <div className="mt-2.5 space-y-2">
        {TASKS.map((t, i) => {
          // a linha entra na ata organizada: o checkbox fica VAZIO de
          // propósito (a lista é sua, o Transcript só organiza)
          const filed = phase >= 4 + i
          return (
            <motion.div
              key={t.text}
              className="relative flex items-center gap-2.5 overflow-hidden rounded-lg border border-ink-100 bg-white px-3 py-2"
              initial={{ opacity: 0, x: -16 }}
              animate={phase >= 2 ? { opacity: 1, x: 0 } : { opacity: 0, x: -16 }}
              transition={{ ...RISE, delay: lite ? 0 : i * 0.12 }}
            >
              <motion.span
                className="absolute inset-y-0 left-0 w-[3px] bg-brand"
                style={{ originY: 0 }}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: filed ? 1 : 0 }}
                transition={{ duration: 0.3 }}
              />
              <span className="h-4 w-4 shrink-0 rounded-[5px] border-[1.5px] border-ink-200" />
              <span className="min-w-0 flex-1 truncate text-[12px] font-medium text-ink-700">
                {t.text}
              </span>
              <Pop
                on={phase >= 3}
                delay={lite ? 0 : i * 0.12}
                className="grid h-5 w-6 place-items-center rounded-pill bg-brand-100 font-mono text-[9px] font-bold text-brand-700"
              >
                {t.who}
              </Pop>
              <Pop
                on={phase >= 3}
                delay={lite ? 0 : 0.15 + i * 0.12}
                className="rounded-pill border border-ink-100 bg-ink-50 px-2 py-0.5 font-mono text-[9px] text-ink-500"
              >
                {t.when}
              </Pop>
            </motion.div>
          )
        })}
      </div>
      <motion.p
        className="mt-2.5 font-mono text-[9.5px] text-ink-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: phase >= 5 ? 1 : 0 }}
        transition={{ duration: 0.4 }}
      >
        ata pronta · 2 tarefas para revisar
      </motion.p>
    </div>
  )
}

/* ---------- 3. Aula · Resumo com flashcard (verbo: VIRAR 3D) ---------- */

export function DocResumo({ phase, lite }: DocBodyProps) {
  // o giro encena a transformação real: o trecho falado vira nota organizada
  const flipped = phase >= 4
  const front = (
    <>
      <span className="font-mono text-[8px] uppercase tracking-[0.16em] text-ink-400">
        trecho da aula
      </span>
      <span className="mt-1 text-[11.5px] font-light leading-snug text-ink-700">
        “a fotossíntese transforma luz em energia química, e isso cai na prova”
      </span>
    </>
  )
  const back = (
    <>
      <span className="font-mono text-[8px] uppercase tracking-[0.16em] text-brand-600">
        organizado
      </span>
      <span className="mt-1 text-[12.5px] font-semibold text-ink-900">
        Fotossíntese: luz vira{' '}
        <span className="text-brand-600">energia química</span>
      </span>
    </>
  )
  return (
    <div>
      <div className="space-y-1.5">
        {[
          'Fotossíntese converte luz em energia química',
          'A clorofila absorve a luz nas folhas',
        ].map((b, i) => (
          <div key={b} className="flex gap-2">
            <Pop on={phase >= 2} delay={lite ? 0 : i * 0.15} className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
            <MaskLine on={phase >= 2} delay={lite ? 0 : 0.1 + i * 0.15} className="text-[12px] text-ink-700">
              {b}
            </MaskLine>
          </div>
        ))}
      </div>
      <motion.div
        className="relative mt-3"
        initial={{ opacity: 0, y: 18 }}
        animate={phase >= 3 ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
        transition={RISE}
      >
        <div className="relative h-[88px] [perspective:800px]">
          {lite ? (
            /* no toque, o giro 3D vira crossfade */
            <>
              <motion.div
                className="absolute inset-0 grid place-items-center rounded-xl border border-ink-100 bg-white px-4 text-center"
                animate={{ opacity: flipped ? 0 : 1 }}
                transition={{ duration: 0.35 }}
              >
                <span className="flex flex-col items-center">{front}</span>
              </motion.div>
              <motion.div
                className="absolute inset-0 grid place-items-center rounded-xl border border-brand/20 bg-brand-50 px-4 text-center"
                animate={{ opacity: flipped ? 1 : 0 }}
                transition={{ duration: 0.35 }}
              >
                <span className="flex flex-col items-center">{back}</span>
              </motion.div>
            </>
          ) : (
            <motion.div
              className="absolute inset-0"
              style={{ transformStyle: 'preserve-3d' }}
              animate={{ rotateY: flipped ? 180 : 0 }}
              transition={{ type: 'spring', stiffness: 180, damping: 22 }}
            >
              <div className="backface-hidden absolute inset-0 grid place-items-center rounded-xl border border-ink-100 bg-white px-4 text-center">
                <span className="flex flex-col items-center">{front}</span>
              </div>
              <div className="backface-hidden absolute inset-0 grid place-items-center rounded-xl border border-brand/20 bg-brand-50 px-4 text-center [transform:rotateY(180deg)]">
                <span className="flex flex-col items-center">{back}</span>
              </div>
            </motion.div>
          )}
        </div>
        <motion.span
          className="absolute -top-2 right-3 rounded-pill bg-warn/15 px-2 py-0.5 text-[9.5px] font-bold text-[#B45309]"
          initial={{ opacity: 0 }}
          animate={
            phase >= 5 ? { opacity: 1, scale: [1, 1.08, 1] } : { opacity: 0 }
          }
          transition={{ duration: 0.5 }}
        >
          Cai na prova
        </motion.span>
      </motion.div>
    </div>
  )
}

/* ---------- 4. Palestra · Pull-quote (verbo: AMPLIAR) ---------- */

export function DocCitacao({ phase }: DocBodyProps) {
  return (
    <div className="relative pl-5">
      {/* régua editorial que se desenha de cima para baixo */}
      <motion.span
        className="absolute bottom-1 left-0 top-1 w-[3px] rounded-pill bg-brand"
        style={{ originY: 0 }}
        initial={{ scaleY: 0 }}
        animate={{ scaleY: phase >= 3 ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      />
      <motion.span
        aria-hidden="true"
        className="absolute -top-1 right-1 select-none font-display text-[44px] leading-none text-brand-200"
        initial={{ opacity: 0 }}
        animate={{ opacity: phase >= 5 ? 1 : 0 }}
        transition={{ duration: 0.8 }}
      >
        ”
      </motion.span>
      <Pop on={phase >= 2} className="block">
        <span className="font-display text-[44px] font-semibold leading-none tracking-tight text-ink-900 sm:text-[52px]">
          {phase >= 3 ? (
            <CountUp to={70} duration={1.1} format={(v) => String(Math.round(v))} />
          ) : (
            '0'
          )}
          <span className="text-brand-600">%</span>
        </span>
      </Pop>
      <div className="mt-1.5">
        <MaskLine on={phase >= 4} className="text-[14px] font-light leading-snug text-ink-700">
          dos clientes decidem
        </MaskLine>
        <MaskLine on={phase >= 4} delay={0.12} className="text-[14px] font-light leading-snug text-ink-700">
          nos <span className="font-semibold text-brand-600">primeiros 8 segundos</span>
        </MaskLine>
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: phase >= 5 ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      >
        <p className="mt-2.5 font-mono text-[9.5px] uppercase tracking-[0.14em] text-ink-400">
          Palestrante · principal insight
        </p>
        <p className="mt-1.5 text-[11.5px] text-ink-500">
          Decisão é emocional, justificativa vem depois
        </p>
      </motion.div>
    </div>
  )
}

/* ---------- 5. Apresentação · E-mail (verbo: ENVIAR) ---------- */

const EMAIL_BODY = [
  { w: 'Nossa' },
  { w: 'proposta' },
  { w: 'reduz' },
  { w: 'o' },
  { w: 'custo' },
  { w: 'em' },
  { w: '18%', k: true },
  { w: 'já' },
  { w: 'no' },
  { w: 'primeiro', k: true },
  { w: 'trimestre.', k: true },
]

export function DocEmail({ phase }: DocBodyProps) {
  return (
    <div className="relative">
      {/* aqui é o documento que se redige sozinho; o envio é SEU:
          o fecho entrega um rascunho pronto, não um e-mail disparado */}
      <div className="overflow-hidden rounded-xl border border-ink-100 bg-white">
        <div className="flex gap-1.5 border-b border-ink-50 px-3 py-2">
          <span className="h-2 w-2 rounded-full bg-ink-100" />
          <span className="h-2 w-2 rounded-full bg-ink-100" />
          <span className="h-2 w-2 rounded-full bg-ink-100" />
        </div>
        <div className="border-b border-ink-50 px-3 py-1.5 font-mono text-[10.5px]">
          <span className="text-ink-400">Para: </span>
          <TypedLine
            words={[{ w: 'cliente@empresa.com' }]}
            on={phase >= 2}
            className="text-ink-800"
          />
        </div>
        <div className="border-b border-ink-50 px-3 py-1.5 font-mono text-[10.5px]">
          <span className="text-ink-400">Assunto: </span>
          <TypedLine
            words={[{ w: 'Follow-up' }, { w: 'da' }, { w: 'proposta' }]}
            on={phase >= 3}
            speed={0.06}
            className="text-ink-800"
          />
        </div>
        <div className="px-3 py-2.5 text-[12px] leading-relaxed text-ink-700">
          <TypedLine words={EMAIL_BODY} on={phase >= 4} speed={0.035} />
        </div>
        <div className="flex justify-end px-3 pb-2.5">
          <Pop
            on={phase >= 5}
            className="inline-flex items-center gap-1.5 rounded-pill bg-ok/10 px-3 py-1.5 text-[11px] font-semibold text-[#0B7A55]"
          >
            <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 12.5 9.5 18 20 6" />
            </svg>
            Rascunho pronto · revise e envie
          </Pop>
        </div>
      </div>
    </div>
  )
}

/* ---------- 6. Entrevista · Ficha (verbo: ENCHER BARRAS) ---------- */

const TOPICS = [
  { label: 'Liderança', quote: 'liderei a migração do sistema' },
  { label: 'Equipe', quote: 'com um time de seis pessoas' },
]

export function DocFicha({ phase, lite }: DocBodyProps) {
  return (
    <div>
      <div className="flex items-center gap-2">
        <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand-100 font-mono text-[10px] font-bold text-brand-700">
          A
        </span>
        <span className="text-[11.5px] font-medium text-ink-700">
          Ana · cada resposta no lugar certo
        </span>
      </div>
      <div className="mt-3 space-y-2">
        {TOPICS.map((t, i) => (
          <div key={t.label} className="flex items-center gap-2.5">
            {/* a etiqueta CARIMBA o tema no trecho: organizar é classificar */}
            <motion.span
              className="w-[86px] shrink-0 rounded-pill bg-brand-100 px-2 py-1 text-center font-mono text-[9px] uppercase tracking-[0.08em] text-brand-700"
              initial={{ opacity: 0, scale: 1.35, rotate: -6 }}
              animate={
                phase >= 3 + i
                  ? { opacity: 1, scale: 1, rotate: 0 }
                  : { opacity: 0, scale: 1.35, rotate: -6 }
              }
              transition={SNAP}
            >
              {t.label}
            </motion.span>
            <MaskLine
              on={phase >= 2}
              delay={lite ? 0 : i * 0.12}
              className="flex-1 rounded-lg border border-ink-100 bg-white px-3 py-2 text-[11.5px] text-ink-700"
            >
              “{t.quote}”
            </MaskLine>
          </div>
        ))}
      </div>
      <motion.p
        className="mt-3 font-mono text-[9.5px] text-ink-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: phase >= 5 ? 1 : 0 }}
        transition={{ duration: 0.4 }}
      >
        destaques por tema · fácil de comparar depois
      </motion.p>
    </div>
  )
}

/* ---------- 7. Treinamento · Manual (verbo: DESENHAR A ESPINHA) ---------- */

const STEPS = [
  { title: 'Validar o pedido', sub: 'conferir dados e pagamento' },
  { title: 'Liberar o estoque', sub: 'só depois da validação' },
  { title: 'Confirmar com o cliente', sub: 'fecha o atendimento' },
]

export function DocManual({ phase, lite }: DocBodyProps) {
  const d = (v: number) => (lite ? 0 : v)
  return (
    <div className="relative pl-10">
      {STEPS.map((s, i) => {
        const on = phase >= 2 + i
        return (
          <div key={s.title} className="relative min-h-[52px] pb-3 last:pb-0">
            {/* espinha ligando este passo ao próximo */}
            {i < STEPS.length - 1 && (
              <svg
                className="absolute -left-[27px] top-[30px] h-[38px] w-[2px] text-ink-200"
                viewBox="0 0 2 38"
                preserveAspectRatio="none"
                fill="none"
              >
                <DrawPath
                  d="M1 0 V 38"
                  stroke="currentColor"
                  strokeWidth="2"
                  whenInView={false}
                  play={phase >= 3 + i}
                  duration={0.45}
                />
              </svg>
            )}
            <Pop
              on={on}
              delay={i === 0 ? 0 : d(0.45)}
              className="absolute -left-10 top-0 grid h-7 w-7 place-items-center rounded-full border border-brand/30 bg-brand-50 font-mono text-[11px] font-bold text-brand-700"
            >
              {i + 1}
            </Pop>
            <MaskLine on={on} delay={i === 0 ? d(0.1) : d(0.55)} className="text-[12.5px] font-medium text-ink-800">
              {s.title}
            </MaskLine>
            <MaskLine on={on} delay={i === 0 ? d(0.18) : d(0.63)} className="text-[10.5px] text-ink-400">
              {s.sub}
            </MaskLine>
          </div>
        )
      })}
    </div>
  )
}

/* ---------- 8. Conversa · Acordos (verbo: CONVERGIR E SELAR) ---------- */

export function DocAcordos({ phase, lite }: DocBodyProps) {
  const shift = lite ? 14 : 24
  return (
    <div className="grid grid-cols-[1fr_auto_1fr] gap-x-3 gap-y-2">
      <Pop
        on={phase >= 2}
        className="justify-self-center rounded-pill bg-brand-100 px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.1em] text-brand-700"
      >
        Você
      </Pop>
      <motion.span
        className="w-px self-stretch bg-ink-100 [grid-row:1/span_2]"
        style={{ originY: 0 }}
        initial={{ scaleY: 0 }}
        animate={{ scaleY: phase >= 2 ? 1 : 0 }}
        transition={{ duration: 0.45 }}
      />
      <Pop
        on={phase >= 2}
        delay={lite ? 0 : 0.1}
        className="justify-self-center rounded-pill bg-ink-100 px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.1em] text-ink-600"
      >
        Ele(a)
      </Pop>
      {/* os dois lados se encontram no meio: nenhuma outra cena faz isso */}
      <motion.div
        className="rounded-lg border border-ink-100 bg-white px-3 py-2 text-[11.5px] leading-snug text-ink-700"
        initial={{ opacity: 0, x: -shift }}
        animate={phase >= 3 ? { opacity: 1, x: 0 } : { opacity: 0, x: -shift }}
        transition={RISE}
      >
        cuidar da documentação
      </motion.div>
      <motion.div
        className="rounded-lg border border-ink-100 bg-white px-3 py-2 text-[11.5px] leading-snug text-ink-700 [grid-column:3]"
        initial={{ opacity: 0, x: shift }}
        animate={phase >= 3 ? { opacity: 1, x: 0 } : { opacity: 0, x: shift }}
        transition={RISE}
      >
        falar com o contador{' '}
        <Pop
          on={phase >= 4}
          className="ml-1 inline-block rounded-pill border border-ink-100 bg-ink-50 px-2 py-0.5 font-mono text-[9px] text-ink-500"
        >
          terça
        </Pop>
      </motion.div>
      <Pop
        on={phase >= 5}
        className="col-span-3 mt-1 inline-flex items-center gap-1.5 justify-self-center rounded-pill bg-ok/10 px-2.5 py-1 text-[10.5px] font-semibold text-[#0B7A55]"
      >
        <svg className="h-2.5 w-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="5" y="11" width="14" height="9" rx="2" />
          <path d="M8 11V7a4 4 0 0 1 8 0v4" />
        </svg>
        Combinado registrado
      </Pop>
    </div>
  )
}
