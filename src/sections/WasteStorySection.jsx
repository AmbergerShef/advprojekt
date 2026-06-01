import ChartSection from "../components/ChartSection.jsx";
import RevealInView from "../components/RevealInView.jsx";
import StoryChapter from "../components/StoryChapter.jsx";

export default function WasteStorySection() {
  return (
    <>
      <StoryChapter
        id="waste-story"
        labelKey="chapters.part1Label"
        labelText="Part I"
        titleKey="chapters.part1Title"
        titleText="Waste pressure and treatment choices"
        textKey="chapters.part1Text"
        text="The first step is to see how much municipal waste countries generate, then track what happens to that waste after collection. Together, these charts show the pressure placed on national waste systems."
      />

      <ChartSection
        sectionId="chart-1-section"
        kickerKey="figures.fig1Kicker"
        kickerText="Figure 1"
        titleKey="figures.fig1Heading"
        titleText="How much municipal waste is generated per person?"
        chartId="chart-1"
        captionKey="figures.fig1Caption"
        captionText="This chart compares municipal waste generated per person across EU countries in 2023. The default view shows the full ranking, while the country filter helps you focus on smaller groups for closer comparison."
      />

      <ChartSection
        sectionId="chart-2-section"
        kickerKey="figures.fig2Kicker"
        kickerText="Figure 2"
        titleKey="figures.fig2Heading"
        titleText="Where does municipal waste go after collection?"
        chartId="chart-2"
        captionKey="figures.fig2Caption"
        captionText="This chart compares three main treatment pathways in 2023: recycling, landfill, and incineration with energy recovery. The default view keeps all available countries in the comparison, and the filters let you narrow both the country set and the treatment paths shown. Latvia is excluded because the harmonized 2023 breakdown needed for this comparison is incomplete."
      />

      <RevealInView as="section" className="section-card section-card--highlight">
        <div className="highlight-banner">
          <p className="highlight-banner__label" data-i18n="highlight.label">
            Interim Takeaway
          </p>
          <p className="highlight-banner__text" data-i18n="highlight.text">
            Countries with lower landfill use often have more developed waste systems, but the
            balance between recycling and energy recovery still varies widely.
          </p>
        </div>
      </RevealInView>
    </>
  );
}
