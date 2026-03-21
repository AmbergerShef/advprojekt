const starfieldCanvas = document.getElementById("starfield-canvas");
const starfieldContext = starfieldCanvas.getContext("2d");
const canvas = document.getElementById("game-canvas");
const context = canvas.getContext("2d");

const startButton = document.getElementById("start-button");
const restartButton = document.getElementById("restart-button");
const statusText = document.getElementById("status-text");
const overlay = document.getElementById("game-overlay");
const overlayLabel = document.querySelector(".overlay-label");
const overlayTitle = document.getElementById("overlay-title");
const overlayCopy = document.getElementById("overlay-copy");
const overlayActions = document.getElementById("overlay-actions");
const themeButtons = document.querySelectorAll(".theme-button");
const themeDescription = document.getElementById("theme-description");
const playerNameInput = document.getElementById("player-name-input");
const leaderboardList = document.getElementById("leaderboard-list");
const leaderboardCount = document.getElementById("leaderboard-count");

const timeValue = document.getElementById("time-value");
const scoreValue = document.getElementById("score-value");
const healthValue = document.getElementById("health-value");
const levelValue = document.getElementById("level-value");
const waveValue = document.getElementById("wave-value");
const xpValue = document.getElementById("xp-value");
const bestValue = document.getElementById("best-value");

const ARENA = {
  width: canvas.width,
  height: canvas.height,
};

const STARFIELD = {
  stars: [],
  width: 0,
  height: 0,
  pointer: {
    x: 0,
    y: 0,
    active: false,
  },
};

const STAR_COUNT = 70;
const MAX_LINK_DISTANCE = 140;
const BULLET_RANGE = 430;
const THEMES = {
  neon: {
    description: "Az eredeti neon sci-fi arena csillagmezos hangulattal es tiszta futurisztikus formakkal.",
    bulletColor: "#ffd447",
    xpColor: "#7be0ff",
    hitColor: "#ffd447",
    hudAccent: "rgba(159, 192, 216, 0.95)",
  },
  battlefield: {
    description: "Hangulatos harcmezo katonaval, drone-okkal es tank jellegu ellenfelekkel. Minel erosebb az ellenfel, annal komolyabb a sziluettje.",
    bulletColor: "#ffbf69",
    xpColor: "#9ed38a",
    hitColor: "#ffbf69",
    hudAccent: "rgba(196, 191, 155, 0.95)",
  },
};
const UPGRADE_OPTIONS = [
  {
    id: "rapid-fire",
    title: "Gyorsabb tuzeles",
    description: "A fegyver gyakrabban lovi a legkozelebbi celpontot.",
    apply: (player) => {
      player.fireInterval = Math.max(0.16, player.fireInterval * 0.82);
    },
  },
  {
    id: "bullet-damage",
    title: "Nagyobb sebzes",
    description: "A lovedekek erosebbet utnek es gyorsabban takaritanak.",
    apply: (player) => {
      player.bulletDamage += 8;
    },
  },
  {
    id: "move-speed",
    title: "Gyorsabb mozgas",
    description: "Konnyebb kiteolni a hullamokat es kimenekulni a sarokbol.",
    apply: (player) => {
      player.speed += 28;
    },
  },
  {
    id: "max-health",
    title: "Panceljavitas",
    description: "No a maximum elet es kapsz azonnali gyogyulast is.",
    apply: (player) => {
      player.maxHealth += 20;
      player.health = Math.min(player.maxHealth, player.health + 28);
    },
  },
  {
    id: "multi-shot",
    title: "Dupla lovedek",
    description: "Egy lovesnel tobb lovedek indul enyhe szorassal.",
    apply: (player) => {
      player.multishot = Math.min(4, player.multishot + 1);
    },
  },
  {
    id: "pickup-range",
    title: "XP magnes",
    description: "Messzebrol magadhoz huzod az XP shardokat.",
    apply: (player) => {
      player.pickupRadius += 40;
    },
  },
];

const ENEMY_ARCHETYPES = [
  {
    id: "chaser",
    minWave: 1,
    weight: 1,
    cost: 1,
    color: 16,
    radius: [15, 22],
    speed: [88, 118],
    health: [18, 28],
    damage: 12,
    xp: 1,
  },
  {
    id: "sprinter",
    minWave: 3,
    weight: 0.8,
    cost: 2,
    color: 348,
    radius: [11, 15],
    speed: [145, 182],
    health: [10, 16],
    damage: 9,
    xp: 1,
  },
  {
    id: "brute",
    minWave: 5,
    weight: 0.55,
    cost: 4,
    color: 44,
    radius: [24, 32],
    speed: [62, 84],
    health: [42, 60],
    damage: 18,
    xp: 3,
  },
];

const keys = new Set();
const bestScoreKey = "last-ring-arena-best";
const leaderboardKey = "last-ring-arena-leaderboard";
const playerNameKey = "last-ring-arena-player-name";

let lastTimestamp = 0;
let state = createInitialState();
let currentTheme = "neon";

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function randomBetween(min, max) {
  return min + Math.random() * (max - min);
}

function createInitialState() {
  return {
    running: false,
    gameOver: false,
    upgradeMode: false,
    elapsed: 0,
    score: 0,
    kills: 0,
    spawnTimer: 0,
    enemyDamageCooldown: 0,
    enemies: [],
    bullets: [],
    xpOrbs: [],
    particles: [],
    camera: {
      x: 0,
      y: 0,
    },
    wave: {
      number: 1,
      spawnBudget: 0,
      spentBudget: 0,
      timeRemaining: 0,
      spawnCooldown: 0,
      spawnInterval: 0.9,
      maxConcurrent: 6,
      breakTimer: 0,
      inBreak: false,
    },
    player: {
      x: 0,
      y: 0,
      radius: 16,
      speed: 285,
      health: 100,
      maxHealth: 100,
      bulletDamage: 18,
      bulletSpeed: 520,
      bulletRadius: 5,
      fireInterval: 0.48,
      fireCooldown: 0.2,
      multishot: 1,
      pickupRadius: 64,
      level: 1,
      xp: 0,
      xpToNext: 5,
    },
    upgradeChoices: [],
  };
}

