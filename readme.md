# Webshot [![npm fetch-headers package](https://img.shields.io/npm/v/@jbmoelker/webshot-service.svg)](https://npmjs.org/package/@jbmoelker/webshot-service)

**Micro service to fetch a screenshot of a web page as a PNG.**

Demo: [`webshot.now.sh/?url=https://www.voorhoede.nl&w=480`](https://webshot.now.sh/?url=https://www.voorhoede.nl&w=480).


## Parameters

The service can be configured with the following URL query parameters:

Parameter | Description | Example
--- | ---
`url` (required) | URL of the web page to take a screenshot of. | `url=https://www.voorhoede.nl`
`width` or `w` (required) | Width (in pixels) to set the viewport to. | `w=320`
`height` or `h` (optional) | Height (in pixels) to set the viewport to. If no height is provided a screenshot of the full page is created with the given viewport width. | `h=320`


## Development

This project requires [Node.js](http://nodejs.org/) (>= v8) and [npm](https://npmjs.org/) (comes with Node).

After installing dependencies using `npm install` the following scripts are available:

`npm run ...` | Description
---|---
`deploy` | Deploys project to now and aliases latest version to [`https://webshot.now.sh`](https://webshot.now.sh).
`dev` | Starts micro service with hot reloading for development on [`http://localhost:3000`](http://localhost:3000).
`start` | Starts micro service for production on [`http://localhost:3000`](http://localhost:3000).


## License

[MIT licensed](license) © [Jasper Moelker](https://twitter.com/jbmoelker)
