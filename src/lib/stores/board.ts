import { writable } from "svelte/store";
import { Matrix } from "../utilities";

// Settings
export const clearLines = writable(true);
export const onlyPossible = writable(true);

// Board
const rows = 22;
const cols = 10;

export const board = writable(new Matrix(rows, cols, -1));