function getCameraOffset() {
  return {
    x: state.camera.x - ARENA.width / 2,
    y: state.camera.y - ARENA.height / 2,
  };
}

function toScreenX(worldX) {
  return worldX - getCameraOffset().x;
}

function toScreenY(worldY) {
  return worldY - getCameraOffset().y;
}

function isOnScreen(worldX, worldY, padding = 80) {
  const screenX = toScreenX(worldX);
  const screenY = toScreenY(worldY);
  return (
    screenX >= -padding &&
    screenX <= ARENA.width + padding &&
    screenY >= -padding &&
    screenY <= ARENA.height + padding
  );
}

function getBestScore() {
  return Number(localStorage.getItem(bestScoreKey) || 0);
}

function setBestScore(score) {
  localStorage.setItem(bestScoreKey, String(score));
}

function getPlayerName() {
  const savedName = playerNameInput.value.trim() || localStorage.getItem(playerNameKey) || "";
  return savedName.slice(0, 16) || "Jatekos";
}

function savePlayerName() {
  localStorage.setItem(playerNameKey, getPlayerName());
}

function getLeaderboard() {
  try {
    const parsed = JSON.parse(localStorage.getItem(leaderboardKey) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function setLeaderboard(entries) {
  localStorage.setItem(leaderboardKey, JSON.stringify(entries));
}

function addLeaderboardEntry(entry) {
  const nextEntries = [...getLeaderboard(), entry]
    .sort((a, b) => b.score - a.score || b.elapsed - a.elapsed)
    .slice(0, 10);
  setLeaderboard(nextEntries);
  renderLeaderboard();
}

function renderLeaderboard() {
  const entries = getLeaderboard();
  leaderboardCount.textContent = `Top ${entries.length}`;
  leaderboardList.innerHTML = "";

  if (entries.length === 0) {
    leaderboardList.innerHTML = '<div class="leaderboard-empty">Meg nincs mentes a toplistan. Indits egy kort es kerulj fel.</div>';
    return;
  }

  entries.forEach((entry, index) => {
    const item = document.createElement("div");
    item.className = "leaderboard-entry";
    item.innerHTML = `
      <span class="leaderboard-rank">#${index + 1}</span>
      <div>
        <div class="leaderboard-name">${entry.name}</div>
        <div class="leaderboard-meta">${entry.elapsed.toFixed(1)} mp • ${entry.kills} kill</div>
      </div>
      <span class="leaderboard-score">${entry.score}</span>
    `;
    leaderboardList.appendChild(item);
  });
}

function updateHud() {
  timeValue.textContent = `${state.elapsed.toFixed(1)} mp`;
  scoreValue.textContent = String(Math.floor(state.score));
  healthValue.textContent = String(Math.max(0, Math.ceil(state.player.health)));
  levelValue.textContent = String(state.player.level);
  waveValue.textContent = String(state.wave.number);
  xpValue.textContent = `${state.player.xp} / ${state.player.xpToNext}`;
  bestValue.textContent = String(getBestScore());
}

function getTheme() {
  return THEMES[currentTheme];
}

function applyTheme(themeId) {
  currentTheme = THEMES[themeId] ? themeId : "neon";
  document.body.dataset.theme = currentTheme;
  themeDescription.textContent = getTheme().description;
  themeButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.theme === currentTheme);
  });
}

function resizeStarfieldCanvas() {
  const bounds = starfieldCanvas.getBoundingClientRect();
  const nextWidth = Math.max(1, Math.floor(bounds.width));
  const nextHeight = Math.max(1, Math.floor(bounds.height));
  const ratio = window.devicePixelRatio || 1;

  starfieldCanvas.width = Math.floor(nextWidth * ratio);
  starfieldCanvas.height = Math.floor(nextHeight * ratio);
  starfieldCanvas.style.width = `${nextWidth}px`;
  starfieldCanvas.style.height = `${nextHeight}px`;
  starfieldContext.setTransform(ratio, 0, 0, ratio, 0, 0);

  STARFIELD.width = nextWidth;
  STARFIELD.height = nextHeight;
  STARFIELD.pointer.x = nextWidth / 2;
  STARFIELD.pointer.y = nextHeight / 2;
  STARFIELD.stars = Array.from({ length: STAR_COUNT }, () => ({
    x: Math.random() * nextWidth,
    y: Math.random() * nextHeight,
    size: Math.random() * 1.8 + 0.8,
    speedX: (Math.random() - 0.5) * 0.16,
    speedY: (Math.random() - 0.5) * 0.16,
  }));
}

function resizeGameCanvas() {
  const bounds = canvas.getBoundingClientRect();
  const nextWidth = Math.max(1, Math.floor(bounds.width));
  const nextHeight = Math.max(1, Math.floor(bounds.height));
  const ratio = window.devicePixelRatio || 1;

  ARENA.width = nextWidth;
  ARENA.height = nextHeight;
  canvas.width = Math.floor(nextWidth * ratio);
  canvas.height = Math.floor(nextHeight * ratio);
  canvas.style.width = `${nextWidth}px`;
  canvas.style.height = `${nextHeight}px`;
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
}

function handleResize() {
  resizeStarfieldCanvas();
  resizeGameCanvas();
}

function clearOverlay() {
  overlayActions.innerHTML = "";
  restartButton.hidden = true;
}

