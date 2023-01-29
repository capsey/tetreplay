<script lang="ts">
    import Checkbox from "./Checkbox.svelte";
</script>

<main>
    Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptate, beatae
    ut? Dicta excepturi veniam ab illum adipisci natus sunt quaerat fugit
    repellendus dolorum vitae nostrum repudiandae eos optio, iste quos.
    <form>
        <Checkbox checked={true}>Automatically clear lines</Checkbox>
        <Checkbox checked={true}>Only possible placements</Checkbox>
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
