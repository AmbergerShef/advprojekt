import RevealInView from "./RevealInView.jsx";

export default function StoryChapter({
  id,
  labelKey,
  labelText,
  titleKey,
  titleText,
  textKey,
  text
}) {
  return (
    <RevealInView as="section" className="story-chapter" id={id} distance={18} duration={0.55}>
      <p className="story-chapter__label" data-i18n={labelKey}>
        {labelText}
      </p>
      <h2 className="story-chapter__title" data-i18n={titleKey}>
        {titleText}
      </h2>
      <p className="story-chapter__text" data-i18n={textKey}>
        {text}
      </p>
    </RevealInView>
  );
}
