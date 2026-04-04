"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// server/generate-quiz.ts
var generate_quiz_exports = {};
__export(generate_quiz_exports, {
  config: () => config,
  default: () => handler
});
module.exports = __toCommonJS(generate_quiz_exports);

// src/lib/quizLength.ts
var QUESTION_COUNT_BY_LENGTH = {
  short: 15,
  medium: 25,
  long: 35
};
function getQuestionCount(length) {
  return QUESTION_COUNT_BY_LENGTH[length];
}

// src/services/promptBuilder.ts
var HANDICAP_RULES = {
  dyslexia: "PRAVIDLO PRO DYSLEXII: Pou\u017E\xEDvej v\xFDhradn\u011B b\u011B\u017En\xE1 slova a kr\xE1tk\xE9 v\u011Bty. Vyhni se ciz\xEDm slov\u016Fm, slo\u017Eit\xFDm souv\u011Bt\xEDm, dvojit\xFDm z\xE1por\u016Fm a zbyte\u010Dn\u011B t\u011B\u017Ek\xE9mu pravopisu u vymy\u0161len\xFDch odpov\u011Bd\xED.",
  visual_impairment: "PRAVIDLO PRO ZRAKOV\xC9 POSTI\u017DEN\xCD: Ot\xE1zky nesm\xED spol\xE9hat na to, co \u201Evid\xED\u0161 na obr\xE1zku\u201C, na barvy jako jedin\xFD rozd\xEDl mezi odpov\u011B\u010Fmi ani na popis vizu\xE1ln\xEDch detail\u016F. V\u0161e mus\xED b\xFDt srozumiteln\xE9 pouze z textu (pop\u0159. hmat, logika, b\u011B\u017En\xE9 znalosti).",
  cognitive_dementia: "PRAVIDLO PRO KOGNITIVN\xCD OMEZEN\xCD A DEMENCI: Jedna jasn\xE1 informace v ot\xE1zce, \u017E\xE1dn\xE9 metafory, ironie ani skryt\xE9 v\xFDznamy. Velmi prost\xE1 slova, konkr\xE9tn\xED kontext (\u0161kola, domov, p\u0159\xEDroda). Pozitivn\xED t\xF3n, kr\xE1tk\xE9 ot\xE1zky bez abstraktn\xEDch h\xE1danek. Odpov\u011Bdi mus\xED b\xFDt zjevn\u011B rozli\u0161iteln\xE9.",
  hearing_impairment: "PRAVIDLO PRO NESLY\u0160\xCDC\xCD: Pou\u017E\xEDvej p\u0159\xEDm\xFD, doslovn\xFD jazyk bez metafor a r\u010Den\xED. Absolutn\u011B se vyhni ot\xE1zk\xE1m na hudbu, zvuky, hlasy nebo audio vjemy.",
  autism_spectrum: "PRAVIDLO PRO AUTISMUS: Ot\xE1zky mus\xED b\xFDt 100% logick\xE9 a faktick\xE9. Nepou\u017E\xEDvej sarkasmus, ironii ani emo\u010Dn\u011B nejednozna\u010Dn\xE9 situace. Odpov\u011Bdi nesm\xED b\xFDt chyt\xE1ky zalo\u017Een\xE9 na slov\xED\u010Dka\u0159en\xED.",
  czech_learners: "PRAVIDLO PRO CIZINCE: Pou\u017E\xEDvej jen z\xE1kladn\xED a mezin\xE1rodn\u011B srozumitelnou slovn\xED z\xE1sobu (A2/B1). Zcela se vyhni lok\xE1ln\xED \u010Desk\xE9 popkultu\u0159e, \u010Desk\xFDm herc\u016Fm, ve\u010Dern\xED\u010Dk\u016Fm a lok\xE1ln\xEDm specifik\u016Fm."
};
var WEB_INSPIRATION = {
  kids: "INSPIRACE OBSAHEM A T\xD3NEM (nevytv\xE1\u0159ej ot\xE1zky o t\u011Bchto webech jako takov\xE9; jen \xFArove\u0148 a styl): \u010CT D\xE9\u010Dko, Al\xEDk.cz, Rumvi a podobn\xE9 bezpe\u010Dn\xE9 d\u011Btsk\xE9 port\xE1ly \u2014 hrav\xFD jasn\xFD jazyk, v\u011Bk 6\u201310 let.",
  juniors: "INSPIRACE: YouTube/TikTok (kulturn\u011B vhodn\xE9), hern\xED novinky, Kahoot, streamovac\xED sc\xE9na \u2014 svi\u017En\xFD t\xF3n teenagera, ale bez nebezpe\u010Dn\xFDch v\xFDzev a vulg\xE1rn\xEDch mem\u016F.",
  adults: "INSPIRACE: zpravodajsk\xE9 a magaz\xEDnov\xE9 weby (nap\u0159. Novinky, iDNES), hobby port\xE1ly, hospodsk\xFD kv\xEDz, CSFD/Kinobox u popkultury \u2014 dosp\u011Bl\xFD neutr\xE1ln\xED a\u017E m\xEDrn\u011B vt\xEDpk\xE1\u0159sk\xFD t\xF3n.",
  seniors: "INSPIRACE: \u010Cesk\xFD rozhlas (Plus, Dvojka), region\xE1ln\xED zpravodajstv\xED, t\xE9mata zahrady, zvyky, pam\u011Bti na ml\xE1d\xED \u2014 klidn\xFD, respektuj\xEDc\xED t\xF3n bez modern\xEDho slangu."
};
function buildHandicapRulesBlock(handicaps) {
  const lines = handicaps.filter((h) => h !== "none").map((h) => HANDICAP_RULES[h]).filter((x) => Boolean(x));
  return lines.join("\n\n");
}
function buildWebInspirationBlock(config2) {
  const base = WEB_INSPIRATION[config2.targetGroup];
  const h = new Set(config2.handicaps.filter((x) => x !== "none"));
  const extra = [base];
  if (h.has("dyslexia")) {
    extra.push(
      "Dopl\u0148uj\xEDc\xED styl: jazyk jako v p\u0159\xEDstupn\xFDch \u010Dl\xE1nc\xEDch pro \u0161irok\xE9 publikum \u2014 kr\xE1tk\xE9 odstavce my\u0161lenkov\u011B, jednoduch\xE1 souv\u011Bt\xED."
    );
  }
  return "=== INSPIRACE RE\xC1LN\xDDMI WEBY A M\xC9DII (jen t\xF3n a t\xE9mata) ===\n\n" + extra.join("\n\n");
}
function buildPersonaBlock(config2) {
  const { targetGroup, category } = config2;
  if (targetGroup === "kids" && category === "fun") {
    return `TVOJE ROLE: Z\xE1bavn\xFD moder\xE1tor d\u011Btsk\xE9ho po\u0159adu ve stylu \u010CT D\xE9\u010Dko nebo Al\xEDk.cz. STYL: Hrav\xFD humor, zv\xED\u0159\xE1tka, poh\xE1dky, absurdn\xED ale ne d\u011Bsiv\xE9 situace. Z\xC1KAZ: such\xE1 encyklopedick\xE1 fakta bez p\u0159\xEDb\u011Bhu. Mo\u017Enosti odpov\u011Bd\xED a\u0165 d\xE1vaj\xED smysl d\xEDt\u011Bti a bav\xED.`;
  }
  if (targetGroup === "kids" && category === "educational") {
    return `TVOJE ROLE: U\u010Ditel/ka 1. stupn\u011B Z\u0160 \u2014 vl\xEDdn\u011B a trp\u011Bliv\u011B jako ve v\xFDukov\xFDch bloc\xEDch na D\xE9\u010Dku nebo Rumvi. STYL: Nau\u010Dn\xE9, ale v\u017Edy s jednoduch\xFDm p\u0159\xEDkladem nebo p\u0159irovn\xE1n\xEDm z d\u011Btsk\xE9ho sv\u011Bta. \u017D\xE1dn\xE9 odborn\xE9 term\xEDny bez vysv\u011Btlen\xED.`;
  }
  if (targetGroup === "kids" && category === "knowledge") {
    return `TVOJE ROLE: Tv\u016Frce d\u011Btsk\xE9ho v\u011Bdomostn\xEDho kv\xEDzu (6\u201310 let). STYL: Konkr\xE9tn\xED ot\xE1zky ze \u017Eivota zv\xED\u0159at, p\u0159\xEDrody, sv\xE1tk\u016F, sportu pro d\u011Bti. Obt\xED\u017Enost v\u017Edy \xFAm\u011Brn\xE1 v\u011Bku \u2014 \u017E\xE1dn\xE9 re\xE1lie z politiky \u010Di finan\u010Dn\xEDch produkt\u016F.`;
  }
  if (targetGroup === "juniors" && category === "competitive") {
    return `TVOJE ROLE: Tv\u016Frce rychl\xFDch viralov\xFDch v\xFDzev ve stylu Kahoot a Hern\xEDch kan\xE1l\u016F. STYL: \xDAdern\xE9 v\u011Bty, gaming, filmy, seri\xE1ly, sporty \u2014 lehk\xE1 ironie je v po\u0159\xE1dku, obsah mus\xED z\u016Fstat slu\u0161n\xFD.`;
  }
  if (targetGroup === "juniors") {
    return `TVOJE ROLE: Moder\xE1tor kv\xEDzu pro teenagery (cca 12\u201316 let). STYL: Srozumiteln\xFD, \u017Eiv\xFD, m\u016F\u017Ee\u0161 ob\u010Das nar\xE1\u017Eet na \u0161kolu, sporty, technologie a popkulturu v m\xED\u0159e vhodn\xE9 pro ml\xE1de\u017E.`;
  }
  if (targetGroup === "adults" && (category === "fun" || category === "competitive")) {
    return `TVOJE ROLE: Moder\xE1tor hospodsk\xE9ho kv\xEDzu nebo sout\u011B\u017En\xEDho po\u0159adu. STYL: Chyt\xE1ky a zaj\xEDmav\xE1 fakta, m\xEDrn\xE1 ironie, propojen\xED historie a popkultury.`;
  }
  if (targetGroup === "seniors" && (category === "knowledge" || category === "educational")) {
    return `TVOJE ROLE: Moder\xE1tor v\u011Bdomostn\xED sout\u011B\u017Ee ve stylu klasick\xE9ho TV kv\xEDzu. STYL: Zdvo\u0159il\xFD, srozumiteln\xFD, \u010Dasto t\xE9ma \u010Desk\xFDch vlast\xED, p\u0159\xEDrody, kultury minul\xFDch dek\xE1d. Z\xC1KAZ: Modern\xED anglick\xFD slang a n\xE1hodn\xE9 anglicismy.`;
  }
  if (targetGroup === "seniors") {
    return `TVOJE ROLE: Moder\xE1tor pro seniory. STYL: Klidn\u011B, jasn\u011B, dost \u010Dasu v textu (del\u0161\xED v\u011Bty jsou v po\u0159\xE1dku, ale jedna my\u0161lenka najednou). Konkr\xE9tn\xED kontext m\xEDsto abstrakce.`;
  }
  return `TVOJE ROLE: Profesion\xE1ln\xED moder\xE1tor znalostn\xEDho kv\xEDzu v \u010De\u0161tin\u011B. P\u0159izp\u016Fsob t\xF3n a obt\xED\u017Enost: c\xEDlov\xE1 skupina = ${targetGroup}, zam\u011B\u0159en\xED kv\xEDzu = ${category}. Bu\u010F srozumiteln\xFD a fakticky p\u0159esn\xFD.`;
}
function buildPromptEnrichment(config2) {
  const parts = [
    "=== T\xD3N, PERSONA A \xDAROVE\u0147 ===\n\n" + buildPersonaBlock(config2)
  ];
  const handicapBlock = buildHandicapRulesBlock(config2.handicaps);
  if (handicapBlock) {
    parts.push("=== PRAVIDLA P\u0158\xCDSTUPNOSTI (OBSAH OTAZEK) ===\n\n" + handicapBlock);
  }
  parts.push(buildWebInspirationBlock(config2));
  return parts.join("\n\n");
}

