# RPG Engine — Project Status

*Last updated after: engine core built + tested, UI skeleton built, extension entry point built (verified registration pattern, not yet wand-menu)*

---

## Full Intended Scope

Grouped by the six-step dev order from the original design doc.

### 1. Deterministic Engine Core
- [x] Configurable dice (standard d4–d100 + custom, e.g. d60)
- [x] Formula parser/evaluator (`2d6 + Strength`, `d60 + INT + 0.5*BLS`, implicit multiplication, parentheses)
- [x] Opposed Check rule type
- [x] Static Check rule type
- [ ] Free-form formula rule type *(the evaluator supports it technically — no dedicated wrapper function yet)*
- [x] Manual overrides, clearly distinguished from organic rolls (`forceTotal`, `forceOutcome`)
- [x] Result breakdown / RESULT-block text formatting
- [ ] Stats vs. Bonuses as a distinct, configurable-per-world concept *(currently just one flat `stats` object)*

### 2. UI
- [x] 9-section layout: 🌎 World · 👤 Characters · 📊 Stats · 🎲 Dice · ⚔️ Rules · 📜 Effects · 💾 Save/Load · ⚙️ Settings · 📋 Event Log
- [x] Mobile-first CSS (touch targets, button wrapping, small-screen tightening)
- [x] Drawer expand/collapse, wired and working
- [x] Live connection-status readout (character name, message count, chat ID) — **confirmed working live in SillyTavern**
- [x] All 9 sections wrapped in one outer master drawer, so the extension collapses to a single line in the Extensions list by default, matching every other installed extension's convention, instead of spilling its full contents into the page
- [x] Formula Tester wired to `engine-core.js` for real — first genuine bridge between the UI and the engine core
- [ ] Wand-menu / floating draggable panel (still deliberately deferred — current approach uses the verified plain Extensions-tab pattern)
- [ ] Every section besides Dice's Formula Tester is still placeholder content — no other buttons do anything yet

### 3. Persistent State Management
- [ ] Character state storage independent of individual chats
- [ ] Both user and narrator AI able to update state
- [ ] State survives between chat sessions

### 4. Configuration / Import-Export
- [ ] World Profile export/import (`Kaelrath_RPG.json`, `Shattered_Dominion_RPG.json`)
- [ ] Character state export/import
- [ ] Schema versioning (`schemaVersion` field for future migration)

### 5. Narrator Integration
- [ ] Structured AI ↔ Engine command system (`ACTION actor: ... action: ...` → `RESULT ...`)
- [ ] Two-pass generation, Variant A (narrator stops at intent → fast AI detects action → engine resolves → narrator continues)
- [ ] Fast/cheap secondary model for intent detection (separate connection profile)
- [ ] `FORCE_RESULT` mechanism, processed before the narrator writes the scene
- [ ] Inventory system (dynamic item creation, AI-parsed into structured objects, equip/unequip effects)
- [ ] Status effects with duration/decay

### 6. Natural-Language Lore Parser *(optional convenience layer, explicitly non-load-bearing)*
- [ ] AI-assisted parsing of authored rules from existing character/world lore (e.g. reading "Pounce = Strength + 0.5 Agility + d60" out of a character card)
- [ ] Assisted-authoring workflow: AI proposes → user approves/edits → engine stores as ground truth
- [ ] Caching so the full lorebook never needs to be re-sent every turn (the specific Story Engine failure this whole project exists to avoid)

---

## Deliberately Deferred / Lower Priority
Not forgotten, just explicitly not being built yet:
- World Progression (useful for Kaelrath's structured timeline; not a good fit for Shattered Dominion's sandbox style)
- Party system
- Maps
- AI-generated visualization/portraits
- Multiple simultaneous AI model roles beyond narrator + one fast model

---

## Files That Currently Exist

| File | Status | Purpose |
|---|---|---|
| `engine-core.js` | ✅ Built, tested (37/37 passing) | Pure dice/formula/check engine, zero SillyTavern dependency |
| `test-engine.js` | ✅ Built, passing | Verifies engine-core against the design doc's own worked examples |
| `settings.html` | ✅ Built | 9-section placeholder UI |
| `style.css` | ✅ Built | Mobile-first styling |
| `index.js` | ✅ Built, untested live | Real extension entry point, verified registration pattern |
| `manifest.json` | ✅ Built, valid JSON | Required for SillyTavern to recognize the extension |

**Important gap, now smaller:** the engine and the UI are connected in exactly one place — the Formula Tester. Every other drawer (World, Characters, Stats, Rules, Effects, Save/Load, Settings, Event Log) is still fully inert. The Formula Tester currently runs against a small hardcoded demo stat set (Kris's real stats + the design doc's Talia example numbers), not a real character system yet, since Stats/Characters haven't been built.

---

## Immediate Next Steps, In Order
1. ~~Confirm `index.js` actually loads in your live SillyTavern~~ — **done, confirmed live**, connection status showing real character/chat data.
2. ~~Wire the Formula Tester to `engine-core.js`~~ — **done**, tested against demo stats.
3. Wand-menu upgrade, once its real registration API is confirmed (not yet researched to the same confidence level as the current approach).
4. Persistent state (step 3 of the original order) — likely the next real feature step, since Formula Tester proved the wiring pattern works.
