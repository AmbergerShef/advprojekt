export class Renderer {
  constructor(canvas, world, patterns, camera) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d", { alpha: false });
    this.world = world;
    this.patterns = patterns;
    this.camera = camera;

    this.resize(canvas.width, canvas.height);
  }

  resize(width, height) {
    this.canvas.width = width;
    this.canvas.height = height;
    this.width = width;
    this.height = height;
    this.camera.viewWidth = width;
    this.camera.viewHeight = height;
  }

  clear() {
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.ctx.fillStyle = "#1a1f24";
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  drawStaticBackground() {
    const scale = this.camera.zoom;
    const sx = Math.floor(this.camera.x);
    const sy = Math.floor(this.camera.z);
    const sw = Math.ceil(this.width / scale);
    const sh = Math.ceil(this.height / scale);

    this.ctx.save();
    this.ctx.imageSmoothingEnabled = false;
    this.ctx.drawImage(
      this.world.staticCanvas,
      sx,
      sy,
      sw,
      sh,
      0,
      0,
      this.width,
      this.height
    );
    this.ctx.restore();
  }

  drawVisibleBuildings(playerState, interiorState) {
    const cameraRect = this.camera.getWorldRect();
    const visibleBuildings = this.world.getVisibleBuildings(cameraRect);

    for (const building of visibleBuildings) {
      const hiddenRoof = interiorState?.building?.id === building.id && interiorState.inside;
      if (!hiddenRoof) {
        building.renderRoof(this.ctx, this.camera, this.patterns, false);
      }
      building.renderWalls(this.ctx, this.camera, this.patterns);
    }

    if (interiorState?.inside && interiorState.building) {
      const { building, floor } = interiorState;
      building.renderInterior(this.ctx, this.camera, floor.level, this.patterns, 1);
    }
  }

  drawPlayer(player) {
    const px = (player.x - this.camera.x) * this.camera.zoom;
    const pz = (player.z - this.camera.z) * this.camera.zoom;
    const size = player.size * this.camera.zoom;

    this.ctx.save();
    this.ctx.fillStyle = "#fcfcfb";
    this.ctx.strokeStyle = "#2a2a2a";
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.arc(px, pz, size * 0.5, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.stroke();

    this.ctx.fillStyle = "rgba(245,105,105,0.48)";
    this.ctx.fillRect(px - size * 0.25, pz - size * 0.5, size * 0.5, size);
    this.ctx.restore();
  }

  render(playerState, interiorState) {
    this.clear();
    this.drawStaticBackground();
    this.drawVisibleBuildings(playerState, interiorState);
    this.drawPlayer(playerState);
  }
}
