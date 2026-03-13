const canvas = document.getElementById("constellation");
const context = canvas.getContext("2d");
const homepageTranslations = {
  hu: {
    title: "Szakács Róbert | GitHub Homepage",
    nav: ["Rólam", "Projektek", "Elérés"],
    eyebrow: "GitHub Homepage",
    heroTitle: "Szakács Róbert vagyok.",
    heroLead:
      "Egyetemi projekteken, adatvizualizációs ötleteken és webes megoldásokon dolgozom. Ez az oldalam a saját online kiindulópontom, ahol a fontosabb munkáimat és projektjeimet mutatom be.",
    heroButtons: ["Microsoft vs Apple projekt", "További részletek"],
    featuredLabel: "Most kiemelt projekt",
    featuredText:
      "Pénzügyi adatokra épülő összehasonlító oldal hivatalos vállalati jelentések, külön adatfájl és interaktív mini vizualizációk felhasználásával.",
    features: ["Külön JSON adatfájl", "Interaktív webes megjelenítés", "Összehasonlító diagramok"],
    aboutEyebrow: "Rólam",
    aboutTitle: "Adatok, dizájn és történetmesélés egy helyen",
    aboutCards: [
      ["Fókuszom", "Olyan projekteket szeretek építeni, ahol az adatok nemcsak elemzésként, hanem vizuálisan is értelmezhető formában jelennek meg."],
      ["Érdeklődésem", "Adatelemzés, adatvizualizáció, frontend fejlesztés és olyan digitális felületek tervezése, amelyek egyszerre informatívak és látványosak."],
      ["Célom", "Olyan portfólió kialakítása, amely jól bemutatja a gondolkodásmódomat, a technikai készségeimet és az egyetemi projektmunkáimat."]
    ],
    projectsEyebrow: "Projektek",
    projectsTitle: "Válogatás a kiemelt munkáimból",
    projectTags: ["Kész projektoldal", "Korábbi projekt"],
    projectDescriptions: [
      "Pénzügyi adatokra épülő összehasonlító weboldal, amely a két vállalat árbevételét, profitabilitását és üzleti szerkezetét mutatja be.",
      "Egy korábbi adatvizualizációs projekt, amely a romániai városok népességváltozását mutatja be 2010 és 2019 között."
    ],
    projectButtons: ["Megnyitás", "Megnyitás"],
    contactEyebrow: "Elérés",
    contactTitle: "Ez az oldal a saját GitHub kezdőlapom alapja",
    contactText:
      "A homepage célja, hogy összefogja a projektjeimet és egy könnyen navigálható, személyes belépőoldalként működjön. Később további munkákkal, új projektekkel és részletesebb bemutatkozó tartalommal is bővíthető.",
    footer: ["Szakács Róbert", "GitHub homepage és projektportfólió"]
  },
  en: {
    title: "Róbert Szakács | GitHub Homepage",
    nav: ["About", "Projects", "Contact"],
    eyebrow: "GitHub Homepage",
    heroTitle: "I'm Róbert Szakács.",
    heroLead:
      "I work on university projects, data visualization ideas, and web solutions. This page is my personal online starting point where I showcase my key work and projects.",
    heroButtons: ["Microsoft vs Apple project", "More details"],
    featuredLabel: "Featured project",
    featuredText:
      "A financial comparison site built from official company reports, a separate data file, and interactive mini visualizations.",
    features: ["Separate JSON data file", "Interactive web presentation", "Comparative charts"],
    aboutEyebrow: "About",
    aboutTitle: "Data, design, and storytelling in one place",
    aboutCards: [
      ["My focus", "I enjoy building projects where data is not only analyzed but also presented in a visually understandable way."],
      ["My interests", "Data analysis, data visualization, frontend development, and designing digital interfaces that are both informative and visually engaging."],
      ["My goal", "To build a portfolio that clearly presents my way of thinking, my technical skills, and my university project work."]
    ],
    projectsEyebrow: "Projects",
    projectsTitle: "A selection of my featured work",
    projectTags: ["Finished project", "Earlier project"],
    projectDescriptions: [
      "A comparison website based on financial data that presents the two companies' revenue, profitability, and business structure.",
      "An earlier data visualization project showing population change in Romanian cities between 2010 and 2019."
    ],
    projectButtons: ["Open", "Open"],
    contactEyebrow: "Contact",
    contactTitle: "This page is the basis of my GitHub homepage",
    contactText:
      "The goal of this homepage is to bring my projects together and function as an easy-to-navigate personal landing page. Later it can be expanded with additional work, new projects, and more detailed introduction content.",
    footer: ["Róbert Szakács", "GitHub homepage and project portfolio"]
  },
  ro: {
    title: "Róbert Szakács | Pagina GitHub",
    nav: ["Despre mine", "Proiecte", "Contact"],
    eyebrow: "Pagina GitHub",
    heroTitle: "Sunt Róbert Szakács.",
    heroLead:
      "Lucrez la proiecte universitare, idei de vizualizare a datelor și soluții web. Această pagină este punctul meu personal de pornire online, unde îmi prezint proiectele și lucrările importante.",
    heroButtons: ["Proiectul Microsoft vs Apple", "Mai multe detalii"],
    featuredLabel: "Proiect evidențiat",
    featuredText:
      "O pagină de comparație financiară bazată pe rapoarte oficiale ale companiilor, un fișier de date separat și mini-vizualizări interactive.",
    features: ["Fișier JSON separat", "Prezentare web interactivă", "Grafice comparative"],
    aboutEyebrow: "Despre mine",
    aboutTitle: "Date, design și storytelling într-un singur loc",
    aboutCards: [
      ["Focusul meu", "Îmi place să construiesc proiecte în care datele nu sunt doar analizate, ci și prezentate într-o formă vizuală ușor de înțeles."],
      ["Interesele mele", "Analiza datelor, vizualizarea datelor, dezvoltarea frontend și proiectarea interfețelor digitale care sunt în același timp informative și atractive."],
      ["Scopul meu", "Să construiesc un portofoliu care să prezinte clar modul meu de gândire, competențele tehnice și proiectele mele universitare."]
    ],
    projectsEyebrow: "Proiecte",
    projectsTitle: "O selecție a lucrărilor mele reprezentative",
    projectTags: ["Proiect finalizat", "Proiect anterior"],
    projectDescriptions: [
      "Un site de comparație bazat pe date financiare care prezintă veniturile, profitabilitatea și structura de afaceri a celor două companii.",
      "Un proiect anterior de vizualizare a datelor care prezintă schimbarea populației în orașele din România între 2010 și 2019."
    ],
    projectButtons: ["Deschide", "Deschide"],
    contactEyebrow: "Contact",
    contactTitle: "Această pagină este baza homepage-ului meu GitHub",
    contactText:
      "Scopul acestei pagini este să reunească proiectele mele și să funcționeze ca o pagină personală de intrare, ușor de navigat. Pe viitor poate fi extinsă cu lucrări noi, proiecte noi și o prezentare mai detaliată.",
    footer: ["Róbert Szakács", "Homepage GitHub și portofoliu de proiecte"]
  }
};

