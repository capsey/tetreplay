<script lang="ts">
    import Checkbox from "./Checkbox.svelte";
    import Dropdown from "./Dropdown.svelte";
    import { themes } from "./renderers";
    import { clearLines, onlyPossible } from "./stores/board";
    import { themeSource } from "./stores/preferences";
</script>

<main>
    Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptate, beatae
    ut? Dicta excepturi veniam ab illum adipisci natus sunt quaerat fugit
    repellendus dolorum vitae nostrum repudiandae eos optio, iste quos.
    <form>
        <Checkbox bind:checked={$clearLines}>
            <span>Automatically clear lines</span>
        </Checkbox>
        <Checkbox bind:checked={$onlyPossible}>
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

    form {
        width: 100%;
    }
</style>
