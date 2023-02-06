<script lang="ts">
    import { pieceNames } from "./pieces";

    export let selected = "i-piece";

    function onKeyDown({ key }: KeyboardEvent) {
        if (/^[1-7]$/.test(key)) selected = pieceNames[parseInt(key) - 1];
    }
</script>

<svelte:window on:keydown={onKeyDown} />

<form>
    <input type="radio" name="piece" value="i-piece" bind:group={selected} />
    <input type="radio" name="piece" value="j-piece" bind:group={selected} />
    <input type="radio" name="piece" value="l-piece" bind:group={selected} />
    <input type="radio" name="piece" value="o-piece" bind:group={selected} />
    <input type="radio" name="piece" value="s-piece" bind:group={selected} />
    <input type="radio" name="piece" value="t-piece" bind:group={selected} />
    <input type="radio" name="piece" value="z-piece" bind:group={selected} />
</form>

<style>
    form {
        grid-area: toolbar;

        display: grid;
        grid-template-rows: repeat(7, min-content) auto;
        grid-template-columns: min-content;

        padding: 0.8rem;
        gap: 1rem;

        overflow-y: scroll;
        scrollbar-width: none;

        background-color: var(--bg-container);
        box-shadow: 0 0 var(--shadow-radius) var(--shadow-color);
    }

    form::-webkit-scrollbar {
        display: none;
    }

    input {
        appearance: none;
        cursor: pointer;

        width: 3rem;
        height: 3rem;

        border: var(--border) white;
        border-style: solid dashed dashed solid;

        background-image: var(--icon);
        background-size: contain;

        transition: background-color var(--hover-duration) var(--hover-timing),
            box-shadow var(--hover-duration) var(--hover-timing);
    }

    input:hover,
    input:checked {
        background-color: var(--hover-color);
    }

    input:hover {
        box-shadow: 0 0 var(--glow-radius) var(--glow-color);
    }

    input[value="i-piece"] {
        --icon: url("assets/i-piece-icon.svg");
        --hover-color: #00bcbc50;
    }

    input[value="j-piece"] {
        --icon: url("assets/j-piece-icon.svg");
        --hover-color: #0000d250;
    }

    input[value="l-piece"] {
        --icon: url("assets/l-piece-icon.svg");
        --hover-color: #d33c0050;
    }

    input[value="o-piece"] {
        --icon: url("assets/o-piece-icon.svg");
        --hover-color: #b3b30050;
    }

    input[value="s-piece"] {
        --icon: url("assets/s-piece-icon.svg");
        --hover-color: #00ac0050;
    }

    input[value="t-piece"] {
        --icon: url("assets/t-piece-icon.svg");
        --hover-color: #7e007e50;
    }

    input[value="z-piece"] {
        --icon: url("assets/z-piece-icon.svg");
        --hover-color: #95000050;
    }
</style>
