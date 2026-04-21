import SectionHeading from "../components/SectionHeading.jsx";
import RevealInView from "../components/RevealInView.jsx";

export default function ConclusionSection() {
  return (
    <RevealInView as="section" className="section-card section-card--conclusion" id="conclusion">
      <SectionHeading
        kickerKey="conclusion.kicker"
        kickerText="Conclusion"
        titleKey="conclusion.title"
        titleText="What this portfolio ultimately shows"
      />
      <p className="section-text" data-i18n="conclusion.text1">
        Taken together, the charts suggest that municipal waste management in Europe is best
        understood as part of a broader sustainability system, not as an isolated technical
        sector. Landfill reduction, recycling, energy recovery, renewable transition, and climate
        context do not move in perfect lockstep, but they are clearly connected.
      </p>
      <p className="section-text" data-i18n="conclusion.text2">
        That makes waste-to-energy a useful but incomplete lens. It becomes most meaningful when
        read alongside wider treatment choices and broader transition indicators. Romania and
        Hungary make that contrast especially clear: they share the same EU policy space, yet
        still show notably different treatment mixes and sustainability positions.
      </p>
    </RevealInView>
  );
}
