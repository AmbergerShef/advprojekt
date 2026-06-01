import { create } from "zustand";
import { defaultSnapshot } from "../data/defaultSnapshot.js";
import { debugLog } from "../lib/debug.js";

const missions = [
  {
    id: "street-pickup",
    title: "Market Sweep",
    description: "Gyujts ossze 3 penzcsomagot a piac es a park kozott.",
    objective: "Beszelj Mira-val a piacon, majd jard be a park melletti utat.",
    reward: 150,
    target: 3,
    progress: 0,
    state: "active",
    started: false,
  },
  {
    id: "courier-run",
    title: "Depot Sprint",
    description: "Pattanj motorra es vidd el a csomagot a futar-depoba.",
    objective: "Beszelj Dani-val, ulj motorra, majd erj a depoba.",
    reward: 220,
    target: 1,
    progress: 0,
    state: "locked",
    started: false,
  },
  {
    id: "heat-wave",
    title: "Garage Heat",
    description: "Szerezd vissza a taskat a garazsudvarbol es allitsd meg az uldozoket.",
    objective: "Beszelj Roka-val, vedd fel a taskat a garazsnal es semlegesits 4 hostile-t.",
    reward: 320,
    target: 4,
    progress: 0,
    state: "locked",
    started: false,
  },
];

const pickupSeeds = [
  { id: "cash-a", x: -134, y: 1, z: 38, amount: 28, active: true },
  { id: "cash-b", x: -118, y: 1, z: 58, amount: 32, active: true },
  { id: "cash-c", x: -96, y: 1, z: 70, amount: 34, active: true },
];

const civilians = [
  { id: "civ-1", name: "Mira", x: -138, y: 1, z: -18, role: "mission", missionId: "street-pickup" },
  { id: "civ-2", name: "Dani", x: 48, y: 1, z: -154, role: "mission", missionId: "courier-run" },
  { id: "civ-3", name: "Roka", x: 150, y: 1, z: 104, role: "mission", missionId: "heat-wave" },
  { id: "civ-4", name: "Bori", x: -130, y: 1, z: -18, role: "shop" },
  { id: "civ-5", name: "Levi", x: -48, y: 1, z: 88, role: "civil" },
  { id: "civ-6", name: "Nora", x: -170, y: 1, z: -104, role: "civil" },
  { id: "civ-7", name: "Adam", x: 120, y: 1, z: -8, role: "civil" },
];

const hostiles = [
  { id: "hostile-1", x: 148, y: 1, z: 112, health: 100, active: false, alive: true },
  { id: "hostile-2", x: 168, y: 1, z: 126, health: 100, active: false, alive: true },
  { id: "hostile-3", x: 128, y: 1, z: 138, health: 100, active: false, alive: true },
  { id: "hostile-4", x: 176, y: 1, z: 88, health: 100, active: false, alive: true },
];

const weaponConfigs = {
  Pistol: {
    magazineSize: 18,
    damage: 34,
    range: 32,
    heat: 5,
  },
  Shotgun: {
    magazineSize: 6,
    damage: 76,
    range: 18,
    heat: 10,
  },
};

const vehicles = [
  { id: "car", label: "Street Car", type: "car", x: 18, y: 0.8, z: 0, rotation: Math.PI / 2, occupied: false },
  { id: "bike", label: "Depot Bike", type: "bike", x: 64, y: 0.7, z: -154, rotation: Math.PI / 2, occupied: false },
];

const secretPickups = [
  { id: "ridge-cache-a", x: 232, z: -214, reward: 95, active: true, label: "Ridge cache" },
  { id: "pine-cache-b", x: -258, z: 196, reward: 115, active: true, label: "Pine cache" },
  { id: "trail-cache-c", x: 18, z: 242, reward: 140, active: true, label: "Old survey box" },
];

