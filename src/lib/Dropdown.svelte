<script lang="ts">
    export let selected: any;
    export let tooltip: string = undefined;
</script>

<select title={tooltip} class="select-element" bind:value={selected} on:change>
    <slot />
</select>

<style>
    select {
        appearance: none;
        position: relative;
        cursor: pointer;

        width: 100%;
        padding: 0.6rem 0.6rem 0.4rem 0.6rem;
        margin: 0;
        margin-top: 0.4rem;

        border: var(--border) white;
        border-style: solid dashed dashed solid;

        background-color: transparent;

        background-image: url(assets/t-piece-icon.svg);
        background-repeat: no-repeat;
        background-position: right center;

        transition: box-shadow var(--hover-duration) var(--hover-timing),
            background-color var(--hover-duration) var(--hover-timing);
    }

    select:hover,
    select:focus {
        background-color: var(--hover-color);
    }

    select:hover {
        box-shadow: 0 0 var(--glow-radius) var(--glow-color);
    }

    /* Fix browser pop-up colors */
    .select-element:global(.select-element option) {
        color: black;
        background-color: white;
    }
</style>
