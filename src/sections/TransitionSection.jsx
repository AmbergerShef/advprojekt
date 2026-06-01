import ChartSection from "../components/ChartSection.jsx";
import RevealInView from "../components/RevealInView.jsx";
import SectionHeading from "../components/SectionHeading.jsx";
import StoryChapter from "../components/StoryChapter.jsx";

const spotlightCards = [
  {
    titleKey: "spotlight.romaniaTitle",
    title: "Romania",
    statKey: "spotlight.romaniaStat",
    stat: "75.7% landfill share",
    textKey: "spotlight.romaniaText",
    text:
      "Romania combines relatively low waste generation with very high landfill use, showing that lower waste volumes do not automatically mean a more circular system."
  },
  {
    titleKey: "spotlight.hungaryTitle",
    title: "Hungary",
    statKey: "spotlight.hungaryStat",
    stat: "33.3% recycling share",
    textKey: "spotlight.hungaryText",
    text:
      "Hungary still relies heavily on landfill, but it performs better than Romania on recycling, circularity, and energy recovery, which makes it a useful regional comparison point."
  },
  {
    titleKey: "spotlight.germanyTitle",
    title: "Germany",
    statKey: "spotlight.germanyStat",
    stat: "68.5% recycling share",
    textKey: "spotlight.germanyText",
    text:
      "Germany remains one of the strongest recyclers in the dataset and shows how landfill can be reduced through a more diversified treatment mix."
  },
  {
    titleKey: "spotlight.swedenTitle",
    title: "Sweden",
    statKey: "spotlight.swedenStat",
    stat: "62.8% renewable share",
    textKey: "spotlight.swedenText",
    text:
      "Sweden stands out less for waste generation than for how strongly energy transition and energy recovery are built into a broader low-landfill model."
  }
];

export default function TransitionSection() {
  return (
    <>
      <StoryChapter
        id="transition-story"
        labelKey="chapters.part2Label"
        labelText="Part II"
        titleKey="chapters.part2Title"
        titleText="Circularity and the wider transition"
        textKey="chapters.part2Text"
        text="The next two charts look beyond waste operations alone. They ask whether countries that manage waste well also appear stronger on renewable energy and circular-economy indicators."
      />

      <ChartSection
        sectionId="chart-3-section"
        kickerKey="figures.fig3Kicker"
        kickerText="Figure 3"
        titleKey="figures.fig3Heading"
        titleText="How quickly is renewable energy expanding?"
        chartId="chart-3"
        captionKey="figures.fig3Caption"
        captionText="This chart places waste-to-energy in a wider energy-transition context. It starts with all available EU countries, and the filters help reduce visual clutter when a smaller comparison is more useful. The optional EU average benchmark adds broader context."
      />

      <ChartSection
        sectionId="chart-4-section"
        kickerKey="figures.fig4Kicker"
        kickerText="Figure 4"
        titleKey="figures.fig4Heading"
        titleText="Do higher recycling rates imply stronger circularity?"
        chartId="chart-4"
        captionKey="figures.fig4Caption"
        captionText="This chart compares the municipal recycling rate with the circular material use rate in the latest common year available. It helps show whether strong recycling results are matched by broader progress toward a circular economy."
      />

      <RevealInView as="section" className="section-card section-card--spotlight" id="spotlight">
        <SectionHeading
          kickerKey="spotlight.kicker"
          kickerText="Country Spotlight"
          titleKey="spotlight.title"
          titleText="Four contrasting national pathways"
        />
        <div className="spotlight-grid">
          {spotlightCards.map((card) => (
            <article className="spotlight-card" key={card.titleKey}>
              <h3 data-i18n={card.titleKey}>{card.title}</h3>
              <p className="spotlight-card__stat" data-i18n={card.statKey}>
                {card.stat}
              </p>
              <p data-i18n={card.textKey}>{card.text}</p>
            </article>
          ))}
        </div>
      </RevealInView>

      <RevealInView as="section" className="section-card section-card--explorer" id="profile-lab">
        <SectionHeading
          kickerKey="explorer.kicker"
          kickerText="Comparative Explorer"
          titleKey="explorer.title"
          titleText="Build a country profile across indicators"
        />
        <p className="section-text" data-i18n="explorer.intro">
          The charts above show separate parts of the story. This panel brings them together so
          you can inspect one country at a time and compare waste generation, treatment
          structure, renewable energy, circularity, and emissions context in one place. Romania
          is selected by default as one of the project’s main focal cases.
        </p>
        <div className="explorer-toolbar">
          <label
            className="explorer-label"
            htmlFor="country-profile-select"
            data-i18n="explorer.selectLabel"
          >
            Select country
          </label>
          <select id="country-profile-select" className="explorer-select"></select>
        </div>
        <div className="explorer-grid">
          <div className="profile-panel">
            <div className="profile-panel__header">
              <p className="profile-panel__kicker" data-i18n="explorer.profileKicker">
                Profile Summary
              </p>
              <h3 id="profile-country-name">Romania</h3>
            </div>
            <div className="profile-metrics" id="profile-metrics"></div>
            <div className="profile-note" id="profile-note"></div>
          </div>
          <div className="ranking-panel">
            <div className="profile-panel__header">
              <p className="profile-panel__kicker" data-i18n="explorer.tableKicker">
                Comparative Table
              </p>
              <h3 id="ranking-table-title" data-i18n="explorer.tableTitle">
                Selected indicators side by side
              </h3>
            </div>
            <div className="ranking-table-wrap">
              <table className="ranking-table">
                <thead>
                  <tr>
                    <th data-i18n="explorer.tableCountry">Country</th>
                    <th data-i18n="explorer.tableWaste">Waste</th>
                    <th data-i18n="explorer.tableRecycling">Recycling</th>
                    <th data-i18n="explorer.tableLandfill">Landfill</th>
                    <th data-i18n="explorer.tableGhg">GHG</th>
                  </tr>
                </thead>
                <tbody id="ranking-table-body"></tbody>
              </table>
            </div>
          </div>
        </div>
      </RevealInView>
    </>
  );
}
