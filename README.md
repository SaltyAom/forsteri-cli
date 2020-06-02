# Forsteri CLI
Forsteri CLI for zero configuration project [Forsteri](https://github.com/saltyAom/forsteri) Project.
  
[Forsteri](https://github.com/saltyAom/forsteri) is a library for building Reusable Reactive Web Component with Virtual DOM in 2KB (gzipped)

Under the hood, Forsteri CLI helps developer to reduce boilerplate to create Forsteri app by setting up webpack and babel as default especially for Forsteri.

## Setting up
1. As recommended, Forsteri has an CLI for generating Forsteri project without need to setup yourself by running the following command:
```bash
yarn create forsteri-app

# Or with npm
npx create-forsteri-app
```

Then follow the instruction and the project is ready for integrated development experience.

2. Otherwise you might wanted to setup the project yourself with following instruction:
First, install the cli:
```bash
yarn add --dev forsteri-cli

# Or with npm
npm install --save-dev forsteri-cli
```

Forsteri CLI required an entry point for TypeScript and HTML.
Create a structure as illustrate:
```bash
-O
 | - src
 | | - index.tsx
 |
 | - public
   | - index.html
```

## Command
Forsteri however, required an entry point as illustrated which is index.html and index.tsx where:
- index.html in public. As when built, the public folder will be bundle to production.
- index.tsx in src.

Forsteri CLI provide the following command:

- forsteri dev
    - Start development server for Forsteri app with Hot Module Replacement.

- forsteri build
    - Bundle Forsteri for production built.

- forsteri components
    - Generate as seperated web components which can be used anywhere with Forsteri runtime.

## Note
Under the hood of Forsteri CLI is purely configured webpack and babel for a quick start experience and clean project structured. However, you could also change the webpack configuration by creating `forsteri.config.js` on root of your project and write your own configuration.

forsteri.config.js:
```javascript
module.exports = {
    // your own webpack config here
}
```