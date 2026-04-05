import type {
  GeneratedQuiz,
  QuizConfiguration,
  QuizQuestion,
  QuizOptionsTuple,
  QuizTheme,
} from '../types'
import { quizOptionCountForConfig } from '@/lib/accessibility/handicapRules'
import { THEME_LABEL_CS } from './themeWizardOptions'

export type FallbackQuizItem = {
  text: string
  options: [string, string, string, string]
  correctIndex: 0 | 1 | 2 | 3
  explanation: string
  imageContextPrompt: string
}

export type CategoryFallbackBuckets = Record<string, FallbackQuizItem[]>

/** Předpřipravené otázky podle kategorie a tematického bucketu (české klíče). */
export const CATEGORY_FALLBACKS: {
  fun: CategoryFallbackBuckets
  educational: CategoryFallbackBuckets
  knowledge: CategoryFallbackBuckets
} = {
  fun: {
    Zvířata: [
      {
        text: 'Které zvíře by bylo nejlepší tanečník? 🕺',
        options: ['Medvěd', 'Plch', 'Žába', 'Hroch'],
        correctIndex: 2,
        explanation:
          'Žáby skáčou a „předvádějí“ pohyb — v našem vtípku vyhrává žabí styl. 🐸',
        imageContextPrompt: 'forest pond with lily pads soft light',
      },
      {
        text: 'Kdo by vyhrál soutěž o nejhlasitější řev? 🦁',
        options: ['Myš', 'Lev', 'Kočka', 'Králík'],
        correctIndex: 1,
        explanation:
          'Lev je proslulý silným řevem — v zábavném kvízu bereme klasiku savců.',
        imageContextPrompt: 'african savanna grass sunset silhouette',
      },
      {
        text: 'Které zvíře by si nejspíš vzalo deštník, kdyby pršelo? ☔',
        options: ['Ryba', 'Veverka', 'Slimák', 'Orel'],
        correctIndex: 2,
        explanation:
          'Slimák nerad vysychá — vtipně si představíme, že by hledal „kryt“. 🐌',
        imageContextPrompt: 'garden after rain green leaves droplets',
      },
      {
        text: 'Kdo je podle vtipu nejlepší kamarád do peřiny? 🛏️',
        options: ['Žralok', 'Medvěd', 'Pes', 'Krokodýl'],
        correctIndex: 2,
        explanation:
          'Pes bývá mazlíček — zábavná otázka hraje s představou „spánku s kamarádem“.',
        imageContextPrompt: 'cozy bedroom soft blanket warm lamp',
      },
    ],
    Vesmír: [
      {
        text: 'Co by podle vtipu astronaut nejspíš zapomněl doma? 🚀',
        options: ['Boty', 'Klíče', 'Helmu', 'Knihu'],
        correctIndex: 1,
        explanation:
          'Zapomenout klíče je klasický gag — u astronauta je to úsměvné nadsázka.',
        imageContextPrompt: 'night sky stars telescope silhouette',
      },
      {
        text: 'Která planeta by byla nejlepší na piknik? 🧺',
        options: ['Merkur', 'Saturn se prstenci', 'Mars', 'Venuše'],
        correctIndex: 1,
        explanation:
          'Saturn má „koberec“ prstenců — představíme si piknik s výhledem (vtipně).',
        imageContextPrompt: 'saturn rings artistic space illustration',
      },
      {
        text: 'Co by měl měsíc v batohu na výlet? 🌙',
        options: ['Sluneční brýle', 'Kávu', 'Spacák', 'Lopatu'],
        correctIndex: 2,
        explanation:
          'Měsíc „spí“ na obloze — spacák je roztomilá absurdita pro děti.',
        imageContextPrompt: 'full moon over quiet hills night',
      },
      {
        text: 'Kdo je ve vesmíru největší fanoušek hvězd? ⭐',
        options: ['Astronom', 'Kuchař', 'Řidič', 'Malíř'],
        correctIndex: 0,
        explanation:
          'Astronom pozoruje hvězdy — jednoduchý vtip se skutečným řemeslem.',
        imageContextPrompt: 'observatory dome under starry sky',
      },
    ],
    Pohádky: [
      {
        text: 'Co by čaroděj nejspíš proměnil v žábu? 🐸',
        options: ['Jablko', 'Prince', 'Košťát', 'Hrad'],
        correctIndex: 1,
        explanation:
          'V pohádkách bývá proměna prince v žábu — hrajeme na klasický motiv.',
        imageContextPrompt: 'enchanted forest path misty trees',
      },
      {
        text: 'Který předmět nepatří do kouzelné výbavy? ✨',
        options: ['Hůlka', 'Kouzelná kniha', 'Mobilní telefon', 'Lektvar'],
        correctIndex: 2,
        explanation:
          'Mobil je moderní — v pohádkovém světě působí směšně a „nepatří“ tam.',
        imageContextPrompt: 'old spellbook candles wooden table',
      },
      {
        text: 'Kdo hlídá poklad v dračí jeskyni? 🐉',
        options: ['Kočka', 'Drak', 'Včela', 'Želva'],
        correctIndex: 1,
        explanation:
          'Drak hlídá poklad — základní pohádkový stereotyp pro zábavu.',
        imageContextPrompt: 'cave entrance rocky mountain dusk',
      },
      {
        text: 'Jak poznáš, že jsi v kouzelné říši? 🏰',
        options: [
          'Lítají tu dorty',
          'Mluví tu zvířata',
          'Všechno je šedé',
          'Není tu hudba',
        ],
        correctIndex: 1,
        explanation:
          'Mluvící zvířata patří k pohádkám — ostatní volby jsou absurdní.',
        imageContextPrompt: 'fairytale castle on hill sunrise clouds',
      },
    ],
    Sezónní: [
      {
        text: 'Co nejvíc patří k zimní radosti? ⛄',
        options: ['Koupání v ledové řece', 'Sněhulák', 'Žihadlo vosy', 'Žába'],
        correctIndex: 1,
        explanation:
          'Sněhulák je symbol zimy — ostatní volby jsou úmyslně mimo mísu.',
        imageContextPrompt: 'snowy village rooftops soft snowfall',
      },
      {
        text: 'Které ovoce „křičí“ léto? 🍉',
        options: ['Jablko ze sklepa', 'Meloun', 'Zmrzlý hrách', 'Kámen'],
        correctIndex: 1,
        explanation:
          'Meloun je letní klasika — zábavná otázka na sezónní náladu.',
        imageContextPrompt: 'picnic blanket summer park trees',
      },
      {
        text: 'Co najdeš na velikonočním stole nejčastěji? 🥚',
        options: ['Klobásu', 'Beránka a vajíčka', 'Pizza', 'Polévku'],
        correctIndex: 1,
        explanation:
          'Beránek a vajíčka jsou typické — ostatní jsou vtipné odbočky.',
        imageContextPrompt: 'spring flowers branches pastel colors',
      },
      {
        text: 'Které roční období má nejlepší barvy listí? 🍂',
        options: ['Zima', 'Jaro', 'Podzim', 'Léto'],
        correctIndex: 2,
        explanation:
          'Podzimní listí je barevné — jednoduchá sezónní otázka.',
        imageContextPrompt: 'autumn forest path golden leaves',
      },
    ],
    Obecné: [
      {
        text: 'Který sport by hrály mravenci? 🐜',
        options: ['Potápění', 'Šach', 'Fotbal s lístečkem', 'Lyžování'],
        correctIndex: 2,
        explanation:
          'Mravenci táhnou věci — mini „míč“ z lístečku je roztomilá absurdita.',
        imageContextPrompt: 'meadow grass close up sunlight',
      },
      {
        text: 'Co je nejlepší superpower na úklid pokoje? 🧹',
        options: ['Neviditelnost', 'Teleport nepořádku pryč', 'Čtení myšlenek', 'Let'],
        correctIndex: 1,
        explanation:
          'Teleport „nepořádku“ je vtipná fantazie — zábavný tón bez faktů.',
        imageContextPrompt: 'tidy wooden desk organized shelves',
      },
      {
        text: 'Kdo vyhraje soutěž v spaní? 😴',
        options: ['Socha', 'Kočka', 'Bzučící včela', 'Běžící kůň'],
        correctIndex: 1,
        explanation:
          'Kočky prosluly šlofíky — jednoduchý humor pro děti.',
        imageContextPrompt: 'sleeping cat sunny windowsill',
      },
      {
        text: 'Jaký dopravní prostředek by použila želva na spěch? 🐢',
        options: ['Raketu', 'Skateboard', 'Ničím, želva nespěchá', 'Ponorku'],
        correctIndex: 2,
        explanation:
          'Želva symbolizuje klid — správná odpověď je humorná pointa.',
        imageContextPrompt: 'quiet country road bicycle lane trees',
      },
    ],
  },
  educational: {
    Zvířata: [
      {
        text: 'Věděl/a jsi, že savec, který snáší vejce, je ptakopysk?',
        options: ['Ano, ptakopysk', 'Ne, je to panda', 'Ne, je to žralok', 'Ne, je to had'],
        correctIndex: 0,
        explanation:
          'Ptakopysk je výjimečný savec, který snáší vejce. Věděl/a jsi, že mláďata se líhnou z vajec a pak sají mléko jako ostatní savci? Patří mezi ptakořitní.',
        imageContextPrompt: 'riverbank reeds calm water reflection',
      },
      {
        text: 'Proč mají někteří živočichové pruhy nebo skvrny?',
        options: [
          'Aby byli vidět z dálky',
          'Jako kamufláž nebo varování',
          'Kvůli hudbě',
          'Kvůli počasí',
        ],
        correctIndex: 1,
        explanation:
          'Věděl/a jsi, že pruhy a skvrny často pomáhají splynout s prostředím nebo varovat predátory? U každého druhu má vzor jiný význam.',
        imageContextPrompt: 'zebra pattern abstract texture neutral',
      },
      {
        text: 'Které zvíře je typickým příkladem migrace na velké vzdálenosti?',
        options: ['Medvěd v jeskyni', 'Hnědý netopýr', 'Rybák obecný (pták)', 'Pavouk domácí'],
        correctIndex: 2,
        explanation:
          'Mnoho ptáků létá na zimu do teplých oblastí. Věděl/a jsi, že migrace šetří energii a zvyšuje šanci na přežití potomstva?',
        imageContextPrompt: 'flock of birds sky migration silhouette',
      },
      {
        text: 'Co znamená, že je živočich „ohrožený druh“?',
        options: [
          'Žije jen v ZOO',
          'Je běžný všude',
          'Hrozí mu vyhynutí ve volné přírodě',
          'Je nebezpečný lidem',
        ],
        correctIndex: 2,
        explanation:
          'Věděl/a jsi, že ohrožený druh potřebuje ochranu prostředí? Často jde o úbytek biotopů, lov nebo změny klimatu.',
        imageContextPrompt: 'national park sign wooden trail nature',
      },
    ],
    Vesmír: [
      {
        text: 'Věděl/a jsi, že Zemi obíhá jeden přirozený satelit?',
        options: ['Mars', 'Měsíc', 'Slunce', 'Halleyova kometa'],
        correctIndex: 1,
        explanation:
          'Měsíc ovlivňuje příliv a odliv. Věděl/a jsi, že jeho fáze souvisí s tím, kolik jeho osvětlené části vidíme ze Země?',
        imageContextPrompt: 'moon phases diagram simple educational',
      },
      {
        text: 'Co je Slunce ve sluneční soustavě?',
        options: ['Planeta', 'Hvězda', 'Měsíc', 'Kometka'],
        correctIndex: 1,
        explanation:
          'Slunce je hvězda a zdroj energie pro život na Zemi. Věděl/a jsi, že planety ho obíhají díky gravitaci?',
        imageContextPrompt: 'solar system artistic orrery soft colors',
      },
      {
        text: 'Proč ve vesmíru neslyšíš výbuchy?',
        options: [
          'Protože je tma',
          'Protože zvuk potřebuje látku, která kmitá',
          'Protože je zima',
          'Protože je tam vítr',
        ],
        correctIndex: 1,
        explanation:
          'Věděl/a jsi, že zvuk se šíří kmitáním částic? Ve vakuu mezi hvězdami téměř nic nekmitá, takže zvuk nepostupuje.',
        imageContextPrompt: 'silent space station window stars',
      },
      {
        text: 'Co je to planeta?',
        options: [
          'Malá hvězda',
          'Těleso obíhající hvězdu, dostatečně velké na kulovitý tvar',
          'Pás asteroidů',
          'Mlhovina',
        ],
        correctIndex: 1,
        explanation:
          'Planeta obíhá hvězdu a má dostatečnou hmotnost na kulovitý tvar. Věděl/a jsi, že sluneční soustava má osm planet?',
        imageContextPrompt: 'planet earth from space clouds blue',
      },
    ],
    Pohádky: [
      {
        text: 'Věděl/a jsi, že pohádky často učí morálním volbám?',
        options: [
          'Ne, jsou jen o strachu',
          'Ano, ukazují důsledek chování',
          'Ne, jsou jen o jídle',
          'Ne, jsou bez příběhu',
        ],
        correctIndex: 1,
        explanation:
          'Pohádky zjednodušují svět, aby děti pochopily souvislosti. Věděl/a jsi, že pomáhají pojmenovat emoce a odvahu?',
        imageContextPrompt: 'open storybook pages warm light desk',
      },
      {
        text: 'Co je typické pro pohádkového hrdinu?',
        options: [
          'Vzdá se hned na začátku',
          'Často čelí zkoušce a roste',
          'Nikdy nemluví',
          'Nemá žádný cíl',
        ],
        correctIndex: 1,
        explanation:
          'Věděl/a jsi, že příběhová cesta hrdiny učí překonávat překážky? Proto mají pohádky oblíbenou strukturu „výzva–pomoc–návrat“.',
        imageContextPrompt: 'mountain path sunrise journey silhouette',
      },
      {
        text: 'Proč mají pohádky často tři syny nebo tři úkoly?',
        options: [
          'Náhoda bez důvodu',
          'Je to rytmus příběhu známý posluchačům',
          'Kvůli matematice',
          'Kvůli počasí',
        ],
        correctIndex: 1,
        explanation:
          'Věděl/a jsi, že trojice je v lidové slovesnosti stabilní vzorec? Pomáhá posluchači sledovat napětí a pointu.',
        imageContextPrompt: 'three stepping stones across stream forest',
      },
      {
        text: 'Jaký účel může mít pohádkové zlo?',
        options: [
          'Učit, co je nebezpečné nebo špatné',
          'Nemá žádný význam',
          'Jen vyplnit čas',
          'Zakázat spaní',
        ],
        correctIndex: 0,
        explanation:
          'Pohádky často bezpečně ukazují hranice. Věděl/a jsi, že důležité je, aby dítě mělo vedle příběhu dospělou oporu?',
        imageContextPrompt: 'shadow puppet theater warm lamp',
      },
    ],
    Sezónní: [
      {
        text: 'Věděl/a jsi, proč na jaře často kvetou stromy?',
        options: [
          'Kvůli sněhu',
          'Kvůli delšímu světlu a teplejšímu počasí',
          'Kvůli televizi',
          'Kvůli moři',
        ],
        correctIndex: 1,
        explanation:
          'Rostliny reagují na světlo a teplotu. Věděl/a jsi, že jarní květy přitahují opylovače a pomáhají tvorbě plodů?',
        imageContextPrompt: 'cherry blossoms branch blue sky',
      },
      {
        text: 'Co je typické pro zimní přírodu v mírném pásmu?',
        options: [
          'Všechno kvete najednou',
          'Některá zvířata hibernují nebo mění potravu',
          'Všechno zmizí navždy',
          'Stromy přestanou existovat',
        ],
        correctIndex: 1,
        explanation:
          'Věděl/a jsi, že hibernace šetří energii? Zvířata se připravují zásobami nebo spánkem na období nedostatku potravy.',
        imageContextPrompt: 'snowy forest animal tracks winter',
      },
      {
        text: 'Proč je léto vhodné na růst plodin?',
        options: [
          'Protože je kratší den',
          'Protože bývá více tepla a světla',
          'Protože prší méně vždy',
          'Protože je tma',
        ],
        correctIndex: 1,
        explanation:
          'Věděl/a jsi, že fotosyntéza potřebuje světlo? Teplo také ovlivňuje metabolismus rostlin, proto farmáři sledují sezónu.',
        imageContextPrompt: 'wheat field golden hour countryside',
      },
      {
        text: 'Co znamená „rovnodennost“?',
        options: [
          'Nejdelší den v roce',
          'Den, kdy je den a noc zhruba stejně dlouhé',
          'Začátek zimy',
          'Konec měsíce',
        ],
        correctIndex: 1,
        explanation:
          'Věděl/a jsi, že při rovnodennosti je Slunce v určité pozici vzhledem k rovníku? Děje se na jaře a na podzim.',
        imageContextPrompt: 'equinox sky gradient horizon calm',
      },
    ],
    Obecné: [
      {
        text: 'Víš, že pitná voda je pro tělo klíčová už od rána?',
        options: [
          'Ne, voda je jen pro rostliny',
          'Ano, pomáhá hydrataci a soustředění',
          'Ne, stačí jen sladké nápoje',
          'Ne, voda se nepije',
        ],
        correctIndex: 1,
        explanation:
          'Věděl/a jsi, že i mírné odvodnění může změnit náladu a výkon? Pravidelná voda je jednoduchý zdravý návyk.',
        imageContextPrompt: 'glass of water morning light kitchen',
      },
      {
        text: 'Proč je dobré číst každý den aspoň chvilku?',
        options: [
          'Aby se knihy neprášily',
          'Rozvíjí slovní zásobu a představivost',
          'Aby byl telefon rychlejší',
          'Aby pršelo',
        ],
        correctIndex: 1,
        explanation:
          'Věděl/a jsi, že čtení trénuje porozumění textu a soustředění? I krátký úsek denně dělá velký rozdíl.',
        imageContextPrompt: 'child reading book cozy corner cushion',
      },
      {
        text: 'Co znamená recyklovat?',
        options: [
          'Vyhodit vše do jedné popelnice',
          'Znovu využít materiály, aby se méně plýtvalo',
          'Kupovat jen nové věci',
          'Skrývat odpad',
        ],
        correctIndex: 1,
        explanation:
          'Věděl/a jsi, že třídění pomáhá zpracovat papír, sklo nebo kov znovu? Šetří to suroviny i energii.',
        imageContextPrompt: 'recycling bins colorful clean street',
      },
      {
        text: 'Proč je spánek důležitý pro učení?',
        options: [
          'Není důležitý',
          'Mozek zpracovává informace a dobíjí energii',
          'Nahrazuje jídlo',
          'Zastaví růst',
        ],
        correctIndex: 1,
        explanation:
          'Věděl/a jsi, že během spánku probíhá upevňování vzpomínek? Pravidelný režim pomáhá paměti i náladě.',
        imageContextPrompt: 'bedroom moonlight soft pillow calm',
      },
    ],
  },
  knowledge: {
    Zvířata: [
      {
        text: 'Který savec snáší vejce?',
        options: ['Panda', 'Ptakopysk', 'Netopýr', 'Vlk'],
        correctIndex: 1,
        explanation:
          'Ptakopysk je výjimečný savec, který snáší vejce a patří mezi ptakořitné.',
        imageContextPrompt: 'river otter like mammal habitat rocks',
      },
      {
        text: 'Kolik nohou má hmyz typicky?',
        options: ['Čtyři', 'Šest', 'Osm', 'Dvě'],
        correctIndex: 1,
        explanation:
          'Hmyz má obvykle tři páry nohou, tedy šest.',
        imageContextPrompt: 'meadow insect on leaf macro nature',
      },
      {
        text: 'Které zvíře je plž?',
        options: ['Hmyz', 'Slimák', 'Ryba', 'Pták'],
        correctIndex: 1,
        explanation:
          'Slimák je měkkýš bez ulity (šnek má ulitu).',
        imageContextPrompt: 'garden snail shell damp soil',
      },
      {
        text: 'Kdo je predátor v potravním řetězci?',
        options: ['Rostlina', 'Liška', 'List', 'Houba jako výhradně producent'],
        correctIndex: 1,
        explanation:
          'Liška loví kořist, patří mezi predátory.',
        imageContextPrompt: 'forest clearing fox distant trees',
      },
    ],
    Vesmír: [
      {
        text: 'Která planeta je nejbližší Slunci?',
        options: ['Venuše', 'Merkur', 'Mars', 'Země'],
        correctIndex: 1,
        explanation:
          'Merkur je první planeta od Slunce ve sluneční soustavě.',
        imageContextPrompt: 'mercury planet surface illustration',
      },
      {
        text: 'Co obíhá Zemi?',
        options: ['Slunce', 'Měsíc', 'Mars', 'Saturn'],
        correctIndex: 1,
        explanation:
          'Měsíc je přirozená družice Země.',
        imageContextPrompt: 'moon crater surface telescope view',
      },
      {
        text: 'Jak se jmenuje naše galaxie?',
        options: ['Andromeda', 'Mléčná dráha', 'Trojúhelník', 'Velký vůz'],
        correctIndex: 1,
        explanation:
          'Sluneční soustava je součástí galaxie Mléčná dráha.',
        imageContextPrompt: 'milky way band night sky stars',
      },
      {
        text: 'Co je hvězda Slunce pro Zemi?',
        options: ['Měsíc', 'Zdroj světla a energie', 'Kometka', 'Mlhovina'],
        correctIndex: 1,
        explanation:
          'Slunce je hvězda, která dodává Zemi světlo a teplo.',
        imageContextPrompt: 'sun rays through clouds sky',
      },
    ],
    Pohádky: [
      {
        text: 'Kdo napsal knihu o Pinocchiovi?',
        options: ['Carlo Collodi', 'Charles Dickens', 'Hans Christian Andersen', 'Grimmové'],
        correctIndex: 0,
        explanation:
          'Pinocchia proslavil ital Carlo Collodi.',
        imageContextPrompt: 'wooden marionette workshop tools',
      },
      {
        text: 'Ve které pohádce je Sněhurka?',
        options: ['O šípkové Růžence', 'O Sněhurce', 'O Popelce', 'O Jeníčkovi a Mařence'],
        correctIndex: 1,
        explanation:
          'Sněhurka je postava z klasické pohádky bratří Grimmů.',
        imageContextPrompt: 'forest cottage seven small doors fairytale',
      },
      {
        text: 'Kdo napsal Malého prince?',
        options: ['Antoine de Saint-Exupéry', 'Jules Verne', 'Mark Twain', 'Agatha Christie'],
        correctIndex: 0,
        explanation:
          'Malého prince napsal Antoine de Saint-Exupéry.',
        imageContextPrompt: 'desert horizon single star evening',
      },
      {
        text: 'Která pohádka obsahuje kouzelné fazolky a obří stopu?',
        options: ['Jack a fazolový stonek', 'Popelka', 'Červená Karkulka', 'O řepě'],
        correctIndex: 0,
        explanation:
          'Příběh Jacka a fazolového stonku pracuje s obrem a fazolkami.',
        imageContextPrompt: 'giant beanstalk clouds castle above',
      },
    ],
    Sezónní: [
      {
        text: 'Které roční období následuje po zimě?',
        options: ['Podzim', 'Jaro', 'Léto', 'Zima znovu'],
        correctIndex: 1,
        explanation:
          'Po zimě přichází jaro.',
        imageContextPrompt: 'snow melting creek buds spring',
      },
      {
        text: 'V kterém ročním období bývá v Česku nejdelší den?',
        options: ['Zima', 'Jaro', 'Léto', 'Podzim'],
        correctIndex: 2,
        explanation:
          'Letní slunovrat přináší nejdelší den v roce.',
        imageContextPrompt: 'summer solstice field long shadows',
      },
      {
        text: 'Jak se jmenuje svátek vánočních tradic v prosinci?',
        options: ['Velikonoce', 'Vánoce', 'Dušičky', 'Masopust'],
        correctIndex: 1,
        explanation:
          'Vánoce se slaví v prosinci (24.–25. u mnoha rodin).',
        imageContextPrompt: 'winter window candles evergreen branches',
      },
      {
        text: 'Které roční období je typické pro sklizeň obilí v Česku?',
        options: ['Zima', 'Jaro', 'Léto', 'Podzim'],
        correctIndex: 2,
        explanation:
          'Hlavní sklizňové práce často vrcholí v létě podle plodiny.',
        imageContextPrompt: 'harvest tractor golden field summer',
      },
    ],
    Obecné: [
      {
        text: 'Hlavní město České republiky je:',
        options: ['Brno', 'Praha', 'Ostrava', 'Plzeň'],
        correctIndex: 1,
        explanation:
          'Hlavní město Česka je Praha.',
        imageContextPrompt: 'prague skyline silhouette river evening',
      },
      {
        text: 'Kolik je 7 + 8?',
        options: ['14', '15', '16', '13'],
        correctIndex: 1,
        explanation:
          'Součet 7 a 8 je 15.',
        imageContextPrompt: 'school notebook numbers doodle calm',
      },
      {
        text: 'Která kapalina je při pokojové teplotě rtuť?',
        options: ['Voda', 'Olej', 'Rtuť', 'Písek'],
        correctIndex: 2,
        explanation:
          'Rtuť je kov tekutý za běžné pokojové teploty.',
        imageContextPrompt: 'laboratory glassware neutral background',
      },
      {
        text: 'Který kontinent je největší?',
        options: ['Afrika', 'Asie', 'Evropa', 'Antarktida'],
        correctIndex: 1,
        explanation:
          'Největší kontinent je Asie.',
        imageContextPrompt: 'world map continents muted colors',
      },
    ],
  },
}

