"use strict";
var DEFAULT_CONFIG_PATH = "./less_config.json";
var fs = require("fs");
var path = require("path");
var yargs = require("yargs");
var Log = require("fell").Log;

function configureOptionsParser() {
	return yargs
		.usage("Usage: motif-less-compiler [options]")
		.example("motif-less-compiler -c path/to/config.json", "does stuff")

		.config("c").alias("c", "config").describe("c", "Path to config file. Defaults to ./less_config.json")

		.boolean("h").alias("h", "help").describe("p4", "Show help")
		.boolean("v").alias("v", "verbose").describe("v", "Verbose mode")
		.boolean("w").alias("w", "watch").describe("w", "Watch directory for changes to LESS files")

		.string("autoprefix").describe("autoprefix", "Autoprefix configuration. See https://github.com/ai/autoprefixer")
		.string("g").alias("g","globals").describe("g", "Import files into every file that is compiled")
		.string("filterfiles").alias("filterfiles", "filterFiles").describe("filterfiles", "Filter files using the given glob patterns")
		.string("filterfolders").alias("filterfolders", "filterFolders").describe("filterfolders", "Filter using the given glob patterns")
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
 * are converted to arrays.
 *
 * E.g global imports
 * @private
 */
function toArray(arg) {

	if (!arg) {
		return [];
	}

	if (!Array.isArray(arg)) {
		return [arg];
	}

	return arg;
}

function normalizePath(filePath) {
	var absPath = path.resolve(process.cwd(), filePath);
	return path.relative(process.cwd(), absPath);
}

module.exports = function(args) {
	loadDefaultConfig(args);
	var opts = configureOptionsParser().parse(args);

	if (opts.help) {
		Log.info(yargs.help());
		process.exit(0);
	}

	return {
		autoprefix: toArray(opts.autoprefix),
		globals: toArray(opts.globals).map(normalizePath),
		filterfiles: toArray(opts.filterfiles),
		filterfolders: toArray(opts.filterfolders),
		theme: toSingle(opts.theme),
		verbose: opts.verbose,
		watch: opts.watch
	};
};
