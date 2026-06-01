import { useGameStore } from "../state/useGameStore.js";
import { BuildingLayer } from "./BuildingLayer.jsx";
import { FirstPersonController } from "./FirstPersonController.jsx";
import { LightingRig } from "./LightingRig.jsx";
import { MissionObjects } from "./MissionObjects.jsx";
import { Npcs } from "./Npcs.jsx";
import { PostEffects } from "./PostEffects.jsx";
import { RoadNetwork } from "./RoadNetwork.jsx";
import { StreetFurniture } from "./StreetFurniture.jsx";
import { Vehicles } from "./Vehicles.jsx";
import { WorldTerrain } from "./WorldTerrain.jsx";

export function SceneContent() {
  const snapshot = useGameStore((state) => state.citySnapshot);

  return (
    <>
      <LightingRig />
      <WorldTerrain bounds={snapshot.bounds} parks={snapshot.parks || []} />
      <RoadNetwork roads={snapshot.roads || []} sidewalks={snapshot.sidewalks || []} />
      <BuildingLayer buildings={snapshot.buildings || []} />
      <StreetFurniture roads={snapshot.roads || []} shop={snapshot.shop} />
      <MissionObjects />
      <Vehicles />
      <Npcs />
      <FirstPersonController />
      <PostEffects />
    </>
  );
}