const THEME_TO_BUCKET: Partial<Record<QuizTheme, string>> = {
  kid_animals: 'Zvířata',
  kid_space_dinosaurs: 'Vesmír',
  kid_fairy_tales_magic: 'Pohádky',
  kid_seasonal: 'Sezónní',
  jr_nature_science: 'Zvířata',
  jr_gaming_tech: 'Obecné',
  jr_pop_culture: 'Obecné',
  jr_fake_news_myths: 'Obecné',
  ad_general: 'Obecné',
  ad_travel_geography: 'Obecné',
  ad_history_culture: 'Pohádky',
  ad_science_tech: 'Vesmír',
  sr_retro_6080: 'Sezónní',
  sr_golden_czech_hands: 'Obecné',
  sr_nature_herbs: 'Zvířata',
  sr_history_local: 'Obecné',
}

function shuffleQuestionOptions(question: QuizQuestion): QuizQuestion {
  const tagged = question.options.map((text, i) => ({
    text,
    correct: i === question.correctAnswerIndex,
  }))
  for (let i = tagged.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[tagged[i], tagged[j]] = [tagged[j], tagged[i]]
  }
  const correctAnswerIndex = tagged.findIndex((t) => t.correct)
  return {
    ...question,
    options: tagged.map((t) => t.text) as QuizOptionsTuple,
    correctAnswerIndex,
  }
}

