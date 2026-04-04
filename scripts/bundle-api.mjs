import * as esbuild from 'esbuild'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

await esbuild.build({
  absWorkingDir: root,
  entryPoints: [join(root, 'server/generate-quiz.ts')],
  bundle: true,
  platform: 'node',
  target: 'node20',
  format: 'esm',
  outfile: join(root, 'api/generate-quiz.js'),
  logLevel: 'info',
  // Jedna spustitelná artefakta pro Vercel — žádné runtime importy z ../src
})
