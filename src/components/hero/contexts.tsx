import type { ComponentType, ReactNode } from 'react'
import {
  DocAcordos,
  DocAta,
  DocCitacao,
  DocEmail,
  DocFicha,
  DocManual,
  DocProntuario,
  DocResumo,
  type DocBodyProps,
} from './docs'

/**
 * Os 8 contextos do palco. Cada um carrega a fala de origem, o documento
 * que nasce dela (Body) e o relógio da própria cena. Os horários contam
 * um dia inteiro passando com o Transcript, das 08h40 às 20h15.
 */

export interface SpeechPart {
  t: string
  k?: boolean
}

export interface HeroContext {
  id: string
  label: string
  mode: 'Clínico' | 'Geral'
  time: string
  icon: ReactNode
  docTitle: string
  speaker: string
  parts: SpeechPart[]
  note: string
  milestones: number[]
  dur: number
  Body: ComponentType<DocBodyProps>
}

const I = {
  stroke: {
    fill: 'none' as const,
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  },
}

const icon = (path: ReactNode) => (
  <svg className="h-3 w-3" viewBox="0 0 24 24" {...I.stroke}>
    {path}
  </svg>
)

export const ICONS = {
  prancheta: icon(
    <>
      <rect x="5" y="4" width="14" height="17" rx="2" />
      <path d="M9 4.5V3h6v1.5M9 10h6M9 14h6M9 18h3" />
    </>,
  ),
  // checklist VAZIO de propósito: o Transcript organiza, quem marca é você
  checklist: icon(
    <>
      <rect x="4" y="4" width="6" height="6" rx="1.5" />
      <path d="M13 7h7" />
      <rect x="4" y="14" width="6" height="6" rx="1.5" />
      <path d="M13 17h7" />
    </>,
  ),
  cartas: icon(
    <>
      <rect x="7" y="3" width="14" height="11" rx="2" />
      <path d="M3 8v9a3 3 0 0 0 3 3h10" />
    </>,
  ),
  aspas: icon(
    <path d="M9 7c-2.5 0-4 1.8-4 4.2V17h5v-5H7.2C7.2 9.8 8 8.8 9.6 8.6zM19 7c-2.5 0-4 1.8-4 4.2V17h5v-5h-2.8c0-2.2.8-3.2 2.4-3.4z" />
  ),
  envelope: icon(
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m4 7 8 6 8-6" />
    </>,
  ),
  etiqueta: icon(
    <>
      <path d="M20.6 13.4 12 22 2 12V2h10l8.6 8.6a2 2 0 0 1 0 2.8z" transform="scale(0.9) translate(1.2 1.2)" />
      <circle cx="7.5" cy="7.5" r="1" />
    </>,
  ),
  lista: icon(<path d="M8 6h12M8 12h12M8 18h12M4 6h.5M4 12h.5M4 18h.5" />),
  cadeado: icon(
    <>
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </>,
  ),
}

const DEFAULT_MILESTONES = [900, 1600, 2400, 3800, 5800]
const DEFAULT_DUR = 8200