function createWaveConfig(waveNumber) {
  return {
    number: waveNumber,
    spawnBudget: 8 + waveNumber * 4,
    spentBudget: 0,
    timeRemaining: 18 + Math.min(14, waveNumber * 1.5),
    spawnCooldown: 0.5,
    spawnInterval: Math.max(0.28, 1.05 - waveNumber * 0.05),
    maxConcurrent: 5 + waveNumber * 2,
    breakTimer: 0,
    inBreak: false,
  };
}

function startWave(waveNumber) {
  state.wave = createWaveConfig(waveNumber);
  state.player.health = Math.min(state.player.maxHealth, state.player.health + 12 + waveNumber * 2);
  statusText.textContent = `Hullam ${waveNumber} elindult. Keszitsd a helyet az uj ellenfeleknek.`;
  updateHud();
}

function startWaveBreak() {
  state.wave.inBreak = true;
  state.wave.breakTimer = 3.5;
  state.player.health = Math.min(state.player.maxHealth, state.player.health + 20);
  statusText.textContent = `Hullam ${state.wave.number} tisztitva. Rogton jon a kovetkezo kor.`;
}

function resetGame() {
  state = createInitialState();
  clearOverlay();
  overlay.classList.add("hidden");
  overlayLabel.textContent = "Kor vege";
  startWave(1);
  updateHud();
  statusText.textContent = "Tulelj minel tovabb. Loj, gyujts XP-t, es fejlodj menet kozben.";
}

function startGame() {
  savePlayerName();
  resetGame();
  state.running = true;
  lastTimestamp = 0;
  statusText.textContent = `A kor elindult. Hullam ${state.wave.number}, tartsd mozgasban a hosod.`;
}

function endGame() {
  state.running = false;
  state.gameOver = true;
  state.upgradeMode = false;

  if (state.score > getBestScore()) {
    setBestScore(state.score);
  }

  addLeaderboardEntry({
    name: getPlayerName(),
    score: Math.floor(state.score),
    elapsed: state.elapsed,
    kills: state.kills,
    theme: currentTheme,
  });

  updateHud();
  clearOverlay();
  overlay.classList.remove("hidden");
  overlayLabel.textContent = "Kor vege";
  overlayTitle.textContent = `Vege! Pontszam: ${Math.floor(state.score)}`;
  overlayCopy.textContent = `Tulelt ido: ${state.elapsed.toFixed(1)} mp, kiutott ellenfelek: ${state.kills}. Uj korben probald mas fejlesztesekkel.`;
  restartButton.hidden = false;
  statusText.textContent = "A kor veget ert. Ujrainditassal mehetsz tovabb.";
}

function buildUpgradeChoices() {
  const pool = [...UPGRADE_OPTIONS];
  const choices = [];

  while (choices.length < 3 && pool.length > 0) {
    const index = Math.floor(Math.random() * pool.length);
    choices.push(pool.splice(index, 1)[0]);
  }

  return choices;
}

function showUpgradeOverlay() {
  state.running = false;
  state.upgradeMode = true;
  state.upgradeChoices = buildUpgradeChoices();
  clearOverlay();
  overlay.classList.remove("hidden");
  overlayLabel.textContent = "Fejlesztes";
  overlayTitle.textContent = `Szint ${state.player.level}`;
  overlayCopy.textContent = "Valassz egy fejlesztest. A kor csak ezutan folytatodik.";

  state.upgradeChoices.forEach((choice) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "upgrade-button";
    button.innerHTML = `<strong>${choice.title}</strong><span>${choice.description}</span>`;
    button.addEventListener("click", () => applyUpgrade(choice));
    overlayActions.appendChild(button);
  });

  statusText.textContent = "Szintlepes! Valassz egy fejlesztest az arena folytatasahoz.";
}

function applyUpgrade(choice) {
  choice.apply(state.player);
  state.upgradeMode = false;
  state.upgradeChoices = [];
  overlay.classList.add("hidden");
  clearOverlay();
  state.running = true;
  statusText.textContent = `${choice.title} aktiv. Nyomd tovabb az arenat.`;
  updateHud();
}

function getAvailableEnemyArchetypes() {
  return ENEMY_ARCHETYPES.filter((type) => state.wave.number >= type.minWave);
}

function pickEnemyArchetype(maxCost = Infinity) {
  const available = getAvailableEnemyArchetypes().filter((type) => type.cost <= maxCost);
  if (available.length === 0) {
    return null;
  }

  const totalWeight = available.reduce((sum, type) => sum + type.weight, 0);
  let roll = Math.random() * totalWeight;

  for (const type of available) {
    roll -= type.weight;
    if (roll <= 0) {
      return type;
    }
  }

  return available[0];
}

function spawnEnemy(type = pickEnemyArchetype()) {
  if (!type) {
    return false;
  }

  const radius = randomBetween(type.radius[0], type.radius[1]);
  const angle = Math.random() * Math.PI * 2;
  const distance = Math.max(ARENA.width, ARENA.height) * 0.75 + Math.random() * 320;
  const x = state.player.x + Math.cos(angle) * distance;
  const y = state.player.y + Math.sin(angle) * distance;

  state.enemies.push({
    x,
    y,
    radius,
    speed: randomBetween(type.speed[0], type.speed[1]) + state.wave.number * 3.5,
    hue: type.color + Math.random() * 12,
    health: randomBetween(type.health[0], type.health[1]),
    maxHealth: type.health[1],
    damage: type.damage,
    xpValue: type.xp,
    type: type.id,
  });

  return true;
}

function spawnParticles(x, y, color, count, speed = 180) {
  for (let i = 0; i < count; i += 1) {
    state.particles.push({
      x,
      y,
      vx: (Math.random() - 0.5) * speed,
      vy: (Math.random() - 0.5) * speed,
      life: 0.35 + Math.random() * 0.45,
      color,
    });
  }
}

