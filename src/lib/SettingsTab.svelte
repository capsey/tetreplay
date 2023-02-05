<script lang="ts">
    import Checkbox from "./Checkbox.svelte";
    import Dropdown from "./Dropdown.svelte";
    import { themes } from "./rendering";
    import { shouldClearLines, onlyAllowDoable } from "./stores/board";
    import { themeSource } from "./stores/preferences";
</script>

<main>
    <p>
        Place pieces on the board by hovering on correct place and left-clicking
        on the board. You can also rotate the piece using right-click. To undo
        piece placement press <span class="key">Ctrl+Z</span>. To clear the
        board press <span class="key">Backspace</span>.
    </p>
    <p>
        Alternatively, you can use <span class="key">TAB</span> key to focus on
        the board and move the piece using arrow keys, place it using
        <span class="key">Enter</span> key and rotate using
        <span class="key">Q</span>, <span class="key">W</span> and
        <span class="key">E</span> keys.
    </p>
    <p>
        To select a piece to place you can use toolbar on the left, or press
        number keys from <span class="key">1</span> to
        <span class="key">7</span>.
    </p>
    <section>
        <p>Replay settings:</p>
        <Checkbox bind:checked={$shouldClearLines}>
            Automatically clear lines
        </Checkbox>
        <Checkbox bind:checked={$onlyAllowDoable}>
            Only possible placements
        </Checkbox>
    </section>
    <section>
        <p>Board theme:</p>
        <Dropdown bind:selected={$themeSource}>
            {#each themes as theme}
                <option value={theme}>{theme.name}</option>
            {/each}
        </Dropdown>
    </section>
</main>

<style>
    main {
        grid-area: settings;

        display: flex;
        flex-direction: column;
        gap: 1rem;

        height: 100%;
        padding: 1.5rem;
        overflow-y: scroll;

        background-color: var(--bg-container);
        box-shadow: 0 0 var(--shadow-radius) var(--shadow-color);
    }

    p {
        cursor: default;
    }

    span.key {
        display: inline-block;
        text-align: center;

        min-width: 1.25rem;
        height: 1.25rem;
        padding: 0 0.25rem;

        background-color: #363636;
        box-shadow: 0 0.15rem #272727;
        border-radius: 0.35rem;
    }
</style>
