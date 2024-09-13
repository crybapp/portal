![Cryb OSS](.github/portal-icon.png "@cryb/portal Logo")

**@cryb/portal** - _VM instance_

[![GitHub contributors](https://img.shields.io/github/contributors/crybapp/portal)](https://github.com/crybapp/portal/graphs/contributors) [![License](https://img.shields.io/github/license/crybapp/portal)](https://github.com/crybapp/portal/blob/master/LICENSE) [![Patreon Donate](https://img.shields.io/badge/donate-Patreon-red.svg)](https://patreon.com/cryb) [![Chat on Discord](https://discord.com/api/guilds/594942455749672983/widget.png)](https://discord.gg/xdhEgD5)

## Docs

* [Info](#info)
  * [Status](#status)
* [Codebase](#codebase)
  * [Folder Structure](#folder-structure)
  * [Code Style](#code-style)
  * [First time setup](#first-time-setup)
    * [Installation](#installation)
  * [Running the app locally](#running-the-app-locally)
    * [Background services](#background-services)
    * [Starting @cryb/portal](#starting-@cryb/portal)
* [Questions / Issues](#questions--issues)

## Info

`@cryb/portal` is the instance deployed onto VM machines to act as the 'Virtual browser'.

`@cryb/portal` connect to `@cryb/portals` over WS to send and recieve updates like controller events and health updates.

### Status

`@cryb/portal` has been actively developed internally since September 2019, and is now open source as of October 2019.

## Codebase

The codebase for `@cryb/portal` is written in JavaScript, utilising TypeScript and Node.js.

### Code Style

We ask that you follow our [code style guidelines](https://github.com/crybapp/library/blob/master/code-style/STYLE.md) when contributing to this repository.

We use ESLint in order to lint our code. Run `pnpm lint` before committing any code to ensure it's clean.

*Note: while we have most rules covered in our `eslint.config.mjs` config, it's good practice to familarise yourself with our code style guidelines*

### Folder Structure

```
cryb/portal/
└──┐ src # The core source code
   ├── browser # Class used to start services on the VM, such as Chromium and ffmpeg
   ├── clients # Our Express.js setup and WebSocket setup
   ├── config # Services such as queue management, etc
   └── utils # Helper methods
```

### First time setup

First, clone the `@cryb/portal` repository locally:

```
git clone https://github.com/crybapp/portal.git
```

#### Installation

The following services need to be installed for `@cryb/portal` to function:

* `@cryb/portals`
* Janus WebRTC Server

We recommend that you run the following services alongside `@cryb/portal`, but it's not required.

* `@cryb/api`
* `@cryb/web`
* Janus WebRTC Server

You also need to install the required dependencies by running `pnpm i`

Ensure that `.env.example` is either copied and renamed to `.env`, or is simply renamed to `.env`.

In this file, you'll need some values. Documentation is available in the `.env.example` file.

### Running the app locally

#### Background Services

Make sure `@cryb/portals` is running on port 5000 and that you have setup Janus WebRTC Server.

#### Starting @cryb/portal

We recommend that you use a service like [Docker](https://docker.com) to start an instance of `@cryb/portal`.

To run `@cryb/portal` in development mode on Docker, run `pnpm run docker:dev`.

Use `pnpm run docker:build` to build an image for deployment in production.

## Questions / Issues

If you have an issues with `@cryb/portal`, please either open a GitHub issue, contact a maintainer or join the [Cryb Discord Server](https://discord.gg/xdhEgD5) and ask in `#tech-support`.

## License

[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fcrybapp%2Fportal.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2Fcrybapp%2Fportal?ref=badge_large)