function findNearestEnemy() {
  let nearestEnemy = null;
  let nearestDistance = Infinity;

  state.enemies.forEach((enemy) => {
    const distance = Math.hypot(enemy.x - state.player.x, enemy.y - state.player.y);
    if (distance < nearestDistance && distance < BULLET_RANGE) {
      nearestDistance = distance;
      nearestEnemy = enemy;
    }
  });

  return nearestEnemy;
}

function fireAtNearestEnemy() {
  const target = findNearestEnemy();
  if (!target) {
    return;
  }

  const baseAngle = Math.atan2(target.y - state.player.y, target.x - state.player.x);
  const spreadStep = 0.16;

  for (let i = 0; i < state.player.multishot; i += 1) {
    const spreadOffset = (i - (state.player.multishot - 1) / 2) * spreadStep;
    const angle = baseAngle + spreadOffset;

    state.bullets.push({
      x: state.player.x,
      y: state.player.y,
      vx: Math.cos(angle) * state.player.bulletSpeed,
      vy: Math.sin(angle) * state.player.bulletSpeed,
      radius: state.player.bulletRadius,
      damage: state.player.bulletDamage,
      life: 0.85,
    });
  }

  spawnParticles(state.player.x, state.player.y, getTheme().bulletColor, 4, 90);
}

function updatePlayer(delta) {
  let moveX = 0;
  let moveY = 0;

  if (keys.has("arrowup") || keys.has("w")) {
    moveY -= 1;
  }
  if (keys.has("arrowdown") || keys.has("s")) {
    moveY += 1;
  }
  if (keys.has("arrowleft") || keys.has("a")) {
    moveX -= 1;
  }
  if (keys.has("arrowright") || keys.has("d")) {
    moveX += 1;
  }

  const length = Math.hypot(moveX, moveY) || 1;
  state.player.x += (moveX / length) * state.player.speed * delta;
  state.player.y += (moveY / length) * state.player.speed * delta;

  state.player.fireCooldown -= delta;
  if (state.player.fireCooldown <= 0) {
    fireAtNearestEnemy();
    state.player.fireCooldown = state.player.fireInterval;
  }
}

function updateCamera(delta) {
  const follow = 1 - Math.exp(-delta * 10);
  state.camera.x += (state.player.x - state.camera.x) * follow;
  state.camera.y += (state.player.y - state.camera.y) * follow;
}

function updateBullets(delta) {
  state.bullets = state.bullets.filter((bullet) => bullet.life > 0);
  state.bullets.forEach((bullet) => {
    bullet.x += bullet.vx * delta;
    bullet.y += bullet.vy * delta;
    bullet.life -= delta;
  });
}

function updateEnemies(delta) {
  state.enemies.forEach((enemy) => {
    const dx = state.player.x - enemy.x;
    const dy = state.player.y - enemy.y;
    const length = Math.hypot(dx, dy) || 1;

    enemy.x += (dx / length) * enemy.speed * delta;
    enemy.y += (dy / length) * enemy.speed * delta;
  });
}

function grantXp(amount) {
  state.player.xp += amount;

  while (state.player.xp >= state.player.xpToNext) {
    state.player.xp -= state.player.xpToNext;
    state.player.level += 1;
    state.player.xpToNext += 3;
    showUpgradeOverlay();
  }

  updateHud();
}

function updateXpOrbs(delta) {
  state.xpOrbs = state.xpOrbs.filter((orb) => orb.life > 0);

  state.xpOrbs.forEach((orb) => {
    const dx = state.player.x - orb.x;
    const dy = state.player.y - orb.y;
    const distance = Math.hypot(dx, dy) || 1;

    if (distance < state.player.pickupRadius) {
      orb.x += (dx / distance) * 260 * delta;
      orb.y += (dy / distance) * 260 * delta;
    }

    orb.life -= delta;

    if (distance < state.player.radius + orb.radius + 6) {
      orb.life = 0;
      grantXp(orb.value);
      spawnParticles(orb.x, orb.y, getTheme().xpColor, 8, 120);
    }
  });
}

function killEnemy(enemyIndex) {
  const enemy = state.enemies[enemyIndex];
  if (!enemy) {
    return;
  }

  state.enemies.splice(enemyIndex, 1);
  state.kills += 1;
  state.score += 18 + enemy.xpValue * 6;
  spawnParticles(enemy.x, enemy.y, `hsl(${enemy.hue} 95% 60%)`, 14, 220);

  for (let i = 0; i < enemy.xpValue; i += 1) {
    state.xpOrbs.push({
      x: enemy.x + (Math.random() - 0.5) * 18,
      y: enemy.y + (Math.random() - 0.5) * 18,
      radius: 6,
      value: 1,
      life: 12,
    });
  }
}

function updateBulletHits() {
  for (let bulletIndex = state.bullets.length - 1; bulletIndex >= 0; bulletIndex -= 1) {
    const bullet = state.bullets[bulletIndex];

    for (let enemyIndex = state.enemies.length - 1; enemyIndex >= 0; enemyIndex -= 1) {
      const enemy = state.enemies[enemyIndex];
      const distance = Math.hypot(enemy.x - bullet.x, enemy.y - bullet.y);

      if (distance < enemy.radius + bullet.radius) {
        enemy.health -= bullet.damage;
        bullet.life = 0;
        spawnParticles(bullet.x, bullet.y, getTheme().hitColor, 4, 80);

        if (enemy.health <= 0) {
          killEnemy(enemyIndex);
        }

        break;
      }
    }
  }
}

function updateCollisions(delta) {
  if (state.enemyDamageCooldown > 0) {
    state.enemyDamageCooldown -= delta;
  }

  state.enemies.forEach((enemy) => {
    const distance = Math.hypot(state.player.x - enemy.x, state.player.y - enemy.y);
    const touching = distance < state.player.radius + enemy.radius;

    if (touching && state.enemyDamageCooldown <= 0) {
      state.player.health -= enemy.damage;
      state.enemyDamageCooldown = 0.45;
      spawnParticles(state.player.x, state.player.y, "#ff5a6b", 18, 210);
    }
  });

  if (state.player.health <= 0) {
    state.player.health = 0;
    endGame();
  }
}

