<script lang="ts">
    export let checked = false;
</script>

<label>
    <input type="checkbox" {checked} />
    <p><slot /></p>
</label>

<style>
    label {
        cursor: pointer;
        display: flex;
        flex-direction: row;
        width: 100%;
    }

    p {
        margin: 10px;
        user-select: none;
    }

    input {
        position: relative;
        appearance: none;
        cursor: pointer;
        width: 32px;
        height: 32px;
        margin: 8px;
        border: 3px solid white;
        border-right-style: dashed;
        border-bottom-style: dashed;
    }

    input:checked {
        background-color: #00ff0030;
    }

    input:checked:after {
        content: "";
        position: absolute;
        width: 100%;
        height: 100%;
        background-image: url("assets/j-piece-icon.svg");
        background-size: contain;
        background-repeat: no-repeat;
        transform: translateY(-1px) rotate(45deg);
    }
</style>
