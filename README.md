This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).


# Nash react starter

This is the nash react starter kit. It show how to set up and use the SDK in a browser application.

This shows how to correctly configure webpack to load our wasm dependency, and how to set up the proxies to interact with our services.

Production setups will also require the same proxies, otherwise the browser will reject requests because of CORS settings.

## Installation

To get start start by installing all the dependencies

```
yarn install
```

## Available Scripts

In the project directory, you can run:

### `yarn start`

Connects to production.

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.


### `yarn start:sandbox`

Connects to sandbox.

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.
