<script lang="ts">
  import type { PluginManifest } from "obsidian";
  import type ChangelogPlugin from "src/main";

  export let plugin: ChangelogPlugin;
  export let manifest: PluginManifest;

  async function tagHelper(id: string): Promise<string[]> {
    return await plugin.getAllTags(await plugin.getPluginInfo(manifest.id));
  }

  let selectedTag = manifest.version;
  let tags = tagHelper(manifest.id);
  let changelog = plugin.getChangelog(manifest, manifest.version);

  function getChangelog() {
    changelog = plugin.getChangelog(manifest, selectedTag);
  }

  async function selectPrevious() {
    const tags = await tagHelper(selectedTag);
    selectedTag = tags[tags.indexOf(selectedTag) - 1];
    getChangelog();
  }

  async function selectNext() {
    const tags = await tagHelper(selectedTag);
    tags.length;
    selectedTag = tags[tags.indexOf(selectedTag) + 1];
    getChangelog();
  }
</script>

<main>
  <h2>
    {manifest.name}
  </h2>
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
      <div class="buttons">
        <button
          disabled={tags.indexOf(selectedTag) === 0}
          class="btn-previous"
          on:click={selectPrevious}
        >
          Previous Release
        </button>
        <a
          href={`https://github.com/${
            plugin.plugins.find((pre) => pre.id === manifest.id)?.repo
          }`}
          class="github-btn"
          ><svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            ><path
              d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
            /></svg
          ></a
        >
        <button
          disabled={tags.indexOf(selectedTag) === tags.length - 1}
          class="btn-next"
          on:click={selectNext}
        >
          Next Release
        </button>
      </div>
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

  .github-btn {
    height: 24px;
  }

  .buttons {
    display: flex;
    place-content: center;
    align-items: center;
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
