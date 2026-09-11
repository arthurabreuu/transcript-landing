import type { CSSProperties, ReactNode } from 'react'
import { MotionConfig, motion, useReducedMotion } from 'framer-motion'
import { AmbientBackground } from '../components/AmbientBackground'
import { Footer } from '../components/Closing'
import { Rise } from '../motion/primitives'
import { EASE, SNAP } from '../motion/tokens'

/**
 * Página de obrigado do checkout (syntriatranscript.com.br/sucesso).
 *
 * É a URL configurada como "página de obrigado" no painel da Cakto, então ela é
 * aberta no instante em que a pessoa termina o checkout, NÃO no instante em que
 * o dinheiro entra. Cartão e PIX costumam confirmar na hora; boleto só depois da
 * compensação. Por isso a página nunca afirma "pagamento aprovado" nem "e-mail
 * enviado": ela promete o que é verdade nos três meios, que é o e-mail sair
 * assim que a confirmação chegar.
 *
 * A página também é puramente informativa. Ela não recebe dados da compra e não
 * consulta o backend: quem libera o acesso é o webhook da Cakto, e a única coisa
 * que a pessoa precisa fazer aqui é saber que o caminho é o e-mail dela.
 */

// Remetente real dos transacionais: `resend_from_email` no back-syntria
// ("Syntria <contato@syntria.app>"). Mudou lá, muda aqui: este endereço existe
// na copy para a pessoa conseguir BUSCAR o e-mail na caixa dela.
const SENDER = 'contato@syntria.app'

// Lojas. Ficam nulas até o app estar publicado, e o bloco de botões some
// sozinho enquanto for assim: um badge que não leva a lugar nenhum, numa página
// aberta logo depois de pagar, é pior do que não ter badge nenhum.
const APP_STORE_URL: string | null = null
const PLAY_STORE_URL: string | null = null

// Mesmo número do atendimento da landing (FloatingWhatsApp).
const PHONE = '5541984115368'
const WHATSAPP_URL = `https://wa.me/${PHONE}?text=${encodeURIComponent(
  'Olá! Acabei de assinar o Syntria Transcript e preciso de ajuda com o acesso.',
)}`

/* ---------- Selo ---------- */

/**
 * O selo de confirmação: o orbe emerge (a física da página é empuxo, nada cai),
 * o traço do check é desenhado e dois anéis se abrem UMA vez. Nenhum loop: isto
 * é um acontecimento, não um estado, e um pulso eterno viraria ruído na tela de
 * quem só quer saber o que fazer agora.
 */
function Seal() {
  const reduced = useReducedMotion() ?? false
  return (
    <div className="relative mx-auto h-[108px] w-[108px]">
      {!reduced &&
        [0, 1].map((i) => (
          <motion.span
            key={i}
            aria-hidden="true"
            className="absolute inset-0 rounded-full border border-brand/35"
            initial={{ scale: 0.62, opacity: 0 }}
            animate={{ scale: 1.55, opacity: [0, 0.5, 0] }}
            transition={{ duration: 1.6, delay: 0.4 + i * 0.3, ease: EASE }}
          />
        ))}
      <motion.span
        aria-hidden="true"
        className="absolute inset-0 rounded-full"
        style={{
          background:
            'radial-gradient(closest-side, rgba(0,111,245,0.30), transparent 74%)',
        }}
        initial={{ opacity: 0, scale: 0.82 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: EASE }}
      />
      <motion.div
        className="absolute inset-[15px] flex items-center justify-center rounded-full shadow-glow"
        style={{
          background:
            'linear-gradient(145deg, #006FF5 0%, #4D9FFF 58%, #88BCF5 100%)',
        }}
        initial={{ opacity: 0, y: 20, scale: 0.94 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 150, damping: 14 }}
      >
        <span
          aria-hidden="true"
          className="absolute inset-x-[18%] top-[9%] h-px"
          style={{
            background:
              'linear-gradient(90deg, transparent, rgba(255,255,255,0.9), transparent)',
          }}
        />
        <svg viewBox="0 0 32 32" fill="none" className="h-10 w-10">
          <motion.path
            d="M9.5 16.6 L14.2 21.3 L22.8 11.2"
            stroke="white"
            strokeWidth={2.7}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: reduced ? 1 : 0, opacity: reduced ? 1 : 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{
              pathLength: { duration: reduced ? 0 : 0.5, delay: reduced ? 0 : 0.34, ease: EASE },
              opacity: { duration: 0.01, delay: reduced ? 0 : 0.34 },
            }}
          />
        </svg>
      </motion.div>
    </div>
  )
}

