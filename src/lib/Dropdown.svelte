<script lang="ts">
    export let selected: any;
</script>

<select class="select-element" bind:value={selected} on:change>
    <slot />
</select>

<style>
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

        background-image: url(assets/t-piece-icon.svg);
        background-repeat: no-repeat;
        background-position: right center;

        transition: box-shadow var(--hover-duration),
            background-color var(--hover-duration);
    }

    select:hover,
    select:focus {
        background-color: var(--hover-color);
    }

    select:hover {
        box-shadow: 0 0 var(--glow-radius) var(--glow-color);
    }

    .select-element:global(.select-element option) {
        color: black;
        background-color: white;
    }
</style>
