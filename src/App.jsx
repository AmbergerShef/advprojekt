import { useEffect, useMemo, useState } from "react";
import robiPortrait from "../beadndo/assets/Robi.png";

function withBasePath(path) {
  const base = import.meta.env.BASE_URL || "/";
  const normalizedBase = base.endsWith("/") ? base : `${base}/`;
  const normalizedPath = path.startsWith("/") ? path.slice(1) : path;
  return `${normalizedBase}${normalizedPath}`;
}

const APPS = [
  {
    slug: "waste-to-energy",
    href: withBasePath("apps/waste-to-energy/"),
    accent: "featured",
    year: "2026",
    kind: { hu: "Adatvizualizáció", en: "Data visualization", ro: "Vizualizare de date" },
    title: "Waste-to-Energy and Sustainability in Europe",
    description: {
      hu: "Többnyelvű, interaktív projekt az európai hulladékkezelési rendszerekről, energia-visszanyerésről és fenntarthatósági mutatókról.",
      en: "A multilingual interactive project about European waste systems, energy recovery, and sustainability indicators.",
      ro: "Un proiect interactiv multilingv despre sistemele europene de gestionare a deșeurilor, recuperarea energiei și indicatorii de sustenabilitate."
    },
    highlights: {
      hu: ["Lokális, tisztított adatok", "Interaktív dashboard", "Románia és Magyarország fókusz"],
      en: ["Clean local datasets", "Interactive dashboard", "Romania and Hungary focus"],
      ro: ["Seturi de date locale curate", "Dashboard interactiv", "Focus pe România și Ungaria"]
    },
    details: {
      hu: ["Stack: React, Vite, Vega-Lite", "Megvalósítás: többnyelvű story-oldal, imperatív chart runtime, dashboard és szűrők"],
      en: ["Stack: React, Vite, Vega-Lite", "Implementation: multilingual story page, imperative chart runtime, dashboard and filters"],
      ro: ["Stack: React, Vite, Vega-Lite", "Implementare: pagină narativă multilingvă, runtime imperativ pentru grafice, dashboard și filtre"]
    }
  },
  {
    slug: "microsoft-vs-apple",
    href: withBasePath("apps/microsoft-vs-apple/"),
    accent: "analysis",
    year: "2025",
    kind: { hu: "Pénzügyi elemzés", en: "Financial analysis", ro: "Analiză financiară" },
    title: "Microsoft vs Apple",
    description: {
      hu: "Narratív összehasonlító oldal a két vállalat bevételéről, profitabilitásáról és üzleti szerkezetéről.",
      en: "A narrative comparison page covering the two companies' revenue, profitability, and business structure.",
      ro: "O pagină comparativă narativă despre veniturile, profitabilitatea și structura de business a celor două companii."
    },
    highlights: {
      hu: ["Éves riportokra épül", "Diagramok és témaváltás", "Elemző történetmesélés"],
      en: ["Built from annual reports", "Charts and theme switch", "Analytical storytelling"],
      ro: ["Bazat pe rapoarte anuale", "Grafice și schimbare de temă", "Storytelling analitic"]
    },
    details: {
      hu: ["Stack: HTML, CSS, JavaScript, JSON adatok", "Megvalósítás: narratív felépítésű pénzügyi összehasonlító oldal témaváltással"],
      en: ["Stack: HTML, CSS, JavaScript, JSON data", "Implementation: narrative financial comparison page with theme switching"],
      ro: ["Stack: HTML, CSS, JavaScript, date JSON", "Implementare: pagină narativă de comparație financiară cu schimbare de temă"]
    }
  },
  {
    slug: "last-ring-arena",
    href: withBasePath("apps/last-ring-arena/"),
    accent: "game",
    year: "2025",
    kind: { hu: "Játék", en: "Game", ro: "Joc" },
    title: "Last Ring Arena",
    description: {
      hu: "Saját survival arena projektem hullámrendszerrel, fejlesztésekkel, témaválasztóval és leaderboarddal.",
      en: "My own survival arena project with waves, upgrades, theme switching, and a leaderboard.",
      ro: "Proiectul meu survival arena cu valuri, upgrade-uri, schimbare de teme și leaderboard."
    },
    highlights: {
      hu: ["Canvas alapú játékmenet", "Két külön vizuális téma", "Folyamatosan bővített saját projekt"],
      en: ["Canvas gameplay", "Two visual themes", "Continuously expanded personal project"],
      ro: ["Gameplay pe canvas", "Două teme vizuale", "Proiect personal extins continuu"]
    },
    details: {
      hu: ["Stack: HTML, CSS, JavaScript, Canvas", "Megvalósítás: survival arena loop, hullámrendszer, képességek és leaderboard"],
      en: ["Stack: HTML, CSS, JavaScript, Canvas", "Implementation: survival arena loop, wave system, abilities, and leaderboard"],
      ro: ["Stack: HTML, CSS, JavaScript, Canvas", "Implementare: loop de survival arena, sistem de valuri, abilități și leaderboard"]
    }
  },
  {
    slug: "romanian-cities-population",
    href: withBasePath("apps/romanian-cities-population/"),
    accent: "archive",
    year: "2024",
    kind: { hu: "Korábbi munka", en: "Earlier work", ro: "Lucrare anterioară" },
    title: "Romanian Cities: A Decade of Population Change",
    description: {
      hu: "Korábbi adatvizualizációs projekt a romániai városok népességváltozásáról 2010 és 2019 között.",
      en: "An earlier data visualization project about population change in Romanian cities between 2010 and 2019.",
      ro: "Un proiect anterior de vizualizare a datelor despre schimbarea populației în orașele din România între 2010 și 2019."
    },
    highlights: {
      hu: ["Vega-Lite vizualizációk", "Egyrészes történetmesélő oldal", "Demográfiai fókusz"],
      en: ["Vega-Lite visualizations", "Single-page story layout", "Demographic focus"],
      ro: ["Vizualizări Vega-Lite", "Layout narativ pe o singură pagină", "Focus demografic"]
    },
    details: {
      hu: ["Stack: HTML, beágyazott CSS, Vega-Lite", "Megvalósítás: egyoldalas adatvizualizációs történet romániai városadatokra"],
      en: ["Stack: HTML, embedded CSS, Vega-Lite", "Implementation: single-page data-story about Romanian city population data"],
      ro: ["Stack: HTML, CSS integrat, Vega-Lite", "Implementare: poveste de date pe o singură pagină despre populația orașelor din România"]
    }
  }
];

