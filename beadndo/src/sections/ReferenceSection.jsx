import SectionHeading from "../components/SectionHeading.jsx";
import RevealInView from "../components/RevealInView.jsx";

export function SourcesSection() {
  return (
    <RevealInView as="section" className="section-card section-card--sources" id="sources">
      <SectionHeading
        kickerKey="sources.kicker"
        kickerText="Data Sources"
        titleKey="sources.title"
        titleText="Official datasets used in this portfolio"
      />
      <div className="sources-grid">
        <article className="source-card">
          <h3 data-i18n="sources.eurostatTitle">Eurostat</h3>
          <p data-i18n="sources.eurostatText">
            The main waste, treatment, renewable energy, and circularity indicators come from
            Eurostat and are used here in cleaned local form.
          </p>
          <a
            href="https://ec.europa.eu/eurostat"
            target="_blank"
            rel="noreferrer"
            data-i18n="sources.visitSource"
          >
            Visit source
          </a>
        </article>
        <article className="source-card">
          <h3 data-i18n="sources.worldBankTitle">World Bank</h3>
          <p data-i18n="sources.worldBankText">
            The greenhouse gas context indicator comes from the World Bank API and adds a recent
            cross-country environmental comparison.
          </p>
          <a
            href="https://data.worldbank.org/"
            target="_blank"
            rel="noreferrer"
            data-i18n="sources.visitSource"
          >
            Visit source
          </a>
        </article>
        <article className="source-card">
          <h3 data-i18n="sources.notesTitle">Project data notes</h3>
          <p data-i18n-html="sources.notesText">
            File-level source mapping, indicator notes, and transformation details are documented
            in <code>DATA_SOURCES.md</code> for transparency and reproducibility.
          </p>
          <a href="DATA_SOURCES.md" data-i18n="sources.openNote">
            Open data note
          </a>
        </article>
      </div>
    </RevealInView>
  );
}

export default function ReferenceSection() {
  return (
    <>
      <RevealInView as="section" className="section-card section-card--methods" id="methods">
        <SectionHeading
          kickerKey="methods.kicker"
          kickerText="Methods"
          titleKey="methods.title"
          titleText="Data scope, sources, and limitations"
        />
        <div className="methods-grid">
          <article>
            <h3 data-i18n="methods.sourcesTitle">Data sources</h3>
            <p data-i18n-html="methods.sourcesText">
              The project uses cleaned extracts from Eurostat and the World Bank. Where possible,
              it keeps full EU coverage instead of relying on a small sample. Source links and
              file mappings are documented in <code>DATA_SOURCES.md</code>.
            </p>
          </article>
          <article>
            <h3 data-i18n="methods.comparabilityTitle">Comparability</h3>
            <p data-i18n="methods.comparabilityText">
              The figures are built for cross-country comparison, but reporting practices, system
              boundaries, and national infrastructure still affect interpretation. A clear example
              is Figure 2, where Latvia is excluded because the harmonized 2023 treatment
              breakdown is incomplete.
            </p>
          </article>
          <article>
            <h3 data-i18n="methods.cautionTitle">Interpretive caution</h3>
            <p data-i18n="methods.cautionText">
              These charts are descriptive, not causal. They are meant to highlight patterns,
              contrasts, and useful questions rather than deliver final policy rankings.
            </p>
          </article>
        </div>
      </RevealInView>

      <RevealInView as="section" className="section-card section-card--contributors" id="contributors">
        <SectionHeading
          kickerKey="contributors.kicker"
          kickerText="Project Contributors"
          titleKey="contributors.title"
          titleText="About the collaborators behind the project"
        />
        <div className="contributors-layout">
          <div className="contributors-gallery">
            <figure className="contributors-figure">
              <img
                src="assets/Robi.png"
                alt="Szakács Róbert"
                className="contributors-image"
              />
              <figcaption className="contributors-name">
                <em>Szakács Róbert</em>
              </figcaption>
            </figure>
            <figure className="contributors-figure">
              <img
                src="assets/Totti.png"
                alt="Tóth Attila"
                className="contributors-image"
              />
              <figcaption className="contributors-name">
                <em>Tóth Attila</em>
              </figcaption>
            </figure>
          </div>
          <div className="contributors-copy">
            <p className="section-text" data-i18n="contributors.text1">
              This website was developed as a collaborative university project focused on waste
              systems, energy recovery, and sustainability in Europe. It combines public data
              analysis with visual storytelling in a format that stays readable and transparent.
            </p>
            <p className="section-text" data-i18n="contributors.text2">
              The collaborator photo is included as part of the project itself, not as decoration.
              It gives the work a clearer sense of authorship while keeping the tone professional.
            </p>
          </div>
        </div>
      </RevealInView>
    </>
  );
}
