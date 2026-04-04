import * as esbuild from 'esbuild'
import { existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const outfile = join(root, 'api/generate-quiz.js')

// CJS: Vercel načítá handler často přes require(). Kořen má "type":"module", takže ESM .js v api/ by se nenačetly správně — viz api/package.json ("type":"commonjs").
await esbuild.build({
  absWorkingDir: root,
  entryPoints: [join(root, 'server/generate-quiz.ts')],
  bundle: true,
  platform: 'node',
  target: 'node20',
  format: 'cjs',
  outfile,
  logLevel: 'info',
})

// #region agent log
fetch('http://127.0.0.1:7257/ingest/939b31b7-9653-4691-9e1d-c6a12b3439eb', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Debug-Session-Id': '3ff1bd',
  },
  body: JSON.stringify({
    sessionId: '3ff1bd',
    hypothesisId: 'H1',
    location: 'scripts/bundle-api.mjs:after-build',
    message: 'api bundle written',
    data: {
      outfile,
      existsAfterWrite: existsSync(outfile),
      note: 'If outfile is gitignored, vercel.json functions pattern may not match on fresh clone',
    },
    timestamp: Date.now(),
    runId: 'bundle-api',
  }),
}).catch(() => {})
// #endregion
