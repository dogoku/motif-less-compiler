/** @module motif-less-compiler/lib/less-file-watcher */

"use strict";

var Log = require("fell").Log;
var chokidar = require("chokidar");
var motifLessCompiler = require("./motif-less-compiler");

/**
 * Waits for initialization of the motif less compiler.
 * Once it's prepared feeds .less files into the motif less compiler.
 *
 * @alias module:motif-less-compiler/lib/less-file-watcher
 */
module.exports = function startWatchingLessFiles(options) {
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
	motifLessCompiler.compileMotifLessFile(path);
}

/**
 * @private
 */
function lessCompilerInitialized() {
	var watcher = chokidar.watch(".", {
		persistent: false,
		ignoreInitial: false,
		ignored: ignoreAllFilesExceptLessFiles
	});

	watcher.
		on("add", watchedLessFileChanged).
		on("change", watchedLessFileChanged).
		on("error", fileWatchingErrored);
}