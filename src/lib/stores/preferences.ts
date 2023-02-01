import { derived, writable } from "svelte/store";
import { getTheme, type BoardTheme } from "../renderers";

export const themeSource = writable("theme-default.png");
export const theme = derived<typeof themeSource, BoardTheme>(themeSource, (source, set) => {
    getTheme(source).then(value => set(value));
})