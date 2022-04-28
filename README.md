## Introduction

This plugin can embed your notion video in obsidian through the Notion API, You need to provide Notion intergration secrets in the settings and enter the corresponding block_id to get the content of the block.

## Usage

First you need to go to the plugin's settings page and enter secrets here, if you don't know what secrets are you can see [this page](https://developers.notion.com/docs).

<img src="https://cdn.jsdelivr.net/gh/LastKnightCoder/ImgHosting3@master/202204281537092022-04-28-15-37-11.png" style="zoom:50%"/>

Back to your editor page, press the shortcut <Ctrl>Ctrl + P</kbd> to open the command panel, then type **Notion API**, then you can see all the relevant commands.


<img src="https://cdn.jsdelivr.net/gh/LastKnightCoder/ImgHosting3@master/202204281539512022-04-28-15-39-51.png" style="zoom:50%"/>

And you will see a modal prompting you to enter block_id. With this block_id you can get the content on the Notion and it will be inserted into the page.

<img src="https://cdn.jsdelivr.net/gh/LastKnightCoder/ImgHosting3@master/202204281540342022-04-28-15-40-34.png" style="zoom:50%"/>

**Notice: In order to get the content, you need to share the page where the content is located (or its parent page) to the intergration you created.**