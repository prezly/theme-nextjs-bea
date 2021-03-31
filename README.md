# Prezly Theme Starter Kit

Prezly Theme starter kit for your newsroom or blog based on Next.js 10+ framework. Made with [Next.js](https://nextjs.org), [PrezlySDK](https://github.com/prezly/javascript-sdk), [TypeScript](https://www.typescriptlang.org), [ESLint](https://eslint.org) and [Slate Renderer](https://www.npmjs.com/package/@prezly/slate-renderer).


As we do not want to tell you how to style your project (CSS vs Sas vs CSS-in-JS vs styled components) and sure as hell do not want to force you on our preferred CSS framework **this theme does not have any styling loaded**. It is intended to be used as a boilerplate to start a new theme from.

## Features

### Content/Newsroom features

* 🎈 Homepage with list of articles
* 🤖 Sitemap.xml, SEO metadata and Open Graph Tags
* 📖 Article detail including images, galleries, cards and video
* 💯 Maximize lighthouse score

### Developer experience:

* 🔥 [Next.js](https://nextjs.org) with SSR, SSI or SSG option
* 🧪 Test/Seed data in 3 categories
* 🎉 Type checking [TypeScript](https://www.typescriptlang.org)
* 🎨 Strongly typed content/entities

### Built-in feature from Next.js:

* ☕ Minify HTML & CSS
* 💨 Live reload/Fast refresh
* ✅ Code splitting and bundling
* ☯ Hybrid: SSG, SSI or SSR
* 🌄 Image optimization

### Requirements

* Node.js and npm

## Quick Start

### Getting Started

Run the following command on your local environment

```
git clone https://github.com/prezly/theme-nextjs-starter
cd theme-nextjs-starter
npm i
```

Set up your .env.local file by copying .env.example and filling in Prezly API key and newsroom UUID.

```
cp .env.example .env.local
```

After that you can run locally in development mode with live reload:

```
npm run dev
```

Open http://localhost:3000 with your favorite browser to see your project.

### Deploy your own

Deploy the example using [Vercel](https://vercel.com) or [Netlify](https://www.netlify.com/):

| Vercel  | Netlify |
| ------------- | ------------- |
| [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https://github.com/prezly/theme-nextjs-starter)  | [![Netlify Deploy button](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/prezly/theme-nextjs-starter)  |

## Documentation

### Routes

List of routes we automatically generate:

* **/** : Index page listing stories
* **/[article_slug]** : Article pages with slug provided by PrezlySDK
* **/category/[category:slug]** : Category page listing articles in respective category
* **/sitemap.xml**: Sitemap

### Testing/Token

To ease with development we have created a few sample newsrooms in different categories:

* **The Good Newsroom**: A newsroom filled with good news. [preview on vercel](https://theme-nextjs-starter-the-good-newsroom.vercel.app/)
* **Cookbook**: Recipes shared by the Prezly team
* **Anonymous Photographer**: Pictures from a photographer. Combination of albums and imagery

A list of tokens/newsroom uuids that can be used to kickstart the theme. 

| Name  | API Token  | Newsroom UUID |
|---|---|---|
| Good Newsroom  | `HKcab_nEbab_a7b2fe3a3465d3729772fa5381800ab5a0c30d8d`  | `578e78e9-9a5b-44ad-bda2-5214895ee036` | 
| Cookbook  | `TKcab_nEbab_28432b75d3a85a826e51cd0b502a3d76acf98d19`  | `9d90b2c1-aed9-4415-a9fb-82dd3a2a1b52` | 
| Anonymous Photographer | `SKcab_nEbab_0b63a6dd0b09286cc99fab93e6e80bfd9aecfbb5`  | `ce8299f6-a293-41df-8ffc-1c064d4401bc` |

## Other

### Contributions

Everyone is welcome to contribute to this project. Feel free to open an issue if you have question or found a bug.

### License

Licensed under the GNU GENERAL PUBLIC LICENSE, Copyright © 2021

See [LICENSE](LICENSE) for more information.

---

Made with ♥ by [Prezly.com](https://www.prezly.com/developers)
