import { ExtraButtonComponent, Plugin, PluginManifest, Setting, request, Modal, App } from 'obsidian';
import ChangelogModal from 'src/ui/changeLogModal';
import { addIcons } from './ui/icons';

interface CommunityPlugin {
	id: string;
	name: string;
	author: string;
	description: string;
	repo: string;
}

export default class ChangelogPlugin extends Plugin {
	plugins: CommunityPlugin[];

	async onload() {
		console.log('loading plugin');

		addIcons();

		//@ts-ignore
		this.registerEvent(this.app.workspace.on("plugin-settings:plugin-control", (setting, manifest, enabled) => {
			//@ts-ignore
			this.createExtraButtons(setting, manifest, enabled);
		}));

		this.plugins = JSON.parse(await request({ url: "https://raw.githubusercontent.com/obsidianmd/obsidian-releases/master/community-plugins.json" })) as CommunityPlugin[];
	}

	createExtraButtons(setting: Setting, manifest: PluginManifest, enabled: boolean) {
		if (this.plugins) {
			setting.addExtraButton((btn: ExtraButtonComponent) => {
				btn.setIcon("changelog")
					.setTooltip("Read Changelog")
					.onClick(async () => new ChangelogModal(this, manifest).open());
			});
		}
	}

	async getChangelog(manifest: PluginManifest, version: string) {
		const plugin = this.getPluginInfo(manifest.id);
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

	async getAllTags(repo: string) {
		if (repo) {
			const resp = JSON.parse(await request({ url: `https://api.github.com/repos/${repo}/git/refs/tags` }))
			const tags: string[] = [];
			resp.forEach(element => {
				tags.push((element.ref as string).split("/").last());
			});
			return tags;
		}
	}

	getPluginInfo(id: string) {
		return this.plugins.find(plugin => plugin.id == id);
	}

	onunload() {
		console.log('unloading plugin');
	}
}

