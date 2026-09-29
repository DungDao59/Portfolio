// Shared intro-sequence state.
//
// The cinematic intro runs inside the R3F frame loop (camera fly-in + particle
// convergence) while React overlays (Preloader HUD, Hero) need to know when it is
// playing. `progress` is read every frame by 3D code and is NOT a React value;
// `active` is a React-subscribable boolean (via `subscribe`) so overlays can gate
// on it with useSyncExternalStore.

type Listener = () => void;

let active = true; // default true so the gated Hero stays hidden until the intro resolves
let progress = 0; // 0..1 timeline, driven by the Preloader clock

const listeners = new Set<Listener>();
const emit = () => {
  for (const l of listeners) l();
};

export const introState = {
  isActive: () => active,
  getProgress: () => progress,
  setProgress: (p: number) => {
    progress = p < 0 ? 0 : p > 1 ? 1 : p;
  },
  /** Begin (or restart) the intro timeline. */
  reset: () => {
    active = true;
    progress = 0;
    emit();
  },
  /** End the intro; hands camera control to ScrollCamera and reveals the hero. */
  finish: () => {
    if (!active) return;
    active = false;
    progress = 1;
    emit();
  },
  subscribe: (l: Listener) => {
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  },
};
