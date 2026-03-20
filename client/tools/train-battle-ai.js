#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const targetDir = process.argv[2] || 'ai-training';
const resolvedDir = path.resolve(process.cwd(), targetDir);
const compiledPath = path.resolve(__dirname, '../play.pokemonshowdown.com/js/battle-ai.js');

if (!fs.existsSync(compiledPath)) {
	console.error('Missing compiled Battle AI logic. Run `node build` first.');
	process.exit(1);
}
if (!fs.existsSync(resolvedDir)) {
	console.error(`Training directory not found: ${resolvedDir}`);
	process.exit(1);
}

require(compiledPath);
const trainer = new global.BattleAITrainingProgram();
const files = fs.readdirSync(resolvedDir)
	.filter(file => file.toLowerCase().endsWith('.html'))
	.map(file => ({
		filename: file,
		contents: fs.readFileSync(path.join(resolvedDir, file), 'utf8'),
	}));

const result = trainer.trainFromFiles(files);
const outputPath = path.join(resolvedDir, 'battle-ai-training-report.json');
fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));
console.log(`Processed ${files.length} HTML file(s).`);
console.log(`Report written to ${outputPath}`);
console.log(JSON.stringify(result.stats, null, 2));
