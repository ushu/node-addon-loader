var loaderUtils = require("loader-utils");
var path = require("path");
var fs = require("fs");
var mkdirp = require("mkdirp");

module.exports = function(content) {
  this.cacheable && this.cacheable();
  if (!this.emitFile)
    throw new Error("emitFile is required from module system");

  // default config
  var config = {
    publicPath: true,
    useRelativePath: true,
    name: "[hash].[ext]",
  };

  var query = loaderUtils.getOptions(this) || {};
  var options = this.options[query.config || "extensionLoader"] || {};

  // options takes precedence over config
  Object.keys(options).forEach(function(attr) {
    config[attr] = options[attr];
  });

  // query takes precedence over config and options
  Object.keys(query).forEach(function(attr) {
    config[attr] = query[attr];
  });

  // the final URL
  var url = loaderUtils.interpolateName(this, config.name, {
    context: this.options.context,
    content: content,
    regExp: config.regExp,
  });

  // for some reason emitFile corrupts binary files...
  // I keep the call to emit the bundle
  // TODO: fix emitFile and uncomment this code
  //this.emitFile(url, content, false);
  // TODO: once emitFile works as intended, remove code below:
  mkdirp.sync(this.options.output.path)
  fs.createReadStream(this.resourcePath)
    .pipe(fs.createWriteStream(path.join(this.options.output.path, url)));

  if (config.basePath) {
    var baseDir = path.relative(config.basePath, this.options.output.path);
    url = path.join(baseDir, url);
  }

  // now we overrite the emitted file with "real" content

  return (
    "try { global.process.dlopen(module, " +
    JSON.stringify(url) +
    "); } catch(e) {" +
    "throw new Error('Cannot open ' + " +
    JSON.stringify(url) +
    " + ': ' + e);}"
  );
};
