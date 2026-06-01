import fs from "fs";
import path from "path";
import pptxgen from "pptxgenjs";

const ROOT = process.cwd();
const OUTPUT_DIR = path.join(ROOT, "output");
const OUTPUT_FILE = path.join(OUTPUT_DIR, "adatvizualizacio-projekt-prezentacio.pptx");

const COLORS = {
  ink: "1F2A28",
  soft: "5A6662",
  cream: "F6F3EC",
  white: "FFFFFF",
  pale: "F7FAF6",
  moss: "2F5D50",
  moss2: "355B50",
  moss3: "6F877F",
  warm: "A06F42",
  mint: "EEF2EB",
  line: "D7DED8",
  darkText: "F8FAF7",
  darkBody: "EAF1EC",
  darkBg: "23483D",
  noteBg: "EDF4F0",
  softPanel: "FBFCFA"
};

const FONT_HEAD = "Trebuchet MS";
const FONT_BODY = "Calibri";
const FONT_CODE = "Consolas";

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function parseCsv(relativePath) {
  const csv = fs.readFileSync(path.join(ROOT, relativePath), "utf8").trim();
  const [header, ...rows] = csv.split(/\r?\n/);
  const headers = header.split(",");
  return rows.map((row) => {
    const cells = row.split(",");
    return Object.fromEntries(headers.map((key, index) => [key, cells[index]]));
  });
}

function num(value) {
  return Number.parseFloat(value);
}

function format(value, digits = 0) {
  return new Intl.NumberFormat("hu-HU", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits
  }).format(value);
}

function treatmentByCountry(rows, country) {
  const selected = rows.filter((row) => row.country === country);
  return {
    recycling: num(selected.find((row) => row.treatment_type === "Recycling")?.share_percent || 0),
    landfill: num(selected.find((row) => row.treatment_type === "Landfill")?.share_percent || 0),
    energy: num(
      selected.find((row) => row.treatment_type === "Incineration with energy recovery")
        ?.share_percent || 0
    )
  };
}

function addTopRule(slide, color = COLORS.moss) {
  slide.addShape("rect", {
    x: 0.45,
    y: 0.34,
    w: 2.2,
    h: 0.08,
    line: { color, transparency: 100 },
    fill: { color }
  });
}

function addFooter(slide, page) {
  slide.addText(`Adatvizualizáció | AI-val támogatott build folyamat | ${page}/9`, {
    x: 0.6,
    y: 7.02,
    w: 5.8,
    h: 0.18,
    fontFace: FONT_BODY,
    fontSize: 10,
    color: COLORS.soft,
    margin: 0
  });
}

function addTitle(slide, kicker, title, subtitle, dark = false) {
  const titleColor = dark ? COLORS.darkText : COLORS.ink;
  const bodyColor = dark ? COLORS.darkBody : COLORS.soft;
  slide.addText(kicker.toUpperCase(), {
    x: 0.65,
    y: 0.56,
    w: 2.8,
    h: 0.24,
    fontFace: FONT_HEAD,
    fontSize: 12,
    bold: true,
    color: dark ? "CDE1D8" : COLORS.moss,
    charSpacing: 2,
    margin: 0
  });
  slide.addText(title, {
    x: 0.65,
    y: 0.9,
    w: 7.6,
    h: 1,
    fontFace: FONT_HEAD,
    fontSize: 24,
    bold: true,
    color: titleColor,
    margin: 0
  });
  slide.addText(subtitle, {
    x: 0.65,
    y: 1.85,
    w: 7.4,
    h: 0.6,
    fontFace: FONT_BODY,
    fontSize: 13.5,
    color: bodyColor,
    margin: 0
  });
}

function addTag(slide, text, x, y, fill, color) {
  const width = Math.max(1.2, text.length * 0.085);
  slide.addShape("roundRect", {
    x,
    y,
    w: width,
    h: 0.34,
    rectRadius: 0.06,
    line: { color: fill, width: 1 },
    fill: { color: fill }
  });
  slide.addText(text, {
    x: x + 0.13,
    y: y + 0.08,
    w: width - 0.26,
    h: 0.16,
    fontFace: FONT_BODY,
    fontSize: 10,
    bold: true,
    color,
    margin: 0
  });
}

