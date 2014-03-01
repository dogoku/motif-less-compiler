/** @module motif-less-compiler/lib/motif-less-compiler */

"use strict";

var fs = require("fs"),
    less = require("less"),
    Promise = require("bluebird"),
    chokidar = require("chokidar"),
    readFile = Promise.promisify(fs.readFile);

/**
 * 
 */
modules.exports = function motifLessCompiler(compilerArguments) {
	startWatchingLessFiles();
};


/**
 * Start watching Less files.
 * 
 * @private
 */
function startWatchingLessFiles() {
	console.info("Watching files");

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

/**
 * Test function which returns whether a file or directory should be watched.
 * If it's a file and it ends with ".less" or if it's a directory it will be watched.
 * 
 * @private
 * @param {string} path - Path for file that could be watched.
 * @param {fs.Stats} [stats] - File stats for file that could be watched.
 * @returns {boolean} Returns false for files or directories that will be watched.
 */
function ignoreAllFilesExceptLessFiles(path, stats) {
	if (stats && stats.isFile() && (/.*less$/.test(path) === false)) {
		return true;
	}

	return false;
}

/**
 * Called when a watched file is changed.
 * 
 * @private
 * @param {string} path - Path for file that changed.
 */
function watchedLessFileChanged(path) {
	console.info("File changed", path);

	
	//You have a less file and right next to it you have a less file.
	//options.paths = [path.dirname(input)].concat(options.paths);
	
	readFile.
	    then(lessFileRead).
	    catch();

	less.render('.class { width: (1 + 1) }', config, function (e, css) {
		console.log(css);
	});
}

/**
 * Called when an error is raised while file watching.
 * 
 * @private
 * @param {Object} error - Error raised while file watching.
 */
function fileWatchingErrored(error) {
	console.error("Error while watching file.");
	console.error(error);
}

/**
 * 
 * @private
 * @param lessFileContents
 * @returns
 */
function lessFileRead(lessFileContents) {
	console.info(lessFileContents);
}

function readingLessFileErrored() {
	
}
