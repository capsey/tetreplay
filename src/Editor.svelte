<script lang="ts">
    import Board from './lib/Board.svelte';
    import NavigationBar from './lib/NavigationBar.svelte';
    import Toolbar from './lib/Toolbar.svelte';

    let selected = 'i-piece';
</script>

<div id="container">
    <NavigationBar />
    <Toolbar {selected} />
    <Board />
    <div id="info" />
</div>

<style>
    #container {
        display: grid;
        width: 100%;
        height: 100%;

        grid-template-areas:
            'navbar navbar navbar'
            'toolbar board info';

        grid-template-rows: min-content auto;
        grid-template-columns: 4.6rem auto auto;
    }

    #info {
        grid-area: info;
        border: 1px solid;
    }
</style>