/** Z 4 možností vytvoří 3 (správná + dvě vybrané špatné). */
function pickThreeFromFour(item: FallbackQuizItem): {
  options: [string, string, string]
  correctIndex: 0 | 1 | 2
} {
  const opts = item.options
  const c = item.correctIndex
  const correctText = opts[c]
  const wrongIx = ([0, 1, 2, 3] as const).filter((i) => i !== c)
  const shuffledWrong = shuffleArray([...wrongIx])
  const w1 = opts[shuffledWrong[0]]
  const w2 = opts[shuffledWrong[1]]
  const triple = shuffleArray([correctText, w1, w2]) as [
    string,
    string,
    string,
  ]
  const correctIndex = triple.indexOf(correctText) as 0 | 1 | 2
  return { options: triple, correctIndex }
}

function itemToQuestion(
  item: FallbackQuizItem,
  index: number,
  optionCount: 3 | 4
): QuizQuestion {
  if (optionCount === 3) {
    const { options, correctIndex } = pickThreeFromFour(item)
    const q: QuizQuestion = {
      id: `q${index + 1}`,
      questionText: item.text,
      options,
      correctAnswerIndex: correctIndex,
      explanation: item.explanation,
      imageContextPrompt: item.imageContextPrompt,
    }
    return shuffleQuestionOptions(q)
  }
  const q: QuizQuestion = {
    id: `q${index + 1}`,
    questionText: item.text,
    options: [...item.options] as [string, string, string, string],
    correctAnswerIndex: item.correctIndex,
    explanation: item.explanation,
    imageContextPrompt: item.imageContextPrompt,
  }
  return shuffleQuestionOptions(q)
}

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/**
 * Sestaví kvíz z předpřipravených otázek (cyklením poolu, pokud jich není dost).
 */
