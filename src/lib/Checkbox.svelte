<script lang="ts">
    export let checked = false;
    export let tooltip: string = undefined;
</script>

<label title={tooltip}>
    <input type="checkbox" bind:checked />
    <span><slot /></span>
</label>

<style>
    label {
        display: flex;
        flex-direction: row;
        cursor: pointer;

        width: 100%;
        padding: 0.4rem 0 0.4rem 0;

        transition: text-shadow var(--hover-duration) var(--hover-timing);
    }

    label input {
        transition: box-shadow var(--hover-duration) var(--hover-timing);
    }

    label:hover {
        text-shadow: 0 0 var(--glow-radius) var(--glow-color);
    }

    label:hover input {
        box-shadow: 0 0 var(--glow-radius) var(--glow-color);
    }

    span {
        margin: auto 0.8rem auto 0.8rem;
        user-select: none;
    }

    input {
        position: relative;
        appearance: none;
        cursor: pointer;

        width: 1.8rem;
        height: 1.8rem;
        margin: 0;

        border: var(--border) white;
        border-style: solid dashed dashed solid;

        background-color: transparent;

        transition: background-color var(--hover-duration) var(--hover-timing);
    }

    input:hover {
        background-color: var(--hover-color);
    }

    input::after {
        content: "";
        position: absolute;

        width: 100%;
        height: 100%;

        background-image: url("assets/j-piece-icon.svg");
        background-size: contain;
        background-repeat: no-repeat;

        translate: 0 calc(var(--border) * -0.5);
        opacity: 0;

        --delay: var(--hover-duration);
        transition: rotate var(--hover-duration) var(--hover-timing),
            opacity var(--hover-duration) var(--hover-timing) var(--delay);
    }

    input:checked::after {
        opacity: 1;
        rotate: -45deg;

        transition: opacity var(--hover-duration) var(--hover-timing),
            rotate var(--hover-duration) var(--hover-timing) var(--delay);
    }
</style>
