/** @module motif-less-compiler/lib/less-file-watcher */

"use strict";

var DEBOUNCE_CHANGE_EVENT = 300;
var options;
var Log = require("fell").Log;
var chokidar = require("chokidar");
var minimatch = require("minimatch");
var path = require("path");
var motifLessCompiler = require("./motif-less-compiler");
var setTimeout = require("timers").setTimeout;

var _recentlyCompiledFiles = {};
var _ignoreCache = {};


/**
 * Waits for initialization of the motif less compiler.
 * Once it's prepared feeds .less files into the motif less compiler.
 *
 * @alias module:motif-less-compiler/lib/less-file-watcher
 */
module.exports = function (opts) {
	options = opts;

	options.filterfiles.unshift("**/*.less");

	if (options.theme) {
		options.filterfiles.push("**/themes/"+options.theme+"/**");
	}

	motifLessCompiler.
	initializeCompiler(options).
	then(startWatchingLessFiles);
};

/**
 * @private
 */
function startWatchingLessFiles() {
	var watcher = chokidar.watch(".", {
		persistent: options.watch,
		ignoreInitial: false,
		ignored: ignoreFilter
	});

	watcher.
		on("add", updateLessFile).
		on("change", updateLessFile).
		on("error", fileWatchingErrored);
}

/**
 * Test function which returns whether a file or directory should be watched.
 *
 * @private
 * @param {string} filePath - Path for file that might be watched.
 * @param {fs.Stats} [stats] - File stats for file that might be watched.
 * @returns {boolean} Returns false for files or directories that will be watched.
 */
function ignoreFilter(filePath, stats) {
	var allowed = true;

	if (stats) {
		var absPath = path.resolve(process.cwd(), filePath);

		//chokidar seems to try to add files that were previously ignored
		//every time any file is changed in a watched directory
		//for that reason, we are caching the results to speed things up

		if (_ignoreCache[absPath] !== undefined) {
			return _ignoreCache[absPath];
		}

		if (stats.isFile() ) {
			allowed = options.filterfiles.every(function(filter) {
				return minimatch(absPath, filter, {nocase: true});
			});
		} else if (stats.isDirectory()) {
			allowed = options.filterfolders.every(function(filter) {
				return minimatch(absPath, filter, {nocase: true});
			});
		}

		_ignoreCache[absPath] = !allowed;
	}

	return !allowed;
}

/**
 * @private
 * @param {string} filePath - filePath for file that changed.
 */
function updateLessFile(filePath) {

	//getting multiple change event triggers, possibly due to a bug in chokidar
	//or to text editor not debouncing their own save events/keybinds
	//for that reason we need to debounce the change event ourselves
	//related chokidar issue: https://github.com/paulmillr/chokidar/issues/104

	if (_recentlyCompiledFiles.hasOwnProperty(filePath)) {
		return;
	}
	_recentlyCompiledFiles[filePath] = setTimeout(function(filePath) {
		delete _recentlyCompiledFiles[filePath];
	}.bind(null, filePath), DEBOUNCE_CHANGE_EVENT);
	motifLessCompiler.compileMotifLessFile(filePath);
}

/**
 * @private
 * @param {Error} error - Error raised while file watching.
 */
function fileWatchingErrored(error) {
	Log.error("Error while watching file.");
	Log.error(error);
}