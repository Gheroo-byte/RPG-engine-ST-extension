/**
 * RPG Engine - Extension Entry Point
 * ====================================
 * Registration pattern verified against official docs.ST.app documentation
 * (SillyTavern.getContext() + renderExtensionTemplateAsync + append to
 * #extensions_settings2) - not guessed.
 *
 * CURRENT SCOPE (matches the dev order - this is step 2, "UI", nothing more):
 *   - Load and display the 9-section settings panel
 *   - Wire up drawer expand/collapse (pure UI, no engine logic)
 *   - Display a live connection status readout, so we can tell at a glance
 *     whether the extension is actually talking to SillyTavern correctly
 *     (this directly answers "capable of connecting to see where we are")
 *
 * EXPLICITLY NOT YET WIRED:
 *   - No calls into engine-core.js from here yet
 *   - No narrator/chat integration
 *   - No persistence
 * Those are later, separate, isolated steps - keeping this file's job
 * narrow on purpose so a failure here can only mean "the UI shell has a
 * problem," not "the UI shell AND the engine AND persistence all broke
 * at once and I can't tell which."
 */

const MODULE_NAME = 'rpg-engine';
const EXTENSION_FOLDER = 'third-party/RPG-engine-ST-extension';

/**
 * Populates the #rpg-connection-status element with live info pulled
 * from SillyTavern.getContext(). This is the "prove we're actually
 * connected" diagnostic - if this shows real, current data, the
 * extension loaded and is talking to ST correctly. If it shows an
 * error or never appears at all, that's an immediate, obvious signal
 * something's wrong with THIS file specifically.
 */
function renderConnectionStatus() {
  const statusEl = document.getElementById('rpg-connection-status');
  if (!statusEl) return;

  try {
    const context = SillyTavern.getContext();
    const chatId = context.chatId ?? '(no active chat)';
    const characterName = context.characters?.[context.characterId]?.name ?? '(no character loaded)';
    const messageCount = context.chat?.length ?? 0;

    statusEl.innerHTML = `
      <span class="rpg-status-ok">● Connected</span>
      <span class="rpg-status-detail">Character: ${escapeHtml(characterName)}</span>
      <span class="rpg-status-detail">Messages in chat: ${messageCount}</span>
      <span class="rpg-status-detail">Chat ID: ${escapeHtml(String(chatId))}</span>
    `;
  } catch (err) {
    statusEl.innerHTML = `
      <span class="rpg-status-error">● Connection error</span>
      <span class="rpg-status-detail">${escapeHtml(err.message || String(err))}</span>
    `;
    console.error(`[${MODULE_NAME}] Failed to read SillyTavern context:`, err);
  }
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/** Wires up click-to-expand/collapse on every .rpg-drawer section. */
function wireDrawers() {
  const drawers = document.querySelectorAll('.rpg-drawer');
  drawers.forEach((drawer) => {
    const toggle = drawer.querySelector('.rpg-drawer-toggle');
    if (!toggle) return;
    toggle.addEventListener('click', () => {
      drawer.classList.toggle('open');
    });
  });
}

/** Wires the master enable/disable checkbox. UI-only for now; doesn't
 *  actually gate any engine behavior yet since there's no engine
 *  behavior wired in here to gate. */
function wireMasterToggle() {
  const toggle = document.getElementById('rpg-engine-master-toggle');
  if (!toggle) return;
  toggle.addEventListener('change', () => {
    console.log(`[${MODULE_NAME}] Master toggle set to: ${toggle.checked}`);
  });
}

async function init() {
  console.log(`[${MODULE_NAME}] Initializing...`);

  try {
    const context = SillyTavern.getContext();
    const settingsHtml = await context.renderExtensionTemplateAsync(EXTENSION_FOLDER, 'settings', {});
    $('#extensions_settings2').append(settingsHtml);

    wireDrawers();
    wireMasterToggle();
    renderConnectionStatus();

    // Re-render connection status on key chat events, so the readout
    // stays live rather than showing a stale snapshot from page load.
    const { eventSource, event_types } = context;
    if (eventSource && event_types) {
      eventSource.on(event_types.CHAT_CHANGED, renderConnectionStatus);
      eventSource.on(event_types.MESSAGE_RECEIVED, renderConnectionStatus);
      eventSource.on(event_types.APP_READY, renderConnectionStatus);
    }

    console.log(`[${MODULE_NAME}] Loaded successfully.`);
  } catch (err) {
    console.error(`[${MODULE_NAME}] FAILED TO LOAD:`, err);
    // Fail loudly but don't throw further - a broken RPG engine extension
    // should never be able to take down the rest of SillyTavern with it.
  }
}

// SillyTavern extensions initialize once the app is ready, not on raw
// page load, so context/eventSource are guaranteed to exist by the time
// init() runs.
jQuery(async () => {
  init();
});
