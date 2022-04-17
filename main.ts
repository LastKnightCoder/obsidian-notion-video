import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';
import Notion from 'notion';

interface NotionSettings {
  secret: string;
}

const DEFAULT_SETTINGS: NotionSettings = {
  secret: '',
}

export default class MyPlugin extends Plugin {
  settings: NotionSettings;

  async onload() {
    await this.loadSettings();
    const notion = new Notion(this.settings.secret);

    this.addCommand({
      id: 'Add Video From Notion',
      name: 'Add Video From Notion',
      editorCallback: async (editor: Editor, view: MarkdownView) => {
        new SampleModal(this.app, async block_id => {
          notion.getVideoURL(block_id).then(url => {
            if (url) {
              editor.replaceRange(`<video controls src="${url}" block_id=${block_id}></video>`, editor.getCursor());
              new Notice("Insert video success")
            } else {
              new Notice("It's not a video block")
            }
          }).catch(err => {
            console.error(err);
            new Notice('Network error happens')
          })
          
        }).open();
      }
    })

    this.addSettingTab(new SampleSettingTab(this.app, this));
  }

  onunload() {

  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}

class SampleModal extends Modal {
  block_id: string;
  callback: (block_id: string) => void;

  constructor(app: App, callback: (block_id: string) => void) {
    super(app);
    this.block_id = '';
    this.callback = callback;
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.createEl('h3', {
      text: 'Input your video block_id',
    })

    new Setting(contentEl)
      .setName('block_id')
      .addText(text => {
        text.onChange(block_id => {
          this.block_id = block_id;
        })
      })
    
    new Setting(contentEl)
      .addButton(btn => {
        btn.setButtonText('OK')
          .onClick(() => {
            this.close();
            this.callback(this.block_id);
          })
      })
  }

  onClose() {
    const { contentEl } = this;
    contentEl.empty();
  }
}

class SampleSettingTab extends PluginSettingTab {
  plugin: MyPlugin;

  constructor(app: App, plugin: MyPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;

    containerEl.empty();

    containerEl.createEl('h2', { text: 'Settings for Notion Plugin.' });

    new Setting(containerEl)
      .setName('Notion intergration secret')
      .setDesc('It\'s a intergration secret')
      .addText(text => text
        .setPlaceholder('Enter your secret')
        .setValue(this.plugin.settings.secret)
        .onChange(async (value) => {
          this.plugin.settings.secret = value;
          await this.plugin.saveSettings();
        }));
  }
}