function updateParticles(delta) {
  state.particles = state.particles.filter((particle) => particle.life > 0);
  state.particles.forEach((particle) => {
    particle.x += particle.vx * delta;
    particle.y += particle.vy * delta;
    particle.life -= delta;
  });
}

function updateWave(delta) {
  if (state.wave.inBreak) {
    state.wave.breakTimer -= delta;
    if (state.wave.breakTimer <= 0) {
      startWave(state.wave.number + 1);
    }
    return;
  }

  state.wave.timeRemaining -= delta;
  state.wave.spawnCooldown -= delta;

  if (
    state.wave.spawnCooldown <= 0 &&
    state.wave.spentBudget < state.wave.spawnBudget &&
    state.enemies.length < state.wave.maxConcurrent
  ) {
    const remainingBudget = state.wave.spawnBudget - state.wave.spentBudget;
    const nextEnemy = pickEnemyArchetype(remainingBudget);

    if (nextEnemy && spawnEnemy(nextEnemy)) {
      state.wave.spentBudget += nextEnemy.cost;
      state.wave.spawnCooldown = state.wave.spawnInterval;
    } else {
      state.wave.spentBudget = state.wave.spawnBudget;
    }
  }

  if (
    state.wave.timeRemaining <= 0 &&
    state.wave.spentBudget >= state.wave.spawnBudget &&
    state.enemies.length === 0
  ) {
    startWaveBreak();
  } else if (state.wave.timeRemaining <= 0) {
    statusText.textContent = `Hullam ${state.wave.number} vegfazis. Tisztitsd le a maradek ellenfeleket.`;
  }
}

function updateGame(delta) {
  if (!state.running) {
    return;
  }

  state.elapsed += delta;
  state.score += delta * 4;
  updateWave(delta);

  updatePlayer(delta);
  updateCamera(delta);
  updateBullets(delta);
  updateEnemies(delta);
  updateBulletHits();
  updateXpOrbs(delta);
  updateCollisions(delta);
  updateParticles(delta);
  updateHud();
}

function updateStarfield() {
  STARFIELD.stars.forEach((star) => {
    star.x += star.speedX;
    star.y += star.speedY;

    if (star.x < -10) star.x = STARFIELD.width + 10;
    if (star.x > STARFIELD.width + 10) star.x = -10;
    if (star.y < -10) star.y = STARFIELD.height + 10;
    if (star.y > STARFIELD.height + 10) star.y = -10;
  });
}

function renderStarfield(timestamp) {
  if (currentTheme === "battlefield") {
    renderBattlefieldSky(timestamp);
    return;
  }

  const pulse = (Math.sin(timestamp * 0.001) + 1) / 2;
  starfieldContext.clearRect(0, 0, STARFIELD.width, STARFIELD.height);

  const backgroundGradient = starfieldContext.createLinearGradient(0, 0, 0, STARFIELD.height);
  backgroundGradient.addColorStop(0, "#081421");
  backgroundGradient.addColorStop(0.55, "#0b1e2e");
  backgroundGradient.addColorStop(1, "#050b12");
  starfieldContext.fillStyle = backgroundGradient;
  starfieldContext.fillRect(0, 0, STARFIELD.width, STARFIELD.height);

  const glowGradient = starfieldContext.createRadialGradient(
    STARFIELD.width * 0.5,
    STARFIELD.height * 0.45,
    0,
    STARFIELD.width * 0.5,
    STARFIELD.height * 0.45,
    Math.max(STARFIELD.width, STARFIELD.height) * 0.55
  );
  glowGradient.addColorStop(0, "rgba(46, 114, 181, 0.22)");
  glowGradient.addColorStop(0.5, "rgba(18, 44, 70, 0.08)");
  glowGradient.addColorStop(1, "rgba(0, 0, 0, 0)");
  starfieldContext.fillStyle = glowGradient;
  starfieldContext.fillRect(0, 0, STARFIELD.width, STARFIELD.height);

  for (let i = 0; i < STARFIELD.stars.length; i += 1) {
    for (let j = i + 1; j < STARFIELD.stars.length; j += 1) {
      const a = STARFIELD.stars[i];
      const b = STARFIELD.stars[j];
      const distance = Math.hypot(a.x - b.x, a.y - b.y);

      if (distance < MAX_LINK_DISTANCE) {
        const midX = (a.x + b.x) / 2;
        const midY = (a.y + b.y) / 2;
        const pointerDistance = Math.hypot(midX - STARFIELD.pointer.x, midY - STARFIELD.pointer.y);
        const pointerGlow = STARFIELD.pointer.active ? clamp(1 - pointerDistance / 220, 0, 1) : 0.12;
        const opacity = clamp((1 - distance / MAX_LINK_DISTANCE) * 0.22 + pointerGlow * 0.32 + pulse * 0.04, 0.02, 0.42);

        starfieldContext.strokeStyle = `rgba(123, 224, 255, ${opacity})`;
        starfieldContext.lineWidth = 1;
        starfieldContext.beginPath();
        starfieldContext.moveTo(a.x, a.y);
        starfieldContext.lineTo(b.x, b.y);
        starfieldContext.stroke();
      }
    }
  }

  STARFIELD.stars.forEach((star) => {
    const pointerDistance = Math.hypot(star.x - STARFIELD.pointer.x, star.y - STARFIELD.pointer.y);
    const pointerGlow = STARFIELD.pointer.active ? clamp(1 - pointerDistance / 210, 0, 1) : 0.12;
    const radius = star.size + pointerGlow * 1.1 + pulse * 0.2;

    starfieldContext.fillStyle = `rgba(237, 244, 255, ${0.58 + pointerGlow * 0.34})`;
    starfieldContext.beginPath();
    starfieldContext.arc(star.x, star.y, radius, 0, Math.PI * 2);
    starfieldContext.fill();
  });
}

