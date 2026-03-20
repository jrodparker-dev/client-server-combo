# AI Battle Trainer

This server now keeps the shared battle AI "brain" on the **server**, not in the browser.

## Where the AI brain lives

- Brain file: `server/config/ai-battle-brain.json`
- Runtime learner: every finished battle on the server feeds its replay log into the shared brain automatically.
- Trainer command: `npm run train-ai-brain -- <replay-folder>`

## What it learns

The current brain stores matchup knowledge such as:

- moves that repeatedly did no damage into a species
- ability-based immunities that were revealed in battle, such as `Wind Rider`
- whether a move tended to be resisted or super effective into a species
- rough damage samples from replay logs
- revealed abilities by species

That knowledge is used live by the server AI so it can stop repeating obviously bad plays.
For example:

- if `Hurricane` gets blocked by `Wind Rider`, that move is heavily penalized immediately on the next choice
- if `Eruption` is weak because the user is low HP, the AI now scores it using its reduced power
- variable-power moves such as `Heavy Slam`, `Heat Crash`, `Grass Knot`, and `Low Kick` are now scored more realistically

## Training from replay files

### 1. Create a replay folder

You can use any folder, but the default expected folder is:

```bash
server/replays/ai-training
```

### 2. Drop replay files into that folder

Supported input files:

- replay HTML exports
- JSON replay/log files that contain a `log`
- plain text battle logs
- `.log` files

### 3. Run the trainer

From the `server/` directory:

```bash
npm run train-ai-brain -- replays/ai-training
```

Or from anywhere with the explicit CLI:

```bash
node pokemon-showdown train-ai-brain replays/ai-training
```

If you omit the folder, it defaults to `replays/ai-training`.

## Output

After training finishes, you will get:

- an updated brain at `config/ai-battle-brain.json`
- a summary report at `<replay-folder>/ai-battle-training-report.json`

The report includes:

- how many files were processed
- how many battles were learned from
- how many move uses were sampled
- how many immunity samples were found
- how many damage samples were found

## Ongoing server learning

You do **not** need to rerun the trainer for normal live-server learning.

Every completed battle already contributes replay-log data to the same shared brain file, so the AI can improve from battles played by anyone on the server.

Use the trainer command when you want to bulk-import old replays or external replay files.

## Recommended workflow

1. Start the server normally.
2. Let live battles keep updating `config/ai-battle-brain.json`.
3. Drop archived replays into `replays/ai-training` whenever you want to backfill knowledge.
4. Run `npm run train-ai-brain -- replays/ai-training`.
5. Keep the generated brain file under version control or back it up if you want a persistent learned state.
