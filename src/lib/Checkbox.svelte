<script lang="ts">
    export let checked = false;
</script>

<label>
    <input type="checkbox" bind:checked />
    <span><slot /></span>
</label>

<style>
    label {
        display: flex;
        flex-direction: row;
        cursor: pointer;

        width: 100%;
        margin: 8px 0 16px 0;

        transition: text-shadow var(--hover-duration);
    }

    label input {
        transition: box-shadow var(--hover-duration);
    }

    label:hover {
        text-shadow: 0 0 var(--glow-radius) var(--glow-color);
    }

    label:hover input {
        box-shadow: 0 0 var(--glow-radius) var(--glow-color);
    }

    span {
        margin: 3px 18px 0 18px;
        user-select: none;
    }

    input {
        position: relative;
        appearance: none;
        cursor: pointer;

        width: 32px;
        height: 32px;
        margin: 0;

        border: 3px solid white;
        border-right-style: dashed;
        border-bottom-style: dashed;

        background-color: transparent;

        transition: background-color var(--hover-duration);
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

        transform: translateY(-1px) rotate(45deg);
        opacity: 0;

        transition: opacity var(--hover-duration);
    }

    input:checked::after {
        opacity: 1;
    }
</style>
