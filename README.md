# Dice Den

A back-room dice roguelike in the browser. Roll seven dice, pick up to five that make a hand, chain the rest to the table, and beat the target before your throws run out. Between rounds you buy relics, charms, seals and house rules that bend the scoring, with bosses every fifth round and a seeded daily challenge with an online board.

**Play it:** https://aneonago.github.io/dice-den/ (no account, no install, phone or desktop)

**Codex:** https://aneonago.github.io/dice-den/codex.html lists every relic, set, hand, card, boss and rule.

## Beta testing

It is in open beta. The most useful feedback is:

- Anything confusing in the first ten minutes.
- Relics, sets or deals that feel far too strong or never worth buying.
- Bugs: what you did, what happened, and the seed from Settings or the run summary so it can be replayed.
- How it runs on your phone (3D dice on or off).

Report it under **Issues** on this repo, or wherever you found the link. Top of the daily board? The run summary lets you ask for an addition to the game.

## Running it yourself

Everything is in `game.html`. Serve the folder over HTTP (for example `npx http-server -p 5173 -c-1`) and open `/game.html`; opening the file directly works too but some browsers block saving there.

## Credits

- Dice, chip and card art and sounds: [Kenney Boardgame Pack](https://kenney.nl), CC0 (see `art/kenney/LICENSE-Kenney-CC0.txt`).
- Fonts: Cinzel and Inter, SIL Open Font License.
- Three.js for the optional 3D dice.
