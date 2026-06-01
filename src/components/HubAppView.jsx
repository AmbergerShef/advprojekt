import { useEffect, useState } from "react";

function AppFrame({ app, copy }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="app-view__stage">
      {!loaded ? (
        <div className="app-view__loading" aria-live="polite">
          <p className="eyebrow">{copy.loadingLabel}</p>
          <h2>{app.title}</h2>
          <p>{copy.loadingText}</p>
        </div>
      ) : null}
      <iframe
        key={app.slug}
        className={`app-view__frame ${loaded ? "is-ready" : ""}`}
        src={app.href}
        title={app.title}
        loading="eager"
        referrerPolicy="strict-origin-when-cross-origin"
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}

export default function HubAppView({ app, copy, onBack }) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <section className="panel app-view">
      <div className="app-view__topbar">
        <div>
          <p className="eyebrow">{app.kind[copy.lang]}</p>
          <h1>{app.title}</h1>
        </div>
        <div className="app-view__actions">
          <button className="button button-secondary" type="button" onClick={onBack}>
            {copy.backToHub}
          </button>
          <a className="button button-primary" href={app.href}>
            {copy.openStandalone}
          </a>
        </div>
      </div>

      <p className="app-view__description">{app.description[copy.lang]}</p>

      <div className="app-view__meta">
        <div className="app-view__meta-card">
          <span>{copy.stackLabel}</span>
          <strong>{app.details[copy.lang][0].replace(/^Stack:\s*/i, "")}</strong>
        </div>
        <div className="app-view__meta-card">
          <span>{copy.runtimeLabel}</span>
          <strong>{app.slug === "danube-street-stories" ? copy.webglRuntime : copy.lazyRuntime}</strong>
        </div>
      </div>

      <AppFrame app={app} copy={copy} />
    </section>
  );
}
