## Spore Demo

![](https://github.com/ahonn/spore-demo/assets/9718515/b478387b-3dfa-49e5-89db-509467962744)

A Spore Protocol Demo based on Next.js + React + [Spore SDK](https://github.com/sporeprotocol/spore-sdk), which implements basic functionalities such as
the creation and transfer of clusters, as well as minting, transferring, and melting of spores.

## Technology Stack

- **Next.js** - A JavaScript framework created by Vercel..
- **React** - A JavaScript library for building user interfaces.
- **Mantine** - A Fully Featured React components library.
- **Spore Graphql Layer** - A GraphQL Layer for query Spore/Cluster data.
- **Spore SDK** - A SDK for interacting with the Spore Protocol.

## Supported Wallets

This project currently supports the following wallets:

- [MetaMask](https://metamask.io) - A crypto wallet & gateway to blockchain apps.
- [JoyID](https://joy.id) - Universal Account Protocol for Web3 Mass-adoption.

> This project integrates MetaMask and JoyID through the use of [Omnilock](https://blog.cryptape.com/omnilock-a-universal-lock-that-powers-interoperability-1) for now.

## Installation

To run this project, you must have Node.js installed.
If you do not have Node.js installed please visit the [Node.js](https://nodejs.org/en/download/) website to download the latest version.

**_Step 1:_** Clone the repository

```bash
git clone https://github.com/ahonn/spore-demo.git
```

**_Step 2:_** Navigate to the cloned repository

```bash
cd spore-demo
```

**_Step 3:_** Install the dependencies

> This project uses PNPM as the package manager, you can also use NPM to perform the following steps

```bash
npm install pnpm -g
pnpm install
```

## Usage

To run the application, use the command below:

```bash
pnpm run dev
```

This will start the development server. Navigate to `http://localhost:3000` in your browser to access the application.

## License

This project is licensed under [MIT License](LICENSE.md).
