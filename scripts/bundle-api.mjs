import * as esbuild from 'esbuild'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

// CJS: Vercel načítá handler často přes require(). Kořen má "type":"module", takže ESM .js v api/ by se nenačetly správně — viz api/package.json ("type":"commonjs").
await esbuild.build({
  absWorkingDir: root,
  entryPoints: [join(root, 'server/generate-quiz.ts')],
  bundle: true,
  platform: 'node',
  target: 'node20',
  format: 'cjs',
  outfile: join(root, 'api/generate-quiz.js'),
  logLevel: 'info',
})
