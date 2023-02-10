<script lang="ts">
    import Editor from './Editor.svelte';
</script>

<div id="background" />
<Editor />

<style>
    #background {
        position: fixed;
        inset: 0;
        z-index: -1;

        background-image: url('https://images.unsplash.com/photo-1673217611194-579eee2a6ff8?auto=format&fit=crop&w=2070&q=80');
        background-size: cover;
        background-repeat: no-repeat;
        filter: brightness(50%);
    }
</style>
