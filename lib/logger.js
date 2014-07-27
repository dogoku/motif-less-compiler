"use strict";

var chalk = require("chalk");

function Logger(options) {
	this.verbose = options.verbose;
}


function timestamp() {
	return (new Date()).toTimeString().substr(0,8);
}

Logger.prototype.log = function(msg) {
	if (this.verbose) {
		console.log(msg);
	}
};

Logger.prototype.info = function(msg) {
	if (this.verbose) {
		console.info(msg);
	}
};

Logger.prototype.compileStarted= function(path) {
	this.log(chalk.yellow.bold(timestamp(), " < ", path));
};

Logger.prototype.fileSaved = function(path) {
	this.log(chalk.green.bold(timestamp(), " > ", path));
};

Logger.prototype.triggerDepe = function(path) {
	this.log(chalk.green.bold(timestamp(), " > ", path));
};

Logger.prototype.error = function(error, path) {
	console.error(chalk.red.bold(timestamp(), " X ", path));
	console.log(error);
};

module.exports = Logger;