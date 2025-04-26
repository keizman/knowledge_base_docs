
# Create a Blog Post

Docusaurus creates a **page for each blog post**, but also a **blog index page**, a **tag system**, an **RSS** feed...

## Create your first Post

Create a file at `blog/2021-02-28-greetings.md`:

```md title="blog/2021-02-28-greetings.md"
---
slug: greetings
title: Greetings!
authors:
  - name: Joel Marcey
    title: Co-creator of Docusaurus 1
    url: https://github.com/JoelMarcey
    image_url: https://github.com/JoelMarcey.png
  - name: Sébastien Lorber
    title: Docusaurus maintainer
    url: https://sebastienlorber.com
    image_url: https://github.com/slorber.png
tags: [greetings]
---
```

# Create a Document

Documents are **groups of pages** connected through:

- a **sidebar**
- **previous/next navigation**
- **versioning**

## Create your first Doc

Create a Markdown file at `docs/hello.md`:

## Configure the Sidebar

Docusaurus automatically **creates a sidebar** from the `docs` folder.

Add metadata to customize the sidebar label and position:

```md title="docs/hello.md" {1-4}
---
sidebar_label: 'Hi!'
sidebar_position: 3
---

# Hello

This is my **first Docusaurus document**!
```

It is also possible to create your sidebar explicitly in `sidebars.js`:

```js title="sidebars.js"
export default {
  tutorialSidebar: [
    'intro',
    // highlight-next-line
    'hello',
    {
      type: 'category',
      label: 'Tutorial',
      items: ['tutorial-basics/create-a-document'],
    },
  ],
};
```

---
sidebar_position: 1
---

# Create a Page

Add **Markdown or React** files to `src/pages` to create a **standalone page**:

- `src/pages/index.js` → `localhost:3000/`
- `src/pages/foo.md` → `localhost:3000/foo`
- `src/pages/foo/bar.js` → `localhost:3000/foo/bar`

## Create your first React Page

Create a file at `src/pages/my-react-page.js`:

```jsx title="src/pages/my-react-page.js"
import React from 'react';
import Layout from '@theme/Layout';

export default function MyReactPage() {
  return (
    <Layout>
      <h1>My React page</h1>
      <p>This is a React page</p>
    </Layout>
  );
}
```

