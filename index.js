var loaderUtils = require("loader-utils");
var path = require("path");

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

  // write the file to the output dir
  this.emitFile(url, content, false);
  this.addDependency(this.resourcePath);

  url = ".\\resources\\" + url;

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
module.exports.raw = true;
