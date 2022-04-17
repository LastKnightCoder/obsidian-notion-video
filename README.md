## Introduction

This plugin can access content in Notion through the Notion API, You need to provide Notion intergration secrets in the settings and enter the corresponding block_id to get the content of the block.

## Usage

First you need to go to the plugin's settings page and enter secrets here, if you don't know what secrets are you can see [this page](https://developers.notion.com/docs).

<img src="https://cdn.jsdelivr.net/gh/LastKnightCoder/ImgHosting3@master/202204172243532022-04-17-22-43-54.png" style="zoom:50%"/>

Back to your editor page, press the shortcut <Ctrl>Ctrl + P</kbd> to open the command panel, then type **Notion API**, then you can see all the relevant commands.

<img src="https://cdn.jsdelivr.net/gh/LastKnightCoder/ImgHosting3@master/202204172248542022-04-17-22-48-55.png" style="zoom:50%"/>

And you will see a modal prompting you to enter block_id. With this block_id you can get the content on the Notion and it will be inserted into the page.

<img src="https://cdn.jsdelivr.net/gh/LastKnightCoder/ImgHosting3@master/202204172249412022-04-17-22-49-42.png" style="zoom:50%"/>

**Notice: In order to get the content, you need to share the page where the content is located (or its parent page) to the intergration you created.**

## Development progress

At the moment, only videos can be inserted into Obsidian. Inserting text content or images or other content will be considered in a later version.

There is currently a problem with the video links expiring and I am trying to fix this.