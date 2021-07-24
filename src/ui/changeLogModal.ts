import { Modal, PluginManifest } from "obsidian";
import type ChangelogPlugin from "src/main";
import ChangelogComponent from "./changeLogModal.svelte"

export default class ChangelogModal extends Modal {
	manifest: PluginManifest;
	plugin: ChangelogPlugin;
	view: ChangelogComponent;

	constructor(plugin: ChangelogPlugin, manifest: PluginManifest) {
		super(plugin.app);
		this.plugin = plugin;
		this.manifest = manifest;
	}

	async onOpen() {
		this.view = new ChangelogComponent({
			target: this.contentEl,
			props: {
				plugin: this.plugin,
				manifest: this.manifest,
			}
		});
	}

	onClose() {
		this.view.$destroy();
	}
}