import fs from "fs";

function tryLoad(path) {
  try {
    return await import(path);
  } catch (e) {
    return null;
  }
}

async function main() {
  // Try common PS module locations across versions/builds.
  const candidates = [
    ["pokedex", "./dist/data/pokedex.js", "Pokedex"],
    ["moves", "./dist/data/moves.js", "Moves"],
    ["abilities", "./dist/data/abilities.js", "Abilities"],
    ["pokedex", "./data/pokedex.js", "Pokedex"],
    ["moves", "./data/moves.js", "Moves"],
    ["abilities", "./data/abilities.js", "Abilities"],
  ];

  const out = {};

  for (const [key, path, exportName] of candidates) {
    if (out[key]) continue;
    const mod = await tryLoad(path);
    if (mod && mod[exportName]) out[key] = mod[exportName];
  }

  if (!out.pokedex || !out.moves || !out.abilities) {
    console.log("Could not find compiled JS data modules.");
    console.log("This usually means you haven't built PS to /dist yet.");
    console.log("Fix: run `node build` (or `npm run build`) in PS root, then rerun this script.");
    process.exit(1);
  }

  fs.writeFileSync("pokedex.json", JSON.stringify(out.pokedex));
  fs.writeFileSync("moves.json", JSON.stringify(out.moves));
  fs.writeFileSync("abilities.json", JSON.stringify(out.abilities));

  console.log("Wrote: pokedex.json, moves.json, abilities.json");
}

main();