// src/lib/generateQuizCore.ts
var THEME_CS = {
  seasonal: "Sez\xF3nn\xED (ro\u010Dn\xED obdob\xED, sv\xE1tky, tradice v dan\xE9m roce)",
  animals: "Zv\xED\u0159ata a p\u0159\xEDroda",
  general: "V\u0161eobecn\xE9 znalosti",
  science: "V\u011Bda a technika",
  pop_culture: "Popkultura, film, hudba, seri\xE1ly"
};
var CATEGORY_CS = {
  knowledge: "V\u011Bdomostn\xED \u2014 ov\u011B\u0159en\xED fakt\u016F a znalost\xED",
  educational: "V\xFDukov\xE9 \u2014 vysv\u011Btlen\xED pojm\u016F, nau\u010Dn\xFD t\xF3n",
  fun: "Z\xE1bavn\xE9 \u2014 lehk\xFD t\xF3n, zaj\xEDmavosti",
  competitive: "Sout\u011B\u017En\xED \u2014 jasn\xE9 zn\u011Bn\xED, vhodn\xE9 pro rychl\xE9 rozhodov\xE1n\xED"
};
var TARGET_CS = {
  kids: "D\u011Bti (cca 6\u201310 let) \u2014 jednoduch\xE1 slova, konkr\xE9tn\xED p\u0159\xEDklady",
  juniors: "Junio\u0159i / mlad\u0161\xED teenage\u0159i \u2014 st\u0159edn\xED obt\xED\u017Enost",
  adults: "Dosp\u011Bl\xED \u2014 b\u011B\u017En\xE1 obt\xED\u017Enost",
  seniors: "Senio\u0159i \u2014 srozumiteln\xE9 v\u011Bty, klidn\xE9 tempo, konkr\xE9tn\xED kontext"
};
function accessibilityHints(handicaps) {
  const parts = [];
  const h = new Set(handicaps.filter((x) => x !== "none"));
  if (h.has("visual_impairment")) {
    parts.push(
      "Zrakov\xE9 posti\u017Een\xED: neodkazuj na \u201Eco vid\xED\u0161\u201C, barvy jako jedin\xFD rozd\xEDl ani na obr\xE1zky; v\u0161e mus\xED b\xFDt srozumiteln\xE9 pouze z textu."
    );
  }
  if (h.has("dyslexia")) {
    parts.push(
      "Dyslexie: kr\xE1tk\xE9 v\u011Bty, jednoduch\xE1 souv\u011Bt\xED, b\u011B\u017En\xE1 slova, vyhni se slo\u017Eit\xE9mu pravopisu u nesmysln\xFDch slov."
    );
  }
  if (h.has("cognitive_dementia")) {
    parts.push(
      "Kognitivn\xED omezen\xED / demence: jedna jasn\xE1 informace v ot\xE1zce, prost\xE1 slova, konkr\xE9tn\xED kontext, pozitivn\xED t\xF3n, kr\xE1tk\xE9 ot\xE1zky, jednozna\u010Dn\xE9 odpov\u011Bdi."
    );
  }
  if (h.has("hearing_impairment")) {
    parts.push(
      "Nesly\u0161\xEDc\xED: p\u0159\xEDm\xFD jazyk bez metafor a r\u010Den\xED; \u017E\xE1dn\xE9 ot\xE1zky na hudbu, zvuky, hlasy ani audio vjemy."
    );
  }
  if (h.has("autism_spectrum")) {
    parts.push(
      "PAS: striktn\u011B logick\xE9 a faktick\xE9 ot\xE1zky, bez sarkasmu, ironie a emo\u010Dn\u011B nejednozna\u010Dn\xFDch situac\xED; \u017E\xE1dn\xE9 chyt\xE1ky ze slov\xED\u010Dka\u0159en\xED."
    );
  }
  if (h.has("czech_learners")) {
    parts.push(
      "Cizinci (A2/B1): z\xE1kladn\xED slovn\xED z\xE1soba, mezin\xE1rodn\u011B srozumiteln\xE9 pojmy; bez lok\xE1ln\xED \u010Desk\xE9 popkultury a specifik."
    );
  }
  if (parts.length === 0) {
    return "Bez speci\xE1ln\xEDch po\u017Eadavk\u016F na p\u0159\xEDstupnost (standardn\xED text).";
  }
  return parts.join("\n");
}
function buildUserPrompt(config2) {
  const today = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
  const questionCount = getQuestionCount(config2.quizLength);
  return `Dne\u0161n\xED datum (pro sez\xF3nn\xED t\xE9mata): ${today}.

${buildPromptEnrichment(config2)}

Vytvo\u0159 jeden kv\xEDz v \u010De\u0161tin\u011B. V\xFDstup mus\xED p\u0159esn\u011B odpov\xEDdat JSON sch\xE9matu (\u017E\xE1dn\xFD text mimo JSON).

Po\u017Eadavky na obsah:
- P\u0159esn\u011B ${questionCount} ot\xE1zek v poli "questions" \u2014 ka\u017Ed\xE1 m\xE1 jin\xE9 zn\u011Bn\xED, \u017E\xE1dn\xE9 duplicity ani opakov\xE1n\xED stejn\xE9ho faktu.
- T\xE9ma obsahu: ${THEME_CS[config2.theme]}
- Styl: ${CATEGORY_CS[config2.category]}
- C\xEDlov\xE1 skupina: ${TARGET_CS[config2.targetGroup]}
- P\u0159\xEDstupnost:
${accessibilityHints(config2.handicaps)}
- Ka\u017Ed\xE1 ot\xE1zka m\xE1 p\u0159esn\u011B 4 \u0159et\u011Bzce v "options".
- "correctAnswerIndex" je 0, 1, 2 nebo 3 \u2014 index spr\xE1vn\xE9 mo\u017Enosti.
- "id" u ot\xE1zek: q1, q2, \u2026 a\u017E q${questionCount}.
- V textech ot\xE1zek a odpov\u011Bd\xED \u017E\xE1dn\xE9 URL ani odkazy \u2014 pouze b\u011B\u017En\xFD text v \u010De\u0161tin\u011B.
- U ka\u017Ed\xE9 ot\xE1zky mus\xED b\xFDt "mediaSearchHint": 2 a\u017E 8 anglick\xFDch slov popisuj\xEDc\xEDch hlavn\xED vizu\xE1ln\xED motiv pro ilustraci (konkr\xE9tn\xED v\u011Bc, m\xEDsto, \u017Eivo\u010Dich, p\u0159edm\u011Bt nebo zn\xE1m\xE1 osoba z kontextu ot\xE1zky). Pouze p\xEDsmena anglick\xE9 abecedy, \u010D\xEDsla a mezery \u2014 \u017E\xE1dn\xE1 \u010De\u0161tina, \u017E\xE1dn\xE1 cel\xE1 v\u011Bta, \u017E\xE1dn\xE9 uvozov\xE9 v\u011Bty. Mus\xED \xFAzce souviset s obsahem ot\xE1zky (typicky kl\xED\u010Dov\xE9 slovo ze spr\xE1vn\xE9 odpov\u011Bdi nebo z jej\xEDho zn\u011Bn\xED). P\u0159\xEDklady: "red squirrel", "Charles Bridge Prague", "volleyball net beach".
- Odpov\u011Bdi a\u0165 jsou fakticky spr\xE1vn\xE9 a v souladu s t\xE9matem.`;
}
function quizResponseJsonSchema(_questionCount) {
  const qItem = {
    type: "object",
    properties: {
      id: { type: "string" },
      questionText: { type: "string" },
      options: {
        type: "array",
        items: { type: "string" }
      },
      correctAnswerIndex: { type: "integer" },
      explanation: { type: "string" },
      mediaSearchHint: { type: "string" }
    },
    required: [
      "questionText",
      "options",
      "correctAnswerIndex",
      "explanation",
      "mediaSearchHint"
    ]
  };
  return {
    type: "object",
    properties: {
      title: { type: "string" },
      questions: {
        type: "array",
        items: qItem
      }
    },
    required: ["title", "questions"]
  };
}
function extractJsonObject(text) {
  const t = text.trim();
  const fence = /^```(?:json)?\s*([\s\S]*?)```$/m.exec(t);
  if (fence) return fence[1].trim();
  return t;
}
function normalizeQuestion(q, index) {
  if (!q || typeof q !== "object") return null;
  const o = q;
  const id = typeof o.id === "string" ? o.id : `q${index + 1}`;
  const questionText = typeof o.questionText === "string" ? o.questionText.trim() : "";
  const explanation = typeof o.explanation === "string" ? o.explanation.trim() : "";
  const options = o.options;
  if (!Array.isArray(options) || options.length !== 4) return null;
  if (!options.every((x) => typeof x === "string" && x.trim().length > 0))
    return null;
  const idx = o.correctAnswerIndex;
  if (typeof idx !== "number" || idx < 0 || idx > 3 || !Number.isInteger(idx))
    return null;
  if (!questionText) return null;
  const hintRaw = typeof o.mediaSearchHint === "string" ? o.mediaSearchHint.trim() : "";
  const mediaSearchHint = hintRaw.length > 0 ? hintRaw.slice(0, 120) : void 0;
  return {
    id,
    questionText,
    options: options.map((s) => String(s).trim()),
    correctAnswerIndex: idx,
    explanation: explanation || "Spr\xE1vn\xE1 odpov\u011B\u010F odpov\xEDd\xE1 zad\xE1n\xED.",
    ...mediaSearchHint ? { mediaSearchHint } : {}
  };
}
function parseGeneratedQuiz(raw, expectedQuestionCount) {
  if (!raw || typeof raw !== "object") {
    throw new Error("Neplatn\xE1 odpov\u011B\u010F AI (nen\xED objekt).");
  }
  const o = raw;
  const title = typeof o.title === "string" ? o.title.trim() : "";
  const questionsRaw = o.questions;
  if (!Array.isArray(questionsRaw) || questionsRaw.length === 0) {
    throw new Error("Neplatn\xE1 odpov\u011B\u010F AI (chyb\xED ot\xE1zky).");
  }
  if (questionsRaw.length !== expectedQuestionCount) {
    throw new Error(
      `AI vr\xE1tila ${questionsRaw.length} ot\xE1zek, o\u010Dek\xE1v\xE1no p\u0159esn\u011B ${expectedQuestionCount}. Zkuste znovu nebo zvolte krat\u0161\xED kv\xEDz.`
    );
  }
  const questions = [];
  for (let i = 0; i < questionsRaw.length; i++) {
    const nq = normalizeQuestion(questionsRaw[i], i);
    if (!nq) {
      throw new Error(`Neplatn\xE1 ot\xE1zka \u010D. ${i + 1} ve struktu\u0159e AI.`);
    }
    questions.push({ ...nq, id: `q${i + 1}` });
  }
  if (!title) {
    throw new Error("Neplatn\xE1 odpov\u011B\u010F AI (chyb\xED n\xE1zev kv\xEDzu).");
  }
  return { title, questions };
}
function textFromGeminiResponse(data) {
  const parts = data.candidates?.[0]?.content?.parts ?? [];
  const texts = parts.map((p) => p.text).filter((t) => typeof t === "string" && t.length > 0);
  if (texts.length === 0) {
    throw new Error("Pr\xE1zdn\xE1 odpov\u011B\u010F od Gemini (\u017E\xE1dn\xFD text).");
  }
  const jsonLike = texts.find((t) => t.trimStart().startsWith("{"));
  return jsonLike ?? texts[texts.length - 1];
}
function maxOutputTokensForQuiz(questionCount) {
  if (questionCount <= 15) return 16384;
  if (questionCount <= 25) return 32768;
  return 65536;
}
function geminiThinkingConfigFromEnv() {
  if (typeof process === "undefined") return {};
  const raw = process.env.GEMINI_THINKING_BUDGET?.trim();
  if (!raw) return {};
  const n = Number.parseInt(raw, 10);
  if (!Number.isFinite(n)) return {};
  return { thinkingConfig: { thinkingBudget: n } };
}
async function generateQuizFromGemini(config2, opts) {
  const apiKey = opts.apiKey.trim();
  if (!apiKey) {
    throw new Error("Chyb\xED API kl\xED\u010D pro Gemini.");
  }
  const questionCount = getQuestionCount(config2.quizLength);
  const model = opts.model?.trim() || "gemini-2.5-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`;
  const body = {
    systemInstruction: {
      parts: [
        {
          text: "Jsi gener\xE1tor vzd\u011Bl\xE1vac\xEDch kv\xEDz\u016F. Odpov\xEDd\xE1\u0161 v\xFDhradn\u011B strukturovan\xFDm JSON podle zadan\xE9ho sch\xE9matu a pokyn\u016F u\u017Eivatele. Ve\u0161ker\xFD obsah pro hr\xE1\u010De pi\u0161 v \u010De\u0161tin\u011B; pole mediaSearchHint je v\xFDjimka \u2014 pouze kr\xE1tk\xE1 anglick\xE1 fr\xE1ze pro vyhled\xE1n\xED ilustrace, nikdy \u010Desky."
        }
      ]
    },
    contents: [
      {
        role: "user",
        parts: [{ text: buildUserPrompt(config2) }]
      }
    ],
    generationConfig: {
      temperature: 0.65,
      maxOutputTokens: maxOutputTokensForQuiz(questionCount),
      responseMimeType: "application/json",
      responseJsonSchema: quizResponseJsonSchema(questionCount),
      ...geminiThinkingConfigFromEnv()
    }
  };
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": apiKey
    },
    body: JSON.stringify(body)
  });
  const data = await res.json();
  if (!res.ok) {
    const msg = data.error?.message || res.statusText;
    throw new Error(`Gemini API (${res.status}): ${msg}`);
  }
  const finishReason = data.candidates?.[0]?.finishReason;
  if (finishReason === "SAFETY") {
    throw new Error(
      "Gemini zablokovala odpov\u011B\u010F (bezpe\u010Dnostn\xED filtry). Zkus upravit t\xE9ma nebo kategorii."
    );
  }
  if (finishReason === "MAX_TOKENS") {
    throw new Error(
      "Odpov\u011B\u010F modelu se u\u0159\xEDzla (p\u0159\xEDli\u0161 dlouh\xFD v\xFDstup). Zvolte krat\u0161\xED kv\xEDz nebo zkuste generov\xE1n\xED znovu."
    );
  }
  const rawText = textFromGeminiResponse(data);
  let parsed;
  try {
    parsed = JSON.parse(extractJsonObject(rawText));
  } catch {
    throw new Error("Gemini nevr\xE1tila platn\xFD JSON.");
  }
  return parseGeneratedQuiz(parsed, questionCount);
}

