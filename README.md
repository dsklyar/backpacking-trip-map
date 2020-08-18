# "Backpacking Trip" Interactive Map

This repo is a work in progress side project made for tracing Stanislaus National Forest wilderness map. I like to go backpacking there once in a while, which lead me to this idea. I am using map information from forest's service [website](https://www.fs.usda.gov/stanislaus) which is broken down in downloadable quadrants. I decided to use Babylon.js in tandem with React/Redux to build simple tracing tool with possible camp marking possibilities.

_Why not use ArcGIS API?_ I want to mess around with Babylon.js/Pixi.JS =)

## Target Features

> 1. Multiple trace setup, e.i color, notes, and routes
> 2. Approximating distance, time, water, and calorie needed
> 3. Saving resulting image and/or the configuration
> 4. Transition animations

## Set-up:

> 1. run `npm install` command and wait for install to complete
> 2. run `npm install -g webpack-dev-server` commnad to install webpack server
> 3. run `npm start` command and wait for web-page to open

## How to use:

> 1. Use `WASD` to move map around and `EQ` to zoom in and out
> 2. Click `Trace` to start tracing the map
> 3. Click around on the map to generate trail line
> 4. Click `Trace` again to stop tracing the map
> 5. Click `Undo` to undo previous tracing actions

## Technologies used:

> - [React](https://github.com/facebook/react/)
> - [BabylonJS](https://github.com/BabylonJS/Babylon.js)
> - [ReactJSS](https://github.com/cssinjs/jss)
> - [Redux](https://github.com/reduxjs/redux)
> - [Webpack](https://github.com/webpack/webpack)