function addCard(slide, x, y, w, h, title, body, fill = COLORS.white) {
  slide.addShape("roundRect", {
    x,
    y,
    w,
    h,
    rectRadius: 0.06,
    line: { color: COLORS.line, width: 1 },
    fill: { color: fill },
    shadow: { type: "outer", color: "000000", blur: 2, offset: 1, angle: 45, opacity: 0.08 }
  });
  slide.addText(title, {
    x: x + 0.18,
    y: y + 0.18,
    w: w - 0.36,
    h: 0.25,
    fontFace: FONT_HEAD,
    fontSize: 15,
    bold: true,
    color: COLORS.ink,
    margin: 0
  });
  slide.addText(body, {
    x: x + 0.18,
    y: y + 0.55,
    w: w - 0.36,
    h: h - 0.68,
    fontFace: FONT_BODY,
    fontSize: 11.5,
    color: COLORS.soft,
    margin: 0
  });
}

function addPlaceholder(slide, x, y, w, h, title, note) {
  const titleY = y + 0.58;
  const noteY = Math.min(y + 1.08, y + h - 0.42);
  const noteH = Math.max(0.22, y + h - noteY - 0.16);
  slide.addShape("roundRect", {
    x,
    y,
    w,
    h,
    rectRadius: 0.06,
    line: { color: COLORS.moss3, width: 1.5, dash: "dash" },
    fill: { color: COLORS.softPanel }
  });
  slide.addText("MANUÁLIS SCREENSHOT HELYE", {
    x: x + 0.2,
    y: y + 0.16,
    w: w - 0.4,
    h: 0.2,
    fontFace: FONT_HEAD,
    fontSize: 12,
    bold: true,
    color: COLORS.moss,
    align: "center",
    margin: 0
  });
  slide.addText(title, {
    x: x + 0.25,
    y: titleY,
    w: w - 0.5,
    h: 0.35,
    fontFace: FONT_HEAD,
    fontSize: 18,
    bold: true,
    color: COLORS.ink,
    align: "center",
    margin: 0
  });
  slide.addText(note, {
    x: x + 0.3,
    y: noteY,
    w: w - 0.6,
    h: noteH,
    fontFace: FONT_BODY,
    fontSize: 11.2,
    color: COLORS.soft,
    align: "center",
    valign: "mid",
    margin: 0
  });
}

function addMiniBar(slide, x, y, w, label, value, max, color, suffix = "") {
  slide.addText(label, {
    x,
    y,
    w: 1.25,
    h: 0.18,
    fontFace: FONT_BODY,
    fontSize: 10.5,
    color: COLORS.ink,
    margin: 0
  });
  slide.addShape("roundRect", {
    x: x + 1.28,
    y,
    w,
    h: 0.15,
    rectRadius: 0.03,
    line: { color: "E8EEEA", transparency: 100 },
    fill: { color: "E8EEEA" }
  });
  slide.addShape("roundRect", {
    x: x + 1.28,
    y,
    w: Math.max(0.08, (value / max) * w),
    h: 0.15,
    rectRadius: 0.03,
    line: { color, transparency: 100 },
    fill: { color }
  });
  slide.addText(`${format(value, suffix === "%" ? 1 : 0)}${suffix}`, {
    x: x + 1.28 + w + 0.12,
    y: y - 0.03,
    w: 0.7,
    h: 0.18,
    fontFace: FONT_BODY,
    fontSize: 10.5,
    bold: true,
    color: COLORS.ink,
    margin: 0
  });
}

function addSpeakerNotes(slide, screenshot, talkTrack) {
  slide.addNotes(`[SCREENSHOT]\n${screenshot}\n\n[MIT MONDJATOK]\n${talkTrack}`);
}

