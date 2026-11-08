# Dice Den patch notes

Every player-visible change, newest first. Play at https://aneonago.github.io/dice-den/, https://diceden.web.app, https://algebraarchive.web.app, https://chancetheory.web.app, https://theoddsindex.web.app or https://samplespace.web.app (the same game everywhere).

## 2026-11-08: Scores with no ceiling, and three leaderboards

- Scores no longer stop at 1e300: a throw, a round and a whole run now count as high as your build goes, shown in e notation (8.73e+1374). Deep endless targets keep climbing with them, so there is no wall any more. Nothing changes for scores below 1e300.
- **High Scores** now ranks three ways: **Rounds cleared** (the default), **Best throw** and **Total score**, on the all-time and daily boards, for Best per player and Every run alike. The column you rank by is highlighted.
- Runs now post how many rounds they cleared, and your best throw and best total are kept on the boards apart from your best run.

## 2026-11-08: Score cap and a Duet fix

- Scores now top out at 1e300 (a 1 with 300 zeros) for a throw, a round and a run. A big enough build could pass the largest number the game can hold and score "Infinity", which then vanished on a reload: the round score, the run total and your best throw were lost, and the run could not be posted. Targets stop at 1e305, so in deep endless the den eventually becomes a wall nobody can clear.
- **Duet** now does what it says: when you score Twins, only the two Twins dice score 2 extra times. It used to give every scored die the extra times, Wingman dice and Spillover extras included.

## 2026-11-08: Four engine relics

- New Legendary relics, each a different road to huge scores (until now the only one was per-die multipliers like The Gilded Throne with Wingman dice):
  - **Echo Chamber**: ×1.1 mult every time a die scores again (Red Seal, Twin Set, Double Take, Arrow faces...).
  - **The Grand Ledger**: ×1.1 mult for every level of the hand you score.
  - **Compound Interest**: ×(1 + your money / 100) mult, and every round you clear pays 10% interest on your money with no cap. It rewards saving instead of spending.
  - **Iron Curtain**: ×1.2 mult for every thrown die you do not score, so big tables pay.
  - Upgraded, each one grows faster.

## 2026-11-08: Four new dice sets

- **Fortune Teller's Set**: start with 3 Arcana cards and 2 more Arcana slots, get an Arcana card every round you clear, and Arcana in the shop cost half. Unlock: use 10 Arcana cards in one run.
- **Bounty Hunter Set**: every third round is a boss round, and each boss pays $10 and a relic. On the dice screen you can ban up to 2 bosses so they never show up in these runs. Unlock: beat 6 bosses in one run.
- **Living Set**: every die is a Living die, so the faces you keep scoring grow and their opposites shrink. Unlock: grow a Living die's face to 12.
- **Mirror Set**: face 1 of every die is a Mirror face, so a low roll copies the most common number instead. Unlock: score the Funhouse face set.
- **Tutorial**: choosing **Keep playing** at the end now gives the practice run a starter kit, so you see sets and upgrades working:
  - a merged relic set (Triple Threat and Pair Bond become Full Table) and Sixer;
  - a Spark die, a Golden die, a Gold Seal, a Mult face and a Star face;
  - Triplets at level 2 and $15.
  - It is still practice: never saved and never on the boards.

## 2026-11-07: Face sets for the new faces, more achievements, Rules tab and table fixes

- **Five new face sets**:
  - **Funhouse**: 3+ Mirror faces, ×2 mult.
  - **Deep Freeze**: 3+ Ice faces, +50 chips.
  - **Fireworks**: 3+ Bomb faces, +100 chips.
  - **Volley**: 3+ Arrow faces, +10 mult.
  - **Arcade**: a Mirror, Ice, Bomb and Arrow face in one throw, ×3 mult.
  - Like the others, each grows with every extra matching die.
- **12 more achievements**, from Hot Streak (High-Low) and Point Made (Craps) to Face Collector, Grand Master, Natural 20 and the very hard Dawn Patrol.
- **Achievements are easier to find**:
  - The main menu shows your count and the next ones to go for, right above Continue.
  - The in-run menu has an **Achievements** tab.
  - The run summary lists the ones you earned that run.
- **Rules tab**:
  - Mult, Gold, Star and Heart now show as real dice, not plain coloured squares.
  - Face descriptions no longer break one word per line.
  - It now covers every gaming table (High-Low, Craps and the Prize Wheel too), curses, the Whale and modifiers.
- **Gaming tables**:
  - The money, the "This visit" total and the result line now wait until the dice or reels land, instead of giving the result away while they are still rolling.
  - The tables, the Rules tab and the Codex no longer quote house edge or payout percentages.
- Fixed: The Carver and The Engraver could set a die to a face it doesn't have.

## 2026-11-07: Balance fixes

- **Bloodstone Set**: blood sacrifice now works three times a run at most. With Cloning Vat or enough Dice Packs it could save you forever.
- **Glass Set**: glass breaks only 1 in 16 each time a die scores, all run (1 in 8 everywhere else).
- **Beat the House is much harder**: end up $500 ahead on bets and gaming tables in a single run, counting everything you staked.
  - Before, it counted only wins, across all your runs, so losses never set you back.
- **Charmed Set**: the gaming tables no longer pay it 10% more (with that bonus every table paid out more than it took in, so a run could farm money forever). Instead, the Prize Wheel never takes a relic in Charmed runs.
- **The Reaper**: its multiplier now stops at ×2 (×3 upgraded). It used to grow forever and was by far the strongest relic.
- **Abacus**: +1 mult for each different number on the table (was +2). It was too strong for a Common.
- **Iron Nerve** no longer counts with the Steel Set, which starts with no rerolls.

## 2026-11-07: Glass, Bloodstone and Marble

- **Glass Set**: glass breaks again (1 in 8 each time a die scores), and you no longer start with Glass Cutter.
  - With unbreakable glass it was by far the strongest set.
  - Finding Glass Cutter in a run now makes it unbreakable.
- **Bloodstone Set reworked**: fall short of a target and your weakest die is sacrificed instead, and the run goes on, as long as you have more than 5 dice. Every die you add is another life.
  - The old blood debt cost money that was better spent in the shop.
- **Marble Set** keeps its power but is harder to unlock: win a run while owning 12 or more special faces.

## 2026-11-07: Sets that change the rules, very hard achievements, achievement pop-ups

- **Achievements are easier to see.**
  - Earning one now shows a big banner at the top of the screen; the very hard ones are pink.
  - The main menu has an **Achievements** tile that lists them all with your progress.
- **Nine very hard achievements**: Beat the House, Den Legend, Flawless, Iron Nerve, Travel Light, Trillionaire, Globetrotter, Shape Master and Full Collection.
- **New: Charmed Set.** Luck is on your side all run.
  - Every chance is twice as likely, bets have no house edge, Mystery Relics never come up empty, and the gaming tables pay 10% more.
  - Unlocks with **Beat the House**: win $2,500 from bets and gaming tables, counted across all your runs.
- **Sets that only handed out dice bonuses now change the rules instead:**
  - **Ember**: each throw in a round is hotter than the last (×1.5, then ×2 and so on), with 6 dice.
  - **Bloodstone**: fall short and you can pay $3 per round number to stay at the table. The price doubles each time.
  - **Twin**: every die you score scores twice, with up to 4 dice per throw.
  - **Watchmaker**: each throw you have left when you clear a round adds +4 mult to every throw of the next round.
  - **Clover**: every fourth throw you score is ×2.
  - **Onyx**: the last throw of each round is ×3, and the first is ×0.5.
  - **Sapphire**: every third time you score a hand, it levels up.
  - **Bullion**: everything in the shop costs a quarter less.
  - **Steel**: every throw is ×1.5, but you start with no rerolls.
  - **Carnival**: a carnival prize every round you clear.
- **Wild Set buffed**: you can now score up to 4 dice per throw (it was 3, with a 4th throw).
- **Marble Set**: no more limit on the chips its dice gain, but Trail Marker never shows up in Marble runs.
- **Clockwork Charm buffed** back up: +2 mult for every throw in a row, up to +10.
- **Dice screen tabs** are now All sets, Unlocked and Shapes.
- The Fat Wallet achievement added earlier today shared its name with an older one (Deep Pockets); it is now called **Fat Cat**.
- Fixed: the Marble Set's description in the game was out of date.

## 2026-11-07: New dice screen, shape sets, reward sets

