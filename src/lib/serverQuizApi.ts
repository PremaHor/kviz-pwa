/**
 * Jediný vstupní modul pro serverless — dynamický import v API handleru
 * zachytí chyby načtení a vrátí JSON místo pádové obálky Vercelu.
 */
export { generateQuizFromGemini } from './generateQuizCore'
export { parseQuizConfigurationBody } from './quizConfigValidation'
export { enrichQuizWithMedia } from '../services/mediaEnrichment'
