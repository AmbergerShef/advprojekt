import { useGameStore } from "../state/useGameStore.js";

function loadCopy(mapLoadState) {
  switch (mapLoadState) {
    case "input-ready":
      return "Input ready. City stream warming up.";
    case "map-loading":
      return "Loading roads, towers and night traffic.";
    case "world-ready":
      return "City online. Step into the street.";
    case "error":
      return "Offline district loaded. Free roam is still live.";
    default:
      return "Booting open-world sandbox.";
  }
}

const menuItems = ["Story", "District", "Controls", "Credits"];

const crewCards = [
  {
    kicker: "Lead",
    name: "Mira Vale",
    text: "Runs the beachside jobs and knows every route through the district.",
  },
  {
    kicker: "Wheelman",
    name: "Dani Cross",
    text: "Fast cars, bad decisions and a depot sprint waiting after midnight.",
  },
  {
    kicker: "Heat",
    name: "Roka Saint",
    text: "Garage trouble, hostile crews and a city that never cools down.",
  },
];

export function MainMenu() {
  const setStarted = useGameStore((state) => state.setStarted);
  const setStatus = useGameStore((state) => state.setStatus);
  const mapLoadState = useGameStore((state) => state.mapLoadState);
  const onlineDataMode = useGameStore((state) => state.onlineDataMode);

  return (
    <section className="vice-menu">
      <div className="vice-sunset" aria-hidden="true">
        <span className="sun"></span>
        <span className="skyline skyline-back"></span>
        <span className="skyline skyline-front"></span>
        <span className="palm palm-left"></span>
        <span className="palm palm-right"></span>
        <span className="supercar"></span>
      </div>

      <nav className="vice-nav" aria-label="Game menu">
        {menuItems.map((item) => (
          <button className={item === "Story" ? "is-active" : ""} type="button" key={item}>
            {item}
          </button>
        ))}
      </nav>

      <div className="vice-brand">
        <p>Danube Street Stories</p>
        <h1>
          <span>Danube</span>
          <strong>DS</strong>
        </h1>
        <small>Budapest street sandbox</small>
      </div>

      <aside className="vice-panel">
        <p className="eyebrow">Live District</p>
        <h2>Night jobs. Fast routes. Rising heat.</h2>
        <p>
          Cruise a neon Danube district, pick up street missions, enter vehicles and build heat while the city
          loader paints the blocks behind you.
        </p>

        <div className="vice-status-grid">
          <div>
            <span>World</span>
            <strong>{mapLoadState}</strong>
          </div>
          <div>
            <span>Data</span>
            <strong>{onlineDataMode}</strong>
          </div>
        </div>

        <p className="vice-status">{loadCopy(mapLoadState)}</p>

        <div className="menu-actions">
          <button
            id="start-fps-button"
            className="button button-primary"
            type="button"
            onClick={() => {
              setStarted(true);
              setStatus("Click inside the scene to lock cursor. Move with WASD.");
            }}
          >
            Start Run
          </button>
          <a className="button button-secondary" href="../../index.html">
            Back To Hub
          </a>
        </div>
      </aside>

      <div className="vice-crew">
        {crewCards.map((card) => (
          <article key={card.name}>
            <span>{card.kicker}</span>
            <h3>{card.name}</h3>
            <p>{card.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
