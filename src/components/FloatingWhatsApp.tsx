import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

/**
 * Contato flutuante por WhatsApp.
 *
 * Esta página é a URL de suporte declarada na App Store, então precisa oferecer
 * um caminho de contato que funcione de verdade. É este botão.
 *
 * No desktop o cartão abre sozinho, mas só depois que a entrada do herói já
 * passou: abrir junto competiria com a primeira dobra, que é onde a página
 * convence. No celular nasce fechado, porque um cartão de 280px em tela pequena
 * tapa justamente o conteúdo que a pessoa veio ler.
 *
 * Fechar é decisão da visita, e ela vale pela sessão inteira (sessionStorage):
 * reabrir sozinho a cada rolagem é o comportamento que faz widget de chat virar
 * sinônimo de incômodo.
 */

const PHONE = '5541984115368'
const MESSAGE = 'Olá! Tenho uma dúvida sobre o Syntria Transcript.'
const DISMISSED_KEY = 'transcript:wa-dismissed'
const AUTO_OPEN_DELAY_MS = 2600

const WHATSAPP_URL = `https://wa.me/${PHONE}?text=${encodeURIComponent(MESSAGE)}`

function WhatsAppGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0 0 20.885 3.4" />
    </svg>
  )
}

export function FloatingWhatsApp() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (sessionStorage.getItem(DISMISSED_KEY) === '1') return
    if (!window.matchMedia('(min-width: 768px)').matches) return
    const timer = window.setTimeout(() => setOpen(true), AUTO_OPEN_DELAY_MS)
    return () => window.clearTimeout(timer)
  }, [])

  const close = () => {
    setOpen(false)
    sessionStorage.setItem(DISMISSED_KEY, '1')
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="card"
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 320, damping: 30 }}
            style={{ transformOrigin: 'bottom right' }}
            className="w-[280px] overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-card"
          >
            <div className="flex items-start justify-between gap-3 border-b border-ink-100 px-4 pb-3 pt-4">
              <div>
                <p className="text-[13.5px] font-semibold leading-snug text-ink-700">
                  Alguma dúvida antes de testar?
                </p>
                <p className="mt-0.5 text-[11.5px] text-ink-400">
                  Respondemos em minutos, em horário comercial.
                </p>
              </div>
              <button
                type="button"
                onClick={close}
                aria-label="Fechar"
                className="-mr-1 -mt-1 rounded-full p-1.5 text-ink-300 transition-colors hover:bg-ink-50 hover:text-ink-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              >
                <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                  <path d="M5 5l10 10M15 5L5 15" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <div className="px-4 pb-4 pt-3">
              <p className="text-[12.5px] leading-relaxed text-ink-500">
                Fale com quem construiu o Transcript: qual plano serve para a sua
                rotina, como funciona na sua especialidade, ou qualquer coisa
                sobre privacidade dos atendimentos.
              </p>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-3 text-[13px] font-semibold text-white transition-colors hover:bg-[#1EBE5A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#25D366]"
              >
                <WhatsAppGlyph className="h-4 w-4" />
                Falar no WhatsApp
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!open && (
        <motion.button
          key="bubble"
          type="button"
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          transition={{ type: 'spring', stiffness: 400, damping: 24 }}
          onClick={() => setOpen(true)}
          aria-label="Falar com a Syntria no WhatsApp"
          className="flex h-14 w-14 items-center justify-center rounded-pill bg-[#25D366] text-white shadow-[0_8px_24px_rgba(37,211,102,0.38)] transition-colors hover:bg-[#1EBE5A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#25D366]"
        >
          <WhatsAppGlyph className="h-7 w-7" />
        </motion.button>
      )}
    </div>
  )
}
