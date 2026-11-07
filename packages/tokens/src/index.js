export const PRESETS = Object.freeze(['site', 'lab']);
export const F_PX = 14;

export function applyPreset(name = 'site', root = globalThis.document?.documentElement) {
  if (!PRESETS.includes(name)) {
    throw new Error(`Unknown preset: ${name}`);
  }
  if (!root) return name;
  root.dataset.preset = name;
  return name;
}

export function setInverted(on, root = globalThis.document?.documentElement) {
  if (!root) return;
  root.classList.toggle('inverted', Boolean(on));
}
