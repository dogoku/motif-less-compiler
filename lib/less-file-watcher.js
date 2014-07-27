/** @module motif-less-compiler/lib/less-file-watcher */

"use strict";

var DEBOUNCE_CHANGE_EVENT = 300;
var options;
var Log = require("fell").Log;
var chokidar = require("chokidar");
var motifLessCompiler = require("./motif-less-compiler");
var setTimeout = require("timers").setTimeout;
var recentlyCompiledFiles = {};

/**
 * Waits for initialization of the motif less compiler.
 * Once it's prepared feeds .less files into the motif less compiler.
 *
 * @alias module:motif-less-compiler/lib/less-file-watcher
 */
module.exports = function startWatchingLessFiles(opts) {
	options = opts;
	motifLessCompiler.
	initializeCompiler(options).
	then(lessCompilerInitialized);
};

/**
 * Test function which returns whether a file or directory should be watched.
 * If it's a file and it ends with ".less" or if it's a directory it will be watched.
 *
 * @private
 * @param {string} path - Path for file that might be watched.
 * @param {fs.Stats} [stats] - File stats for file that might be watched.
 * @returns {boolean} Returns false for files or directories that will be watched.
 */
function ignoreAllFilesExceptLessFiles(path, stats) {
	if (stats) {
		if (stats.isFile() && /.*less$/.test(path) === false) {
			return true;
		} else if (stats.isDirectory() && (/.*node_modules$/.test(path) || /.*\.git$/.test(path) || /.*\.svn$/.test(path))) {
			return true;
		}
	}

	return false;
}

/**
 * @private
 * @param {Error} error - Error raised while file watching.
 */
function fileWatchingErrored(error) {
	Log.error("Error while watching file.");
	Log.error(error);
}

/**
 * @private
 * @param {string} path - Path for file that changed.
 */
function watchedLessFileChanged(path) {

	//getting multiple change event triggers, possibly due to a bug in chokidar
	//or to text editor not debouncing their own save events/keybinds
	//for that reason we need to debounce the change event ourselves
	//related chokidar issue: https://github.com/paulmillr/chokidar/issues/104

	if (recentlyCompiledFiles.hasOwnProperty(path)) {
		return;
	}
	recentlyCompiledFiles[path] = setTimeout(function(path) {
		delete recentlyCompiledFiles[path];
	}.bind(null, path), DEBOUNCE_CHANGE_EVENT);
	motifLessCompiler.compileMotifLessFile(path);
}

/**
 * @private
 */
function lessCompilerInitialized() {
	var watcher = chokidar.watch(".", {
		persistent: options.watch,
		ignoreInitial: false,
		ignored: ignoreAllFilesExceptLessFiles
	});

	watcher.
		on("add", watchedLessFileChanged).
		on("change", watchedLessFileChanged).
		on("error", fileWatchingErrored);
}