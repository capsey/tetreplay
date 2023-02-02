<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { pieceNames } from "./pieces";

    const dispatch = createEventDispatcher<{ selected: number }>();

    let selected = "i-piece";

    $: if (selected) {
        const index = pieceNames.findIndex((x) => x === selected);
        dispatch("selected", index);
    }

    function onKeyDown(event: KeyboardEvent) {
        if (/^[1-7]$/.test(event.key)) {
            const index = parseInt(event.key) - 1;
            selected = pieceNames[index];
        }
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
        height: 100%;
        box-sizing: border-box;
        padding: 16px;

        display: flex;
        flex-direction: column;
        gap: 16px;

        background-color: #000000be;
        box-shadow: 0 0 12px #000000aa;
    }

    input {
        position: relative;
        appearance: none;
        cursor: pointer;

        width: 56px;
        height: 56px;
        margin: 0;

        border: 3px solid white;
        border-right-style: dashed;
        border-bottom-style: dashed;

        background-image: var(--icon);
        background-repeat: no-repeat;
        background-size: contain;

        transition: background-color var(--hover-duration),
            box-shadow var(--hover-duration);
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
