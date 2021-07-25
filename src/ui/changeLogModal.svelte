<script lang="ts">
  import type { PluginManifest } from "obsidian";
  import type ChangelogPlugin from "src/main";

  export let plugin: ChangelogPlugin;
  export let manifest: PluginManifest;

  async function tagHelper(id: string): Promise<string[]>{
    return await plugin.getAllTags((await plugin.getPluginInfo(manifest.id)));
  }

  let selectedTag = manifest.version;
  let tags = tagHelper(manifest.id);
  let changelog = plugin.getChangelog(manifest, manifest.version);

  function getChangelog() {
    changelog = plugin.getChangelog(manifest, selectedTag);
  }
</script>

<main>
  <h2>{manifest.name}</h2>
  {#await tags}
    <div class="center">
      <div class="spinner" />
    </div>
  {:then tags}
    <div class="descContainer">
      <span class="desc">Your Version: {manifest.version}</span>
      <select
        class="dropdown"
        name="Version"
        bind:value={selectedTag}
        on:change={getChangelog}
      >
        {#each tags as tag}
          <option value={tag}>{tag}</option>
        {/each}
      </select>
    </div>
    <h3>Changelog</h3>
    {#await changelog}
      <div class="center">
        <div class="spinner" />
      </div>
    {:then changelog}
      {#if changelog}
        {@html changelog}
      {:else}
        Can't find the Changelog
      {/if}
    {/await}
  {:catch}
    <div class="error">Something went wrong..</div>
  {/await}
</main>

<style lang="scss">
  main {
    min-height: 25vh;
    min-width: 33vw;
  }

  .descContainer {
    display: flex;
    place-content: space-between;
  }

  .center {
    margin: auto;
    width: 100%;
    margin-top: 2rem;
  }

  @keyframes spinner {
    0% {
      transform: translate3d(-50%, -50%, 0) rotate(0deg);
    }
    100% {
      transform: translate3d(-50%, -50%, 0) rotate(360deg);
    }
  }

  .spinner {
    // The height here is just for demo purposes
    height: 3rem;
    opacity: 1;
    position: relative;
    transition: opacity linear 0.1s;
    &::before {
      animation: 2s linear infinite spinner;
      border: solid 3px var(--background-modifier-border);
      border-bottom-color: var(--interactive-accent);
      border-radius: 50%;
      content: "";
      height: 40px;
      left: 50%;
      opacity: inherit;
      position: absolute;
      top: 50%;
      transform: translate3d(-50%, -50%, 0);
      transform-origin: center;
      width: 40px;
      will-change: transform;
    }
  }
</style>
