import { create } from "zustand";

/**
 * Minimal app store – extend or add slices as needed.
 * Usage: const value = useAppStore((s) => s.value);
 */
interface AppState {
    // placeholder – add app-wide state here
}

export const useAppStore = create<AppState>(() => ({}));
