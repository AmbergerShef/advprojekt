import LanguageSwitch from "../components/LanguageSwitch.jsx";
import RevealInView from "../components/RevealInView.jsx";

export default function HeroSection() {
  return (
    <header className="hero">
      <div className="hero__content">
        <LanguageSwitch />
        <RevealInView as="div" className="hero__text" distance={20} duration={0.7}>
          <p className="eyebrow" data-i18n="hero.eyebrow">
            Thesis Project
          </p>
          <h1 data-i18n="hero.title">Waste-to-Energy and Sustainability in Europe</h1>
          <p className="hero__subtitle" data-i18n="hero.subtitle">
            A visual study of how European countries handle municipal waste, where that waste
            goes, and how those choices connect to energy and sustainability trends.
          </p>
          <p className="hero__intro" data-i18n="hero.intro">
            Waste management is more than a technical service. It reflects how countries consume,
            how infrastructure is built, and how public policy balances recycling, landfill
            reduction, energy recovery, and climate goals. This project uses public European data
            to compare those patterns across the EU, with special attention to Romania and
            Hungary.
          </p>
          <p className="hero__note" data-i18n="hero.note">
            The analysis is based on cleaned local extracts from official public datasets, mainly
            Eurostat and the World Bank.
          </p>
        </RevealInView>
        <RevealInView as="aside" className="hero__panel" delay={0.08} distance={24} duration={0.7}>
          <p className="hero__panel-kicker" data-i18n="hero.panelKicker">
            Framing Question
          </p>
          <p className="hero__panel-text" data-i18n="hero.panelText">
            When countries rely less on landfill, do they also tend to perform better on broader
            sustainability indicators?
          </p>
          <div className="hero__nav">
            <a href="#waste-story" className="hero__nav-link" data-i18n="hero.navWaste">
              Waste System
            </a>
            <a
              href="#transition-story"
              className="hero__nav-link"
              data-i18n="hero.navCircularity"
            >
              Circularity
            </a>
            <a href="#climate-story" className="hero__nav-link" data-i18n="hero.navClimate">
              Climate Context
            </a>
            <a href="#methods" className="hero__nav-link" data-i18n="hero.navMethods">
              Methods
            </a>
          </div>
        </RevealInView>
      </div>
    </header>
  );
}
