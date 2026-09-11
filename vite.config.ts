import { fileURLToPath } from 'node:url'
import { defineConfig, type Connect, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

const entry = (path: string) => fileURLToPath(new URL(path, import.meta.url))

const SUCESSO = '/sucesso'

/**
 * Faz `/sucesso` (sem barra final) servir a página de obrigado no dev e no
 * preview, espelhando o rewrite de produção do vercel.json.
 *
 * Sem isto o fallback de SPA do Vite responde a landing INTEIRA nessa URL, com
 * status 200 e sem erro nenhum. Como `/sucesso` é justamente o endereço que a
 * Cakto abre depois do pagamento, o defeito só apareceria quando alguém já
 * tivesse pago e caísse de volta na página de vendas.
 */
const sucessoUrl = (): Plugin => {
  const rewrite: Connect.NextHandleFunction = (req, _res, next) => {
    const url = req.url ?? ''
    if (url === SUCESSO || url.startsWith(`${SUCESSO}?`)) {
      req.url = `${SUCESSO}/index.html${url.slice(SUCESSO.length)}`
    }
    next()
  }
  return {
    name: 'sucesso-extensionless-url',
    configureServer: (server) => {
      server.middlewares.use(rewrite)
    },
    configurePreviewServer: (server) => {
      server.middlewares.use(rewrite)
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), sucessoUrl()],
  build: {
    // Duas entradas HTML de verdade, em vez de uma SPA com roteador: a página
    // de obrigado sai como `dist/sucesso/index.html`, é estática e não depende
    // de JS de roteamento para existir.
    rollupOptions: {
      input: {
        main: entry('index.html'),
        sucesso: entry('sucesso/index.html'),
      },
    },
  },
})
