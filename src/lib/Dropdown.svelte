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
        display: flex;
        flex-direction: row;
        width: 100%;
    }

    #dropdown-label:global(#dropdown-label span) {
        margin: 8px;
        margin-bottom: 0;
        margin-top: 12px;
        user-select: none;
    }

    select {
        position: relative;
        appearance: none;
        cursor: pointer;
        width: calc(100% - 18px);
        height: 48px;
        margin: 8px;
        margin-top: 2px;
        border: 3px solid white;
        border-right-style: dashed;
        border-bottom-style: dashed;
        padding: 10px 10px 6px 10px;
        background-color: transparent;
    }

    select:hover,
    select:focus {
        background-color: #00ff0030;
        background-image: url(assets/t-piece-icon.svg);
        background-repeat: no-repeat;
        background-position: right center;
    }

    #select-element:global(#select-element option) {
        color: black;
        background-color: white;
    }
</style>
