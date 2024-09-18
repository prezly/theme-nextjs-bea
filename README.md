# Prezly Bea Theme

Bea Prezly Theme is based on [Next.js] 12+ framework.
- Made with [TypeScript], [Prezly SDK] and [Prezly Content React Renderer].
- Data-fetching is handled by [Prezly Theme Kit] and [Prezly SDK].
- Multi-language is powered by [React Intl] and [Prezly Themes Translations].
- Analytics powered by [Prezly Analytics].
- Code-style is ensured by [ESLint], [StyleLint] and [Prettier].
- Search is powered by Meilisearch
- Error-logging with [Sentry].

### Requirements

* Node.js and npm

## Quick Start

### Getting Started

Run the following command on your local environment

```Shell
git clone https://github.com/prezly/theme-nextjs-bea
cd theme-nextjs-bea
npm i
```

Set up your .env.local file by copying .env.example:
```Shell
cp .env.example .env.local
```

You'll need to populate it with your Prezly Access Token and your newsroom's UUID.
Additionally, you'll need to provide:
- Sitekey for HCaptcha if you want HCaptcha to work on the Subscribe form.
- API key for Prezly's search index (you can contact [Prezly support](https://www.prezly.com/talk-to-us) to issue a token for you)

After that you can run locally in development mode with live reload:

```Shell
npm run dev
```

Open http://localhost:3000 with your favorite browser to see your project.

### Deploy your own

Deploy the example using [Vercel](https://vercel.com) or [Netlify](https://www.netlify.com/):

| Vercel  | Netlify |
| ------------- | ------------- |
| [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https://github.com/prezly/theme-nextjs-bea)  | [![Netlify Deploy button](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/prezly/theme-nextjs-bea)  |

### Scripts in package.json

In addition to regular Next scripts, we provide some scripts to help with code-styling checks.
This repo is configured with GitHub workflows to run linter checks on every push, but you can also run these checks locally, along with TypeScript checks, by running this script:
```Shell
npm run check
```

Prettier is configured to be managed by ESLint, but you can always run it separately with `npm run prettier` to check code-style, or with `npm run prettier:fix` to auto-fix code-style issues in the project.

## Documentation

### Business logic

The data layer is abstracted by [Prezly Theme Kit]. You can get more info on it in the repo README.

Logic for content display is based heavily on [Prezly Theme Starter]. Check it out if you only want to see the bare minimum required to display data from Prezly newsrooms.

### Testing/Token

To ease with development we have created a few sample newsrooms in different categories:

* **The Good Newsroom** [(preview on vercel)](https://theme-nextjs-bea-the-good-newsroom.vercel.app/): A newsroom filled with good news
* **Cookbook** [(preview on vercel)](https://theme-nextjs-bea-cookbook.vercel.app/): Recipes shared by the Prezly team
* **Anonymous Photographer** [(preview on vercel)](https://theme-nextjs-bea-photography.vercel.app/):  Pictures from a photographer. Combination of albums and imagery

A list of tokens/newsroom uuids that can be used to kickstart the theme.

| Name  | API Token  | Newsroom UUID |
|---|---|---|
| Good Newsroom  | `HKcab_nEbab_a7b2fe3a3465d3729772fa5381800ab5a0c30d8d`  | `578e78e9-9a5b-44ad-bda2-5214895ee036` |
| Cookbook  | `TKcab_nEbab_28432b75d3a85a826e51cd0b502a3d76acf98d19`  | `9d90b2c1-aed9-4415-a9fb-82dd3a2a1b52` |
| Anonymous Photographer | `SKcab_nEbab_0b63a6dd0b09286cc99fab93e6e80bfd9aecfbb5`  | `ce8299f6-a293-41df-8ffc-1c064d4401bc` |

### Contributions

Everyone is welcome to contribute to this project. Feel free to open an issue if you have question or found a bug.

### License

Prezly Bea Theme is [MIT licensed](LICENSE).

---

Made with ♥ by [Prezly](https://www.prezly.com/developers)

[Next.js]: https://nextjs.org
[Prezly SDK]: https://github.com/prezly/javascript-sdk
[Prezly Theme Kit]: https://github.com/prezly/theme-kit-nextjs
[Typescript]: https://www.typescriptlang.org
[ESLint]: https://eslint.org
[StyleLint]: https://stylelint.io
[Prettier]: https://prettier.io
[React Intl]: https://www.npmjs.com/package/react-intl
[Prezly Content React Renderer]: https://www.npmjs.com/package/@prezly/content-renderer-react-js
[Prezly Themes Translations]: https://github.com/prezly/themes-intl-messages
[Prezly Analytics]: https://github.com/prezly/analytics
[Sentry]: https://sentry.io/
[Prezly Theme Starter]: https://github.com/prezly/theme-nextjs-starter
