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
    <div>
        <p>Replay settings:</p>
        <Checkbox bind:checked={$shouldClearLines}>
            Automatically clear lines
        </Checkbox>
        <Checkbox bind:checked={$onlyAllowDoable}>
            Only possible placements
        </Checkbox>
    </div>
    <div>
        <p>Board theme:</p>
        <Dropdown bind:selected={$themeSource}>
            {#each themes as theme}
                <option value={theme}>{theme.name}</option>
            {/each}
        </Dropdown>
    </div>
</main>

<style>
    main {
        flex: 1;

        display: flex;
        flex-direction: column;
        gap: 1rem;

        height: 100%;
        padding: 1.5rem;
        box-sizing: border-box;
        overflow-y: scroll;

        background-color: #000000be;
        box-shadow: 0 0 12px #000000aa;
    }

    p {
        cursor: default;
        margin: 0;
    }

    span.key {
        display: inline-block;
        text-align: center;

        min-width: 1rem;
        height: 1.3rem;
        padding: 0 4px 0 4px;

        background-color: #363636;
        box-shadow: 0 var(--extrude) #272727;
        border-radius: 6px;

        --extrude: 2px;
        transition: color var(--hover-duration),
            background-color var(--hover-duration),
            transform var(--hover-duration), box-shadow var(--hover-duration);
        transform-box: fill-box;
    }

    span.key:hover {
        color: rgb(150, 150, 150);
        transform: translateY(var(--extrude));
        background-color: #272727;
        box-shadow: 0 0 #272727;
    }
</style>
