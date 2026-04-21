import RevealInView from "../components/RevealInView.jsx";

export default function FooterSection() {
  return (
    <RevealInView as="footer" className="site-footer" distance={20} duration={0.65}>
      <section className="footer-note-card">
        <p className="footer-note-card__kicker" data-i18n="footer.noteKicker">
          Thesis Project
        </p>
        <h2 className="footer-note-card__title" data-i18n="footer.noteTitle">
          Waste-to-Energy and Sustainability in Europe
        </h2>
        <p className="footer-note-card__text" data-i18n="footer.noteText">
          A thesis project on comparative waste systems in Europe, with a focus on landfill,
          recycling, energy recovery, and their relationship to broader sustainability trends.
        </p>
      </section>
      <div className="footer-grid">
        <p data-i18n="footer.text1">
          The project brings together public data, comparative analysis, and visual storytelling
          to examine how waste systems differ across EU countries.
        </p>
        <p data-i18n="footer.text2">
          Romania and Hungary serve as anchor cases within a wider EU comparison of treatment
          choices, circularity, renewable energy, and emissions context.
        </p>
      </div>
    </RevealInView>
  );
}
