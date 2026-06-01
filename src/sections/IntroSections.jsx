import SectionHeading from "../components/SectionHeading.jsx";
import RevealInView from "../components/RevealInView.jsx";

const insightCards = [
  {
    titleKey: "insights.card1Title",
    title: "Waste generation remains uneven",
    textKey: "insights.card1Text",
    text:
      "Municipal waste per person still varies sharply across the EU, pointing to real differences in consumption, services, and reporting systems."
  },
  {
    titleKey: "insights.card2Title",
    title: "Low landfill often coincides with stronger system capacity",
    textKey: "insights.card2Text",
    text:
      "Countries with low landfill use usually combine recycling and energy recovery instead of relying on one dominant treatment path."
  },
  {
    titleKey: "insights.card3Title",
    title: "Recycling and circularity are related but not identical",
    textKey: "insights.card3Text",
    text:
      "High recycling rates do not automatically mean high circularity. The wider economy and material flows matter too."
  },
  {
    titleKey: "insights.card4Title",
    title: "Romania and Hungary illustrate two different transition positions",
    textKey: "insights.card4Text",
    text:
      "Romania and Hungary sit in the same regional and EU policy space, but they show clearly different treatment mixes and transition paths."
  }
];

export default function IntroSections() {
  return (
    <>
      <RevealInView
        as="section"
        className="stats-strip"
        data-i18n-aria-label="language.keyFacts"
        aria-label="Key facts"
        distance={18}
      >
        <article className="stat-card">
          <p className="stat-card__label" id="stat-waste-label">
            Highest Waste Level
          </p>
          <p className="stat-card__value" id="stat-waste-value">
            --
          </p>
          <p className="stat-card__note" id="stat-waste-note">
            Loading current data.
          </p>
        </article>
        <article className="stat-card">
          <p className="stat-card__label" id="stat-recycling-label">
            Strongest Recycling Share
          </p>
          <p className="stat-card__value" id="stat-recycling-value">
            --
          </p>
          <p className="stat-card__note" id="stat-recycling-note">
            Loading current data.
          </p>
        </article>
        <article className="stat-card">
          <p className="stat-card__label" id="stat-renewable-label">
            Highest Renewable Share
          </p>
          <p className="stat-card__value" id="stat-renewable-value">
            --
          </p>
          <p className="stat-card__note" id="stat-renewable-note">
            Loading current data.
          </p>
        </article>
        <article className="stat-card">
          <p className="stat-card__label" id="stat-focus-label">
            Romania and Hungary
          </p>
          <p className="stat-card__value" id="stat-focus-value">
            --
          </p>
          <p className="stat-card__note" id="stat-focus-note">
            Loading current data.
          </p>
        </article>
      </RevealInView>

      <RevealInView as="section" className="section-card section-card--intro" id="overview">
        <SectionHeading
          kickerKey="overview.kicker"
          kickerText="Project Scope"
          titleKey="overview.title"
          titleText="How to read this project"
        />
        <div className="intro-grid">
          <article>
            <h3 data-i18n="overview.researchTitle">Research question</h3>
            <p data-i18n="overview.researchText">
              The core question is simple: how do waste generation and treatment differ across
              Europe, and do stronger recovery systems line up with stronger sustainability
              outcomes?
            </p>
          </article>
          <article>
            <h3 data-i18n="overview.storyTitle">Story structure</h3>
            <p data-i18n="overview.storyText">
              The story moves from waste pressure to treatment choices, then to the wider
              sustainability picture. That sequence helps the charts build one argument instead of
              feeling like separate visuals.
            </p>
          </article>
          <article>
            <h3 data-i18n="overview.dataTitle">Data integration</h3>
            <p data-i18n-html="overview.dataText">
              The <code>data/</code> folder reflects the workflow behind the charts. Each figure
              uses cleaned local files based on official public datasets, with source notes in{" "}
              <code>DATA_SOURCES.md</code>.
            </p>
          </article>
        </div>
      </RevealInView>

      <RevealInView as="section" className="section-card section-card--insights" id="insights">
        <SectionHeading
          kickerKey="insights.kicker"
          kickerText="Main Findings"
          titleKey="insights.title"
          titleText="What the current evidence suggests"
        />
        <div className="insight-grid">
          {insightCards.map((card) => (
            <article className="insight-card" key={card.titleKey}>
              <h3 data-i18n={card.titleKey}>{card.title}</h3>
              <p data-i18n={card.textKey}>{card.text}</p>
            </article>
          ))}
        </div>
      </RevealInView>

      <RevealInView as="section" className="section-card section-card--statement" id="purpose">
        <SectionHeading
          kickerKey="purpose.kicker"
          kickerText="Project Purpose"
          titleKey="purpose.title"
          titleText="Why this topic matters"
        />
        <div className="statement-layout">
          <div>
            <p className="section-text" data-i18n="purpose.text1">
              Waste policy sits at the intersection of environmental protection, resource
              management, and energy strategy. This project uses a focused set of indicators to
              show how those pressures play out across Europe.
            </p>
            <p className="section-text" data-i18n="purpose.text2">
              The aim is to pair a clear visual structure with transparent public data, so the
              analysis stays informative without becoming dense or overloaded.
            </p>
          </div>
          <aside className="takeaway-box">
            <p className="takeaway-box__label" data-i18n="purpose.lensLabel">
              Analytical Lens
            </p>
            <p className="takeaway-box__text" data-i18n="purpose.lensText">
              The project does not treat waste-to-energy as automatically good or bad. Instead, it
              asks how energy recovery fits into wider patterns of landfill reduction, recycling,
              and sustainability transition.
            </p>
          </aside>
        </div>
      </RevealInView>
    </>
  );
}