function renderBattlefieldSky(timestamp) {
  starfieldContext.clearRect(0, 0, STARFIELD.width, STARFIELD.height);

  const sky = starfieldContext.createLinearGradient(0, 0, 0, STARFIELD.height);
  sky.addColorStop(0, "#463726");
  sky.addColorStop(0.48, "#2d261f");
  sky.addColorStop(1, "#121519");
  starfieldContext.fillStyle = sky;
  starfieldContext.fillRect(0, 0, STARFIELD.width, STARFIELD.height);

  const haze = starfieldContext.createRadialGradient(
    STARFIELD.width * 0.58,
    STARFIELD.height * 0.3,
    0,
    STARFIELD.width * 0.58,
    STARFIELD.height * 0.3,
    STARFIELD.width * 0.5
  );
  haze.addColorStop(0, "rgba(255, 170, 84, 0.18)");
  haze.addColorStop(0.45, "rgba(174, 95, 36, 0.10)");
  haze.addColorStop(1, "rgba(0, 0, 0, 0)");
  starfieldContext.fillStyle = haze;
  starfieldContext.fillRect(0, 0, STARFIELD.width, STARFIELD.height);

  STARFIELD.stars.forEach((star, index) => {
    const drift = Math.sin(timestamp * 0.0007 + index) * 0.18;
    const radius = star.size * 0.9 + 0.5;
    starfieldContext.fillStyle = index % 5 === 0 ? "rgba(255, 190, 110, 0.45)" : "rgba(196, 187, 160, 0.22)";
    starfieldContext.beginPath();
    starfieldContext.ellipse(star.x, star.y, radius * 1.4, radius, drift, 0, Math.PI * 2);
    starfieldContext.fill();
  });
}

function drawArenaBackground() {
  context.clearRect(0, 0, ARENA.width, ARENA.height);
  const cameraOffset = getCameraOffset();

  if (currentTheme === "battlefield") {
    const dust = context.createLinearGradient(0, 0, 0, ARENA.height);
    dust.addColorStop(0, "rgba(255, 180, 92, 0.05)");
    dust.addColorStop(1, "rgba(0, 0, 0, 0.12)");
    context.fillStyle = dust;
    context.fillRect(0, 0, ARENA.width, ARENA.height);

    for (let i = 0; i < 5; i += 1) {
      const parallax = cameraOffset.x * (0.015 + i * 0.005);
      context.fillStyle = `rgba(40, 44, 33, ${0.14 + i * 0.02})`;
      context.beginPath();
      context.moveTo(-80 - parallax, ARENA.height - i * 18);
      context.lineTo(ARENA.width * 0.22 - parallax, ARENA.height - 55 - i * 12);
      context.lineTo(ARENA.width * 0.45 - parallax, ARENA.height - 22 - i * 15);
      context.lineTo(ARENA.width * 0.7 - parallax, ARENA.height - 60 - i * 10);
      context.lineTo(ARENA.width + 80 - parallax, ARENA.height - 24 - i * 14);
      context.lineTo(ARENA.width, ARENA.height);
      context.lineTo(0, ARENA.height);
      context.closePath();
      context.fill();
    }

    context.strokeStyle = "rgba(234, 210, 166, 0.04)";
    context.lineWidth = 1;
    const battlefieldOffset = ((cameraOffset.x % 52) + 52) % 52;
    for (let x = -battlefieldOffset; x < ARENA.width + 52; x += 52) {
      context.beginPath();
      context.moveTo(x, 0);
      context.lineTo(x, ARENA.height);
      context.stroke();
    }
    return;
  }

  context.strokeStyle = "rgba(255, 255, 255, 0.04)";
  context.lineWidth = 1;

  const gridOffsetX = ((cameraOffset.x % 40) + 40) % 40;
  const gridOffsetY = ((cameraOffset.y % 40) + 40) % 40;

  for (let x = -gridOffsetX; x < ARENA.width + 40; x += 40) {
    context.beginPath();
    context.moveTo(x, 0);
    context.lineTo(x, ARENA.height);
    context.stroke();
  }

  for (let y = -gridOffsetY; y < ARENA.height + 40; y += 40) {
    context.beginPath();
    context.moveTo(0, y);
    context.lineTo(ARENA.width, y);
    context.stroke();
  }

  context.beginPath();
  context.arc(toScreenX(0), toScreenY(0), 210, 0, Math.PI * 2);
  context.strokeStyle = "rgba(114, 241, 184, 0.12)";
  context.lineWidth = 10;
  context.stroke();
}

function drawPlayer() {
  if (currentTheme === "battlefield") {
    drawBattlefieldPlayer();
    return;
  }

  const playerX = toScreenX(state.player.x);
  const playerY = toScreenY(state.player.y);
  context.beginPath();
  context.arc(playerX, playerY, state.player.radius, 0, Math.PI * 2);
  context.fillStyle = "#72f1b8";
  context.shadowBlur = 16;
  context.shadowColor = "#72f1b8";
  context.fill();
  context.shadowBlur = 0;
}

