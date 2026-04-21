export default function SectionHeading({ kickerKey, kickerText, titleKey, titleText }) {
  return (
    <div className="section-heading">
      <p className="section-kicker" data-i18n={kickerKey}>
        {kickerText}
      </p>
      <h2 data-i18n={titleKey}>{titleText}</h2>
    </div>
  );
}
