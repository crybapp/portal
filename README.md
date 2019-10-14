![Cryb OSS](.github/portal-icon.png "@cryb/portal Logo")

_**Portal** - VM instance_

![GitHub contributors](https://img.shields.io/github/contributors/crybapp/portal) ![GitHub](https://img.shields.io/github/license/crybapp/portal) [![PayPal Donate](https://img.shields.io/badge/donate-PayPal-blue.svg)](https://paypal.me/williamsthing)

## Docs
* [Info](#info)
    * [Status](#status)
* [Codebase](#codebase)
    * [Folder Structure](#folder-structure)
    * [First time setup](#first-time-setup)
        * [Installation](#installation)
    * [Running the app locally](#running-the-app-locally)
        * [Background services](#background-services)
        * [Starting @cryb/portal](#starting-@cryb/portal)
* [Questions / Issues](#questions-/-issues)

## Info
`@cryb/portal` is the instance deployed onto VM machines to act as the 'Virtual browser'.

`@cryb/portal` connect to `@cryb/portals` over WS to send and recieve updates like controller events and health updates.

### Status
`@cryb/portal` has been actively developed internally since September 2019, and is now open source as of October 2019.

## Codebase
The codebase for `@cryb/portal` is written in JavaScript, utilising TypeScript and Node.js.

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
* `@cryb/aperture`

We recommend that you run the following services alongside `@cryb/portal`, but it's not required.
* `@cryb/api`
* `@cryb/web`
* `@cryb/aperture`

You also need to install the required dependencies, by running either:

```
npm install
```
or
```
yarn
```

Ensure that `.env-example` is either copied and renamed to `.env`, or is simply renamed to `.env`.

In this file, you'll need some values. Documentation is available in the `.env-example` file.

### Running the app locally

#### Background Services
Make sure that you have installed MongoDB and Redis, and they are both running locally on port 27017 and 6379 respectively.

The command to start MongoDB is `mongod`, and the command to start Redis is `redis-server`.

If you're developing a feature that requires the VM infrastructure, then make sure `@cryb/aperture` is running.

#### Starting @cryb/portal
We recommend that you use a service like [Docker](https://docker.com) to start an instance of `@cryb/portal`.

To run `@cryb/portal` in development mode on Docker, run either:
```
npm run docker:dev
```
or
```
yarn docker:dev
```

## Questions / Issues

If you have an issues with `@cryb/portal`, please either open a GitHub issue, or contact a maintainer.