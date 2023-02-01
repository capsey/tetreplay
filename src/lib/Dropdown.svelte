<script lang="ts">
    export let selected: any = undefined;
</script>

<div>
    <label id="dropdown-label">
        <slot name="label" /><br />
    </label>
    <select id="select-element" bind:value={selected} on:change>
        <slot />
    </select>
</div>

<style>
    label {
        width: 100%;

        display: flex;
        flex-direction: row;
    }

    #dropdown-label:global(#dropdown-label span) {
        margin-bottom: 0;
        margin-top: 12px;

        user-select: none;
    }

    select {
        appearance: none;
        position: relative;
        cursor: pointer;

        width: 100%;
        height: 48px;
        padding: 10px 10px 6px 10px;
        margin: 0;
        margin-top: 2px;

        border: 3px solid white;
        border-right-style: dashed;
        border-bottom-style: dashed;

        background-color: transparent;

        transition: box-shadow 0.1s, background-color 0.1s;
    }

    select:hover,
    select:focus {
        background-color: #00ff0030;
        background-image: url(assets/t-piece-icon.svg);
        background-repeat: no-repeat;
        background-position: right center;
    }

    select:hover {
        box-shadow: 0 0 4px white;
    }

    #select-element:global(#select-element option) {
        color: black;
        background-color: white;
    }
</style>