// src/lib/quizConfigValidation.ts
var TARGETS = ["kids", "juniors", "adults", "seniors"];
var HANDICAPS = [
  "none",
  "visual_impairment",
  "dyslexia",
  "cognitive_dementia",
  "hearing_impairment",
  "autism_spectrum",
  "czech_learners"
];
var LEGACY_HANDICAP_KEYS = /* @__PURE__ */ new Set([
  "motor_skills",
  "cognitive",
  "dementia"
]);
function normalizeHandicapsFromApi(strings) {
  const set = /* @__PURE__ */ new Set();
  for (const h of strings) {
    if (h === "none") continue;
    if (h === "motor_skills") continue;
    if (h === "cognitive" || h === "dementia") {
      set.add("cognitive_dementia");
      continue;
    }
    if (HANDICAPS.includes(h) && h !== "none") {
      set.add(h);
    }
  }
  return set.size === 0 ? ["none"] : [...set];
}
var CATEGORIES = [
  "knowledge",
  "educational",
  "fun",
  "competitive"
];
var THEMES = [
  "seasonal",
  "animals",
  "general",
  "science",
  "pop_culture"
];
var LENGTHS = ["short", "medium", "long"];
function isString(v) {
  return typeof v === "string";
}
function parseQuizConfigurationBody(raw) {
  if (!raw || typeof raw !== "object") {
    throw new Error("Neplatn\xE9 t\u011Blo po\u017Eadavku (o\u010Dek\xE1v\xE1m JSON objekt).");
  }
  const o = raw;
  const targetGroup = o.targetGroup;
  const category = o.category;
  const theme = o.theme;
  const quizLength = o.quizLength;
  if (!isString(targetGroup) || !TARGETS.includes(targetGroup)) {
    throw new Error("Neplatn\xE1 c\xEDlov\xE1 skupina.");
  }
  if (!isString(category) || !CATEGORIES.includes(category)) {
    throw new Error("Neplatn\xE1 kategorie.");
  }
  if (!isString(theme) || !THEMES.includes(theme)) {
    throw new Error("Neplatn\xE9 t\xE9ma.");
  }
  if (!isString(quizLength) || !LENGTHS.includes(quizLength)) {
    throw new Error("Neplatn\xE1 d\xE9lka kv\xEDzu.");
  }
  const handicapsRaw = o.handicaps;
  if (!Array.isArray(handicapsRaw)) {
    throw new Error("Neplatn\xE9 pole handicap\u016F.");
  }
  const strings = handicapsRaw.filter(isString);
  if (strings.length !== handicapsRaw.length) {
    throw new Error("Neplatn\xE1 hodnota v handicapech.");
  }
  const allowedInput = /* @__PURE__ */ new Set([
    ...HANDICAPS,
    ...LEGACY_HANDICAP_KEYS
  ]);
  for (const h of strings) {
    if (!allowedInput.has(h)) {
      throw new Error("Neplatn\xE1 hodnota v handicapech.");
    }
  }
  const handicaps = normalizeHandicapsFromApi(strings);
  return {
    targetGroup,
    handicaps,
    category,
    theme,
    quizLength
  };
}

