import type {
  GeneratedQuiz,
  QuizCategory,
  QuizConfiguration,
  QuizQuestion,
  TargetGroup,
} from '@/types'

const EMOJI_RE =
  /[\u{1F300}-\u{1FAFF}\u2600-\u26FF\u2700-\u27BF]/u

function questionTextBlob(q: QuizQuestion): string {
  return `${q.questionText} ${q.options.join(' ')}`
}

function questionMatchesFun(q: QuizQuestion): boolean {
  const blob = questionTextBlob(q)
  if (EMOJI_RE.test(blob)) return true
  return /\b(kdo by|co by|nejlepší|nejlépe|směš|vtip|zábav|hádank|piknik|superpower|tanečník|řev|spánek|spaní|kouzeln)\b/i.test(
    q.questionText
  )
}

function questionMatchesEducational(q: QuizQuestion): boolean {
  const ex = q.explanation
  const qt = q.questionText
  if (/Věděl|věděla|Víš\b|Víte\b|proč\b|Víte, že|Víš, že/i.test(qt)) return true
  const sentences = ex
    .split(/(?<=[.!?])\s+/)
    .filter((s) => s.trim().length > 12)
  if (sentences.length >= 2) return true
  if (/Věděl|věděla|protože|znamená|pomáhá|učí|říkáme|objev|pochopíš/i.test(ex))
    return true
  return false
}

function questionMatchesKnowledge(q: QuizQuestion): boolean {
  if (EMOJI_RE.test(questionTextBlob(q))) return false
  if (
    /\b(kdo by|co by|nejlepší taneční|vyhrálo soutěž|superpower|piknik\s+v\s+batohu|kouzeln)\b/i.test(
      q.questionText
    )
  )
    return false
  const ex = q.explanation.trim()
  if (ex.length > 220) return false
  if (/Věděl jsi|Věděla jsi|Víš, že|Věděl\/a jsi/i.test(ex)) return false
  return true
}

/** Soutěžní tón: stručná otázka nebo výzva / bonus v textu. */
function questionMatchesCompetitive(q: QuizQuestion): boolean {
  const t = q.questionText
  if (
    /Rychle|Bonus|Bonusová|Timeout|Výzva|nejprve|nejrychleji|paměť|soutěž|Zamysl|Která odpověď/i.test(
      t
    )
  )
    return true
  return t.length <= 100
}

function questionMatchesCategory(
  q: QuizQuestion,
  category: QuizCategory
): boolean {
  switch (category) {
    case 'fun':
      return questionMatchesFun(q)
    case 'educational':
      return questionMatchesEducational(q)
    case 'knowledge':
      return questionMatchesKnowledge(q)
    case 'competitive':
      return questionMatchesCompetitive(q)
    default:
      return true
  }
}

/** Poměr otázek, které projdou heuristikou stylu kategorie. */
export function categoryMatchRatio(
  quiz: GeneratedQuiz,
  category: QuizCategory
): number {
  if (quiz.questions.length === 0) return 0
  const matched = quiz.questions.filter((q) =>
    questionMatchesCategory(q, category)
  ).length
  return matched / quiz.questions.length
}

const SENIORS_MODERN_RE =
  /\b(tiktok|instagram|iphone|smartphone|snapchat|wifi|wi-?fi|streamovat|netflix|meme|emoji\s*only)\b/i

/**
 * Skóre shody kvízu se zvolenou kategorií a skupinou (0–1).
 * Pod 0.6 → vhodný fallback nebo opakování generování.
 */
export function validateQuizCategory(
  quiz: GeneratedQuiz,
  expectedCategory: QuizCategory,
  targetGroup: TargetGroup
): number {
  let score = categoryMatchRatio(quiz, expectedCategory)

  if (targetGroup === 'seniors' && expectedCategory === 'fun') {
    const bad = quiz.questions.some((q) =>
      SENIORS_MODERN_RE.test(`${q.questionText} ${q.explanation}`)
    )
    if (bad) score *= 0.65
  }

  if (targetGroup === 'seniors' && expectedCategory === 'knowledge') {
    const emojiLeak = quiz.questions.some((q) =>
      EMOJI_RE.test(questionTextBlob(q))
    )
    if (emojiLeak) score *= 0.7
  }

  return Math.min(1, Math.max(0, score))
}

export function quizPassesCategoryValidation(
  quiz: GeneratedQuiz,
  category: QuizConfiguration['category'],
  targetGroup: TargetGroup
): boolean {
  if (
    category !== 'fun' &&
    category !== 'educational' &&
    category !== 'knowledge' &&
    category !== 'competitive'
  ) {
    return true
  }
  return validateQuizCategory(quiz, category, targetGroup) >= 0.6
}