function drawBattlefieldPlayer() {
  const target = findNearestEnemy();
  const angle = target ? Math.atan2(target.y - state.player.y, target.x - state.player.x) : 0;
  const playerX = toScreenX(state.player.x);
  const playerY = toScreenY(state.player.y);

  context.save();
  context.translate(playerX, playerY);
  context.rotate(angle);
  context.fillStyle = "#d7dfcf";
  context.fillRect(-8, -6, 12, 16);
  context.fillStyle = "#6f8f5e";
  context.fillRect(-10, -10, 14, 8);
  context.fillStyle = "#2f342a";
  context.fillRect(2, -2, 18, 4);
  context.fillStyle = "#e6d2b3";
  context.beginPath();
  context.arc(-2, -12, 5, 0, Math.PI * 2);
  context.fill();
  context.restore();

  context.beginPath();
  context.arc(playerX, playerY, state.player.radius + 4, 0, Math.PI * 2);
  context.strokeStyle = "rgba(158, 211, 138, 0.18)";
  context.lineWidth = 2;
  context.stroke();
}

function drawBullets() {
  state.bullets.forEach((bullet) => {
    if (!isOnScreen(bullet.x, bullet.y, 40)) {
      return;
    }

    const bulletX = toScreenX(bullet.x);
    const bulletY = toScreenY(bullet.y);
    if (currentTheme === "battlefield") {
      context.strokeStyle = getTheme().bulletColor;
      context.lineWidth = 2.5;
      context.beginPath();
      context.moveTo(bulletX, bulletY);
      context.lineTo(bulletX - bullet.vx * 0.02, bulletY - bullet.vy * 0.02);
      context.stroke();
    } else {
      context.beginPath();
      context.arc(bulletX, bulletY, bullet.radius, 0, Math.PI * 2);
      context.fillStyle = getTheme().bulletColor;
      context.shadowBlur = 10;
      context.shadowColor = getTheme().bulletColor;
      context.fill();
      context.shadowBlur = 0;
    }
  });
}

function drawXpOrbs() {
  state.xpOrbs.forEach((orb) => {
    if (!isOnScreen(orb.x, orb.y, 50)) {
      return;
    }

    const orbX = toScreenX(orb.x);
    const orbY = toScreenY(orb.y);
    if (currentTheme === "battlefield") {
      context.save();
      context.translate(orbX, orbY);
      context.rotate(Math.PI / 4);
      context.fillStyle = getTheme().xpColor;
      context.fillRect(-5, -5, 10, 10);
      context.restore();
    } else {
      context.beginPath();
      context.arc(orbX, orbY, orb.radius, 0, Math.PI * 2);
      context.fillStyle = getTheme().xpColor;
      context.shadowBlur = 12;
      context.shadowColor = getTheme().xpColor;
      context.fill();
      context.shadowBlur = 0;
    }
  });
}

function drawEnemies() {
  state.enemies.forEach((enemy) => {
    if (!isOnScreen(enemy.x, enemy.y, enemy.radius + 40)) {
      return;
    }

    if (currentTheme === "battlefield") {
      drawBattlefieldEnemy(enemy);
    } else {
      const enemyX = toScreenX(enemy.x);
      const enemyY = toScreenY(enemy.y);
      context.beginPath();
      context.arc(enemyX, enemyY, enemy.radius, 0, Math.PI * 2);
      context.fillStyle = `hsl(${enemy.hue} 95% 60%)`;
      context.shadowBlur = 14;
      context.shadowColor = "rgba(255, 96, 96, 0.85)";
      context.fill();
      context.shadowBlur = 0;
    }

    drawEnemyHealth(enemy);
  });
}

function drawBattlefieldEnemy(enemy) {
  const enemyX = toScreenX(enemy.x);
  const enemyY = toScreenY(enemy.y);

  if (enemy.type === "sprinter") {
    context.save();
    context.translate(enemyX, enemyY);
    context.rotate(Date.now() * 0.006);
    context.fillStyle = "#8c98a0";
    context.beginPath();
    context.moveTo(0, -enemy.radius);
    context.lineTo(enemy.radius * 0.8, 0);
    context.lineTo(0, enemy.radius);
    context.lineTo(-enemy.radius * 0.8, 0);
    context.closePath();
    context.fill();
    context.strokeStyle = "#ff736a";
    context.lineWidth = 2;
    context.beginPath();
    context.moveTo(-enemy.radius, 0);
    context.lineTo(enemy.radius, 0);
    context.moveTo(0, -enemy.radius);
    context.lineTo(0, enemy.radius);
    context.stroke();
    context.restore();
    return;
  }

  if (enemy.type === "brute") {
    context.save();
    context.translate(enemyX, enemyY);
    context.fillStyle = "#7f735e";
    context.fillRect(-enemy.radius, -enemy.radius * 0.6, enemy.radius * 2, enemy.radius * 1.2);
    context.fillStyle = "#4c4438";
    context.fillRect(-enemy.radius * 0.45, -enemy.radius * 0.95, enemy.radius * 0.9, enemy.radius * 0.55);
    context.fillRect(enemy.radius * 0.1, -enemy.radius * 0.18, enemy.radius * 1.2, enemy.radius * 0.16);
    context.strokeStyle = "#2f2b26";
    context.lineWidth = 4;
    context.beginPath();
    context.moveTo(-enemy.radius * 0.9, enemy.radius * 0.7);
    context.lineTo(enemy.radius * 0.9, enemy.radius * 0.7);
    context.moveTo(-enemy.radius * 0.9, -enemy.radius * 0.7);
    context.lineTo(enemy.radius * 0.9, -enemy.radius * 0.7);
    context.stroke();
    context.restore();
    return;
  }

  context.save();
  context.translate(enemyX, enemyY);
  context.fillStyle = "#b49e82";
  context.fillRect(-enemy.radius * 0.45, -enemy.radius * 0.22, enemy.radius * 0.9, enemy.radius * 1.1);
  context.fillStyle = "#5f6c48";
  context.fillRect(-enemy.radius * 0.48, -enemy.radius * 0.8, enemy.radius * 0.96, enemy.radius * 0.42);
  context.fillStyle = "#e3c9ab";
  context.beginPath();
  context.arc(0, -enemy.radius * 0.95, enemy.radius * 0.28, 0, Math.PI * 2);
  context.fill();
  context.restore();
}

