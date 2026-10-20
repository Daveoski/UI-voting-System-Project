# Smart Voting System (TypeScript)

A browser voting app written in strict **TypeScript** with no framework, built for the Africa Hackathon programme. Voters cast one vote each for a candidate; the app blocks duplicate voters and keeps a live tally.

**Live demo:** https://guileless-quokka-908f99.netlify.app/

## Features

- One vote per voter: names are normalised before the duplicate check
- Live tally and leader display
- Candidates modelled as a union type, so an invalid candidate is a compile-time error
- Typed DOM access helper that fails loudly when an element is missing
- Styled with Tailwind CSS (browser build)

## Getting started

```bash
npm install
npm run build     # compiles voting.ts to dist/voting.js
```

Then open `index.html` in a browser. Use `npm run watch` to rebuild on save.

## Project structure

```text
├── index.html      # Page markup; loads dist/voting.js
├── voting.ts       # All app logic
├── src/input.html
├── tsconfig.json
└── package.json
```

## Tech stack

TypeScript 5 · Tailwind CSS · Netlify

## License

[MIT](LICENSE)
