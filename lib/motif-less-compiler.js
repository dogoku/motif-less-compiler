/** @module motif-less-compiler/lib/motif-less-compiler */

"use strict";

var fs = require("fs"),
    less = require("less"),
    Promise = require("bluebird"),
    chokidar = require("chokidar"),
    readFile = Promise.promisify(fs.readFile);

/**
 * 
 * @param {Array} compilerArguments
 * @returns
 */
module.exports = function startWatchingLessFiles(compilerArguments) {
//	console.info("Watching files");

	var watcher = chokidar.watch(".", {
			persistent: false,
			ignoreInitial: false,
			ignored: ignoreAllFilesExceptLessFiles
		});
	
	watcher.
	    on("add", watchedLessFileChanged).
	    on("change", watchedLessFileChanged).
	    on("error", fileWatchingErrored);
};

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
	if (stats && stats.isFile() && 
			(/.*less$/.test(path) === false || /.*node_modules.*/.test(path))) {
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
//	console.info("File changed", path);

	readFile(path, "utf8").
	    then(lessFileRead.bind(null, path)).
	    catch(readingLessFileErrored);
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
function lessFileRead(filePath, lessFileContents) {
	//options.paths = [path.dirname(input)].concat(options.paths);
	//config,
	
	less.
	    render(lessFileContents, lessFileCompiled.bind(null, filePath));
}

/**
 * 
 * @param error
 * @returns
 */
function readingLessFileErrored(error) {
	console.error("Error while reading less file.");
	console.error(error);
}

/**
 * 
 * @param {string} lessFilePath
 * @param {Object} error
 * @param {string} css
 * @returns
 */
function lessFileCompiled(lessFilePath, error, css) {
	if(error) {
		console.error("Error while compiling less file");
		console.error(error);
		process.exit(1);
	} else {
		//TODO: Write the css to a file adjacent to the less file.
		var cssFilePath = lessFilePath.replace(/\.less$/, ".css");
		//fs.writeFileSync(cssFilePath, css, "utf8");
		console.log(cssFilePath);
	}
}
