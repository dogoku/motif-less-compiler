/** @module motif-less-compiler/lib/motif-less-compiler */

"use strict";

var	globalMixins = "",
	fs = require("fs"),
	globalVariables = "",
	path = require("path"),
    less = require("less"),
    Log = require("fell").Log,
    Promise = require("bluebird"),
    chokidar = require("chokidar"),
    readFile = Promise.promisify(fs.readFile),
    writeFile = Promise.promisify(fs.writeFile);

/**
 * @param {Array} compilerArguments
 */
module.exports = function startWatchingLessFiles(compilerArguments) {
	var mixinsPath = path.resolve(process.cwd(), "default-aspect/themes/cotton/mixins.less");
	var globalVariablesPath = path.resolve(process.cwd(), "default-aspect/themes/cotton/ontology/variables.less");
	
	Promise.all([
			readFile(mixinsPath, "utf8"),
			readFile(globalVariablesPath, "utf8")
		]).
		spread(globalFilesRead).
		catch(readingGlobalFilesErrored);
};

/**
 * @private
 * @param {string} mixinsFileContents
 * @param {string} globalVariablesFileContents
 */
function globalFilesRead(mixinsFileContents, globalVariablesFileContents) {
	globalMixins = mixinsFileContents;
	globalVariables = globalVariablesFileContents;
	
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
 * @param {Error} error
 */
function readingGlobalFilesErrored(error) {
	Log.error("Error while reading global less files, unable to compile less files.");
	Log.error(error);
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
 * Called when a watched file is changed.
 * 
 * @private
 * @param {string} path - Path for file that changed.
 */
function watchedLessFileChanged(path) {
	readFile(path, "utf8").
	    then(lessFileRead.bind(null, path)).
	    catch(readingLessFileErrored);
}

/**
 * Called when an error is raised while file watching.
 * 
 * @private
 * @param {Error} error - Error raised while file watching.
 */
function fileWatchingErrored(error) {
	Log.error("Error while watching file.");
	Log.error(error);
}

/**
 * @private
 * @param {string} filePath
 * @param {string} lessFileContents
 */
function lessFileRead(filePath, lessFileContents) {
	var lessFileWithGlobals = lessFileContents + globalVariables + globalMixins;
	
	less.render(lessFileWithGlobals, lessFileCompiled.bind(null, filePath));
}

/**
 * 
 * @param {Error} error
 * @returns
 */
function readingLessFileErrored(error) {
	Log.error("Error while reading less file.");
	Log.error(error);
}

/**
 * 
 * @param {string} lessFilePath
 * @param {Error} error
 * @param {string} css
 * @returns
 */
function lessFileCompiled(lessFilePath, error, css) {
	if(error) {
		Log.error("Error while compiling less file", lessFilePath);
		Log.error(error);
	} else {
		var cssFilePath = lessFilePath.replace(/\.less$/, ".css");

		writeFile(cssFilePath, css).
			catch(writingCSSFileErrored);
	}
}

/**
 * @param {Error} error
 */
function writingCSSFileErrored(error) {
	Log.error("Error while writing css file.");
	Log.error(error);
}