A new page is now available at [http://localhost:3000/my-react-page](http://localhost:3000/my-react-page).

# Manage Docs Versions

Docusaurus can manage multiple versions of your docs.

## Create a docs version

Release a version 1.0 of your project:

```bash
npm run docusaurus docs:version 1.0
```

The `docs` folder is copied into `versioned_docs/version-1.0` and `versions.json` is created.

Your docs now have 2 versions:

- `1.0` at `http://localhost:3000/docs/` for the version 1.0 docs
- `current` at `http://localhost:3000/docs/next/` for the **upcoming, unreleased docs**

## Add a Version Dropdown

To navigate seamlessly across versions, add a version dropdown.

Modify the `docusaurus.config.js` file:

```js title="docusaurus.config.js"
export default {
  themeConfig: {
    navbar: {
      items: [
        // highlight-start
        {
          type: 'docsVersionDropdown',
        },
        // highlight-end
      ],
    },
  },
};
```

The docs version dropdown appears in your navbar:

![Docs Version Dropdown](./img/docsVersionDropdown.png)

## Update an existing version

It is possible to edit versioned docs in their respective folder:

- `versioned_docs/version-1.0/hello.md` updates `http://localhost:3000/docs/hello`
- `docs/hello.md` updates `http://localhost:3000/docs/next/hello`




# Translate your site

Let's translate `docs/intro.md` to French.

## Configure i18n

Modify `docusaurus.config.js` to add support for the `fr` locale:

```js title="docusaurus.config.js"
export default {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'fr'],
  },
};
```

## Translate a doc

Copy the `docs/intro.md` file to the `i18n/fr` folder:

```bash
mkdir -p i18n/fr/docusaurus-plugin-content-docs/current/

cp docs/intro.md i18n/fr/docusaurus-plugin-content-docs/current/intro.md
```

Translate `i18n/fr/docusaurus-plugin-content-docs/current/intro.md` in French.


## Add a Locale Dropdown

To navigate seamlessly across languages, add a locale dropdown.

Modify the `docusaurus.config.js` file:

```js title="docusaurus.config.js"
export default {
  themeConfig: {
    navbar: {
      items: [
        // highlight-start
        {
          type: 'localeDropdown',
        },
        // highlight-end
      ],
    },
  },
};
```


## Front Matter


category json content
```
{
  "position": 2.5,
  "label": "Tutorial",
  "collapsible": true,
  "collapsed": false,
  "className": "red",
  "link": {
    "type": "generated-index",
    "title": " Tutorialoverview"
  },
  "customProps": {
    "description": "This description can be used in the swizzled DocCard"
  }
}
```

https://docusaurus.io/docs/next/api/plugins/@docusaurus/plugin-content-docs#routeBasePath
```
Docs 
---
id: doc-markdown
title: Docs Markdown Features
hide_title: false
hide_table_of_contents: false
sidebar_label: Markdown
sidebar_position: 3
pagination_label: Markdown features
custom_edit_url: https://github.com/facebook/docusaurus/edit/main/docs/api-doc-markdown.md
description: How do I find you when I cannot solve this problem
keywords:
  - docs
  - docusaurus
tags: [docusaurus]
image: https://i.imgur.com/mErPwqL.png
slug: /myDoc
last_update:
  date: 1/1/2000
  author: custom author name
---

```


```Blogs
---
title: Welcome Docusaurus
authors:
  - slorber
  - yangshun
  - name: Joel Marcey
    title: Co-creator of Docusaurus 1
    url: https://github.com/JoelMarcey
    image_url: https://github.com/JoelMarcey.png
    socials:
      x: joelmarcey
      github: JoelMarcey
tags: [docusaurus]
description: This is my first post on Docusaurus.
image: https://i.imgur.com/mErPwqL.png
hide_table_of_contents: false
---

A Markdown blog post

```

## Code Blocks

Markdown code blocks are supported with Syntax highlighting.

````md
```jsx title="src/components/HelloDocusaurus.js"
function HelloDocusaurus() {
  return <h1>Hello, Docusaurus!</h1>;
}
```
````

```jsx title="src/components/HelloDocusaurus.js"
function HelloDocusaurus() {
  return <h1>Hello, Docusaurus!</h1>;
}
```


## MDX and React Components

[MDX](https://mdxjs.com/) can make your documentation more **interactive** and allows using any **React components inside Markdown**:

```jsx
export const Highlight = ({children, color}) => (
  <span
    style={{
      backgroundColor: color,
      borderRadius: '20px',
      color: '#fff',
      padding: '10px',
      cursor: 'pointer',
    }}
    onClick={() => {
      alert(`You clicked the color ${color} with label ${children}`)
    }}>
    {children}
  </span>
);

This is <Highlight color="#25c2a0">Docusaurus green</Highlight> !
This is <Highlight color="#1877F2">Facebook blue</Highlight> !
```
export const Highlight = ({children, color}) => (
  <span
    style={{
      backgroundColor: color,
      borderRadius: '20px',
      color: '#fff',
      padding: '10px',
      cursor: 'pointer',
    }}
    onClick={() => {
      alert(`You clicked the color ${color} with label ${children}`);
    }}>
    {children}
  </span>
);
This is <Highlight color="#25c2a0">Docusaurus green</Highlight> !
This is <Highlight color="#1877F2">Facebook blue</Highlight> !


----


# Docusaurus Documentation Project Information

## Project Overview
这是一个个人知识库项目, 用于记录所学知识以及发布感悟 blogs, 基于

## Project Structure
The project follows the standard Docusaurus structure:
- `/docs`: Contains all documentation markdown files
- `/blog`: Contains blog posts
- `/src`: Contains React components and custom pages
- `/static`: Contains static assets like images


## Configuration
The site is configured through `docusaurus.config.ts` with the following main settings:
- Base URL: `https://knowledge.llmproai.xyz`
- Default locale: English with additional locales for Chinese and Portuguese
- Theme customization via `src/css/custom.css` (current theme uses light blue colors)
- Navigation structure defined in the themeConfig section

## Development Workflow
Development commands are available in `package.json`:
- `npm start`: Start the development server

## Documentation Structure
The documentation follows a sidebar structure automatically generated from the folder structure in the `/docs` directory, with the main entry point being `docs/intro.md`.

## Media and Assets
Static assets are stored in the `/static` directory, with configuration in `.gitten/config.json` specifying `static` as the media folder.

## Current Status
The documentation is in active development with several example pages and translations already in place. The content about the GPT API Proxy service is being expanded, particularly in the "API Docs" section.

## 编辑须知 (Guidelines for AI Editors)

### Markdown 语法指南 (Markdown Syntax Guidelines)
1. **基本语法** (Basic Syntax):
    markdown 语法

2. **Docusaurus 特殊语法** (Docusaurus-Specific Syntax):
   - 前端元数据 (Front Matter): 
     ```
     ---
     sidebar_position: 1
     title: 页面标题
     description: 页面描述
     ---
     ```
   - Admonitions (提示框):
     ```
     :::tip 提示标题
     提示内容
     :::

     :::warning 警告标题
     警告内容
     :::

     :::danger 危险标题
     危险内容
     :::
     ```
   


4. **MDX 组件** (MDX Components):
   - 可以在 Markdown 中使用 React 组件
   - 组件定义使用标准 JSX 语法
   - 示例:
     ```jsx
     export const Highlight = ({children, color}) => (
       <span style={{backgroundColor: color}}>
         {children}
       </span>
     );

     <Highlight color="#1877F2">高亮文本</Highlight>
     ```

### 多语言支持指南 (Multilingual Guidelines), attention: 只有指定翻译任务时才参考此指南
1. **创建翻译文件**:
   - 新文档应优先创建英文版本
   - 翻译文件位于 `i18n/zh-Hans/` 和 `i18n/pt-BR/` 目录

2. **翻译协作**:
   - 确保专业术语在所有语言中保持一致
   - 保留原文中的代码示例，仅翻译注释
   - 可使用 `npm run write-translations` 生成待翻译文件

### 图片和资源 (Images and Assets)
1. **图片存放**:
   - 将图片放置在 `/static/img/` 目录下
   - 在 Markdown 中引用: `![描述](/img/图片名.png)`
   
2. **组织结构**:
   - 为特定文档创建子文件夹
   - 使用有意义的文件名

### 文档质量标准 (Documentation Quality Standards)
1. **内容要求**:
   - 文档应清晰、简洁、准确
   - 示例代码必须能够正常运行
   - 技术描述应准确无误
   - 解释复杂概念时提供图表或类比

2. **格式标准**:
   - 一致的标题大小写
   - 一致的代码风格
   - 恰当的段落长度 (避免过长段落)
   - 合理使用列表和表格组织信息

### 编辑限制 (Editing Restrictions)

**不能做的事** (What You Cannot Do):
- 删除现有重要内容
- 添加不准确的技术信息
- 添加与项目无关的内容
- 生成与文档主题无关的营销内容
- 更改已建立的术语一致性