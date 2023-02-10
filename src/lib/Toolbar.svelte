<script lang="ts">
    export let selected: string;
</script>

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
        grid-template-rows: repeat(7, auto) 1fr;

        padding: 0.8rem;
        gap: 0.8rem;

        background: var(--bg-container);
    }

    input {
        appearance: none;
        cursor: pointer;

        aspect-ratio: 1 / 1;

        border: var(--border) white;
        border-style: solid dashed dashed solid;

        background-image: var(--icon);
        background-size: contain;

        transition: background-color var(--hover-duration) var(--hover-timing), box-shadow var(--hover-duration) var(--hover-timing);
    }

    input:hover,
    input:checked {
        background-color: var(--hover-color);
    }

    input:hover {
        box-shadow: 0 0 var(--glow-radius) var(--glow-color);
    }

    input[value='i-piece'] {
        --icon: url('../assets/i-piece-icon.svg');
        --hover-color: #0ff6;
    }

    input[value='j-piece'] {
        --icon: url('../assets/j-piece-icon.svg');
        --hover-color: #00f6;
    }

    input[value='l-piece'] {
        --icon: url('../assets/l-piece-icon.svg');
        --hover-color: #ff810066;
    }

    input[value='o-piece'] {
        --icon: url('../assets/o-piece-icon.svg');
        --hover-color: #ff06;
    }

    input[value='s-piece'] {
        --icon: url('../assets/s-piece-icon.svg');
        --hover-color: #0f06;
    }

    input[value='t-piece'] {
        --icon: url('../assets/t-piece-icon.svg');
        --hover-color: #f0f6;
    }

    input[value='z-piece'] {
        --icon: url('../assets/z-piece-icon.svg');
        --hover-color: #f006;
    }
</style>
