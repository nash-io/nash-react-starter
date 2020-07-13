This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

# Nash React starter

This is the Nash React starter kit. It shows how to set up and use the our [TypeScript SDK](https://github.com/nash-io/api-client-typescript) for building a browser application.

Included are examples of how to correctly configure webpack to load our Wasm dependency and how to set up the proxies to interact with our services.

Production setups will require the same proxies, otherwise the browser will reject requests because of CORS settings.

## Installation

Get started by installing all dependencies:
```
yarn install
```

## Available scripts

In the project directory, you can run the following commands:

### `yarn start`
* Connects to production.
* Runs the app in the development mode. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.
* The page will reload if you make edits.
* You will also see any lint errors in the console.

### `yarn start:sandbox`
* Connects to the sandbox.
* Runs the app in the development mode. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.
* The page will reload if you make edits.
* You will also see any lint errors in the console.