const COPY = {
  hu: {
    lang: "hu",
    nav: ["Kezdőlap", "Munkák"],
    eyebrow: "Projektportfólió",
    title: "Szakács Róbert digitális projektjei egy helyen.",
    lead:
      "Ez a gyökéroldal most már tényleg a portfólió kezdőpontja: innen lehet belépni az egyes munkákba, legyen szó adatvizualizációról, elemző oldalról vagy saját játékról.",
    primary: "Waste-to-Energy megnyitása",
    secondary: "Összes munka",
    panelLabel: "Kiemelt munka",
    panelTitle: "Waste-to-Energy and Sustainability in Europe",
    panelText:
      "A legerősebb és legösszetettebb projekt jelenleg ez a többnyelvű adatvizualizációs oldal, amely az európai hulladékkezelési mintákat és fenntarthatósági összefüggéseket vizsgálja.",
    panelMeta: [
      ["Forma", "Interaktív webes projekt"],
      ["Fókusz", "Hulladékkezelés, energia, fenntarthatóság"]
    ],
    worksEyebrow: "Válogatás",
    worksTitle: "Kiemelt munkák",
    open: "Megnyitás",
    infoLabel: "Részletek",
    footer: ["Szakács Róbert", "Projektportfólió"]
  },
  en: {
    lang: "en",
    nav: ["Home", "Work"],
    eyebrow: "Project Portfolio",
    title: "Róbert Szakács's digital projects in one place.",
    lead:
      "This root page now works as the actual portfolio entry point: from here you can open each project, whether it is a data visualization piece, an analysis page, or a personal game project.",
    primary: "Open Waste-to-Energy",
    secondary: "All projects",
    panelLabel: "Featured work",
    panelTitle: "Waste-to-Energy and Sustainability in Europe",
    panelText:
      "The strongest and most ambitious project at the moment is this multilingual data visualization site about European waste systems and broader sustainability patterns.",
    panelMeta: [
      ["Format", "Interactive web project"],
      ["Focus", "Waste systems, energy, sustainability"]
    ],
    worksEyebrow: "Selection",
    worksTitle: "Selected work",
    open: "Open",
    infoLabel: "Details",
    footer: ["Róbert Szakács", "Project portfolio"]
  },
  ro: {
    lang: "ro",
    nav: ["Acasă", "Lucrări"],
    eyebrow: "Portofoliu de proiecte",
    title: "Proiectele digitale ale lui Róbert Szakács într-un singur loc.",
    lead:
      "Această pagină-rădăcină funcționează acum ca punct real de intrare în portofoliu: de aici poți deschide fiecare proiect, fie că este vorba de vizualizare de date, pagină analitică sau joc personal.",
    primary: "Deschide Waste-to-Energy",
    secondary: "Toate proiectele",
    panelLabel: "Lucrare evidențiată",
    panelTitle: "Waste-to-Energy and Sustainability in Europe",
    panelText:
      "Cel mai puternic și mai amplu proiect în acest moment este acest site multilingv de vizualizare a datelor despre sistemele europene de deșeuri și legăturile lor cu sustenabilitatea.",
    panelMeta: [
      ["Format", "Proiect web interactiv"],
      ["Focus", "Deșeuri, energie, sustenabilitate"]
    ],
    worksEyebrow: "Selecție",
    worksTitle: "Lucrări selectate",
    open: "Deschide",
    infoLabel: "Detalii",
    footer: ["Róbert Szakács", "Portofoliu de proiecte"]
  }
};

