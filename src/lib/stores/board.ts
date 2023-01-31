import { writable } from "svelte/store";
import { Matrix } from "../utilities";

export const rows = 22;
export const cols = 10;

export const board = writable(new Matrix(rows, cols, -1));
