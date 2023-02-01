import { derived, writable } from "svelte/store";
import { getTheme, themes, type BoardTheme, type BoardThemeSource } from "../renderers";

export const themeSource = writable<BoardThemeSource>(themes[0]);
export const theme = derived<typeof themeSource, BoardTheme>(themeSource, (source, set) => {
    getTheme(source).then(value => set(value));
});