import ChartSection from "../components/ChartSection.jsx";
import StoryChapter from "../components/StoryChapter.jsx";

export default function ClimateSection() {
  return (
    <>
      <StoryChapter
        id="climate-story"
        labelKey="chapters.part3Label"
        labelText="Part III"
        titleKey="chapters.part3Title"
        titleText="Climate context and energy recovery"
        textKey="chapters.part3Text"
        text="The final section adds emissions context, then returns to waste-to-energy through an interactive comparison of energy recovery trends."
      />

      <ChartSection
        sectionId="chart-5-section"
        kickerKey="figures.fig5Kicker"
        kickerText="Figure 5"
        titleKey="figures.fig5Heading"
        titleText="How different is the climate context across countries?"
        chartId="chart-5"
        captionKey="figures.fig5Caption"
        captionText="This chart adds environmental context through per-capita greenhouse gas emissions. It does not measure waste systems alone, but it helps place national waste and energy patterns inside a broader climate picture."
      />

      <ChartSection
        sectionId="chart-6-section"
        kickerKey="figures.fig6Kicker"
        kickerText="Figure 6"
        titleKey="figures.fig6Heading"
        titleText="How has energy recovery from waste changed over time?"
        chartId="chart-6"
        captionKey="figures.fig6Caption"
        captionText="This interactive chart tracks municipal waste sent to energy recovery over time. It works as a practical waste-to-energy proxy based on harmonized Eurostat data and shows how differently countries use this pathway."
      />
    </>
  );
}
