import { useImperativeUi } from "./hooks/useImperativeUi.js";
import FloatingNav from "./components/FloatingNav.jsx";
import HeroSection from "./sections/HeroSection.jsx";
import IntroSections from "./sections/IntroSections.jsx";
import WasteStorySection from "./sections/WasteStorySection.jsx";
import TransitionSection from "./sections/TransitionSection.jsx";
import ClimateSection from "./sections/ClimateSection.jsx";
import ReferenceSection, { SourcesSection } from "./sections/ReferenceSection.jsx";
import DashboardSection from "./sections/DashboardSection.jsx";
import ConclusionSection from "./sections/ConclusionSection.jsx";
import FooterSection from "./sections/FooterSection.jsx";

export default function App() {
  useImperativeUi();

  return (
    <>
      <div className="page-top-line" aria-hidden="true"></div>
      <FloatingNav />
      <HeroSection />
      <main className="page-shell">
        <IntroSections />
        <WasteStorySection />
        <TransitionSection />
        <ClimateSection />
        <DashboardSection />
        <SourcesSection />
        <ReferenceSection/>
        <ConclusionSection />
      </main>
      <FooterSection />
    </>
  );
}