/* ---------- Cabeçalho enxuto ---------- */

/**
 * A Nav da landing não serve aqui: as âncoras dela apontam para seções que esta
 * página não tem, e o CTA "Testar grátis" é a última coisa que faz sentido
 * oferecer para quem acabou de assinar.
 */
function SlimNav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-5">
        <a href="/" className="flex items-center gap-2.5">
          <img
            src="/brand/favicon-transcript.png"
            alt=""
            className="h-7 w-7 rounded-[8px] shadow-sm"
          />
          <span className="text-[15px] font-semibold tracking-tight text-ink-900">
            Syntria <span className="text-ink-400">Transcript</span>
          </span>
        </a>
        <a
          href="/"
          className="text-[13px] font-medium text-ink-400 transition-colors hover:text-ink-900"
        >
          Voltar ao site
        </a>
      </div>
    </header>
  )
}

/* ---------- Passos ---------- */

const STEPS: { n: string; title: string; body: ReactNode }[] = [
  {
    n: '01',
    title: 'Abra o e-mail da Syntria',
    body: (
      <>
        Ele chega de <span className="font-medium text-ink-700">{SENDER}</span>,
        no endereço que você usou no checkout. Se não estiver na caixa de
        entrada, procure em spam, lixo eletrônico ou na aba de promoções.
      </>
    ),
  },
  {
    n: '02',
    title: 'Crie a sua senha',
    body: 'O link do e-mail leva à criação da senha da sua conta. Ele é pessoal e vale uma vez só, então não repasse para ninguém.',
  },
  {
    n: '03',
    title: 'Baixe o app e entre',
    body: 'Faça login com o mesmo e-mail da compra e a senha que você acabou de criar. Seu plano já vem ativo.',
  },
]

/* ---------- Lojas ---------- */

function AppleGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M17.05 12.72c-.02-2.2 1.8-3.26 1.88-3.31-1.02-1.5-2.62-1.7-3.19-1.72-1.36-.14-2.65.8-3.34.8-.69 0-1.75-.78-2.87-.76-1.48.02-2.84.86-3.6 2.18-1.53 2.66-.39 6.6 1.1 8.76.73 1.06 1.6 2.25 2.74 2.2 1.1-.04 1.52-.71 2.85-.71 1.33 0 1.7.71 2.87.69 1.18-.02 1.93-1.08 2.65-2.14.83-1.22 1.18-2.4 1.2-2.46-.03-.01-2.29-.88-2.31-3.5M14.9 5.36c.6-.74 1.01-1.75.9-2.76-.87.04-1.93.58-2.56 1.31-.56.65-1.05 1.69-.92 2.68.97.08 1.96-.49 2.58-1.23" />
    </svg>
  )
}

function PlayGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M3.6 2.4c-.26.28-.4.7-.4 1.25v16.7c0 .55.14.97.4 1.25l.06.05 9.36-9.35v-.22L3.66 2.35zm12.7 6.06L13.6 5.75 4.5 1.53c-.3-.16-.58-.2-.8-.12zm0 7.08l-2.7 2.7L4.5 22.47c.22.08.5.04.8-.12zm1.06-6.5-2.2-1.27-2.85 2.85 2.85 2.85 2.2-1.27c.86-.5.86-1.66 0-2.16z" />
    </svg>
  )
}

function StoreButtons() {
  const stores = [
    { url: APP_STORE_URL, label: 'App Store', Glyph: AppleGlyph },
    { url: PLAY_STORE_URL, label: 'Google Play', Glyph: PlayGlyph },
  ].filter((s): s is { url: string; label: string; Glyph: typeof AppleGlyph } =>
    Boolean(s.url),
  )
  if (stores.length === 0) return null
  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {stores.map(({ url, label, Glyph }) => (
        <motion.a
          key={label}
          href={url}
          target="_blank"
          rel="noreferrer"
          className="glass-flat inline-flex items-center gap-2 rounded-pill px-4 py-2 text-[12.5px] font-semibold text-ink-700 transition-colors hover:text-ink-900"
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.97 }}
          transition={SNAP}
        >
          <Glyph className="h-4 w-4" />
          {label}
        </motion.a>
      ))}
    </div>
  )
}