export const CONTEXTS: HeroContext[] = [
  {
    id: 'consulta',
    label: 'Consulta',
    mode: 'Clínico',
    time: '08h40',
    icon: ICONS.prancheta,
    docTitle: 'Prontuário · Consulta de nutrição',
    speaker: 'Paciente',
    parts: [
      { t: 'Esse mês ' },
      { t: 'cheguei aos 82 quilos', k: true },
      { t: ', mas ' },
      { t: 'ando pulando o café da manhã', k: true },
      { t: '.' },
    ],
    note: 'a fala vira prontuário estruturado',
    milestones: DEFAULT_MILESTONES,
    dur: DEFAULT_DUR,
    Body: DocProntuario,
  },
  {
    id: 'reuniao',
    label: 'Reunião',
    mode: 'Geral',
    time: '10h00',
    icon: ICONS.checklist,
    docTitle: 'Ata · Reunião de projeto',
    speaker: 'Você',
    parts: [
      { t: 'Então ficou combinado: ' },
      { t: 'proposta revisada até sexta', k: true },
      { t: ' e ' },
      { t: 'o Léo fecha com o fornecedor', k: true },
      { t: '.' },
    ],
    note: 'ata e tarefas com dono e prazo',
    milestones: DEFAULT_MILESTONES,
    dur: DEFAULT_DUR,
    Body: DocAta,
  },
  {
    id: 'aula',
    label: 'Aula',
    mode: 'Geral',
    time: '11h30',
    icon: ICONS.cartas,
    docTitle: 'Resumo de estudo · Biologia',
    speaker: 'Professora',
    parts: [
      { t: 'Guardem isso: ' },
      { t: 'a fotossíntese transforma luz em energia química', k: true },
      { t: ', e ' },
      { t: 'isso cai na prova', k: true },
      { t: '.' },
    ],
    note: 'a aula vira material de estudo',
    milestones: DEFAULT_MILESTONES,
    dur: DEFAULT_DUR,
    Body: DocResumo,
  },
  {
    id: 'palestra',
    label: 'Palestra',
    mode: 'Geral',
    time: '14h00',
    icon: ICONS.aspas,
    docTitle: 'Notas da palestra',
    speaker: 'Palestrante',
    parts: [
      { t: 'Nossos dados mostram: ' },
      { t: '70% dos clientes decidem', k: true },
      { t: ' nos ' },
      { t: 'primeiros 8 segundos', k: true },
      { t: '.' },
    ],
    note: 'a palestra vira citação e insight',
    milestones: DEFAULT_MILESTONES,
    dur: DEFAULT_DUR,
    Body: DocCitacao,
  },
  {
    id: 'apresentacao',
    label: 'Apresentação',
    mode: 'Geral',
    time: '15h30',
    icon: ICONS.envelope,
    docTitle: 'Rascunho de follow-up',
    speaker: 'Você',
    parts: [
      { t: 'Nossa proposta ' },
      { t: 'reduz o custo em 18%', k: true },
      { t: ' já no ' },
      { t: 'primeiro trimestre', k: true },
      { t: '.' },
    ],
    note: 'o pitch vira rascunho de follow-up',
    milestones: [900, 1800, 2800, 4600, 6800],
    dur: 8800,
    Body: DocEmail,
  },
  {
    id: 'entrevista',
    label: 'Entrevista',
    mode: 'Geral',
    time: '17h00',
    icon: ICONS.etiqueta,
    docTitle: 'Ficha da candidata · Ana',
    speaker: 'Candidata',
    parts: [
      { t: 'Eu ' },
      { t: 'liderei a migração do sistema', k: true },
      { t: ' com um ' },
      { t: 'time de seis pessoas', k: true },
      { t: '.' },
    ],
    note: 'a entrevista vira registro comparável',
    milestones: DEFAULT_MILESTONES,
    dur: DEFAULT_DUR,
    Body: DocFicha,
  },
  {
    id: 'treinamento',
    label: 'Treinamento',
    mode: 'Geral',
    time: '18h30',
    icon: ICONS.lista,
    docTitle: 'Manual do processo · Pedidos',
    speaker: 'Instrutor',
    parts: [
      { t: 'Valida o pedido', k: true },
      { t: ', depois ' },
      { t: 'libera o estoque', k: true },
      { t: ' e ' },
      { t: 'confirma com o cliente', k: true },
      { t: '.' },
    ],
    note: 'o treinamento vira manual',
    milestones: DEFAULT_MILESTONES,
    dur: DEFAULT_DUR,
    Body: DocManual,
  },
  {
    id: 'conversa',
    label: 'Conversa importante',
    mode: 'Geral',
    time: '20h15',
    icon: ICONS.cadeado,
    docTitle: 'Acordos registrados',
    speaker: 'Você',
    parts: [
      { t: 'Então combinado: ' },
      { t: 'eu cuido da documentação', k: true },
      { t: ' e você ' },
      { t: 'fala com o contador até terça', k: true },
      { t: '.' },
    ],
    note: 'o combinado não se perde',
    milestones: DEFAULT_MILESTONES,
    dur: DEFAULT_DUR,
    Body: DocAcordos,
  },
]
