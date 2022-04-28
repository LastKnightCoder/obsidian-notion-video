import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting, TFile } from 'obsidian';
import Notion from 'notion';

interface NotionSettings {
  secret: string;
}

const DEFAULT_SETTINGS: NotionSettings = {
  secret: '',
}

export default class NotionPlugin extends Plugin {
  settings: NotionSettings;
  // 防止每次打开文件的时候都要请求数据，将文件的路径进行缓存
  cached: Set<string>;

  async onload() {
    await this.loadSettings();
    const notion = new Notion(this.settings.secret);
    this.cached = new Set<string>();

    this.addCommand({
      id: 'Add Video From Notion',
      name: 'Add Video From Notion',
      editorCallback: async (editor: Editor, view: MarkdownView) => {
        new VideoModal(this.app, async block_id => {
          try {
            const url = await notion.getVideoURL(block_id)
            if (url) {
              editor.replaceRange(`<video controls src="${url}" data-block-id="${block_id}"></video>`, editor.getCursor());
              new Notice("Insert video success")
            } else {
              new Notice("It's not a video block")
            }
          } catch(err) {
            console.error(err);
            new Notice('Network error happens')
          }
          
        }).open();
      }
    })

    this.addSettingTab(new SampleSettingTab(this.app, this));

    // 每次打开文件的时候，更新其中的 Notion Video 链接
    this.registerEvent(this.app.workspace.on('file-open', async (file: TFile) => {   
      // 只处理 Markdown 文件   
      if (file?.extension === 'md') {        
        // 文件已经被缓存过，不用再次请求
        if (this.cached.has(file.path)) {
          return;
        }
        this.cached.add(file.path);
        const { vault } = this.app;
        const data = await vault.read(file);
        const newdata = await this.findVideoAndReplace(data, notion);
        if (data === newdata) {
          // new Notice("内容没有变化")
          return;
        }
        await vault.modify(file, newdata);
        new Notice("Update Video URL Success!");
      }
    }))
  }

  // 提取包含 data-block-id 属性的 video 标签，
  async findVideoAndReplace(data: string, notion: Notion): Promise<string> {
    const reg: RegExp = /<video.*data-block-id="(?<id>[^"]*)".*><\/video>/g;
    let res;
    while((res = reg.exec(data))) {
      // console.log(res)
      const block_id = res.groups.id;
      if (!block_id) {
        continue;
      }
      const url = await notion.getVideoURL(block_id);
      if (url) {
        data = data.replace(res[0], `<video controls src="${url}" data-block-id="${block_id}"></video>`);
      }
    }

    return data;
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

class VideoModal extends Modal {
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
  plugin: NotionPlugin;

  constructor(app: App, plugin: NotionPlugin) {
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
