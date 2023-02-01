<script lang="ts">
    import Checkbox from "./Checkbox.svelte";
    import Dropdown from "./Dropdown.svelte";
    import { themes } from "./renderers";
    import { shouldClearLines, onlyAllowDoable } from "./stores/board";
    import { themeSource } from "./stores/preferences";
</script>

<main>
    <p>
        Place pieces on the board by hovering on correct place and left-clicking
        on the board using. You can also rotate the piece using right-click. To
        undo piece placement you can press <span class="key">Ctrl+Z</span>. To
        clear the board press <span class="key">Backspace</span>.
    </p>
    <p>
        Alternatively, you can use <span class="key">TAB</span> key to focus on
        the board and move the piece using <span class="key">Arrow</span> keys,
        place it using <span class="key">Enter</span> key and rotate using
        <span class="key">Q</span>, <span class="key">W</span> and
        <span class="key">E</span> keys.
    </p>
    <p>Replay settings:</p>
    <form>
        <Checkbox bind:checked={$shouldClearLines}>
            <span>Automatically clear lines</span>
        </Checkbox>
        <Checkbox bind:checked={$onlyAllowDoable}>
            <span>Only possible placements</span>
        </Checkbox>
        <Dropdown bind:selected={$themeSource}>
            <span slot="label">Board theme</span>
            {#each themes as theme}
                <option value={theme}>{theme.name}</option>
            {/each}
        </Dropdown>
    </form>
</main>

<style>
    main {
        flex: 1;

        display: flex;
        flex-direction: column;
        gap: 1rem;

        padding: 1.5rem;

        background-color: #000000be;
        box-shadow: 0 0 12px #000000aa;
    }

    p {
        margin: 0;
    }

    span.key {
        padding: 4px 6px 1px 6px;

        background-color: #363636;
        box-shadow: 0 4px #272727;
        border-radius: 6px;

        user-select: none;
    }

    form {
        width: 100%;
    }
</style>
