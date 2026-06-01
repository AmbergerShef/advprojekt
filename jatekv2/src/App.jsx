import { Suspense, lazy, useEffect, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { loadRuntimeMap } from "./game/lib/runtimeMapLoader.js";
import { debugLog } from "./game/lib/debug.js";
import { useGameStore } from "./game/state/useGameStore.js";

const GameWorld = lazy(() =>
  import("./game/components/GameWorld.jsx").then((module) => ({ default: module.GameWorld }))
);
const Hud = lazy(() => import("./game/ui/Hud.jsx").then((module) => ({ default: module.Hud })));
const MainMenu = lazy(() =>
  import("./game/ui/MainMenu.jsx").then((module) => ({ default: module.MainMenu }))
);

function loadingCopy(state) {
  switch (state) {
    case "input-ready":
      return "Input ready. Preparing live city data.";
    case "map-loading":
      return "Loading OSM roads and buildings.";
    case "world-ready":
      return "World ready.";
    case "error":
      return "Map loader hit an error, fallback mode active.";
    default:
      return "Booting HTML5 FPS shell.";
  }
}

export default function App() {
  const started = useGameStore((state) => state.started);
  const mapLoadState = useGameStore((state) => state.mapLoadState);
  const setStatus = useGameStore((state) => state.setStatus);
  const setCitySnapshot = useGameStore((state) => state.setCitySnapshot);
  const setMapLoadState = useGameStore((state) => state.setMapLoadState);
  const setOnlineDataMode = useGameStore((state) => state.setOnlineDataMode);
  const maxDpr = useMemo(() => {
    if (typeof window === "undefined") {
      return 1;
    }
    return Math.min(window.devicePixelRatio || 1, 1);
  }, []);

  useEffect(() => {
    let active = true;
    setMapLoadState("booting");
    setStatus("HTML5 loader booting.");

    loadRuntimeMap((state) => {
      if (!active) {
        return;
      }
      setMapLoadState(state);
      setStatus(loadingCopy(state));
    })
      .then((snapshot) => {
        if (!active) {
          return;
        }
        setCitySnapshot(snapshot);
        setOnlineDataMode(snapshot.meta?.sourceMode || "fallback");
        setMapLoadState("world-ready");
        setStatus(
          snapshot.meta?.sourceMode === "live"
            ? "Live OSM city data loaded."
            : "Fallback city cache loaded."
        );
        debugLog("render", "app world ready", {
          sourceMode: snapshot.meta?.sourceMode || "fallback",
          buildings: snapshot.buildings?.length || 0,
          roads: snapshot.roads?.length || 0,
        });
      })
      .catch((error) => {
        if (!active) {
          return;
        }
        setMapLoadState("error");
        setOnlineDataMode("fallback");
        setStatus("Map loader failed hard, running built-in fallback.");
        debugLog("render", "app load error", {
          error: error instanceof Error ? error.message : String(error),
        });
      });

    return () => {
      active = false;
    };
  }, [setCitySnapshot, setMapLoadState, setOnlineDataMode, setStatus]);

  return (
    <div className="app-shell">
      <Canvas
        camera={{ fov: 70, near: 0.1, far: 1300, position: [0, 1.7, 8] }}
        shadows={false}
        dpr={[1, maxDpr]}
        gl={{
          alpha: false,
          antialias: false,
          depth: true,
          powerPreference: "high-performance",
          preserveDrawingBuffer: false,
          stencil: false,
        }}
        performance={{ min: 0.7 }}
      >
        <color attach="background" args={["#d99b69"]} />
        <fogExp2 attach="fog" args={["#c79168", 0.00215]} />
        <Suspense fallback={null}>
          <Physics gravity={[0, -18, 0]} colliders={false} timeStep="vary">
            <GameWorld />
          </Physics>
        </Suspense>
      </Canvas>

      <Suspense
        fallback={
          started ? null : (
            <section className="menu-panel menu-panel--loading">
              <p className="eyebrow">Loading</p>
              <h1>Danube Street Stories</h1>
              <p>{loadingCopy(mapLoadState)}</p>
            </section>
          )
        }
      >
        {started ? <Hud /> : <MainMenu />}
      </Suspense>
    </div>
  );
}