- **A cleaner dice screen.** Every set is a tile, with tabs for Classic, Shapes, Hard and Rewards. Pick one to see what it does and how to unlock it.
  - Difficulty, stake and modifiers sit beside it, each saying what a win there unlocks. Then press **Start run**.
  - Modifiers are folded away until you open them. The game remembers the last set you played.
- **Shape sets are back, done properly.** Every die in the run is the same shape, and only the dice set decides it. Every die you gain in that run (Dice Packs, the shop and the rest) comes in that shape too.
  - **Caltrop Set**: d4s, with +2 mult each. Unlocks at round 8.
  - **Prism Set**: d8s. Unlocks at round 12.
  - **Percentile Set**: d10s, a new shape. Unlocks at round 16.
  - **Zodiac Set**: d12s. Unlocks by winning a run.
  - **Critical Set**: d20s; a natural 20 doubles the mult and a natural 1 halves it. Unlocks at round 20 with a shape set.
  - Hands use the real numbers; nothing counts as a 6 any more.
  - The dice take their set's colours in 2D and 3D, so they match the rest of the den.
  - Each set's targets are adjusted so it plays fairly. Each one says by how much.
- **Stakes, difficulties and modifiers now earn things.**
  - **Clover Set**: every die has a Green Seal. Win on the Green stake.
  - **Onyx Set**: three Black Seals. Win on the Black stake.
  - **Sapphire Set**: three Blue Seals. Win on the Blue stake.
  - **Bullion Set**: two Gold Seals. Win on the Gold stake.
  - **Steel Set**: three Steel dice. Win on Hard or Brutal.
  - **Diamond Set**: an upgraded Epic relic and an extra slot. Win on Brutal.
  - **Carnival Set**: five dice with random charms. Win with two or more modifiers.
  - Ruby (Red stake) and Bloodstone (Hard) already worked this way.
- **11 new achievements**: one for winning on each stake that had none, Brutal, each modifier, two modifiers at once (Twisted) and a shape set (Shape Shifter).
- **Twin Set reworked**: two pairs of twins that always land on the same face, so every throw holds two pairs.
- **Marble Set reworked**: every die you score gains +1 chip for good, up to +5 per die.
- **Watchmaker Set and the Clockwork Charm toned down**: Clockwork is now +1 mult per throw in a row, up to +5 (it had no cap), and the set starts with two Clockwork dice instead of three.

## 2026-11-07: Ghost duels; polyhedral dice taken out