export function buildFallbackQuiz(
  config: QuizConfiguration,
  questionCount: number
): GeneratedQuiz {
  const cat = config.category
  if (cat !== 'fun' && cat !== 'educational' && cat !== 'knowledge') {
    throw new Error('Fallback kvíz je dostupný jen pro kategorie fun, educational a knowledge.')
  }
  const buckets = CATEGORY_FALLBACKS[cat]
  const bucketKey =
    config.theme === 'random' || config.theme === 'custom'
      ? 'Obecné'
      : THEME_TO_BUCKET[config.theme] ?? 'Obecné'
  const primary = buckets[bucketKey] ?? buckets.Obecné
  const merged: FallbackQuizItem[] =
    bucketKey === 'Obecné' ? [...primary] : [...primary, ...buckets.Obecné]
  let pool = shuffleArray(merged)
  if (pool.length === 0) {
    throw new Error('Chybí fallback otázky pro zvolenou kategorii.')
  }
  const picked: FallbackQuizItem[] = []
  for (let i = 0; i < questionCount; i++) {
    picked.push(pool[i % pool.length])
  }
  const label = THEME_LABEL_CS[config.theme]
  const title =
    config.theme === 'custom' && config.customThemeText.trim()
      ? `${config.customThemeText.trim().slice(0, 48)} (záložní kvíz)`
      : `${label} — záložní kvíz`

  const optionCount = quizOptionCountForConfig(config)
  const questions = picked.map((item, i) =>
    itemToQuestion(item, i, optionCount)
  )
  return { title, questions }
}
