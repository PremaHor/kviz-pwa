/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Klíč z [Google AI Studio](https://aistudio.google.com/apikey) */
  readonly VITE_GEMINI_API_KEY?: string
  /** Výchozí: gemini-2.5-flash */
  readonly VITE_GEMINI_MODEL?: string
  /**
   * Volitelné — lepší fotky než jen Commons; bez klíče stačí Wikimedia (zdarma).
   * https://www.pexels.com/api/
   */
  readonly VITE_PEXELS_API_KEY?: string
  /**
   * `'0'` vypne doplňování obrázků/videí (žádné dotazy na Commons/Pexels).
   * Jinak zapnuto.
   */
  readonly VITE_QUIZ_MEDIA?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
