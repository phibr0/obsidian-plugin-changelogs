import { ExtraButtonComponent, Plugin, PluginManifest, Setting, request, Modal, App, Notice } from 'obsidian';
import ChangelogModal from 'src/ui/changeLogModal';
import { addIcons } from './ui/icons';

interface CommunityPlugin {
	id: string;
	name: string;
	author: string;
	description: string;
	repo: string;
	tags: string[];
}

export default class ChangelogPlugin extends Plugin {
	plugins: CommunityPlugin[] = [];

	async onload() {
		console.log('loading plugin');

		addIcons();
		//@ts-ignore
		if (!this.app.plugins.getPlugin("hotkey-helper")) {
			new Notice("Please install the Plugin: \"Hotkey Helper\" by PJ Eby to use the Changelog Plugin.", 10000)
		} 

		//@ts-ignore
		this.registerEvent(this.app.workspace.on("plugin-settings:plugin-control", (setting: Setting, manifest: PluginManifest, enabled: boolean) => {
			//@ts-ignore
			this.createExtraButtons(setting, manifest, enabled);
		}));
	}

	async getCommunityPlugins() {
		if (this.plugins.length === 0) {
			this.plugins = JSON.parse(await request({ url: "https://raw.githubusercontent.com/obsidianmd/obsidian-releases/master/community-plugins.json" })) as CommunityPlugin[];
		}
		return this.plugins;
	}

	async createExtraButtons(setting: Setting, manifest: PluginManifest, enabled: boolean) {
		setting.addExtraButton((btn: ExtraButtonComponent) => {
			btn.setIcon("changelog")
				.setTooltip("Read Changelog")
				.onClick(async () => new ChangelogModal(this, manifest).open());
		});
	}

	async getChangelog(manifest: PluginManifest, version: string) {
		const plugin = await this.getPluginInfo(manifest.id);
		if (plugin) {
			const parser = new DOMParser();
			const releasePage = await request({
				url: `https://github.com/${plugin.repo}/releases/tag/${version}`
			});
			const releaseHTML = parser.parseFromString(releasePage, "text/html");
			const patchNotes = releaseHTML.getElementsByClassName("release-main-section")?.item(0).children.item(1);
			//@ts-ignore
			return window.DOMPurify.sanitize(patchNotes)
		}
	}

	async getAllTags(plugin: CommunityPlugin) {
		if (!plugin.tags) {
			console.log("api call")
			const resp = JSON.parse(await request({ url: `https://api.github.com/repos/${plugin.repo}/git/refs/tags` }))
			const tags: string[] = [];
			resp.forEach((element) => {
				tags.push((element.ref as string).split("/").last());
			});
			plugin.tags = tags;
		}
		return plugin.tags;
	}

	async getPluginInfo(id: string) {
		return (await this.getCommunityPlugins()).find(plugin => plugin.id == id);
	}

	onunload() {
		console.log('unloading plugin');
	}
}

