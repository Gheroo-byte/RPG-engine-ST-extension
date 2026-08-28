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
- [x] Live connection-status readout (character name, message count, chat ID)
- [ ] Wand-menu / floating draggable panel (currently using the plain Extensions-tab list as the verified-safe baseline — this is the deliberate next upgrade)
- [ ] Every section is currently placeholder content — no buttons do anything yet, including the Formula Tester box, which isn't wired to `engine-core.js` even though the engine underneath it already works

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

**Important gap worth naming plainly:** the engine and the UI are both individually built and individually verified, but **not yet connected to each other.** The Formula Tester box in the Dice section is inert — typing a formula there does nothing right now, even though the exact same formula would evaluate correctly if run through `test-engine.js` directly. Wiring that box up would be a good, small, satisfying first integration task once live-loading in SillyTavern is confirmed working.

---

## Immediate Next Steps, In Order
1. **Confirm `index.js` actually loads in your live SillyTavern** — the connection-status box is the test. This hasn't been verified live yet, only that the code is written against confirmed-real APIs.
2. Wire the Formula Tester to `engine-core.js` — first real bridge between the two halves, low-risk, easy to verify by hand.
3. Wand-menu upgrade, once its real registration API is confirmed (not yet researched to the same confidence level as the current approach).
4. Persistent state (step 3 of the original order).
