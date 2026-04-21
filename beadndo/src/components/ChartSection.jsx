import SectionHeading from "./SectionHeading.jsx";
import RevealInView from "./RevealInView.jsx";

export default function ChartSection({
  sectionId,
  kickerKey,
  kickerText,
  titleKey,
  titleText,
  chartId,
  captionKey,
  captionText
}) {
  return (
    <RevealInView as="section" className="section-card" id={sectionId}>
      <SectionHeading
        kickerKey={kickerKey}
        kickerText={kickerText}
        titleKey={titleKey}
        titleText={titleText}
      />
      <div id={chartId} className="chart-frame"></div>
      <p className="chart-description" data-i18n={captionKey}>
        {captionText}
      </p>
    </RevealInView>
  );
}
