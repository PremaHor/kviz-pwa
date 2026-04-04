/// <reference types="vite/client" />

interface ImportMetaEnv {
  /**
   * Jen lokální vývoj bez `/api`: `1` = vždy ukázkový kvíz (žádné volání serveru).
   */
  readonly VITE_DEV_MOCK?: string
  /**
   * Ovlivní jen doplňování obrázků u **ukázkového** kvízu v prohlížeči.
   * Produční kvíz má média už z serveru (`QUIZ_MEDIA` tam).
   */
  readonly VITE_QUIZ_MEDIA?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
