# Skye Force
A group of asteroids heading towards the Earth at very high speeds. Collision with any one of the would lead to extinction of all living beings on earth. Are you up to the challenge of saving Earth by destroing the asteroids.

Play the game at https://skyeforce.github.io

## Trailer
[![Skye Force (2021)](http://img.youtube.com/vi/6UNGyH458ZY/0.jpg)](http://www.youtube.com/watch?v=6UNGyH458ZY "Skye Force (2021)")

## Controls
* `A` to move left
* `D` to move right
* `Space` to shoot bullets

## Project Structure
```
build - Directory for built and compressed files from the npm build script
src - Directory for all dev files
├── css - Contains all SCSS files, that are compiled to `src/public/css`
├── js - All the Three.js app files, with `app.js` as entry point. Compiled to `src/public/js` with webpack
│   ├── app
│   │   ├── components - Three.js components that get initialized in `main.js`
│   │   ├── helpers - Classes that provide ideas on how to set up and work with defaults
│   │   ├── managers - Manage complex tasks such as GUI or input
│   │   └── model - Classes that set up the model object
│   ├── data - Any data to be imported into app
│   └── utils - Various helpers and vendor classes
└── public - Used by webpack-dev-server to serve content. Webpack builds local dev files here. 
    └── assets - Is copied over to build folder with build command. Place external asset files here.
```

## Getting started
Install dependencies:

```
npm install
```

Then run dev script:

```
npm run dev
```

Spins up a webpack dev server at localhost:8080 and keeps track of all js and sass changes to files.

## Build
```
npm run build
```

Cleans existing build folder while linting js folder and copies over the public assets folder from src. Then sets environment to production and compiles js and css into build.

## Other NPM Scripts
You can run any of these individually if you'd like with the `npm run` command:
* `prebuild` - Cleans up build folder and lints `src/js`
* `clean` - Cleans build folder
* `lint` - Runs lint on the `src/js` folder and uses the `.eslintrc` file in root for linting rules
* `webpack-server` - Start up a  webpack-dev-server with hot-module-replacement
* `webpack-watch` - Run webpack in dev environment with watch
* `dev:js` - Run webpack in dev environment without watch
* `build:dir` - Copy files and folders from `src/public` to `build`
* `build:js` - Run webpack in production environment