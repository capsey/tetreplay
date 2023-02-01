<script lang="ts">
    export let checked = false;
</script>

<label id="checkbox-label">
    <input type="checkbox" bind:checked />
    <slot />
</label>

<style>
    label {
        display: flex;
        flex-direction: row;
        cursor: pointer;

        width: 100%;
        margin-bottom: 20px;

        transition: text-shadow 0.1s;
    }

    label input {
        transition: box-shadow 0.1s;
    }

    label:hover {
        text-shadow: 0 0 4px white;
    }

    label:hover input {
        box-shadow: 0 0 4px white;
    }

    #checkbox-label:global(#checkbox-label span) {
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

        transition: background-color 0.1s;
    }

    input:hover {
        background-color: #00ff0030;
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

        transition: opacity 0.1s;
    }

    input:checked::after {
        opacity: 1;
    }
</style>
