"use strict";
var DEFAULT_CONFIG_PATH = "./less_config.json";
var fs = require("fs");
var yargs = require("yargs");
var Log = require("fell").Log;

function configureOptionsParser() {
	return yargs
		.usage("Usage: motif-less-compiler [options]")
		.example("motif-less-compiler -c path/to/config.json", "does stuff")

		.config("c").alias("c", "config").describe("c", "Path to config file")
		
		.boolean("autoprefix").describe("autoprefix", "Add auto-prefixer functionality to compiler")
		.boolean("h").alias("h", "help").describe("p4", "Show help")
		.boolean("p4").alias("p4", "perforce").describe("p4", "Use perforce to checkout files before saving")
		.boolean("v").alias("v", "verbose").describe("v", "Verbose mode")
		.boolean("w").alias("w", "watch").describe("w", "Watch directory for changes to LESS files")
		
		.string("g").alias("g","globals").describe("g", "Import files into every file that is compiled")
		.string("ignorefiles").describe("ignorefiles", "Ignore files with the given filenames")
		.string("ignorefolders").describe("ignorefolders", "Ignore folders in the given array")
		.string("t").alias("t", "theme").describe("t", "Name of a Bladerunner theme to use");
}

/**
 * If no config file is specified from the command line,
 * check if a "less_config.json" file exists in current directory
 * and add that as config.
 *
 * This is required as yargs doesn't support default values for config paramaters
 * @private
 */
function loadDefaultConfig(args) {
	if ((args.indexOf("-c") < 0) && (args.indexOf("--config") < 0) && fs.existsSync(DEFAULT_CONFIG_PATH)) {
		args.push("-c");
		args.push(DEFAULT_CONFIG_PATH);
	}
}

/**
 * Yargs will automatically merge repeated arguments in an array.
 * This function is used to guarantee that only a single item is received
 *
 * E.g theme must be unique
 * @private
 */
function toSingle(arg) {
	if (Array.isArray(arg)) {
		return arg.pop();
	}
	return arg;
}

/**
 * This function is used to guarantee that arguments expected as arrays,
 * are converted to arrays, in case only 1 item is defined
 *
 * E.g global imports
 * @private
 */
function toArray(arg) {
	if (!Array.isArray(arg)) {
		return [arg];
	}

	return arg;
}

module.exports = function(args) {
	loadDefaultConfig(args);
	var opts = configureOptionsParser().parse(args);

	if (opts.help) {
		Log.info(yargs.help());
		process.exit(0);
	}

	return {
		autoPrefix: opts.autoprefix,
		globals: toArray(opts.globals),
		ignoreFolders: toArray(opts.ignorefolders),
		ignoreFiles: toArray(opts.ignorefolders),
		perforce: opts.perforce,
		theme: toSingle(opts.theme),
		verbose: opts.verbose,
		watch: opts.watch
	};
};