function AppCard({ app, copy }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <article className={`project-card project-card--${app.accent}`}>
      <div className="project-card__top">
        <div className="project-card__meta">
          <span className="project-tag">{app.kind[copy.lang]}</span>
          <span className="project-year">{app.year}</span>
        </div>
        <button
          type="button"
          className={`project-card__info ${isOpen ? "project-card__info--active" : ""}`}
          aria-label={copy.infoLabel}
          aria-expanded={isOpen}
          onClick={() => setIsOpen((current) => !current)}
        >
          i
        </button>
        <h3>{app.title}</h3>
        <p>{app.description[copy.lang]}</p>
      </div>
      {isOpen ? (
        <div className="project-card__details">
          {app.details[copy.lang].map((detail) => (
            <p key={detail}>{detail}</p>
          ))}
        </div>
      ) : null}
      <ul className="project-points">
        {app.highlights[copy.lang].map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <a className="button button-primary wide" href={app.href}>
        {copy.open}
      </a>
    </article>
  );
}

export default function App() {
  const [language, setLanguage] = useState(
    () => localStorage.getItem("portfolio-root-language") || "hu"
  );
  const copy = useMemo(() => COPY[language] || COPY.hu, [language]);

  useEffect(() => {
    document.documentElement.lang = copy.lang;
    document.title =
      language === "hu"
        ? "Szakács Róbert | Projektportfólió"
        : language === "ro"
          ? "Róbert Szakács | Portofoliu"
          : "Róbert Szakács | Project Portfolio";
    localStorage.setItem("portfolio-root-language", language);
  }, [copy.lang, language]);

  return (
    <>
      <div className="shell-bg" aria-hidden="true"></div>
      <header className="site-header">
        <div className="brand">SR</div>
        <nav className="site-nav">
          <a href="#top">{copy.nav[0]}</a>
          <a href="#work">{copy.nav[1]}</a>
        </nav>
        <div className="language-switcher" aria-label="Language switcher">
          <button
            className={`lang-btn ${language === "hu" ? "active" : ""}`}
            type="button"
            onClick={() => setLanguage("hu")}
          >
            HU
          </button>
          <button
            className={`lang-btn ${language === "en" ? "active" : ""}`}
            type="button"
            onClick={() => setLanguage("en")}
          >
            EN
          </button>
          <button
            className={`lang-btn ${language === "ro" ? "active" : ""}`}
            type="button"
            onClick={() => setLanguage("ro")}
          >
            RO
          </button>
        </div>
      </header>

      <main>
        <section className="hero" id="top">
          <div className="hero-copy">
            <p className="eyebrow">{copy.eyebrow}</p>
            <div className="hero-heading">
              <img className="hero-portrait" src={robiPortrait} alt="Róbert Szakács portrait" />
              <h1>{copy.title}</h1>
            </div>
            <p className="lead">{copy.lead}</p>
            <div className="hero-actions">
              <a className="button button-primary" href={APPS[0].href}>
                {copy.primary}
              </a>
              <a className="button button-secondary" href="#work">
                {copy.secondary}
              </a>
            </div>
          </div>

          <aside className="hero-card">
            <p className="card-label">{copy.panelLabel}</p>
            <h2>{copy.panelTitle}</h2>
            <p>{copy.panelText}</p>
            <div className="spotlight-meta">
              {copy.panelMeta.map(([label, value]) => (
                <div className="spotlight-meta__row" key={label}>
                  <span>{label}</span>
                  <strong>{value}</strong>
                </div>
              ))}
            </div>
            <a className="button button-primary wide" href={APPS[0].href}>
              {copy.primary}
            </a>
          </aside>
        </section>

        <section className="panel project-panel" id="work">
          <div className="section-heading">
            <p className="eyebrow">{copy.worksEyebrow}</p>
            <h2>{copy.worksTitle}</h2>
          </div>
          <div className="project-cards">
            {APPS.map((app) => (
              <AppCard key={app.slug} app={app} copy={copy} />
            ))}
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <p>{copy.footer[0]}</p>
        <p>{copy.footer[1]}</p>
      </footer>
    </>
  );
}