- **Ghost duels**: challenge a friend to beat one of your runs.
  - When a run ends, **Challenge a friend** on the run summary copies a duel link. Every run in **Past runs** has a **Duel** button too.
  - Your friend opens the link and finds the invite on the main menu. They play the same seed, dice set, difficulty, stake and modifiers (a daily gets that day's set, relic and house rule).
  - While they play, a line above the score bar shows your ghost's score for that round, and a marker on the bar shows where it got to.
  - Whoever reaches the further round wins; on the same round, more points wins. The summary names the winner, offers a **Rematch**, and lets them send their run back to you.
  - The link opens on the same web address you played on. It names the game version you played; if your friend has a different version, the invite says the same seed may play out differently.
  - Nothing is uploaded: the run travels inside the link. Duel runs stay off the boards and records. Challenge runs, the tutorial and cheated runs cannot be sent.
- **Polyhedral dice are gone**: the d4, d8, d12 and d20 dice did not fit the game, so they are out again, along with the Tabletop and Critical sets and the Dungeon Crawl challenge.
  - A saved run with them carries on with ordinary d6s, as a Classic Set run.
  - A Dungeon Crawl run in progress is removed.
- Fixed: the Codex page came up empty since earlier today.

## 2026-11-07: 3D polyhedral dice

- With 3D dice on, the d4, d8, d12 and d20 are now real 3D dice: a tetrahedron, an octahedron, a dodecahedron and an icosahedron with numbered faces. They tumble, land with the rolled number on top (a d4 with it on the top corner, like a real one), glow when picked and get chained like the d6s. Opposite faces add up to one more than the number of sides, as on real dice.

## 2026-11-07: Honest runs no longer marked as cheated

- Fixed: a run was marked as cheated as soon as a die got a Mirror, Ice, Bomb or Arrow face, or held a d4, d8, d12 or d20. That hit the Tabletop, Critical and Kaleidoscope sets and the Dungeon Crawl challenge from the start. The anti-cheat check now knows the new faces and shapes.
- A run that was wrongly marked loses the mark when you continue it (unless you opened the Cheats menu in it).

## 2026-11-07: Polyhedral dice and the Whale

- **Polyhedral dice**: d4, d8, d12 and d20 dice, in two new dice sets.
  - Each die scores its number as chips, and a number above 6 can also count as a 6 in a hand.
  - A d4 adds +2 mult when it scores.
  - A d20 doubles the mult on a natural 20 and halves it on a natural 1.
  - They take charms and seals, but not face paints.
- **Tabletop Set**: a d4, three d6s, a d8, a d12 and a d20, with targets 20% higher. Dice Packs often bring other shapes. Unlocks at round 12.
- **Critical Set**: seven d20s, with targets 2.75 times as high. Unlocks by winning with the Tabletop Set.
- **Dungeon Crawl**: a new challenge, the Tabletop Set where every round is a boss round.
- **The Whale**: from round 6, the betting screen sometimes offers to call the Whale, at most once between two bosses.
  - You see its rule first: a boss rule for that round.
  - Clear the round as usual, or score twice the target and the Whale pays $10 plus a Rare or better relic.
  - Calling it gives up that round's tag.
- New achievement: Whale Watcher.
- Mirror faces can copy any number, including a Living or polyhedral die's number past 6; the face then shows the number itself (copying one used to break drawing that die).

## 2026-11-07: Curses, challenges, two new tables and a pile of new content

- **12 new relics**:
  - Tuning Fork: dice all within 1 of each other give ×1.5.
  - Wraparound: ladders wrap from 6 to 1.
  - Metronome: alternates +mult and +chips each throw.
  - Matryoshka: each clone in a family scores more mult than the last.
  - Domino Effect: each die adds the previous die's number as chips.
  - Spare Change: grows on every 1 you score.
  - Main Event: pick a hand each round for ×2.
  - Instant Replay: your last throw adds your best throw's chips.
  - Lucky Coin: heads gives +12 mult.
  - Abacus: +mult for every different number on the table.
  - Powder Keg: a growing multiplier that may blow up each round; sell it before it does.
  - Hot Potato: one die on the table holds the potato. Score it for ×1.5, or leave it and lose $2.
- **4 new faces**:
  - Mirror: copies the most common number on the table.
  - Ice: stays frozen on the table after it scores.
  - Bomb: +50 chips, cracks after 3 scores.
  - Arrow: the next die scores again.
- **6 new charms**:
  - Void: no chips, ×1.4 mult.
  - Clockwork: winds up +2 mult for every throw in a row it scores.
  - Anchor: rerolled dice drift to its number.
  - Spring: bounces off a 1 or 2.
  - Fate: ×2 or ×0.5.
  - Chameleon: copies the charm of the die before it.
- **3 new seals**:
  - Copper: +2 chips for good every reroll.
  - Black: scores twice more in the last throw.
  - Green: +$1 when chained.
- **7 new bosses**: The Copycat, The Heckler, The Repo Man, The Stopwatch, Frostbite, The Snob and The Sphinx.
- **5 new dice sets**: Marble, Twin, Pearl, Kaleidoscope and Watchmaker, each with its own unlock.
- **3 new relic sets**: Rhythm Section, Demolition Crew (the Powder Keg never blows) and Nesting Dolls.
- **2 new secret hands**: Twenty-One (six dice totalling 21) and Staircase (three pairs in a row).
- **4 new Arcana**:
  - The Alchemist: Gold faces into Mult, or the other way.
  - The Wager: double up or lose half.
  - The Stopclock: one more throw.
  - The Tower: unchain and reroll your chained dice for free.
- **3 new house rules**: Second Chance, Loyalty Card and Pip Insurance.
- **4 new Back Alley deals**: a dare (clear the next round in one throw), a swap (a relic for one a rarity higher), a fix (choose your next boss) and a pact.
- **Curses**: from round 3 some relic cards come Cursed. They cost half, but carry a curse while you hold them and sell for nothing. The Back Alley's pact gives a free cursed Rare.
- **Gaming tables**: two new tables, High-Low and Craps. Each shop now opens two of the four cash tables; the Prize Wheel stays.
- **Challenges**: eight fixed-twist runs on the main menu. Clear round 15 to complete one.
- **Modifiers**: five optional twists on the dice screen. A modified run stays off the online boards.
- **Relic collection**: the Collection now remembers every relic you have held across your runs, and Records counts them.
- 7 new achievements: Hexed, Kaboom, Daredevil, Challenger, Curator, Archivist and Museum Piece.

## 2026-11-07: Weekly challenge removed

- The Weekly challenge is gone: no Weekly tile, no "This week" line on the main menu and no Weekly tab on the high scores. The daily challenge, the daily streak and Past runs stay.
- The Weekend Warrior achievement went with it.
- Past runs: a weekly run in the list now replays as a plain seeded run on the same seed.

## 2026-11-07: More places to play

- Dice Den now plays at six addresses, all the same game and the same build:
  - https://aneonago.github.io/dice-den/
  - https://diceden.web.app
  - https://algebraarchive.web.app
  - https://chancetheory.web.app
  - https://theoddsindex.web.app
  - https://samplespace.web.app
- Each also works on .firebaseapp.com (for example https://chancetheory.firebaseapp.com), and the old https://dice-den-aab4d.web.app forwards to diceden.web.app.
- Progress saved without an account stays on the address you played it on. Sign up and the same progress follows you to every address and device.

## 2026-11-07: Final boss, weekly challenge, shop preview and more

- **The House**, a final boss at round 30: it deals two other boss rules at once. Beat it to win the run.
- **Shop preview**: every relic on the shelf shows what your last scored throw would have made with it ("Last throw 88 → 264, +200%"), counting any set bonus it completes.
- **Weekly challenge**: a new Weekly tile. One seed a week with its own dice set, starting relic and house rule, plus a twist (Boss Week, Closed Shelves, Big Table or Tight Budget). Your first weekly run of the week goes on the new Weekly board (High scores).
- **Daily streak**: play the daily on consecutive days to build a streak, shown under the menu tiles. New achievements Regular (7 days) and Part of the Furniture (30 days), plus Weekend Warrior (clear round 10 in a weekly).
- **Past runs**: a new tile with your last 20 finished runs and their seeds. Replay plays one again as a seeded run; a daily or weekly gets its set, relic, house rule and twist back. The list is also under Records.
- **Relaxed** (easy) gets a **Best pick** button that picks the best-scoring dice for you. Relaxed runs no longer unlock dice sets or stakes.
- **Thirteen**: a plain 13 now pays 7 to 5 and a doubled hand that lands on 13 pays 2 to 1. Double used to never be the right move; now it is in about a fifth of deals. The house edge is about 1.1%.
- Fix: when a set card with a center ring lost Mimic or Reflection but kept another set (the Prize Wheel can take one), the ring stayed. The ringed relic now goes back to your bar, and the message says so.
- **Prize Wheel**: a relic is valued at half its shop price (a grown Gilded Egg no longer counts its growth), cash pays twice that and the big prize three times. The wheel paid out far more than it took.

## 2026-11-07: Hold an item for the next shop

- Most shop cards now have a **Hold** button. It keeps that item for your next shop, but it isn't free: holding costs a quarter of the item's price now, the item costs a quarter more in the next shop, it takes the place of a new item on its shelf, and it is gone if you don't buy it there. One hold per shop; free items, the Mystery Relic, Extra Slots and an item that was already carried over can't be held.
- When you reach the next shop, the message reminds you that your held item is on the shelf and this is its last chance. A held Star Chart shows the level your hand has by then.
- New house rule, **Layaway Plan** ($6): holding is free, and the held item costs no more in your next shop (bought while an item is already carried over, it drops that item's surcharge too).
- New achievement, **Layaway**: buy an item you held over from the shop before.

## 2026-11-07: Why to sign up

- Signed out, the main menu now explains that Dice Den has more than one web address and that progress saved without an account stays on the address you played it on, while an account carries it to every address and device. The × hides the note for good. The Sign up panel says the same.

## 2026-11-07: First-run tutorial, clone badges, Glass Set and Hoarder

- Your very first **New run** starts the tutorial: a short practice round (**Quit tutorial** ends it any time). The tutorial now also shows the **menu** button and what is in it, how to **sell** a relic, every shelf in the shop, the **Sets / Dice / Collection** buttons and the main menu, and ends with **Start a real run**.
- Original and Clone dice on the table show a small round badge beside the die (a gold crown for the original, a copy mark for a clone) instead of a text tag stuck on the die, which sat on the face of 3D dice.
- Glass Set: you start with **Glass Cutter**, so your glass never breaks.
- Hoarder: +4 mult per unused reroll (+6 upgraded), up from +1 (+2).
- On diceden.web.app the game plays right at the address, with nothing after the slash (an old /game.html link still works).
- Patch notes live here on GitHub now, and are no longer in the game.

## 2026-11-05: A new relic, a new house rule and a dozen fixes

- New relic, Short Fuse (Rare): ×2.25 mult (×3 upgraded), but a throw that scores under a third of the round target, and doesn't clear the round, burns one more throw. The throws counter flashes when it does.
- New house rule, Bargain Bin ($9): rerolling the shop costs half as much.
- Thirteen: a tie now gives your stake back. To keep the table fair the dealer draws to 11 instead of 10; exactly 13 still pays 3 to 2.
- Living dice: a face past 6 can also count as a 6 in a hand (a Living 9 and two 6s make Triplets) and still scores its own number in chips. The pick line says when it does.
- Tall Stack is stronger: +5 chips for every die you own (+10 upgraded), up from +2.
- The Reaper now swings a scythe at the die it takes.
- Auto-center dice is on by default (it stays off if you switched it off), and sorted dice now all face the same way.
- Clone families: the die you scored is the Original and its copies are Clones (they were Clone and Faulty clone), and every family die is marked Original or Clone on the table.
- The Understudy: a relic it is on shows a ×2 badge (×3 with two, and so on) in your bar and says so in its tooltip.
- Steady Hand, Eternal Flame, Shatterhand and The Reaper descriptions read properly (they said things like 'Grows multiplies mult by 0.05').
- A House Credit relic you put in a set card's center ring (or sell) no longer leaves an empty slot where it stood.

## 2026-11-05: A second home for the Den

- Dice Den now also plays at diceden.web.app (hosted by Firebase). It is the same game as aneonago.github.io/dice-den, updated at the same moment, with the same online boards, daily and accounts.
- Progress kept only in your browser stays on the site you played it on, because each site has its own browser storage. To carry it over, sign in on the site where you played (that saves your progress to your account), then sign in on the other one and choose your account's progress.
- Report a bug now says which site you were playing on.

## 2026-11-04: Thirteen and the Wingman

- Twenty-One is now Thirteen: dice blackjack to 13. You and the dealer start with two dice, the dealer draws to 10 and wins ties, and exactly 13 pays 3 to 2. The house edge is the same as before (about 3% with perfect play). A Twenty-One hand left open in a saved run gives your stake back.
- Wingman dice can now join your hand: pick a Wingman and, when it makes a better hand (a pair and a Wingman make Triplets, or it fills a ladder), it counts as part of the hand and takes one of your dice slots. The pick line says when it does. An unpicked Wingman, or one with every slot full, still rides along for free as before.

## 2026-11-03: New charm: the Living Die

- New charm, the Living Charm ($6, in the shop and Face Packs): every time a Living die scores, the face it scored grows by 1 and the face opposite shrinks by 1, for good. Feed a face and it climbs past 6, while its back side sinks to 0 and below.
- A Living die shows numbers instead of pips, in 2D and 3D, and you see the face grow as it scores. A negative face takes chips off (a throw never scores below 0), and scoring a low face pulls the die back toward the middle.
- Faces past 6 still pair with each other and stretch ladders (4-5-6-7), and you can steer faces onto the numbers your relics like. A new charm on the die resets it.
- New achievement: It's Alive, grow a face of a Living die to 12.

## 2026-10-31: Account fixes

- The game no longer says your account has newer progress from another device when that progress is its own: the last save it sends as you close it, or a save from a second tab. Each device now marks its saves, and a copy holding the same progress as this device is never offered.
- A game left open on one device could save its older progress over newer progress from another device. Saves now check first: if another device saved since, this one stops saving and asks which progress to keep.
- Signing out first sends any progress that was still waiting to be saved.
- When your sign-in stops working (for example after a password change), the game says so and asks you to sign in again, instead of quietly saving nothing.
- The choice between this device's progress and the account's can't be closed without picking one (closing it used to stop cloud saves for the visit).
- Only one first daily run per account goes on the daily board, even when you play on two devices.
- If the check against the official build fails (for example offline when the game loads), posting a run tries it again and offers Retry, instead of refusing for the whole visit.

## 2026-10-31: Bug fixes

- A copy of the game saved under another name (like game (1).html) flagged every run as cheated, and an older copy could be flagged right after an update. Both are fixed.
- The gaming tables can't be scouted any more: each run has its own slot, Twenty-One and Prize Wheel results, even on the same seed.
- Coupon Tag: a shop reroll keeps as many free items as you had left instead of making a whole new shelf free. Rigging the case no longer takes away the free Mystery Relic, and a Charm Tag in the same shop gives its own free Relic Pack.
- Iron Shackle: double-tapping dice while a throw is scoring no longer changes the pick.
- Prize Wheel: picking a relic for it ends when you close the wheel or leave the shop, so relic taps later open the relic as usual. A reload mid-spin still tells you the result.
- Upgraded Spillover: the +5 chips go on the picked dice the hand doesn't need.
- Wingman: a picked Wingman gets chained like an unpicked one, a chained Wingman doesn't score under The Pit Boss, bet odds no longer count Wingman dice toward hands, and the pick line counts them right.
- Curtain Call replays the last die you pick, not a Wingman riding along. The relic that grows when you repeat your last hand is now called Standing Ovation (two relics were both called Curtain Call).
- A clone family whose glass shatters loses the Glass charm on every clone.
- Gravity Well pulls real 1s and 2s before a Star on the 1 or 2 side, works after The Shaker too, and says how many dice it pulled.
- Lean Your Way: the face you choose counts for the whole clone family.
- Heartthrob and Heartstone no longer fire on a Stone die's painted Heart face.
- Restart in Settings starts the same kind of run again: restarting a daily, seeded or tutorial run no longer replaces your saved run.
- Shop: no Dice Pack once your dice are at the limit; House Chalk, Bulk Deal and Jeweler's Loupe texts are right; copy relics read the right neighbour beside very big set cards; the Back Alley trade works with 5 dice.
- Controls: F (full screen) works at the table, keys no longer act under the bug report and Escape closes it, Score closes an open Arcana pick, Next round waits for the Mystery Relic case, the End run and Throw out confirmations reset when you close the menu, and the Reroll button counts only the dice it rerolls.
- Auto spin: a clearer end message, and leaving the table mid-spin no longer replaces the next round's message.
- The daily's dice set, relic and house rule no longer change when new things are added to the game. Also: Double Take's text (4 dice of a Full House), quitting the tutorial while a throw scores, and the round-clear message about chained dice.

## 2026-10-31: Phone shop fix

- On phones and tablets the gaming tables (slots, Twenty-One, Prize Wheel) no longer squeeze into three narrow columns with text spilling out: each table gets its own full-width row.

## 2026-10-31: Tutorial dice

- With 3D dice on, the dice were invisible in the tutorial whenever it lit up the table (the highlight drew the felt over them). They show now.

## 2026-10-31: Phone typing fix

- On Android, tapping a text box (seed, account, names, bug reports, searches) opened the keyboard and closed it again at once. The game no longer redraws the screen when the keyboard or the address bar slides in, and a text box you are typing in keeps its focus, text and cursor if the screen does redraw.

## 2026-10-31: A better tutorial

- The tutorial now also shows the round Bonus goal, the Hand levels list (every hand and what it pays), the gaming tables, and the Back Alley, and ends by pointing you to Sign up.
- On screens a little over 1000 pixels wide the tutorial card no longer squeezes the shop into thin columns: the shop stacks its shelves beside the card instead.
- Clearer steps: the shop step reminds you to close the Bonus pop-up first, and the reroll step suggests which dice to throw again.

## 2026-10-31: Report a bug

- New Report a bug button on the main menu and in Settings. Describe what happened and press Send report: it goes straight to the developer with the build, your seed and round, dice set and screen size (no GitHub account needed). You can still open a ready-made GitHub issue or copy the report instead.

## 2026-10-31: Boards need an account

- Runs now go on the online boards only from an account, and they post under the account name: your username, or for an account made with an email, a name you pick (letters, numbers, spaces, up to 16; asked once, and it follows the account to other devices). Without an account the run summary offers Sign up or sign in, then Post this run.
- Each account has one entry on the boards, whatever device it plays on. Scores posted before this under a free-typed name stay on the boards.

## 2026-10-31: Hover help

- Hover a house rule icon in the shop header to see what it does (and how many times you own it).
- The Collection has a search bar (name, effect, rarity or set), and hovering a relic there shows its upgraded effect.

## 2026-10-31: Roomier relic shelf

- With Window Shopper (and copies of it) the extra relic cards in the shop wrap onto new rows of three instead of squeezing into tall, thin columns.

## 2026-10-31: Fixes and rarities

- Wingman dice no longer act like Wild dice: they still score with every hand, but they never help make it (a 3 and a Wingman 3 are not Twins).
- Auto spin showed fresh random reels while the real spin played out of sight, so the reels did not match what you won. The reels you see are now the result that pays, and each result stays up a little longer.
- Window Shopper is now Rare (same effect). The copy relics Mimic, Reflection and Ringleader are now Legendary.

## 2026-10-31: Gravity Well

- Gravity Well now pulls up 2s as well as 1s: after every throw or reroll, up to 1 (2 upgraded) of the 1s and 2s you rolled turn into 6s, 1s first. A Star face sitting on the 1 or 2 side counts too and turns to the 6 side.

## 2026-10-31: Auto spin, Jade slots

- One-Armed Bandit: Auto spin. Set a money goal and a stake and the machine keeps pulling (with faster reels) until you reach the goal, the stake is more than you hold, you press Stop, or 200 spins.
- Jade Set: its 2 extra starting slots no longer make new slots dearer. Slot prices start where they do for every other set.

## 2026-10-31: Reorder set cards

- Tap a merged set card and use the arrows beside each relic to change their order on the card. The order matters for copy relics: Mimic copies its left neighbour and Reflection its right one.

## 2026-10-31: Table tallies

- The One-Armed Bandit and Twenty-One keep a tally of your visit (games played and money won or lost so far), and leaving the table tells you the result of the visit.
- Twenty-One: the dealer total counts up as each of the dealer dice lands, instead of showing dots until the end.

## 2026-10-31: Cleaner rerolls

- Dice being rerolled no longer show the little reroll badge while they roll.

## 2026-10-31: Spark dice

- The Lucky Die is now the Spark Die (and the Lucky Charm the Spark Charm): it always gives +2 mult, so there was nothing lucky about it. It works exactly as before, and the Ember Set and Rainbow Roll use the new name.

## 2026-10-31: More dice on the table

- New ways to throw more dice (you still score the same number): the Wide Table relic (Uncommon, one more die every throw, two upgraded, and it brings a plain die into your bag), Seventh Seat can now be bought twice, and a new Back Alley deal, A bigger table ($6 for one more die every throw for the rest of the run, with a plain die for your bag).
- Wingman dice still score with every hand, but they stay on the table afterwards like any die you did not pick, so they can be chained into the next throw instead of going back into the bag.
- Double Take now replays every pair in the dice you score: 2 dice of Triplets, all 4 of Quads, 4 of Quints, 6 of Six of a Kind and all 5 of a Full House.

## 2026-10-31: Brighter glass, more icons

- Glass dice are stronger: on top of double chips, every Glass die gives ×1.25 mult each time it scores (still 1 in 8 to shatter).
- Everything has its own icon now: The Hammer, the Mega Arcana Pack, the house rules Pit Boss's Favour, Second Spin and Lean Your Way, every Back Alley deal, and the boss rule line under the table shows the icon of that boss.

## 2026-10-31: Wingman always flies

- A Wingman die on the table now scores with every hand as if you had picked it: its pips, faces, charm effects and relics all count, and it can complete the hand (a 5 and a Wingman 5 score as Twins). It still never counts toward the dice limit. The old +2 chips per pip for leaving it unpicked is gone.

## 2026-10-30: Bigger face sets, a gentler climb

- Face sets pay more, and more again for every matching die past 3 (counted up to 8): Mult Surge ×2.5 (+×0.5 each), Jackpot +$5 (+$2 each), Crystal Chorus +30 chips (+20 each), Constellation +40 chips (+20 each), Full Heart +8 mult and +$4 (+3 mult and +$1 each), Trifecta +15 mult (+5 for each extra Mult, Gold or Glass die), Rainbow Roll ×3.5 (+×0.5 for each extra Lucky, Golden or Heavy die).
- Rounds 31 to 40 climb much more slowly: targets grow ×1.35 a round instead of doubling (round 40 needs about 4.2 million instead of 216 million). They double again from round 41.

## 2026-10-30: Cleaner charmed dice

- Charmed dice now just take the colour of their charm: no letter badge or coloured rim on the die (2D and 3D). The charm still shows in the Dice menu and the tooltip of the die.
- Hall of Mirrors is now Mythic ($20, found in rounds 1 to 5 and 25 on).
- When the Prize Wheel is used up, One-Armed Bandit and Twenty-One widen to fill the Gaming tables shelf.

## 2026-10-30: Fixes and two house rules

- Twenty-One: the rolling dice were drawn at the top of the screen instead of on the felt (where you could see a die before it landed). They roll on the table now, and the result says what you won (your profit) and both totals.
- The Prize Wheel leaves the shelf once it is used up for the shop. New house rule Second Spin: one more spin every shop, and it can be bought twice.
- New house rule Lean Your Way: Loaded dice, the Weighted Cup and Lady Luck keep the roll nearest the side you pick for each die (tap a face in the Dice menu) instead of the higher one.
- Rolling twice and keeping one: when both rolls are worth 6, a special face (Mult, Gold, Heart) is kept over a Star face. Engraved pips now count properly.
- Upgraded Sixth Sense also rolls one more die every throw.
- The Hammer with 3D dice: the 3D die shakes and bursts, with no flat 2D die or dashed outlines drawn over the 3D dice.

## 2026-10-30: Glass dice, the Wingman and more

- Glass is now a whole die: the Glass Charm (shop, Face Pack, The Glazier, the Back Alley glazing) makes every face count double. It shatters less often, 1 in 8 (the glass breaks, the die stays). Glass faces you already had became Glass dice, and the Glass Set starts every die as Glass.
- New charm: the Wingman Die. Left unpicked on the table when you score, it adds twice its pips in chips; picked, it can join any hand as an extra die, past the dice limit.
- Charms now change the whole die, not just a corner: Steel looks like metal, Lucky is green, Golden is gold, Glass is see-through, and so on (in 3D too).
- The Face Pack now offers die charms and seals as well as face paints.
- Face paints you are asked to place can be skipped (Don't paint it).
- Same dice as last throw: when your bag holds more dice than you can throw, one button throws the dice you threw last time.
- The Prize Wheel: pick the relic to wager by tapping it in your relic bar.
- Twenty-One: you see the dealer roll each die, one at a time, instead of the dice just appearing.
- The side column on wide screens fits without a scroll bar: Face sets only lists the sets on the table, in one column, and the bag dice are smaller.

## 2026-10-30: Prize Wheel, accounts and more

- New at the Gaming tables, now the first shelf in the shop: the Prize Wheel. Wager a relic you own. 3 times in 10 the wheel takes it; otherwise it stays and may win you cash, an upgrade, or a missing piece of its set. One spin a shop.
- The One-Armed Bandit, Twenty-One and the Prize Wheel have their own art and their own sounds: the lever, the reels ticking past and locking, coins, a jackpot fanfare, dice landing on the felt, the dealer turning over, the wheel's pegs.
- Twenty-One deals its dice one at a time, and the dealer turns over and draws one die at a time.
- Rerolls are no longer limited to 5 dice: while you have rerolls left you can pick as many dice as you like and reroll them all (Score still takes at most 5). Reroll rest rerolls every die you have not picked.
- Accounts: press Sign up on the main menu (or in Settings) and sign up with a username or an email, and a password, to keep your progress in the cloud and carry it to another device.
- A soft tick plays when the mouse moves onto a button (Settings > Sounds > Button hover turns it off).

## 2026-10-30: Background sounds

- Settings has a switch for each of the room's background sounds: the room hum, the lamp's buzz when it flickers, and the low rumble when a run is lost. Switch off the ones you do not want; the rest keep playing.

## 2026-10-30: Gambling overhaul

- Bet odds are fixed. Called shot, the first-throw hand bets, Big throw and Score to spare were priced as if you always play for points, so playing for the bet (rerolling for All Odds, scoring one die to keep the round going) won most of them at ×3 to ×7. They are now priced for a player who chases the bet, wild dice count, and no bet pays more than ×5.
- New in the shop: Gaming tables. The One-Armed Bandit is a slot machine (three of a kind pays up to 250 times the stake), and Twenty-One is dice blackjack against the dealer. Both keep a small house edge.
- The Mystery Relic now shows what it gave you and asks: Keep it, Sell it, or Reroll (sells it and opens another Mystery Relic; it warns you first).
- Settings: Case spin can be set to Skip, which shows Mystery Relic, slot machine and coin flip results at once.
- Rigging the case opens in stages: Common relics after 15 Mystery Relics in a run, Uncommon after 25, Rare 35, Epic 45, Legendary 55, Mythic 65. You can only rig a set piece (a relic from a set you already hold part of), and the rig pauses while you hold none of its set.
- The Back Alley coin flip has no limit: heads doubles all of your money.

## 2026-10-30: Relics, hands and controls

- Mythic relics only turn up in rounds 1 to 5 and from round 25 on (shop, packs, rewards, the Mystery Relic and the rigged case).
- The Fence no longer rolls one rarity higher when upgraded. Instead The Fence and Loaded Odds form a new set, Crooked House: +8 mult, and Mystery Relics roll one rarity higher.
- Quints no longer count as a Full House.
- Hovering a card in the shop no longer lights up the card next to it (hovering a relic in your bar still shows the shop cards from its sets).
- New throw buttons: Deselect all (key X) clears your pick, and Reroll rest (key E) rerolls every die you have not picked and keeps your pick.
- The Sell area is bigger, and dragging a relic or card also opens a large drop zone at the bottom of the screen.

## 2026-10-30: Bug fixes: texts and looks

- The Inside Job achievement can now be earned (winning the relic you rigged the case for).
- The boss message shows what the boss really paid, bet chips show their payout with House Odds and Hustler included, and the Mystery Relic card shows the dud odds that upgraded Loaded Odds gives.
- Star Charts say how far House Chalk takes a hand. Arcana packs say what to pick, dice packs count Bulk Deal's extra die, and the Mega Arcana Pack's Skip turns into Done after one pick.
- Hot Hand, The Comeback, The Bookie, The Reaper, Rabbit's Foot, Blood Pact, Swarm Cup and The Fence have their own icons.
- The Legendary achievement counts Mythic relics. The Cloning Vat says its copies are faulty. The relic Encore is now Curtain Call (no more clash with the Arcana card The Encore).
- Under House Silence you can still open an Arcana card to sell it. Smaller wording fixes: The Tinker and The Mirror messages, the Tailor's prompt, the Coupon Tag, the rig odds (Mythic is 1 in 20 too), the bet texts, the paint panel, and the shop odds in the Collection now add up to 100%.

## 2026-10-30: Bug fixes: copy relics

- An upgraded Mimic, Reflection or Ringleader now really copies a passive relic one level higher (an upgraded Mimic on Hourglass adds two throws, not one). Their text also says that a relic whose only change is its upgraded effect gains nothing more.

## 2026-10-30: Bug fixes: flow

- Round 1 gets its extra throws and rerolls (the Wild Set, a daily's Spare Cup, starting Hourglass relics).
- Everyone on the same seed is offered the same bets with the same odds.
- The Mega Arcana Pack is only stocked when you have room for both cards, and old saves drop shop offers for things that no longer exist.
- An open Arcana pick (the Hammer, the Understudy, Credit Line) ends with the round, and House Silence stops it. The Hammer only works at the table, and the Understudy only during a round, never on a switched-off relic.
- Keys no longer act behind the paint panel or the dice menu, Escape closes the dice menu, and the paint panel waits behind the run summary.
- The tutorial moves on if you leave the shop without buying Even Steven. Dragging to the Sell area during an animation no longer sells.
- The Nudger never lowers a die (a Star face stays a 6), The Shaker lands dice like a throw (Weighted Cup, Lady Luck), and Gravity Well pulls up dice showing a 1 by value, a clone family as one.
- When a snack wears out (or a Phoenix burns) on a set card, the relics of the broken set go back to your bar instead of staying stuck on the card.

## 2026-10-30: Bug fixes: scoring

- A Clone Army pick past the limit, all one value, scores as Quints (or Six of a Kind) with every clone, instead of All Odds or All Evens.
- When two hands tie on mult, the one with more chips wins, so two even or two odd pairs can score as Double Twins (with a level, they now do).
- With upgraded Spillover the best hand always counts, since every die scores anyway.
- A Stone die no longer counts its hidden face toward face sets, Minimalist or Rainbow Pick, and cannot shatter.
- A die Midas Touch gilds this throw counts as Gold for Gold Tooth, Collector, Jackpot and the other face bonuses.
- Triple Threat, Twin-Cut and Double Take count Wild dice the way the hand does. Twin Flame now fires only on Twins or Double Twins, as its text says.
- The pick preview leaves out dice a boss zeroes and counts Legion chips. Spillover's +5 shows on the right die, empty relic steps are gone, the pick warnings name the right reason, and money in the throw message shows cents.

## 2026-10-30: Bug fixes: money

- In debt, The Taxman and The Doorman no longer wipe out what you owe, The Croupier no longer doubles it, and Piggy Bank and Safecracker no longer charge negative interest.
- Skipping the round after a Back Alley deal no longer cancels the deal's cost: it moves to the next round you play.
- Free items (Coupon Tag shop, Charm Tag pack) can be taken in debt, survive a shop reroll, and Regular's Tab no longer puts a price on them. The Charm Tag waits while your bar is full.
- Bulk Deal discounts the packs already on the shelf when you buy it.
- Relic slots past 15 cost 2.5 times the one before ($210 for the 16th).
- House Credit no longer raises a relic's sell price. The Understudy on Blood Pact costs a throw, like a copy does.
- The Back Alley coin flip doubles to the cent, and bets always leave whole cents.

## 2026-10-30: You choose

- Face paints are never random any more: shop face cards, The Painter, The Saint, free faces from bonuses and the Back Alley glazing all let you tap the exact die face to paint.
- Choosing a die (charms, seals, Arcana) shows your dice as dice to tap, with all six faces, instead of a long list.
- The Understudy and Credit Line ask you to tap the relic in your bar (on a set card, the relic itself) instead of picking from a list.

## 2026-10-30: Mythic relics

- New rarity above Legendary: Mythic (pink). Shop relics are Mythic 0.25% of the time and Mystery Relics 0.1%, at $20. Legendary relics are half as common as before (shop 1%, Mystery Relic 0.5%).
- Mythic relics: The Forger (unchanged), Eternal Flame (now ×0.35 a round), The Weaver (set bonuses count three times, four upgraded) and three new ones: The Gilded Throne (every scored die ×1.35 mult), The Last Word (your last throw of a round ×6 mult) and Hourglass of Ages (+1 throw every round and +1 reroll every throw).

## 2026-10-30: More changes

- No more "Drop here to sell" popup: the Sell area beside the relic bar lights up and shows the price while you drag.
- The Forger says it never copies Credit Line.
- The house rules you own are listed beside the table, with what each does.
- House Credit can put you in debt: its cost comes off the round's pay even below $0, and nothing on the shelves can be bought until you are back above $0.
- The online boards hide runs whose best throw is far too small for the round they reached (they came from very old builds).
- A clone family stays identical: any change to one clone (a face, charm, seal, loaded mark, engraving) changes them all.
- Mimic, Reflection and Ringleader are Epic now.
- Three-Ring Circus takes 1 slot: Looking Glass inside it no longer counts as a second set.

## 2026-10-30: Fair play

- Only a copy of the game that matches the official build posts to the online boards: an edited, out-of-date or offline copy plays fine but keeps its scores local.

## 2026-10-30: Shared relics

- A set card that holds two sets (they share a relic, like Clone Army and Hive Mind) now shows one box per set, joined by a glowing tether. The shared relic sits in one box with a faint copy at the other end, so you can see the card takes one slot per set.
- A relic in the center ring that finishes its own set stays in the ring (still copied) and shows in its set's box too.

## 2026-10-30: Fairer bet odds

- Bet odds are now worked out from the throws you would actually score for points, instead of assuming you chase the bet with every reroll. Measured against played runs, a bet now wins about as often as it says, late in a run too (the Called shot and Triplets bets used to promise far more than they paid).

## 2026-10-30: Changes

- Lady Luck, Loaded dice, the Weighted Cup and The Shaker keep the better face by what it scores, so a Star face (a 6) or engraved pips count.
- Up to 25 relic slots. Past 15, each slot costs 2.5 times the one before (the Coupon Tag never pays for slots).
- The Mystery Relic still shows with a full bar (marked Slots full).
- Clone dice never get chained or shackled. Dice the Cloning Vat makes are faulty: relic effects on them work at half strength (the original die is unaffected).
- Rusty Chains now chains every die you leave on the table, with no limit.
- The dice menu draws faces flat. Edition names (Gilt Edge, Twin-Cut...) and their effects show in their own colour in the shop.
- New Mega Arcana Pack: pick 2 of 5 Arcana cards, $8.
- Dropping a relic or card on the Sell area sells it at once.

## 2026-10-30: Fair play

- Runs that are tampered with (game values changed from the browser console, game code rewritten, an edited save or an edited game file) are caught: the run is marked CHEATER across the screen and never reaches the boards, records or unlocks. The Cheats menu in Settings is still there for honest experimenting.

## 2026-10-30: Sell area

- A Sell area now sits beside the relic bar: drag a relic, a set card or an Arcana card onto it to sell (one more tap confirms).

## 2026-10-30: Face sets on the table

- Face sets (Mult Surge, Jackpot, Crystal Chorus, Constellation, Full Heart, Trifecta, Rainbow Roll) now show beside the table whenever your dice can make them, with how many matching faces your pick (or the table) has, and they light up when the pick scores one.

## 2026-10-30: Skipping a round

- Skipping a round now plays a short scene: the round is struck out and the tag you earned flips in with a burst of sparks (tap to hurry it).

## 2026-10-30: Bets and clones

- Bets have an All in chip: stake every whole dollar you hold on one bet.
- Clone families stop growing at 12 dice: the Cloning Vat makes no more copies of a die whose family is that big.

## 2026-10-30: House rules

- House rules stand out in the shop (a gold House Rule card) and the ones you own show in the shop header.
- Buffs: Weighted Cup now weights the first 2 dice, House Odds +30% bet profit, Card Case also gives a free Arcana card, Croupier's Tip $3 a round, Pit Boss's Favour also pays $3 per boss beaten, Sticky Felt costs $5.
- Fixed Rates now takes $1 off every shop reroll instead of fixing it at $2.
- New house rules: Jeweler's Loupe (editions twice as often), Bulk Deal (packs $2 cheaper with one more choice), Velvet Rope (+$5 per boss beaten), House Chalk (Star Charts level twice).

## 2026-10-30: Rules tab and Arcana

- The Rules tab has a Star Charts section (which hands each chart levels, how rare it is and its price) and a House rules section.
- Holding five or more of the same Arcana card shows it once, with ×5, ×6... next to its name.

## 2026-10-30: Fixes

- Loaded Odds says plainly that it does not touch gambling (bets and the Mystery Relic).
- Credit Line can no longer be copied by The Forger or The Encore.
- The Understudy works on any relic except copy relics: a passive one (The Weaver, Piggy Bank, Rabbit's Foot...) counts as copied once more for the round.
- The Handy Tag shows how much it will pay.
- A House Credit relic (or one that finishes a set) can be taken even when your bar is over full, from the shop or a Relic Pack.

## 2026-10-30: New dice sets and achievements

- Five new dice sets with big unlock challenges: Ruby (Mult faces on every 6, no starting money; win on the Red stake or higher), Jade (7 relic slots; own 10 relics at once), Ember (every die Lucky, 6 dice; score a million in one throw), Bloodstone (start with Blood Pact; reach round 20 on Hard or Brutal) and Starlit (every 1 is a Star face; win with the Wild Set).
- Thirty new achievements, from scoring each big hand to million-point throws, Whale money, Hoarder bars, boss hunts, rigging the case and winning on the Gold stake.

## 2026-10-30: Credit Line

- New Arcana card, Credit Line ($4): turn a relic on one of your set cards into House Credit. A set whose relics are all House Credit takes no slot, so this can free up your bar, but every House Credit relic costs $1 of each round's pay.

## 2026-10-30: Rigged case

- Rigging the Mystery Relic is much harder: it unlocks after 15 buys (was 10), costs $10 to rig (and $10 more for every rig after that in the run), makes each rigged case $3 dearer, and hits 1 in 10 (1 in 20 for Epic and Legendary relics) instead of 1 in 5.

## 2026-10-30: Bets late in a run

- Bet odds now simulate throws the way the game makes them: a Swarm Cup swarm goes in on top, Petri Dish lands a family on one face, Lady Luck and Gravity Well count, and a whole clone family can be scored with Clone Army. Late-game clone builds no longer get broken odds or a near-empty bet list.
- A bet that would be almost certain now climbs instead of disappearing: Score to spare asks for 2, 3, 5 or 10 times the target, and the first-throw bet asks for Quads or Quints.

## 2026-10-30: Copy relics

- Copy relics (Mimic, Reflection, Ringleader, the center ring) now copy the numbers of passive relics too, drawbacks included: a copied Blood Pact takes another throw away, and copies add more throws (Hourglass, which also raises the target again), rerolls (Rabbit's Foot), dice per throw (Brood Chamber), 1s turned to 6s (Gravity Well), chain rounds (Lodestone), chips per die (Trail Marker), level-up rolls (Lucky Star), Arcana cards (Fortune Teller, The Forger), set bonus repeats (The Weaver), boss pay (The Fixer) and Relic Pack size (The Fence).
- Rule relics stay single: a second copy of Midas Touch, Sixth Sense, Petri Dish, Skip Step, Spillover and the like changes nothing.

## 2026-10-30: Reroll

- Reroll throws the dice you have picked: tap dice, then press Reroll (or Score). With nothing picked the Reroll button does nothing, and there is no separate reroll mode any more.

## 2026-10-30: Swarm Cup

- The Swarm Cup is now an ordinary relic: it can turn up in any shop, pack or Mystery Relic, instead of only appearing (at the head of every shop) once a clone family reaches 7.

## 2026-10-29: Fits one screen

- On a computer screen a round now fits without scrolling or zooming out: the message, bonus, Arcana, tags, bag and tips sit in a column beside the table, and the table grows or shrinks to the window height.
- The shop is more compact on wide screens (no logo or round stats, shorter cards), and its Reroll and Next round bar stays pinned to the bottom of the window.

## 2026-10-29: Faster with many relics

- Starting a round no longer stalls with a big relic bar: the betting screen shows at once and the bet odds fill in a moment later.

## 2026-10-29: Dice menu

- Your dice now open from a Dice button at the top of the shop: a panel with every die, all six faces drawn in 3D (flat dice with 3D off), and its charm, seal, loaded mark and clone family. Throwing a die out moved there too.

## 2026-10-29: End run and the boards

- End run in Settings (tap twice) finishes the run where it stands. It goes on the online boards like any finished run, so a won run you are done with still counts.
- High Scores can show Every run as well as each player's best, and every entry shows the build it was played on. Runs from builds before today's balance changes are marked older build.
- Scores of a million or more show in e notation on the boards (2.23e+10).

## 2026-10-29: New growing relics

- Night Shift (Common): grows +2 mult every time you score your last throw of a round.
- Encore (Uncommon): grows +2 mult every time you score the same hand as your previous throw.
- Rolling Stone (Common): grows +2 chips for every die you reroll.
- Steady Hand (Rare): grows ×0.05 mult for every round you clear without a reroll.

## 2026-10-29: Midas Touch

- Midas Touch now gilds a die the moment it scores, with a gold flash, and the new Gold face already pays out on that same score.

## 2026-10-29: Set cards and a full bar

- A set card now takes one slot for each set on it: a card that holds two sets (Clone Army with Hive Mind, Looking Glass inside Three-Ring Circus) takes two. A set whose relics are all House Credit takes no slot on the card.
- With a full relic bar the shop still shows its relic cards as usual. They read Slots full, except one that would finish one of your sets (as long as the finished card fits), which you can buy.

## 2026-10-29: Balance

- Gold pays less: Gold faces earn $1 (was $2), Gold seals $2 (was $3) and the Jackpot face set $4 (was $6).
- Clone Army gives +5 mult (was +10) and Hive Mind ×1.5 mult (was ×2). The Hive Mind description now says plainly how it joins Clone Army and makes the Legion hand.
- High Court: each 5 or 6 scored gives ×1.1 mult, ×1.2 upgraded (was ×1.25 and ×1.5).
- After the win the targets double every round (was ×1.3), so endless runs end much sooner.
- Relic slots get dearer faster past 8 slots: the 9th costs $24, then $34, $44 and so on.

## 2026-10-29: Mystery Relic odds

- Rare relics come up less often from the Mystery Relic: Dud 15%, Common 52%, Uncommon 25%, Rare 5%, Epic 2%, Legendary 1%.
- Upgraded Loaded Odds no longer goes to waste with The Fence: since The Fence leaves no duds to halve, each Mystery Relic rolls its rarity twice and keeps the rarer.
- Upgraded Loaded Odds now really halves Mystery Relic duds (it did nothing before).

## 2026-10-29: Small fixes

- The Oracle shows its number on a set card too, not only on its own box.
- Quints now also count as a Full House, so relics, bets and challenges that ask for a Full House accept five of a kind.

## 2026-10-29: More fixes

- Swapping a House Credit relic into the center ring with a full bar no longer pushes the old ring relic past your relic slots.
- Selling Iron Shackle lets go of the dice it was holding, so they no longer stay chained to the table.
- A relic in the center ring that came from another set card stays in the ring when that card breaks up (a snack wearing out, the Phoenix Feather burning), riding on the ring card instead of taking a bar slot.
- The Hammer can no longer smash the last die on the table in the middle of a throw, which left a throw with nothing to score.
- When a relic burns up on a set card and the set breaks, the message now says so, and how many relics to sell if the bar is overfull.
- With a full relic bar, a relic that completes a set is only offered when the set card really frees a slot (a set whose other relics are House Credit frees none). House Credit relics on the shelf can be bought with a full bar, as in Relic Packs.

## 2026-10-29: Fixes

- A bag holding only a left-out swarm no longer starts an empty throw that could not be scored: the swarm goes in.
- The Painter and The Sweeper now paint or strip the whole clone family, so a later paint can no longer undo them.
- A relic that burns up while sitting in a center ring leaves the ring, so Mimic and Reflection go back to copying.
- The Mystery Relic keeps the Regular's Tab discount after it restocks. Buying the relic you rigged the case for clears the rig.

## 2026-10-29: Stakes and milestones

- Stakes: six chips on the dice screen, from White to Gold. Winning a run unlocks the next one, and each adds a twist on top of the ones below: Red pays $1 less per round, Green makes shop rerolls climb $2 a time, Black raises every target 10%, Blue makes relics $1 dearer, Gold takes a throw off every boss round.
- Endless milestones: new achievements for reaching rounds 50, 75 and 100, a line when you pass rounds 40, 50, 75 and 100, and a badge next to deep runs on the boards.
- New run from the victory screen now posts your score first (and asks for your name if it needs one).
- Board names and champion requests are filtered for slurs and profanity.

## 2026-10-29: Epic relics

- Purple is now Epic, a tier between Rare (blue) and Legendary (gold). Shatterhand, Gravedigger, The Forger, The Fixer, Quad Squad, Snake Eyes, Royal Ladder, Chain Reaction and Showstopper are Epic ($11); Hall of Mirrors, Lady Luck, Grand Finale, Kingpin and Eternal Flame are Legendary again.
- Shop odds: Common 58%, Uncommon 26%, Rare 10%, Epic 4%, Legendary 2%. The Fence upgraded steps each rarity up one tier.

## 2026-10-29: Mystery Relic

- The Mystery Relic is back to needing a free relic slot: with a full bar it is not stocked.

## 2026-10-29: Big scores on the boards

- When the online board refuses a score, the run summary now says so instead of saying the boards could not be reached.

## 2026-10-28: Endless mode speed

- Long score chains play in beats: a swarm with retriggers now finishes in seconds instead of minutes, and a tap on the score box plays the rest at once.
- Bet odds no longer stall the round start with a big bag, and throws no longer redraw the whole screen twelve times a second.
- Glass shatters per clone family: one roll, and the whole family's face breaks together.

## 2026-10-28: Swarm fixes

- Throws and rerolls of 30 or more dice no longer break the 3D animation (dice that never landed and could not be tapped). Big tables shrink the dice so a swarm fits the felt.
- A swarm can stay in the bag: tap a clone in the bag to leave the whole family out of a throw, and tap again to put it back.
- One button picks the whole clone family: to throw, to score, or to reroll. Picking past the limit without the Clone Army set now says why nothing happened.
- Clones share their faces: paint a face on one and every clone of it gets it too (shop faces, packs, Arcana, the Back Alley, rewards, Midas Touch).
- The Mystery Relic case has a Skip button (or tap anywhere). The dice list in the shop stays open while you throw a die out.

## 2026-10-28: The long game

- The run is now won at round 30, not 15. Targets keep their curve up to 30 (round 20 needs 12,415, round 30 56,608) and the endless climb starts after the win. Night Owl is now reaching round 40.
- Mythic, a purple rarity above Legendary: Hall of Mirrors, Lady Luck, Grand Finale, Kingpin and Eternal Flame. Half a percent of shop relics and Mystery Relics, $18. The Fence upgraded turns Legendary into Mythic.
- The rigged case: after 10 Mystery Relic buys in a run, the Mystery Relic card lets you pick a relic you do not own; every later Mystery Relic has a 1 in 5 chance to be it, never a dud, until you win it.

## 2026-10-28: Beta feedback: features

- Set pieces light up: in the shop, packs, the Mystery Relic case and the Collection, a relic from a set you hold part of is marked, and hovering it lights the rest of the set in your bar.
- Every Legendary relic now belongs to a set: The Syndicate, Tapestry, Prophecy, Fragile Things, High Bench, Graveyard Shift, The Fix, Card Table, Charmed Life and Final Act.
- Clone Army is now two sets that share the Cloning Vat: Clone Army (Petri Dish, Brood Chamber) and Hive Mind (Sixth Sense, Swarm Cup). Together on one card they allow the Legion hand.
- The Mystery Relic restocks after every buy, $2 dearer each time in the same shop. You can hold up to 15 relic slots.
- New house rules: Second Shelf (one more relic every shop), Long Counter (one more offer every shop) and Fixed Rates (shop rerolls always cost $2). New relic, Window Shopper: every shop shows one more relic card.
- Two more six-dice hands for Sixth Sense: Three Pairs and Full Manor (quads + twins).
- The Looking Glass card has a center ring too: a relic in it is copied by both Mimic and Reflection.
- Drag a relic onto the sell zone under the bar to sell it. A Sets button sits beside Collection in the shop.

## 2026-10-28: Beta feedback: fixes

- The score pop-up is back to its normal size and scrolls into view under the table; menus and panels now cover the 3D dice.
- Skipping a round with bets placed says that the bets came back, and the Skip card warns about it.
- The money box counts up the moment a gold face, gold seal or golden die scores.
- House Credit relics now sit in the relic bar like any other (still taking no slot), so Mimic and Reflection can copy them and be copied, and you can move them. The merge pop-up says what a card with House Credit relics really takes.
- On a set card, Mimic and Reflection look to the other side of the card when their own side is empty.
- Picked dice sit above unpicked ones, so their seal dots and charm badges stay visible. The Sell button no longer jumps when it asks you to confirm.
- The online boards take scores of any size: run totals are no longer capped at ten billion, and numbers past a trillion read as 1.23e+15 on the boards, the score box and the records.

## 2026-10-28: The back room

- The Den is now a dark back room: the table sits in the middle and the edges sink into shadow, with drifting dust and a faint film grain.
- The room flickers and buzzes now and then. On boss rounds the shadows turn red and something in the dark is watching. Losing a run flashes the room red; a big win lifts the darkness for a moment. A low hum fills the room (it follows mute and volume).
- 3D dice are lit from straight above and throw longer shadows.
- The round, score, throws and money boxes are smaller, and the relic bar is bigger so your relics are easier to see and drag.
- The Roll, Reroll and Score buttons sit right under the table and stay on screen, and tips appear under them instead of on top. The tutorial card moved to the left on wide screens and the top corner on phones (it steps aside from whatever it points at, and folds into a tab).
- A real main menu: pick Player or Test, then Continue or New run, with tiles for the daily, seeded runs, high scores, the tutorial, the Codex, patch notes and settings. In a run, Settings > Main menu takes you back to it. On a computer it spreads into two columns, with bigger tiles.
- Turn it off in Settings > Room. Players who prefer reduced motion get the room without flicker, dust or grain motion.

## 2026-10-28: Wild dice, difficulties, new animations

- Difficulties: Relaxed, Normal, Hard and Brutal, picked on the dice screen. Only Normal runs go on the online boards.
- New Wild Set: every die is Wild, so every throw holds a hand, and you get 4 throws a round, but you score at most 3 dice. The Obsidian Set is now 7 dice, every one weighted (each rolls twice and keeps the higher).
- New relic, The Fence: Mystery Relics never come up a dud and Relic Packs show more relics.
- Chained dice no longer take throw slots: you throw a full hand from your bag and the chained dice ride along.
- Face sets (three Hearts, three Golds, Trifecta...) get their own banner and sparks. The Hammer swings onto any die you tap on the table or in the bag. The Back Alley coin flip is a real coin toss. Face paints are picked on the flat unfolded die, like the hover view.
- The score preview now shows the least a pick scores (hand chips and pips times its mult, before relics). A Hand levels button sits by the table and in the shop.
- Double Take now fires on Twins, Double Twins, Quads and the pair in a Full House. The Kicker charm and Kickback are gone. Targets climb fast after round 20.
- Settings is now a tidy grid of icon tiles, with a volume slider and the fine print folded away.
- The menu is cards instead of paragraphs: Rules shows four steps, every boss with its rule and when the next one comes, the special faces, and folding lists for charms, seals, Arcana and the rest. Hands shows example dice with chips and mult. Sets shows each set’s relics, lit as you collect them; hover or tap a relic to see what it does and whether you own it. Records shows your numbers as tiles, this run with its score chart, which dice sets you have unlocked, and achievement badges.
- Fixes: a Wild die fills Double Twins (5, 5, 6, Wild), a dragged relic no longer sticks in mid-air, and Settings opens from the dice screen.

## 2026-10-27: Polish, and the easy side

- Targets are lower across the run and every run starts with $4. The first boss is gentler and is never Tight Table, Small Table or Lights Out.
- Dice work is about 20% cheaper: faces $2, Loaded Die $4, charms and seals a dollar or two less.
- About 40 fixes from a full audit: daily seeds now match between players in every path, burned relics leave their merged cards, Lights Out and other boss rules behave, saves survive reloads, and the scoring animation can no longer be wiped mid-count.
- Balance: Odd Couple is ×1.5, Rising Tide grows +1 a round, Snowball counts real Twins only, Double Take fires on exact pairs, Signature Move caps at +12, Instant Noodles melts faster, pawning pays $12, The Reaper grows ×0.15 a kill but keeps growing at 5 dice, Trail Marker caps at +15 a die. The Obsidian Set loses its chip bonus.
- In 3D the reroll mark and scoring order ride with the flying dice.

## 2026-10-26: The Back Alley, five bosses, a swarm

- The Back Alley: every third round a stranger offers three deals on the way out of the shop.
- New bosses: The Bouncer, House Silence, Small Table, The Auditor, The Doorman. The Pit Boss's Favour house rule swaps a boss rule once.
- New relics: Comeback Kid, The Bookie, Hot Hand, The Reaper, Rabbit's Foot, Blood Pact, Swarm Cup (heads the shop once a clone family reaches 7). New Arcana: The Hammer.
- Cloning Vat makes a copy per copy relic, clones pop into the bag together, and Petri Dish families land looking identical.
- The pick line shows what your dice would score; the run summary has a score chart; seeded runs from the profile screen; the day's daily champion can ask for an addition to the game.

## 2026-10-25: Center ring

- The Three-Ring Circus center ring takes relics that already sit on another set card.
