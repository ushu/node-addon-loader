A simple loader to embed native addons in [node] or [electron] projects.

This package is a mix between:

- [node-loader] that loads a node module from an _absolute path_
- [file-loader] that loads copy a file into the bundle and return its path

This one package allows to load a node native addon, binary file will end up copied into the output directory and loaded dynamically from its _relative_ path.

## Install

Add the package to your `package.json`

```bash
$ yarn add --dev node-addon-loader
```

## Usage

Add the loader to your `webpack.config.js` for all `.node` native files.

**webpack.config.js**
```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.node$/,
        use: 'node-addon-loader',
        options: [
          basePath: resolve(__dirname),
        ]
      }
    ]
  }
}
```

Note the `basePath` option: it will instruct the loader of the "base" path, from where the [node] runtime will be started. It will generate loading path relative to this URL.
For example is you develop an [electron] app with a bundle emitted into `dist/` directory, you want all the required paths (emitted `require` statements) to be relative to the current directory of the [electron] runtime (they all will be like `dist/xxxx.node`).

**In your application**

You require the file directly

```js
import node from 'relative/path/to/myLib.node';
// or
const node = require("relative/path/to/myLib.node");
```

or with the inline syntax:

**Inline**
```js
import node from 'node-addon-loader!./myLib.node';
```

**with an alias**

a good option is to keep your modules in some place and create aliases for them, such as:

```js
// webpack config
module.exports = {

  resolve: {
    alias: {
    "myLib": "/path/to/myLib.node",
    }
  },

  // ...

}
```

and then use your alias directly:

```js
import myLib from "myLib";
```

## Thanks

big thanks go the the authors of [node-loader] and [file-loader] which I eagerly copied.

## TODO

Fix the issue with `emitFile`, see **TODO** in code.

All contributions are welcome, this is MIT do-whatever-you-want-I-dont-care code.

[node]: https://nodejs.org
[electron]: https://electron.atom.io/
[node-loader]: https://github.com/webpack-contrib/node-loader/blob/master/index.js
[file-loader]: https://github.com/webpack-contrib/file-loader 