const npcDialogue = {
  "civ-1": "Mira: A piac mogott vannak a csomagok. Ne kelts feltunest.",
  "civ-2": "Dani: A motor gyors, de a hegyi utak alattomosak.",
  "civ-3": "Roka: A garazsnal figyelj. Nem minden ajto marad zarva.",
  "civ-4": "Bori: Van medkit es loszer, ha van penzed.",
  "civ-5": "Levi: A varos szelen furcsa ladakat lattam a fak kozott.",
  "civ-6": "Nora: Este a lampak segitenek tajekozodni.",
  "civ-7": "Adam: A magaslatrol az egesz negyed belathato.",
};

function logStore(action, payload) {
  debugLog("store", action, payload);
}

function weaponConfigFor(weapon) {
  return weaponConfigs[weapon] || weaponConfigs.Pistol;
}

function missionById(missionsList, missionId) {
  return missionsList.find((mission) => mission.id === missionId);
}

function respawnPatch(state) {
  const heatWaveActive =
    state.activeMissionId === "heat-wave" && missionById(state.missions, "heat-wave")?.started;

  return {
    respawnNonce: state.respawnNonce + 1,
    player: {
      ...state.player,
      position: { ...state.citySnapshot.playerSpawn },
      inVehicle: null,
      health: 100,
      heat: 0,
      vehicleSpeedKmh: 0,
      money: Math.max(0, state.player.money - 90),
    },
    vehicles: state.vehicles.map((vehicle) => ({ ...vehicle, occupied: false })),
    hostiles: hostiles.map((hostile) => ({
      ...hostile,
      active: heatWaveActive,
      alive: true,
      health: 100,
    })),
    movementState: "idle",
    statusText: "You died. Respawned in the safe zone. -$90.",
  };
}

