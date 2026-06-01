# `jatekv2` Webes GTA-szerű játékterv

## Összefoglaló
A `jatekv2` egy böngészőben futó, egyjátékos, GTA-hangulatú minijáték. A fókusz nem a teljes open world méret, hanem egy kis városi játszótér, ahol a játékos szabadon mozoghat, autót és motort vezethet, NPC-kkel találkozhat, pénzt kereshet, fegyvert válthat, és néhány rövid küldetést teljesíthet.

## Játékkoncepció
- Nézet: könnyű, pseudo-3D városi felülnézet, erős perspektivikus hangulattal.
- Cél: pénz és reputáció gyűjtése három rövid küldetésláncon keresztül.
- Fő loop: felfedezés -> interakció -> küldetés -> pénzszerzés -> vásárlás -> újabb küldetés.
- Hangulat: utcai sandbox, de rövid sessionökre optimalizálva.

## Világ és szereplők
- A pálya egy kompakt városrész utakból, épületekből, parkból, boltból és küldetési pontokból áll.
- A játékos gyalog indul, majd bármikor járműbe szállhat.
- A városban férfi és női NPC-k vegyesen jelennek meg járókelőként, boltosként és küldetésadóként.
- Az NPC-k alapjáraton sétálnak, veszély esetén szétszélednek, és küldetési státusztól függően megszólíthatók.

## Core Mechanics
- Gyalogos mozgás `WASD` vagy nyilakkal.
- Interakció `E` gombbal: beszélgetés, küldetésfelvétel, járműbe szállás, bolt használata.
- Lövés `F`, fegyverváltás `1` és `2`.
- Járművek:
  - legalább 1 autó
  - legalább 1 motor
  - eltérő sebesség és irányítás
- Fegyverek:
  - pisztoly: gyorsabb, gyengébb
  - shotgun: lassabb, erősebb közelre
- Pénzrendszer:
  - küldetésjutalom
  - eldobott pénzkötegek felvétele
  - boltban költés lőszerre és életerőre
- Egyszerű fenyegetettségi rendszer:
  - lövöldözés és gázolás növeli a heat szintet
  - magasabb heat esetén üldöző ellenségek jelennek meg
- Halál és visszatérés:
  - a játékos respawnol a safehouse ponton
  - pénzbüntetést kap
  - a heat visszaesik

## Küldetések
1. `Street Pickup`
Gyűjts össze három pénzcsomagot a blokkon belül.

2. `Courier Run`
Szállj be a motorba és érj el egy kijelölt pontot időn belül.

3. `Heat Wave`
Szerezd vissza a lopott táskát, miközben üldöző ellenfeleket kell leszedni vagy lerázni.

## UI és HUD
- Bal oldali panel:
  - rövid leírás
  - vezérlés
  - küldetéslista
  - shop infó
- Felső HUD:
  - élet
  - pénz
  - aktív fegyver
  - lőszer
  - heat
  - aktív jármű
- Alsó státusz:
  - rövid üzenetek
  - küldetés progress
- Visszalink a hubra.

## Technikai architektúra
- `index.html`: UI váz és canvas.
- `style.css`: dashboard + városi neon/noir megjelenés.
- `script.js`: teljes játéklogika, render, input és küldetéskezelés.
- Stack: natív HTML, CSS, JavaScript, Canvas API.
- A pseudo-3D hatást egyszerű árnyékok, épületmagasságok és kameraeltolás adják.

## Hub-integráció
- A root hub új kártyát kap a játékhoz.
- A build script a `jatekv2` mappát új statikus appként másolja a `dist/apps/` alá.
- A játék közvetlenül megnyitható a portfólió főoldaláról.

## Elfogadási feltételek
- A játék betöltődik hibamentesen böngészőben.
- A játékos tud gyalog mozogni.
- Használható legalább 1 autó és 1 motor.
- Működik legalább 2 fegyver.
- Az NPC-k mozognak vagy reagálnak.
- A pénz gyűjthető és elkölthető.
- Teljesíthető legalább 3 küldetés.
- A hubból elérhető és vissza is lehet lépni oda.

## Alapértelmezett döntések
- Nincs multiplayer.
- Az első verzió kis pályát használ.
- A GTA-szerűség hangulatot és rendszereket jelent, nem másolatot.
- A női karakterek egyenrangú civil és történeti szereplők.
- A teljesítmény és játszhatóság fontosabb a teljes 3D realizmusnál.