const state = {
  width: 0,
  height: 0,
  pointer: { x: window.innerWidth / 2, y: window.innerHeight / 2, active: false },
  scrollY: 0,
  stars: []
};

const STAR_COUNT = 90;
const MAX_LINK_DISTANCE = 150;

const resizeCanvas = () => {
  state.width = window.innerWidth;
  state.height = window.innerHeight;
  const ratio = window.devicePixelRatio || 1;

  canvas.width = state.width * ratio;
  canvas.height = state.height * ratio;
  canvas.style.width = `${state.width}px`;
  canvas.style.height = `${state.height}px`;
  context.setTransform(ratio, 0, 0, ratio, 0, 0);

  state.stars = Array.from({ length: STAR_COUNT }, () => ({
    x: Math.random() * state.width,
    y: Math.random() * state.height,
    size: Math.random() * 2 + 0.7,
    speedX: (Math.random() - 0.5) * 0.18,
    speedY: (Math.random() - 0.5) * 0.18
  }));
};

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

const draw = () => {
  context.clearRect(0, 0, state.width, state.height);

  const scrollFactor = clamp(window.scrollY / Math.max(document.body.scrollHeight - window.innerHeight, 1), 0, 1);
  const pulse = (Math.sin(Date.now() * 0.001 + scrollFactor * 6) + 1) / 2;

  state.stars.forEach((star) => {
    star.x += star.speedX;
    star.y += star.speedY + scrollFactor * 0.03;

    if (star.x < -10) star.x = state.width + 10;
    if (star.x > state.width + 10) star.x = -10;
    if (star.y < -10) star.y = state.height + 10;
    if (star.y > state.height + 10) star.y = -10;
  });

  for (let i = 0; i < state.stars.length; i += 1) {
    for (let j = i + 1; j < state.stars.length; j += 1) {
      const a = state.stars[i];
      const b = state.stars[j];
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < MAX_LINK_DISTANCE) {
        const midX = (a.x + b.x) / 2;
        const midY = (a.y + b.y) / 2;
        const cursorDistance = Math.hypot(midX - state.pointer.x, midY - state.pointer.y);
        const cursorGlow = state.pointer.active ? clamp(1 - cursorDistance / 240, 0, 1) : 0.18;
        const opacity = clamp((1 - distance / MAX_LINK_DISTANCE) * 0.35 + cursorGlow * 0.45 + pulse * 0.08, 0.04, 0.72);

        context.strokeStyle = `rgba(123, 224, 255, ${opacity})`;
        context.lineWidth = 1;
        context.beginPath();
        context.moveTo(a.x, a.y);
        context.lineTo(b.x, b.y);
        context.stroke();
      }
    }
  }

  state.stars.forEach((star) => {
    const cursorDistance = Math.hypot(star.x - state.pointer.x, star.y - state.pointer.y);
    const glow = state.pointer.active ? clamp(1 - cursorDistance / 220, 0, 1) : 0.15;
    const radius = star.size + glow * 1.4 + pulse * 0.35;

    context.fillStyle = `rgba(237, 244, 255, ${0.45 + glow * 0.45})`;
    context.beginPath();
    context.arc(star.x, star.y, radius, 0, Math.PI * 2);
    context.fill();
  });

  requestAnimationFrame(draw);
};