export const useGameStore = create((set, get) => ({
  started: false,
  pointerLocked: false,
  debugEnabled: false,
  mapLoadState: "booting",
  onlineDataMode: "fallback",
  movementState: "idle",
  respawnNonce: 0,
  worldTime: 18,
  citySnapshot: defaultSnapshot,
  player: {
    position: { ...defaultSnapshot.playerSpawn },
    health: 100,
    money: 120,
    heat: 0,
    weapon: "Pistol",
    ammo: 18,
    reserveAmmo: 54,
    sprinting: false,
    inVehicle: null,
    vehicleSpeedKmh: 0,
  },
  missions: structuredClone(missions),
  activeMissionId: "street-pickup",
  pickups: structuredClone(pickupSeeds),
  civilians: structuredClone(civilians),
  hostiles: structuredClone(hostiles),
  vehicles: structuredClone(vehicles),
  secretPickups: structuredClone(secretPickups),
  garageDoors: {},
  activeDialogue: null,
  bag: { x: 116, y: 1, z: 96, active: false },
  objectiveText: "Click to start, then talk to Mira at the market.",
  statusText: "Curated district loader initializing.",
  interactHint: "Move close to an NPC, vehicle or shop, then press E.",
  canInteract: false,
  nearbyTarget: null,
  setStarted: (started) => {
    logStore("setStarted", { started });
    set({ started });
  },
  setPointerLocked: (pointerLocked) => {
    logStore("setPointerLocked", { pointerLocked });
    set({ pointerLocked });
  },
  setMapLoadState: (mapLoadState) => {
    logStore("setMapLoadState", { mapLoadState });
    set({ mapLoadState });
  },
  setOnlineDataMode: (onlineDataMode) => {
    logStore("setOnlineDataMode", { onlineDataMode });
    set({ onlineDataMode });
  },
  setMovementState: (movementState) => {
    set({ movementState });
  },
  setDebugEnabled: (debugEnabled) => {
    set({ debugEnabled });
  },
  advanceWorldTime: (delta) =>
    set((state) => ({
      worldTime: (state.worldTime + delta * 0.035) % 24,
    })),
  setCitySnapshot: (citySnapshot) => {
    logStore("setCitySnapshot", {
      buildings: citySnapshot?.buildings?.length || 0,
      roads: citySnapshot?.roads?.length || 0,
      sidewalks: citySnapshot?.sidewalks?.length || 0,
    });
    set({ citySnapshot });
  },
  updatePlayer: (patch) =>
    set((state) => ({
      player: {
        ...state.player,
        ...patch,
      },
    })),
  setPlayerPosition: (position) =>
    set((state) => ({
      player: {
        ...state.player,
        position,
      },
    })),
  setVehicleSpeedKmh: (vehicleSpeedKmh) =>
    set((state) => ({
      player: {
        ...state.player,
        vehicleSpeedKmh,
      },
    })),
  setInteractState: (nearbyTarget, canInteract, interactHint) => set({ nearbyTarget, canInteract, interactHint }),
  toggleGarageDoor: (garageId) =>
    set((state) => {
      const isOpen = Boolean(state.garageDoors[garageId]);
      return {
        garageDoors: {
          ...state.garageDoors,
          [garageId]: !isOpen,
        },
        statusText: !isOpen ? "Garage door opening." : "Garage door closing.",
      };
    }),
  talkToNpc: (npcId) =>
    set({
      activeDialogue: {
        npcId,
        text: npcDialogue[npcId] || "Szia. Maradj biztonsagban odakint.",
        until: performance.now() + 4600,
      },
    }),
  clearExpiredDialogue: (now = performance.now()) =>
    set((state) => (state.activeDialogue?.until && state.activeDialogue.until <= now ? { activeDialogue: null } : {})),
  setStatus: (statusText) => {
    logStore("setStatus", { statusText });
    set({ statusText });
  },
  setObjective: (objectiveText) => {
    logStore("setObjective", { objectiveText });
    set({ objectiveText });
  },
  raiseHeat: (value) =>
    set((state) => ({
      player: {
        ...state.player,
        heat: Math.min(100, state.player.heat + value),
      },
    })),
  coolHeat: (delta) =>
    set((state) => ({
      player: {
        ...state.player,
        heat: Math.max(0, state.player.heat - delta),
      },
    })),
  spendMoney: (amount) =>
    set((state) => ({
      player: {
        ...state.player,
        money: Math.max(0, state.player.money - amount),
      },
    })),
  addMoney: (amount) =>
    set((state) => ({
      player: {
        ...state.player,
        money: state.player.money + amount,
      },
    })),
  collectPickup: (pickupId) =>
    set((state) => {
      logStore("collectPickup", { pickupId });
      const pickup = state.pickups.find((entry) => entry.id === pickupId);
      return {
        pickups: state.pickups.map((entry) => (entry.id === pickupId ? { ...entry, active: false } : entry)),
        missions: state.missions.map((mission) =>
          mission.id === state.activeMissionId && mission.id === "street-pickup"
            ? { ...mission, started: true, progress: Math.min(mission.target, mission.progress + 1) }
            : mission
        ),
        player: {
          ...state.player,
          money: state.player.money + (pickup?.amount || 0),
        },
        statusText: `Cash collected +$${pickup?.amount || 0}`,
      };
    }),
  collectSecretPickup: (pickupId) =>
    set((state) => {
      const pickup = state.secretPickups.find((entry) => entry.id === pickupId);
      if (!pickup?.active) {
        return {};
      }

      return {
        secretPickups: state.secretPickups.map((entry) =>
          entry.id === pickupId ? { ...entry, active: false } : entry
        ),
        player: {
          ...state.player,
          money: state.player.money + pickup.reward,
        },
        statusText: `${pickup.label} found. +$${pickup.reward}`,
      };
    }),
  damagePlayer: (amount) =>
    set((state) => {
      const health = Math.max(0, state.player.health - amount);
      if (health <= 0) {
        logStore("damagePlayer:death", { amount });
        return respawnPatch(state);
      }

      return {
        player: {
          ...state.player,
          health,
        },
      };
    }),
  healPlayer: (amount) =>
    set((state) => ({
      player: {
        ...state.player,
        health: Math.min(100, state.player.health + amount),
      },
    })),
  reload: () =>
    set((state) => {
      logStore("reload", { ammo: state.player.ammo, reserveAmmo: state.player.reserveAmmo });
      const config = weaponConfigFor(state.player.weapon);
      const needed = config.magazineSize - state.player.ammo;
      const load = Math.min(needed, state.player.reserveAmmo);
      return {
        player: {
          ...state.player,
          ammo: state.player.ammo + load,
          reserveAmmo: state.player.reserveAmmo - load,
        },
        statusText: load > 0 ? "Reload complete." : "No reserve ammo left.",
      };
    }),
  shoot: () => {
    let shot = { fired: false, damage: 0, range: 0 };

    set((state) => {
      const config = weaponConfigFor(state.player.weapon);
      if (state.player.ammo <= 0) {
        return { statusText: "Empty magazine. Press R." };
      }
      logStore("shoot", { weapon: state.player.weapon, ammoBefore: state.player.ammo });
      shot = {
        fired: true,
        damage: config.damage,
        range: config.range,
      };
      return {
        player: {
          ...state.player,
          ammo: Math.max(0, state.player.ammo - 1),
          heat: Math.min(100, state.player.heat + config.heat),
        },
      };
    });

    return shot;
  },
  switchWeapon: (weapon) =>
    set((state) => {
      const config = weaponConfigFor(weapon);
      if (!weaponConfigs[weapon]) {
        return { statusText: "That weapon is not available." };
      }

      const overflow = Math.max(0, state.player.ammo - config.magazineSize);
      logStore("switchWeapon", { weapon });
      return {
        player: {
          ...state.player,
          weapon,
          ammo: Math.min(state.player.ammo, config.magazineSize),
          reserveAmmo: state.player.reserveAmmo + overflow,
        },
        statusText: `${weapon} active.`,
      };
    }),
  useShop: () =>
    set((state) => {
      logStore("useShop", {
        money: state.player.money,
        health: state.player.health,
        reserveAmmo: state.player.reserveAmmo,
      });
      if (state.player.health < 100 && state.player.money >= 80) {
        return {
          player: {
            ...state.player,
            health: Math.min(100, state.player.health + 35),
            money: state.player.money - 80,
          },
          statusText: "Medkit purchased.",
        };
      }
      if (state.player.reserveAmmo <= 84 && state.player.money >= 40) {
        return {
          player: {
            ...state.player,
            reserveAmmo: state.player.reserveAmmo + 24,
            money: state.player.money - 40,
          },
          statusText: "Ammo purchased.",
        };
      }
      return { statusText: "Shop has nothing better for you right now." };
    }),
  startMission: (missionId) =>
    set((state) => {
      logStore("startMission", { missionId });
      const mission = missionById(state.missions, missionId);

      if (!mission) {
        return { statusText: "Unknown mission contact." };
      }

      if (mission.state === "done") {
        return { statusText: `${mission.title} is already complete.` };
      }

      if (mission.id !== state.activeMissionId || mission.state === "locked") {
        const activeMission = missionById(state.missions, state.activeMissionId);
        return {
          statusText: activeMission
            ? `Finish ${activeMission.title} before taking this job.`
            : "No new jobs are available right now.",
        };
      }

      if (mission.started) {
        return {
          statusText: `${mission.title} is already active.`,
          objectiveText: mission.objective,
        };
      }

      const nextMissions = state.missions.map((entry) =>
        entry.id === missionId ? { ...entry, started: true } : entry
      );
      return {
        missions: nextMissions,
        bag: missionId === "heat-wave" ? { ...state.bag, active: true } : state.bag,
        hostiles:
          missionId === "heat-wave"
            ? state.hostiles.map((entry) => ({ ...entry, active: true }))
            : state.hostiles,
        objectiveText: mission?.objective || state.objectiveText,
        statusText: `${mission?.title || "Mission"} started.`,
      };
    }),
  advanceMission: (missionId, amount = 1) =>
    set((state) => ({
      missions: state.missions.map((mission) =>
        mission.id === missionId ? { ...mission, progress: Math.min(mission.target, mission.progress + amount) } : mission
      ),
    })),
  completeActiveMission: () =>
    set((state) => {
      const active = state.missions.find((mission) => mission.id === state.activeMissionId);
      if (!active) {
        return {};
      }
      logStore("completeActiveMission", { missionId: active.id, reward: active.reward });
      const nextId = active.id === "street-pickup" ? "courier-run" : active.id === "courier-run" ? "heat-wave" : null;
      return {
        activeMissionId: nextId,
        missions: state.missions.map((mission) => {
          if (mission.id === active.id) {
            return { ...mission, state: "done", started: true, progress: mission.target };
          }
          if (mission.id === nextId) {
            return { ...mission, state: "active" };
          }
          return mission;
        }),
        player: {
          ...state.player,
          money: state.player.money + active.reward,
        },
        objectiveText: nextId
          ? state.missions.find((mission) => mission.id === nextId)?.objective || "New mission active."
          : "All missions cleared. Free roam the district.",
        statusText: `${active.title} complete. +$${active.reward}`,
      };
    }),
  enterVehicle: (vehicleId) =>
    set((state) => {
      logStore("enterVehicle", { vehicleId });
      return {
        player: {
          ...state.player,
          inVehicle: vehicleId,
        },
        vehicles: state.vehicles.map((vehicle) =>
          vehicle.id === vehicleId ? { ...vehicle, occupied: true } : vehicle
        ),
        statusText: `${state.vehicles.find((vehicle) => vehicle.id === vehicleId)?.label || "Vehicle"} in use.`,
      };
    }),
  exitVehicle: () =>
    set((state) => {
      logStore("exitVehicle", { currentVehicle: state.player.inVehicle });
      return {
        player: {
          ...state.player,
          inVehicle: null,
        },
        vehicles: state.vehicles.map((vehicle) => ({ ...vehicle, occupied: false })),
        statusText: "Exited vehicle.",
      };
    }),
  moveVehicle: (vehicleId, patch) =>
    set((state) => ({
      vehicles: state.vehicles.map((vehicle) => (vehicle.id === vehicleId ? { ...vehicle, ...patch } : vehicle)),
    })),
  setCivilianPosition: (npcId, position) =>
    set((state) => ({
      civilians: state.civilians.map((npc) =>
        npc.id === npcId ? { ...npc, currentX: position.x, currentZ: position.z } : npc
      ),
    })),
  setHostilePosition: (hostileId, position) =>
    set((state) => ({
      hostiles: state.hostiles.map((hostile) =>
        hostile.id === hostileId ? { ...hostile, x: position.x, y: position.y ?? hostile.y, z: position.z } : hostile
      ),
    })),
  hitHostile: (hostileId, damage) => {
    let killedNow = false;

    set((state) => {
      logStore("hitHostile", { hostileId, damage });
      const activeMission = state.missions.find((mission) => mission.id === state.activeMissionId);
      const updated = state.hostiles.map((hostile) => {
        if (hostile.id !== hostileId || !hostile.alive) {
          return hostile;
        }
        const health = Math.max(0, hostile.health - damage);
        if (health === 0) {
          killedNow = true;
        }
        return {
          ...hostile,
          health,
          alive: health > 0,
        };
      });
      return {
        hostiles: updated,
        missions:
          killedNow && activeMission?.id === "heat-wave" && activeMission.started
            ? state.missions.map((mission) =>
                mission.id === "heat-wave"
                  ? { ...mission, progress: Math.min(mission.target, mission.progress + 1) }
                  : mission
              )
            : state.missions,
        statusText: killedNow ? "Hostile down." : state.statusText,
      };
    });

    if (killedNow) {
      get().maybeResolveMissionProgress();
    }
  },
  takeBag: () =>
    set((state) => {
      logStore("takeBag");
      return {
        bag: {
          ...state.bag,
          active: false,
        },
        statusText: "Bag secured.",
      };
    }),
  resetOnDeath: () =>
    set((state) => {
      logStore("resetOnDeath", { moneyBefore: state.player.money });
      return respawnPatch(state);
    }),
  maybeResolveMissionProgress: () => {
    const state = get();
    const active = state.missions.find((mission) => mission.id === state.activeMissionId);
    if (!active) {
      return;
    }

    if (active.id === "street-pickup" && active.progress >= active.target) {
      get().completeActiveMission();
      return;
    }
    if (active.id === "courier-run" && active.progress >= active.target) {
      get().completeActiveMission();
      return;
    }
    if (active.id === "heat-wave" && active.progress >= active.target && !state.bag.active) {
      get().completeActiveMission();
    }
  },
}));