/* ---------- Página ---------- */

export default function Sucesso() {
  return (
    <MotionConfig reducedMotion="user">
      <AmbientBackground />
      <SlimNav />
      <main className="mx-auto max-w-4xl px-5 pb-20 pt-28 sm:pt-32">
        <Rise dist={20} margin="0px">
          <Seal />
        </Rise>

        <div className="mx-auto mt-8 max-w-2xl text-center">
          <Rise dist={12} delay={0.08} margin="0px">
            <p className="eyebrow-brand">Compra registrada</p>
          </Rise>
          <Rise dist={18} delay={0.14} margin="0px">
            <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl">
              {/* no celular a frase quebra no meio do trecho em gradiente e
                  perde a batida; separar as duas metades resolve sem mudar a
                  linha única do desktop */}
              <span className="block font-light sm:inline">Deu certo. </span>
              <span className="gradient-text">
                Seu acesso vai por <span className="whitespace-nowrap">e-mail.</span>
              </span>
            </h1>
          </Rise>
          <Rise dist={14} delay={0.22} margin="0px">
            <p className="mt-4 text-[15px] font-light leading-relaxed text-ink-400">
              Assim que o pagamento é confirmado, enviamos para o endereço usado
              no checkout um e-mail com o link para você criar sua senha. No
              cartão e no PIX isso costuma levar poucos minutos. No boleto,
              acontece depois da compensação.
            </p>
          </Rise>
        </div>

        <div className="mt-12 grid gap-3 sm:grid-cols-3">
          {STEPS.map((s, i) => (
            <Rise
              key={s.n}
              className="glass glass-top-light hover-card flex flex-col rounded-[24px] border p-6"
              delay={0.3 + i * 0.12}
              dist={34}
              margin="0px"
            >
              <span
                className="float-bob font-mono text-[12px] text-brand"
                style={
                  { '--bob-delay': `${i * 0.9}s`, '--bob-dur': '5s' } as CSSProperties
                }
              >
                {s.n}
              </span>
              <h2 className="mt-3 text-[16px] font-semibold text-ink-900">
                {s.title}
              </h2>
              <p className="mt-2 text-[13.5px] font-light leading-relaxed text-ink-400">
                {s.body}
              </p>
              {i === 2 && <StoreButtons />}
            </Rise>
          ))}
        </div>

        <Rise
          className="glass-subtle mt-6 rounded-[26px] p-7"
          delay={0.5}
          dist={28}
          margin="0px"
        >
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[15px] font-semibold text-ink-900">
                O e-mail não chegou?
              </p>
              <ul className="mt-3 space-y-2 text-[13px] font-light leading-relaxed text-ink-400">
                <li className="flex gap-2.5">
                  <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-brand/60" />
                  Procure por Syntria em spam, lixo eletrônico e na aba de
                  promoções antes de qualquer coisa.
                </li>
                <li className="flex gap-2.5">
                  <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-brand/60" />
                  Ele vai para o e-mail que você digitou no checkout. Se você
                  digitou outro por engano, fale com a gente que resolvemos.
                </li>
                <li className="flex gap-2.5">
                  <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-brand/60" />
                  Se você pagou por boleto, ele só sai depois da compensação, em
                  até 3 dias úteis.
                </li>
              </ul>
            </div>
            <motion.a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noreferrer"
              className="btn-brand cta-glow shrink-0 self-start text-[13.5px] sm:self-center"
              whileHover={{ y: -2, scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={SNAP}
            >
              Falar no WhatsApp
            </motion.a>
          </div>
        </Rise>

        <Rise delay={0.6} dist={14} margin="0px">
          <p className="mt-8 text-center text-[12px] font-light text-ink-300">
            Você tem 7 dias de garantia. Se mudar de ideia nesse prazo, é só
            pedir e devolvemos o valor.
          </p>
        </Rise>
      </main>
      <Footer />
    </MotionConfig>
  )
}