window.addEventListener("mousemove", (event) => {
  state.pointer.x = event.clientX;
  state.pointer.y = event.clientY;
  state.pointer.active = true;
});

window.addEventListener("mouseleave", () => {
  state.pointer.active = false;
});

window.addEventListener("scroll", () => {
  state.scrollY = window.scrollY;
});

window.addEventListener("resize", resizeCanvas);

resizeCanvas();
draw();

const applyHomepageLanguage = (lang) => {
  const copy = homepageTranslations[lang] || homepageTranslations.hu;
  document.title = copy.title;

  document.querySelectorAll(".site-nav a").forEach((link, index) => {
    link.textContent = copy.nav[index];
  });

  document.querySelector(".hero-copy .eyebrow").textContent = copy.eyebrow;
  document.querySelector(".hero-copy h1").textContent = copy.heroTitle;
  document.querySelector(".hero-copy .lead").textContent = copy.heroLead;

  const heroButtons = document.querySelectorAll(".hero-actions .button");
  heroButtons[0].textContent = copy.heroButtons[0];
  heroButtons[1].textContent = copy.heroButtons[1];

  document.querySelector(".hero-card .card-label").textContent = copy.featuredLabel;
  document.querySelector(".hero-card p:not(.card-label)").textContent = copy.featuredText;
  document.querySelectorAll(".feature-list li").forEach((item, index) => {
    item.textContent = copy.features[index];
  });

  const sectionHeadings = document.querySelectorAll(".section-heading");
  sectionHeadings[0].querySelector(".eyebrow").textContent = copy.aboutEyebrow;
  sectionHeadings[0].querySelector("h2").textContent = copy.aboutTitle;
  sectionHeadings[1].querySelector(".eyebrow").textContent = copy.projectsEyebrow;
  sectionHeadings[1].querySelector("h2").textContent = copy.projectsTitle;
  sectionHeadings[2].querySelector(".eyebrow").textContent = copy.contactEyebrow;
  sectionHeadings[2].querySelector("h2").textContent = copy.contactTitle;

  document.querySelectorAll(".about-card").forEach((card, index) => {
    card.querySelector("h3").textContent = copy.aboutCards[index][0];
    card.querySelector("p").textContent = copy.aboutCards[index][1];
  });

  document.querySelectorAll(".project-card").forEach((card, index) => {
    card.querySelector(".project-tag").textContent = copy.projectTags[index];
    card.querySelector("p").textContent = copy.projectDescriptions[index];
    card.querySelector(".button").textContent = copy.projectButtons[index];
  });

  document.querySelector(".contact-text").textContent = copy.contactText;
  document.querySelectorAll(".site-footer p").forEach((paragraph, index) => {
    paragraph.textContent = copy.footer[index];
  });
};

window.addEventListener("site-language-change", (event) => {
  applyHomepageLanguage(event.detail.lang);
});

window.SiteLanguage.initializeLanguageSwitcher();
applyHomepageLanguage(window.SiteLanguage.getCurrentLanguage());