function drawEnemyHealth(enemy) {
  const enemyX = toScreenX(enemy.x);
  const enemyY = toScreenY(enemy.y);
  const healthWidth = enemy.radius * 2;
  const healthRatio = clamp(enemy.health / enemy.maxHealth, 0, 1);
  context.fillStyle = "rgba(255,255,255,0.12)";
  context.fillRect(enemyX - enemy.radius, enemyY - enemy.radius - 12, healthWidth, 4);
  context.fillStyle = currentTheme === "battlefield" ? "#e2b86c" : "#ffd447";
  context.fillRect(enemyX - enemy.radius, enemyY - enemy.radius - 12, healthWidth * healthRatio, 4);
}

function drawParticles() {
  state.particles.forEach((particle) => {
    if (!isOnScreen(particle.x, particle.y, 30)) {
      return;
    }

    context.globalAlpha = Math.max(0, particle.life);
    context.fillStyle = particle.color;
    context.fillRect(toScreenX(particle.x), toScreenY(particle.y), 4, 4);
  });
  context.globalAlpha = 1;
}

function drawHealthRing() {
  const ratio = state.player.health / state.player.maxHealth;

  context.beginPath();
  context.arc(90, 90, 48, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * ratio);
  context.strokeStyle = ratio > 0.35 ? "#72f1b8" : "#ff5a6b";
  context.lineWidth = 10;
  context.stroke();

  context.beginPath();
  context.arc(90, 90, 48, 0, Math.PI * 2);
  context.strokeStyle = "rgba(255,255,255,0.12)";
  context.lineWidth = 10;
  context.stroke();

  context.fillStyle = currentTheme === "battlefield" ? "#f0e6d2" : "#eff7ff";
  context.font = "700 20px Trebuchet MS";
  context.textAlign = "center";
  context.fillText(`${Math.ceil(state.player.health)}`, 90, 97);
}

function drawWeaponInfo() {
  const infoX = 28;
  const infoY = 162;

  context.textAlign = "left";
  context.fillStyle = currentTheme === "battlefield" ? "rgba(240, 230, 210, 0.96)" : "rgba(239, 247, 255, 0.92)";
  context.font = "700 16px Trebuchet MS";
  context.fillText(`Szint ${state.player.level}`, infoX, infoY);
  context.fillStyle = getTheme().hudAccent;
  context.font = "14px Trebuchet MS";
  context.fillText(`Loves: ${state.player.multishot} | Sebzes: ${state.player.bulletDamage}`, infoX, infoY + 22);
}

function render() {
  drawArenaBackground();
  drawHealthRing();
  drawWeaponInfo();
  drawXpOrbs();
  drawEnemies();
  drawBullets();
  drawPlayer();
  drawParticles();

  if (!state.running && !state.gameOver && !state.upgradeMode) {
    context.fillStyle = "rgba(239, 247, 255, 0.9)";
    context.font = "700 34px Trebuchet MS";
    context.textAlign = "center";
    context.fillText("Nyomd meg a Jatek inditasa gombot", ARENA.width / 2, ARENA.height / 2 - 10);
    context.font = "18px Trebuchet MS";
    context.fillStyle = "rgba(159, 192, 216, 0.9)";
    context.fillText("Mozgas: WASD vagy nyilak | Tuzeles: automatikus", ARENA.width / 2, ARENA.height / 2 + 26);
  }

  if (state.running && state.wave.inBreak) {
    context.fillStyle = "rgba(239, 247, 255, 0.92)";
    context.font = "700 28px Trebuchet MS";
    context.textAlign = "center";
    context.fillText(`Hullam ${state.wave.number} vege`, ARENA.width / 2, 64);
    context.font = "16px Trebuchet MS";
    context.fillStyle = "rgba(159, 192, 216, 0.95)";
    context.fillText(`Kovetkezo hullam: ${state.wave.breakTimer.toFixed(1)} mp`, ARENA.width / 2, 88);
  }
}

function loop(timestamp) {
  if (!lastTimestamp) {
    lastTimestamp = timestamp;
  }

  const delta = Math.min(0.032, (timestamp - lastTimestamp) / 1000);
  lastTimestamp = timestamp;

  updateStarfield();
  updateGame(delta);
  renderStarfield(timestamp);
  render();
  requestAnimationFrame(loop);
}

starfieldCanvas.addEventListener("mousemove", (event) => {
  const bounds = starfieldCanvas.getBoundingClientRect();
  STARFIELD.pointer.x = event.clientX - bounds.left;
  STARFIELD.pointer.y = event.clientY - bounds.top;
  STARFIELD.pointer.active = true;
});

starfieldCanvas.addEventListener("mouseleave", () => {
  STARFIELD.pointer.active = false;
});

themeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    applyTheme(button.dataset.theme);
    statusText.textContent = button.dataset.theme === "battlefield"
      ? "Battlefield tema aktiv. Katona, drone es tank ellenfelek varnak."
      : "Neon Arena tema aktiv. Visszatert a futurisztikus csillagmezo.";
  });
});

playerNameInput.addEventListener("change", savePlayerName);
playerNameInput.addEventListener("blur", savePlayerName);

window.addEventListener("keydown", (event) => {
  keys.add(event.key.toLowerCase());
});

window.addEventListener("keyup", (event) => {
  keys.delete(event.key.toLowerCase());
});

window.addEventListener("resize", handleResize);

startButton.addEventListener("click", startGame);
restartButton.addEventListener("click", startGame);

clearOverlay();
applyTheme(currentTheme);
playerNameInput.value = (localStorage.getItem(playerNameKey) || "").slice(0, 16);
renderLeaderboard();
handleResize();
updateHud();
requestAnimationFrame(loop);