async function buildPresentation() {
  const wasteRows = parseCsv("data/municipal_waste_per_capita.csv");
  const treatmentRows = parseCsv("data/waste_treatment_comparison.csv");
  const renewableRows = parseCsv("data/renewable_energy_share.csv");
  const ghgRows = parseCsv("data/ghg_per_capita.csv");
  const energyRows = parseCsv("data/energy_recovery_over_time.csv");

  const roWaste = num(wasteRows.find((row) => row.country === "Romania").waste_kg_per_capita);
  const huWaste = num(wasteRows.find((row) => row.country === "Hungary").waste_kg_per_capita);
  const roTreat = treatmentByCountry(treatmentRows, "Romania");
  const huTreat = treatmentByCountry(treatmentRows, "Hungary");
  const roRenew = num(
    renewableRows.find((row) => row.country === "Romania" && row.year === "2024")
      .renewable_share_percent
  );
  const huRenew = num(
    renewableRows.find((row) => row.country === "Hungary" && row.year === "2024")
      .renewable_share_percent
  );
  const roGhg = num(ghgRows.find((row) => row.country === "Romania").ghg_tonnes_per_capita);
  const huGhg = num(ghgRows.find((row) => row.country === "Hungary").ghg_tonnes_per_capita);
  const roEnergy = num(
    energyRows.find((row) => row.country === "Romania" && row.year === "2023")
      .energy_recovery_kg_per_capita
  );
  const huEnergy = num(
    energyRows.find((row) => row.country === "Hungary" && row.year === "2023")
      .energy_recovery_kg_per_capita
  );
  const topWaste = wasteRows.reduce((best, row) =>
    num(row.waste_kg_per_capita) > num(best.waste_kg_per_capita) ? row : best
  );

  const pptx = new pptxgen();
  pptx.layout = "LAYOUT_WIDE";
  pptx.author = "OpenAI Codex";
  pptx.company = "OpenAI";
  pptx.subject = "Adatvizualizáció projektprezentáció";
  pptx.title = "AI-val támogatott weboldal-készítési folyamat";
  pptx.lang = "hu-HU";

  {
    const slide = pptx.addSlide();
    slide.background = { color: COLORS.darkBg };
    slide.addShape("rect", {
      x: 8.75,
      y: 0,
      w: 4.58,
      h: 7.5,
      line: { color: COLORS.moss2, transparency: 100 },
      fill: { color: COLORS.moss2 }
    });
    addTitle(
      slide,
      "Adatvizualizáció",
      "AI-val támogatott\nweboldal-készítési folyamat",
      "A fókusz itt nem az akadémiai háttér, hanem az, hogyan jutottunk el nulláról egy kész, adatvezérelt, interaktív weboldalig.",
      true
    );
    addTag(slide, "Codex mint pair programmer", 0.72, 3.02, "31584D", COLORS.darkText);
    addTag(slide, "0 kódos indulás", 2.85, 3.02, "31584D", COLORS.darkText);
    addTag(slide, "React + Vite + dashboard", 4.35, 3.02, "31584D", COLORS.darkText);
    addCard(
      slide,
      0.72,
      3.7,
      6.25,
      1.45,
      "Mi a fő állítás?",
      "Ez a projekt azért érdekes, mert brutálisan használtuk a Codexet és más AI-eszközöket, és ezzel együtt is nekünk kellett végig dönteni, iterálni és ellenőrizni.",
      "2B5347"
    );
    addCard(
      slide,
      8.55,
      0.92,
      3.95,
      1.28,
      "Miről lesz szó?",
      "Ötlet -> tervezés -> adatok -> frontend -> vizualizáció -> tanulságok"
    );
    addCard(
      slide,
      8.55,
      2.44,
      3.95,
      1.3,
      "Miért jó ez előadásnak?",
      "Mert a készítés folyamata önmagában is vizuális és technikai sztori."
    );
    addCard(
      slide,
      8.55,
      4.0,
      3.95,
      1.64,
      "Csapat",
      "Szakács Róbert\nTóth Attila"
    );
    addFooter(slide, 1);
    addSpeakerNotes(
      slide,
      "Ehhez a slide-hoz nem kell screenshot. Ha nagyon akartok, max. a kész oldal hero részének egy esztétikus kivágása mehet a jobb oldal egyik kártyája helyére.",
      "Itt röviden mondjátok el, hogy ez a prezentáció nem a téma elméletéről szól, hanem a projekt elkészítésének folyamatáról. Emeljétek ki, hogy nulla komoly kódolási háttérrel indultatok, és a Codex plusz más AI-eszközök végig konkrét szerepet kaptak a munkában."
    );
  }

  {
    const slide = pptx.addSlide();
    slide.background = { color: COLORS.cream };
    addTopRule(slide);
    addTitle(
      slide,
      "Kiindulópont",
      "Nulla kódismeret, de nem nulla ambíció",
      "A fő döntés az volt, hogy nem egy statikus beadandót akarunk, hanem egy ténylegesen működő, vizuálisan erős weboldalt."
    );
    addCard(slide, 0.72, 2.65, 3.85, 1.72, "1. Ötlet", "Adatvizualizációs tantárgyhoz valami olyat akartunk, ami nem csak informál, hanem látványos és bejárható is.");
    addCard(slide, 4.75, 2.65, 3.85, 1.72, "2. Korlát", "Nem volt mögöttünk nagy fejlesztői rutin, ezért szükség volt egy workflow-ra, ami segít gyorsan tanulni és iterálni.");
    addCard(slide, 8.78, 2.65, 3.85, 1.72, "3. Megoldás", "Az AI-t nem egyszeri trükknek kezeltük, hanem napi munkatársnak: ötleteltünk vele, kódot írtunk vele, és visszajelzést kértünk tőle.");
    slide.addShape("roundRect", {
      x: 0.72,
      y: 4.85,
      w: 11.9,
      h: 1.06,
      rectRadius: 0.06,
      line: { color: "D6E3DC", width: 1 },
      fill: { color: COLORS.noteBg }
    });
    slide.addText("0 kódismeret -> használható AI workflow -> működő weboldal", {
      x: 1.0,
      y: 5.15,
      w: 11.35,
      h: 0.3,
      fontFace: FONT_HEAD,
      fontSize: 19,
      bold: true,
      color: COLORS.moss,
      align: "center",
      margin: 0
    });
    addFooter(slide, 2);
    addSpeakerNotes(
      slide,
      "Ehhez sem kötelező screenshot. Ha akartok valamit, mehet egy nagyon egyszerű kép a kezdeti skiccről, jegyzetlapról vagy a repo korai állapotáról.",
      "Itt mondjátok el, hogy az elején még nem az volt a kérdés, hogyan optimalizálunk egy kódbázist, hanem hogy egyáltalán hogyan lehet összerakni egy ilyen projektet. A nagy váltás az volt, hogy az AI miatt a technikai belépési küszöb sokkal alacsonyabb lett."
    );
  }

  {
    const slide = pptx.addSlide();
    slide.background = { color: COLORS.pale };
    addTopRule(slide, COLORS.warm);
    addTitle(
      slide,
      "AI mint fejlesztőtárs",
      "A Codex végig ott volt a folyamatban",
      "Nem csak egyszer segített, hanem a projekt szinte minden fontos fázisában szerepet kapott."
    );
    addCard(slide, 0.72, 2.6, 2.9, 1.95, "Ötletelés", "Milyen szerkezet működjön? Milyen stílus? Milyen részekből álljon az oldal?");
    addCard(slide, 3.83, 2.6, 2.9, 1.95, "Kódgenerálás", "Komponensek, layoutok, dashboard UI, stílusok, adatszerkezetek.");
    addCard(slide, 6.94, 2.6, 2.9, 1.95, "Debug", "Hibák, széteső elrendezések, nem működő logika, rossz fájlszerkezet.");
    addCard(slide, 10.05, 2.6, 2.55, 1.95, "Tanulás", "Közben értettük meg, hogyan működik a React, a moduláris felépítés és a vizuális hierarchia.");
    addPlaceholder(
      slide,
      0.9,
      5.05,
      4.1,
      1.05,
      "Codex chat / prompt példa",
      "Ide jó lehet egy olyan screenshot, amin látszik, hogy ténylegesen hogyan kértetek segítséget: prompt, kódrészlet, javítási kérés vagy iteráció."
    );
    slide.addShape("roundRect", {
      x: 5.3,
      y: 5.05,
      w: 7.3,
      h: 1.05,
      rectRadius: 0.06,
      line: { color: "E1D7C9", width: 1 },
      fill: { color: "F2E7DA" }
    });
    slide.addText("A fontos pont: az AI gyorsított, de a projekt attól lett jó, hogy minden választás után visszanéztük, javítottuk és újrapromptoltuk.", {
      x: 5.6,
      y: 5.32,
      w: 6.7,
      h: 0.42,
      fontFace: FONT_BODY,
      fontSize: 12.5,
      color: COLORS.ink,
      align: "center",
      margin: 0
    });
    addFooter(slide, 3);
    addSpeakerNotes(
      slide,
      "Ehhez a slide-hoz nagyon ajánlott egy Codex vagy más AI beszélgetés screenshotja. Olyan részlet legyen, ahol látszik a prompt és hogy kaptatok tényleges fejlesztési segítséget: például komponensírás, hibajavítás vagy refaktor.",
      "Itt ne általánosságban beszéljetek az AI-ról, hanem mondjátok ki, hogy konkrétan mire használtátok. Mondhatjátok például, hogy a Codex volt a pair programmer, aki segített felépíteni a struktúrát, de a végső döntések és ellenőrzések nálatok maradtak."
    );
  }

  {
    const slide = pptx.addSlide();
    slide.background = { color: COLORS.cream };
    addTopRule(slide);
    addTitle(
      slide,
      "Tervezési folyamat",
      "A weboldal nem egyszerre állt össze, hanem blokkonként",
      "Először a történeti ívet terveztük meg, és csak utána raktuk rá a konkrét adatokat, a vizuális elemeket és az interaktivitást."
    );
    const steps = [
      ["01", "Framing", "Mi legyen a téma és mi legyen az oldal alaphangulata?"],
      ["02", "Szekciók", "Hero, intro, chartok, dashboard, források, lezárás."],
      ["03", "Tartalom", "Melyik rész milyen kérdésre válaszoljon?"],
      ["04", "UI", "Kártyák, tipográfia, spacing, navigáció, responsive viselkedés."],
      ["05", "Finomhangolás", "Olvashatóság, ritmus, tördelés, vizuális egyensúly."]
    ];
    steps.forEach(([indexText, title, body], idx) => {
      const y = 2.55 + idx * 0.73;
      slide.addShape("ellipse", {
        x: 0.8,
        y,
        w: 0.42,
        h: 0.42,
        line: { color: COLORS.moss, width: 1 },
        fill: { color: COLORS.moss }
      });
      slide.addText(indexText, {
        x: 0.88,
        y: y + 0.12,
        w: 0.25,
        h: 0.1,
        fontFace: FONT_BODY,
        fontSize: 9,
        bold: true,
        color: COLORS.darkText,
        align: "center",
        margin: 0
      });
      slide.addText(title, {
        x: 1.4,
        y: y + 0.01,
        w: 1.5,
        h: 0.18,
        fontFace: FONT_HEAD,
        fontSize: 13.5,
        bold: true,
        color: COLORS.ink,
        margin: 0
      });
      slide.addText(body, {
        x: 3.0,
        y: y + 0.01,
        w: 3.6,
        h: 0.2,
        fontFace: FONT_BODY,
        fontSize: 11.2,
        color: COLORS.soft,
        margin: 0
      });
    });
    addPlaceholder(
      slide,
      7.18,
      2.48,
      5.35,
      3.6,
      "A weboldal fő nézete",
      "Ide jöhet a site egy olyan screenshotja, amin látszik a hero rész, a színvilág, és hogy ez tényleg egy megtervezett felület, nem csak egymás alá rakott chartok."
    );
    addFooter(slide, 4);
    addSpeakerNotes(
      slide,
      "Ide a legjobb egy teljes oldal vagy hero screenshot. Olyat fotózzatok, amin a landing rész jól néz ki, és első ránézésre látszik a webes minőség. Ha csak egy képet tesztek az egész deckbe a site-ról, ez legyen az egyik.",
      "Itt azt mondjátok el, hogy először a történetet terveztétek meg, nem a kódot. Ez azért fontos, mert az adatvizualizációs projekt ereje attól jött, hogy tudtuk, milyen sorrendben akarjuk felépíteni a befogadói élményt."
    );
  }

  {
    const slide = pptx.addSlide();
    slide.background = { color: COLORS.pale };
    addTopRule(slide, COLORS.warm);
    addTitle(
      slide,
      "Adatpipeline",
      "A nyers adatból használható vizualizációs alap lett",
      "A weboldal mögött külön adatállományok vannak, nem kézzel beírt számok."
    );
    addCard(slide, 0.72, 2.48, 3.78, 1.96, "Források", "Eurostat és World Bank. Több indikátor, több év, EU-s összehasonlíthatóság, fókuszban Románia és Magyarország.");
    addCard(slide, 4.78, 2.48, 3.78, 1.96, "Tisztítás", "Évek egységesítése, országlisták összehangolása, hiányzó adatok kezelése, egyszerűbb formátumok.");
    addCard(slide, 8.84, 2.48, 3.78, 1.96, "Kimenet", "Lokális CSV-k és adatfájlok, amelyekre a chartok és a dashboard közvetlenül épülnek.");
    slide.addShape("roundRect", {
      x: 0.75,
      y: 4.88,
      w: 5.1,
      h: 1.18,
      rectRadius: 0.05,
      line: { color: COLORS.line, width: 1 },
      fill: { color: COLORS.white }
    });
    slide.addText(
      "data/municipal_waste_per_capita.csv\n" +
        "data/waste_treatment_comparison.csv\n" +
        "data/renewable_energy_share.csv\n" +
        "data/ghg_per_capita.csv\n" +
        "data/energy_recovery_over_time.csv",
      {
        x: 1.0,
        y: 5.12,
        w: 4.7,
        h: 0.8,
        fontFace: FONT_CODE,
        fontSize: 10.8,
        color: COLORS.moss,
        margin: 0
      }
    );
    addCard(slide, 6.3, 4.88, 2.05, 1.18, "Max hulladék", `${topWaste.country}\n${format(num(topWaste.waste_kg_per_capita))} kg/fő`);
    addCard(slide, 8.58, 4.88, 1.95, 1.18, "RO 2023", `landfill ${format(roTreat.landfill, 1)}%\nrecycling ${format(roTreat.recycling, 1)}%`);
    addCard(slide, 10.76, 4.88, 1.95, 1.18, "HU 2023", `landfill ${format(huTreat.landfill, 1)}%\nrecycling ${format(huTreat.recycling, 1)}%`);
    addFooter(slide, 5);
    addSpeakerNotes(
      slide,
      "Ha akartok ide screenshotot, akkor vagy a DATA_SOURCES.md-ből egy részletet, vagy a data mappa tartalmát fotózzátok le. Nem kötelező, mert a slide önmagában is működik.",
      "Itt azt hangsúlyozzátok, hogy a projekt nem csak kinézetre weboldal, hanem mögötte tényleges adatmunka van. Mondjátok el, hogy külön forrásokból dolgoztatok, és az AI abban is segített, hogy hogyan szervezzétek az adatokat használható struktúrába."
    );
  }

  {
    const slide = pptx.addSlide();
    slide.background = { color: COLORS.cream };
    addTopRule(slide);
    addTitle(
      slide,
      "Frontend megvalósítás",
      "A technikai oldal modulárisabb lett, ahogy a projekt nőtt",
      "A végeredmény már külön szekciókból, komponensekből és feature-ökből álló site lett."
    );
    addTag(slide, "React", 0.72, 2.32, COLORS.mint, COLORS.ink);
    addTag(slide, "Vite", 1.83, 2.32, COLORS.mint, COLORS.ink);
    addTag(slide, "Framer Motion", 2.7, 2.32, COLORS.mint, COLORS.ink);
    addTag(slide, "JS + CSS", 4.18, 2.32, COLORS.mint, COLORS.ink);
    slide.addShape("roundRect", {
      x: 0.72,
      y: 2.8,
      w: 5.8,
      h: 3.2,
      rectRadius: 0.05,
      line: { color: COLORS.line, width: 1 },
      fill: { color: COLORS.white }
    });
    slide.addText(
      "src/\n" +
        "  App.jsx\n" +
        "  sections/\n" +
        "    HeroSection.jsx\n" +
        "    IntroSections.jsx\n" +
        "    DashboardSection.jsx\n" +
        "  components/\n" +
        "    FloatingNav.jsx\n" +
        "    ChartSection.jsx\n" +
        "modules/features/dashboard.js",
      {
        x: 1.0,
        y: 3.08,
        w: 5.1,
        h: 2.55,
        fontFace: FONT_CODE,
        fontSize: 11.2,
        color: COLORS.ink,
        margin: 0
      }
    );
    addCard(slide, 6.85, 2.84, 2.5, 1.28, "AI mit adott?", "Szerkezet, komponensek, UI-javaslatok, hibajavítás, refaktor.");
    addCard(slide, 9.58, 2.84, 2.5, 1.28, "Mi maradt nálunk?", "Döntés, válogatás, végső forma, és hogy mi maradjon bent az oldalban.");
    addPlaceholder(
      slide,
      6.82,
      4.45,
      5.38,
      1.58,
      "Kódrészlet vagy fájlszerkezet screenshot",
      "Ide ideális egy screenshot a src mappáról, a DashboardSection komponensről, vagy egy olyan részletről, amin tényleg látszik, hogy weboldalt építettetek."
    );
    addFooter(slide, 6);
    addSpeakerNotes(
      slide,
      "Erre a slide-ra nagyon jó a VS Code Explorer nézet vagy egy jellegzetes komponens screenshotja. Olyat válasszatok, amin látszik a projekt szerkezete, és hogy több fájl, több réteg, több responsibility van.",
      "Itt mondjátok el, hogy a projekt idővel kinőtte az egyszerű egyfájlos megközelítést. Ezen a ponton már külön komponensek, szekciók és dashboard logika voltak, és ebben a Codex sokat segített, de a végső elrendezést nektek kellett értelmesen összerakni."
    );
  }

  {
    const slide = pptx.addSlide();
    slide.background = { color: COLORS.pale };
    addTopRule(slide, COLORS.warm);
    addTitle(
      slide,
      "Vizualizáció és interaktivitás",
      "A site egyik legerősebb része az összehasonlíthatóság lett",
      "Nem csak statikus grafikonok készültek, hanem olyan felület is, ahol a felhasználó maga választhat nézeteket."
    );
    addCard(slide, 0.75, 2.48, 2.65, 3.08, "Románia", "Alacsonyabb waste/fő\nNagyon magas landfill\nAlacsony recovery\nErősebb renewable arány");
    addCard(slide, 3.55, 2.48, 2.65, 3.08, "Magyarország", "Magasabb waste/fő\nAlacsonyabb landfill mint RO\nNagyobb recovery szint\nGyengébb renewable arány");
    slide.addText("Gyors, valódi adatból rajzolt összevetés", {
      x: 6.55,
      y: 2.52,
      w: 4.6,
      h: 0.18,
      fontFace: FONT_HEAD,
      fontSize: 15,
      bold: true,
      color: COLORS.ink,
      margin: 0
    });
    addMiniBar(slide, 6.55, 2.95, 1.55, "RO waste", roWaste, 800, COLORS.moss);
    addMiniBar(slide, 6.55, 3.28, 1.55, "HU waste", huWaste, 800, COLORS.warm);
    addMiniBar(slide, 6.55, 3.7, 1.55, "RO landfill", roTreat.landfill, 100, COLORS.moss3, "%");
    addMiniBar(slide, 6.55, 4.03, 1.55, "HU landfill", huTreat.landfill, 100, COLORS.warm, "%");
    addMiniBar(slide, 6.55, 4.45, 1.55, "RO recovery", roEnergy, 400, COLORS.moss);
    addMiniBar(slide, 6.55, 4.78, 1.55, "HU recovery", huEnergy, 400, COLORS.warm);
    addMiniBar(slide, 9.3, 2.95, 1.55, "RO renewable", roRenew, 55, COLORS.moss, "%");
    addMiniBar(slide, 9.3, 3.28, 1.55, "HU renewable", huRenew, 55, COLORS.warm, "%");
    addMiniBar(slide, 9.3, 3.7, 1.55, "RO GHG", roGhg, 12, COLORS.moss);
    addMiniBar(slide, 9.3, 4.03, 1.55, "HU GHG", huGhg, 12, COLORS.warm);
    addPlaceholder(
      slide,
      6.48,
      5.08,
      5.78,
      1.08,
      "Dashboard screenshot",
      "Ide jöhet a dashboard egy olyan nézetben, ahol látszik a szűrőpanel, a chart és a tábla. Ez a site egyik legjobb bizonyítéka arra, hogy a projekt nem csak statikus design."
    );
    addFooter(slide, 7);
    addSpeakerNotes(
      slide,
      "Erre a slide-ra mindenképp csináljatok dashboard screenshotot. Olyan állapot legyen, ahol látszik legalább a filter panel, egy chart és a táblázat. Ha lehet, Románia és Magyarország legyen kiválasztva, mert akkor passzol a slide-on lévő összehasonlításhoz.",
      "Itt azt mondjátok el, hogy a cél nem csak az volt, hogy szépek legyenek a grafikonok, hanem hogy a felhasználó tudjon játszani az adatokkal. Ezért fontos a dashboard: az már valódi interaktivitás, nem csak egy statikus bemutatófelület."
    );
  }

  {
    const slide = pptx.addSlide();
    slide.background = { color: COLORS.cream };
    addTopRule(slide);
    addTitle(
      slide,
      "Kihívások és tanulságok",
      "Az AI nem váltotta ki a munkát, csak sokkal gyorsabbá tette",
      "A projekt attól lett működőképes, hogy végig iteráltunk, javítottunk és visszaellenőriztünk."
    );
    addCard(slide, 0.72, 2.52, 2.9, 1.5, "Adatkompatibilitás", "Nem minden mutató ugyanabban az évben és ugyanazzal az országlistával volt elérhető.");
    addCard(slide, 3.83, 2.52, 2.9, 1.5, "Vizuális egyensúly", "Könnyű túlzsúfolni egy adatvizualizációs oldalt, ezért kellett szelekció és ritmus.");
    addCard(slide, 6.94, 2.52, 2.9, 1.5, "AI output minőség", "A generált kód ritkán volt kész elsőre, sokszor kellett finomítani és visszakérdezni.");
    addCard(slide, 10.05, 2.52, 2.55, 1.5, "Fókusz", "Végig tartani kellett, hogy ez adatvizualizációs projekt maradjon, ne csak technikai játék.");
    slide.addShape("roundRect", {
      x: 0.72,
      y: 4.48,
      w: 11.9,
      h: 1.22,
      rectRadius: 0.06,
      line: { color: COLORS.line, width: 1 },
      fill: { color: COLORS.white }
    });
    slide.addText("Legfontosabb tanulság", {
      x: 0.98,
      y: 4.75,
      w: 2.4,
      h: 0.18,
      fontFace: FONT_HEAD,
      fontSize: 15,
      bold: true,
      color: COLORS.moss,
      margin: 0
    });
    slide.addText(
      "Nulla kódismerettel is lehet működő digitális projektet építeni, ha az AI-t jól használjuk, de a minőséghez továbbra is emberi döntés és ellenőrzés kell.",
      {
        x: 3.48,
        y: 4.75,
        w: 8.45,
        h: 0.4,
        fontFace: FONT_BODY,
        fontSize: 12.8,
        color: COLORS.ink,
        margin: 0
      }
    );
    addFooter(slide, 8);
    addSpeakerNotes(
      slide,
      "Ehhez nem szükséges screenshot. Ha akartok mégis valamit, akkor mehet egy bugos állapot vagy egy félresikerült korai verzió screenshotja humorosan, de ez teljesen opcionális.",
      "Itt őszintén mondjátok el, hogy az AI nem varázspálca volt. Sokszor kellett újrakérni, javítani, törölni és újraírni dolgokat. Ettől viszont a projekt pont hitelesebb lesz, mert látszik, hogy tényleg dolgoztatok vele."
    );
  }

  {
    const slide = pptx.addSlide();
    slide.background = { color: COLORS.darkBg };
    addTitle(
      slide,
      "Végeredmény",
      "Nem csak egy weboldal készült el,\nhanem egy használható munkamódszer is",
      "A projekt azt bizonyítja, hogy AI-val támogatva nagyon gyorsan lehet összetett digitális munkát építeni, még tanulási fázisból indulva is.",
      true
    );
    addTag(slide, "Működő site", 0.72, 3.0, "31584D", COLORS.darkText);
    addTag(slide, "Valós adatok", 1.95, 3.0, "31584D", COLORS.darkText);
    addTag(slide, "Interaktív dashboard", 3.18, 3.0, "31584D", COLORS.darkText);
    addTag(slide, "AI workflow", 5.0, 3.0, "31584D", COLORS.darkText);
    addCard(
      slide,
      0.72,
      3.75,
      6.1,
      1.5,
      "Mit viszünk ebből tovább?",
      "Azt, hogy a jövőbeli projektekhez már van egy működő mintánk arra, hogyan lehet ötletből rövid idő alatt vizuális és technikai eredményt csinálni."
    );
    addPlaceholder(
      slide,
      7.42,
      1.0,
      5.05,
      4.45,
      "Csapatkép vagy kész site highlight",
      "Ide a végére jó lehet egy közös fotó, vagy egy nagyon erős screenshot a kész weboldalról. Ez a lezáró vizuál, szóval itt tényleg a legjobb képet használjátok."
    );
    slide.addText("Szakács Róbert • Tóth Attila", {
      x: 0.78,
      y: 6.46,
      w: 4.1,
      h: 0.2,
      fontFace: FONT_BODY,
      fontSize: 12.5,
      color: "D5E1DA",
      margin: 0
    });
    addFooter(slide, 9);
    addSpeakerNotes(
      slide,
      "Ide vagy közös csapatképet tegyetek, vagy a kész oldal legerősebb screenshotját. Ez a záró vizuál, itt érdemes a legszebb képet használni.",
      "A lezárásnál mondjátok ki, hogy a projekt számotokra nem csak egy beadandó lett, hanem egy bizonyíték arra, hogy AI-val gyorsan lehet webes projektet építeni. A hangsúly a folyamaton, a tanuláson és a működő eredményen legyen."
    );
  }

  ensureDir(OUTPUT_DIR);
  await pptx.writeFile({ fileName: OUTPUT_FILE });
  console.log(`Presentation written to ${OUTPUT_FILE}`);
}

buildPresentation().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