// src/services/mediaEnrichment.ts
var import_meta = {};
var COMMONS_API = "https://commons.wikimedia.org/w/api.php";
var THEME_FALLBACK_EN = {
  seasonal: "season holiday nature",
  animals: "wild animals nature",
  general: "landmark culture",
  science: "science laboratory nature",
  pop_culture: "cinema music concert"
};
var STOP_WORDS = /* @__PURE__ */ new Set([
  "jak",
  "co",
  "kdy",
  "kde",
  "kdo",
  "pro\u010D",
  "\u017Ee",
  "je",
  "jsou",
  "byl",
  "byla",
  "b\xFDt",
  "t\xEDm",
  "pro",
  "na",
  "v",
  "ve",
  "z",
  "ze",
  "do",
  "od",
  "po",
  "za",
  "o",
  "u",
  "i",
  "a",
  "nebo",
  "ani",
  "kter\xFD",
  "kter\xE1",
  "kter\xE9",
  "jak\xFD",
  "jak\xE1",
  "jak\xE9",
  "kolik",
  "mezi",
  "aby"
]);
function defaultClientMediaRuntime() {
  let enabled = true;
  try {
    const viteEnv = import_meta.env;
    if (viteEnv != null) {
      enabled = viteEnv.VITE_QUIZ_MEDIA !== "0";
    }
  } catch {
  }
  return {
    enabled,
    pexelsApiKey: void 0
  };
}
function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}
function sanitizeMediaSearchHint(raw) {
  const t = raw.replace(/[^a-zA-Z0-9\s-]/g, " ").replace(/\s+/g, " ").trim().slice(0, 100);
  if (t.length < 2) return null;
  return t;
}
function buildHeuristicMediaQuery(q, theme) {
  const normalized = q.questionText.replace(/[?!.:;,""""''()[\]{}«»]/g, " ").replace(/\s+/g, " ").trim();
  const words = normalized.split(" ").map((w74) => w74.trim()).filter((w) => w.length > 2 && !STOP_WORDS.has(w.toLowerCase()));
  const fromQuestion = words.slice(0, 6).join(" ");
  const correct = String(q.options[q.correctAnswerIndex] ?? "").replace(/[?!.:;,]/g, " ").trim();
  const correctWords = correct.split(/\s+/).filter((w) => w.length > 2 && !STOP_WORDS.has(w.toLowerCase()));
  const fromCorrect = correctWords.slice(0, 4).join(" ");
  const merged = [fromQuestion, fromCorrect].filter(Boolean).join(" ").trim();
  const uniqueWords = [...new Set(merged.split(/\s+/).filter(Boolean))];
  let query = uniqueWords.length > 0 ? uniqueWords.join(" ") : THEME_FALLBACK_EN[theme];
  if (query.length < 2) {
    query = THEME_FALLBACK_EN[theme];
  }
  return query.slice(0, 100);
}
function pickCommonsMedia(page) {
  const info = page.imageinfo?.[0];
  if (!info?.url || !info.mime) return null;
  const mime = info.mime.toLowerCase();
  const title = (page.title ?? "").replace(/^file:/i, "").trim();
  const alt = title.length > 0 ? `Ilustrace k ot\xE1zce: ${title.replace(/_/g, " ")}` : "Ilustrace z Wikimedia Commons";
  if (mime.startsWith("video/")) {
    return {
      kind: "video",
      url: info.url,
      alt,
      mime,
      sourceLabel: "Wikimedia Commons",
      sourceUrl: info.descriptionurl
    };
  }
  if (!mime.startsWith("image/")) return null;
  const displayUrl = info.thumburl || info.url;
  return {
    kind: "image",
    url: info.url,
    displayUrl,
    alt,
    sourceLabel: "Wikimedia Commons",
    sourceUrl: info.descriptionurl
  };
}
function parseCommonsBody(data) {
  const pages = data.query?.pages;
  if (!pages) return null;
  for (const p of Object.values(pages)) {
    if (!p?.title) continue;
    const lower = p.title.toLowerCase();
    if (lower.endsWith(".pdf") || lower.endsWith(".djvu") || lower.endsWith(".mid") || lower.endsWith(".oga")) {
      continue;
    }
    const media = pickCommonsMedia(p);
    if (media) return media;
  }
  return null;
}
async function fetchCommonsMedia(search) {
  const trimmed = search.trim();
  if (!trimmed) return null;
  const url = new URL(COMMONS_API);
  url.searchParams.set("action", "query");
  url.searchParams.set("format", "json");
  url.searchParams.set("origin", "*");
  url.searchParams.set("generator", "search");
  url.searchParams.set("gsrsearch", trimmed);
  url.searchParams.set("gsrnamespace", "6");
  url.searchParams.set("gsrlimit", "12");
  url.searchParams.set("prop", "imageinfo");
  url.searchParams.set("iiprop", "url|mime|thumburl|extmetadata");
  url.searchParams.set("iiurlwidth", "960");
  const res = await fetch(url.toString());
  if (res.status === 429) {
    await sleep(900);
    const res2 = await fetch(url.toString());
    if (!res2.ok) return null;
    return parseCommonsBody(await res2.json());
  }
  if (!res.ok) return null;
  return parseCommonsBody(await res.json());
}
async function fetchPexelsMedia(search, apiKey) {
  const key = apiKey.trim();
  if (!key || !search.trim()) return null;
  const u = new URL("https://api.pexels.com/v1/search");
  u.searchParams.set("query", search.slice(0, 80));
  u.searchParams.set("per_page", "1");
  u.searchParams.set("locale", "cs-CZ");
  const res = await fetch(u.toString(), {
    headers: { Authorization: key }
  });
  if (!res.ok) return null;
  const data = await res.json();
  const ph = data.photos?.[0];
  if (!ph) return null;
  const displayUrl = ph.src?.large ?? ph.src?.medium;
  if (!displayUrl) return null;
  const photographer = ph.photographer?.trim() ?? "nezn\xE1m\xFD autor";
  const alt = (ph.alt && ph.alt.trim().length > 0 ? ph.alt.trim() : `Fotografie k ot\xE1zce (${photographer})`) || "Fotografie z Pexels";
  return {
    kind: "image",
    url: displayUrl,
    displayUrl,
    alt,
    sourceLabel: `Pexels \xB7 ${photographer}`,
    sourceUrl: ph.url
  };
}
async function resolveMediaForQuestion(q, config2, runtime) {
  const preferPexelsFirst = Boolean(runtime.pexelsApiKey?.trim());
  const tryPexels = async (s) => fetchPexelsMedia(s, runtime.pexelsApiKey ?? "");
  const tryCommons = async (s) => fetchCommonsMedia(s);
  async function tryProviders(search) {
    if (preferPexelsFirst) {
      return await tryPexels(search) ?? await tryCommons(search);
    }
    return await tryCommons(search) ?? await tryPexels(search);
  }
  const hint = q.mediaSearchHint != null && q.mediaSearchHint.length > 0 ? sanitizeMediaSearchHint(q.mediaSearchHint) : null;
  const heuristic = buildHeuristicMediaQuery(q, config2.theme);
  const thematic = THEME_FALLBACK_EN[config2.theme];
  const attempts = [];
  const seen = /* @__PURE__ */ new Set();
  const add = (s) => {
    const k = s.toLowerCase().trim();
    if (k.length < 2 || seen.has(k)) return;
    seen.add(k);
    attempts.push(s);
  };
  if (hint) add(hint);
  add(heuristic);
  add(thematic);
  for (const search of attempts) {
    const media = await tryProviders(search);
    if (media) return media;
    await sleep(80);
  }
  return null;
}
async function enrichQuizWithMedia(quiz, config2, runtime) {
  const env = runtime ?? defaultClientMediaRuntime();
  if (!env.enabled) {
    return quiz;
  }
  const questions = quiz.questions;
  const out = [...questions];
  const concurrency = 2;
  let next = 0;
  const worker = async () => {
    while (true) {
      const i = next++;
      if (i >= out.length) break;
      try {
        const media = await resolveMediaForQuestion(out[i], config2, env);
        if (media) {
          out[i] = { ...out[i], media };
        }
      } catch {
      }
      await sleep(100);
    }
  };
  await Promise.all(
    Array.from({ length: Math.min(concurrency, out.length) }, () => worker())
  );
  return { ...quiz, questions: out };
}

// server/generate-quiz.ts
var config = {
  maxDuration: 300
};
function parseRequestBody(req) {
  const b = req.body;
  if (b == null || typeof b === "string" && b.trim() === "") {
    return void 0;
  }
  if (typeof b === "string") {
    return JSON.parse(b);
  }
  if (Buffer.isBuffer(b)) {
    const s = b.toString("utf8").trim();
    return s ? JSON.parse(s) : void 0;
  }
  return b;
}
async function handler(req, res) {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  try {
    if (req.method === "OPTIONS") {
      res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
      res.setHeader("Access-Control-Allow-Headers", "Content-Type");
      res.status(204).end();
      return;
    }
    if (req.method !== "POST") {
      res.status(405).json({ error: "Metoda nen\xED povolena." });
      return;
    }
    const apiKey = process.env.GEMINI_API_KEY?.trim();
    if (!apiKey) {
      res.status(503).json({
        error: "Server nem\xE1 nastaven\xFD GEMINI_API_KEY. Na Vercelu: Project \u2192 Settings \u2192 Environment Variables \u2192 p\u0159idej GEMINI_API_KEY (ne VITE_*). Pot\xE9 Redeploy."
      });
      return;
    }
    let config2;
    try {
      const body = parseRequestBody(req);
      config2 = parseQuizConfigurationBody(body);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Neplatn\xFD JSON nebo struktura t\u011Bla.";
      res.status(400).json({ error: msg });
      return;
    }
    const model = process.env.GEMINI_MODEL?.trim();
    let quiz = await generateQuizFromGemini(config2, { apiKey, model });
    const mediaEnabled = process.env.QUIZ_MEDIA !== "0";
    const pexelsKey = process.env.PEXELS_API_KEY?.trim();
    quiz = await enrichQuizWithMedia(quiz, config2, {
      enabled: mediaEnabled,
      pexelsApiKey: pexelsKey || void 0
    });
    let payload;
    try {
      payload = JSON.stringify(quiz);
    } catch (serErr) {
      console.error("[api/generate-quiz] serialize", serErr);
      res.status(500).json({
        error: "Nepoda\u0159ilo se serializovat odpov\u011B\u010F kv\xEDzu.",
        hint: "Zkontrolujte log funkce na Vercelu."
      });
      return;
    }
    res.status(200).send(payload);
  } catch (e) {
    console.error("[api/generate-quiz]", e);
    const msg = e instanceof Error ? e.message : "Neo\u010Dek\xE1van\xE1 chyba serveru.";
    try {
      if (!res.headersSent) {
        res.status(500).json({
          error: msg,
          hint: "Zkontrolujte log funkce ve Vercelu (Deployments \u2192 zvolte build \u2192 Functions). Pokud je zde chyba o modulu (import), zkontrolujte build a z\xE1vislosti."
        });
      }
    } catch (sendErr) {
      console.error("[api/generate-quiz] send error body failed", sendErr);
    }
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  config
});
