/** @module motif-less-compiler/lib/motif-less-compiler */

"use strict";

var options = null,
	globalMixins = "",
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
 * Will load globally required less variables and mixins.
 *
 * @alias module:motif-less-compiler/lib/motif-less-compiler
 */
exports.initializeCompiler = function initializeCompiler(options) {
	var mixinsPath = path.resolve(process.cwd(), "default-aspect/themes/cotton/mixins.less");
	var globalVariablesPath = path.resolve(process.cwd(), "default-aspect/themes/cotton/ontology/variables.less");

	return Promise.all([
		readFile(mixinsPath, "utf8"),
		readFile(globalVariablesPath, "utf8")
	]).
	spread(globalFilesRead).
	catch(readingGlobalFilesErrored);	
};

/**
 * Will load globally required less variables and mixins.
 * Once loaded it will compile every .less file into an adjacent .css file.
 * It will search for .less files from the cwd of the process.
 *
 * @alias module:motif-less-compiler/lib/motif-less-compiler
 */
exports.compileMotifLessFile = function compileMotifLessFile(path) {
	readFile(path, "utf8").
    then(lessFileRead.bind(null, path)).
    catch(readingLessFileErrored);
};

/**
* @private
* @param {string} mixinsFileContents
* @param {string} globalVariablesFileContents
*/
function globalFilesRead(mixinsFileContents, globalVariablesFileContents) {
	globalMixins = mixinsFileContents;
	globalVariables = globalVariablesFileContents;
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
 * @param {Error} error
 */
function readingLessFileErrored(error) {
	Log.error("Error while reading less file.");
	Log.error(error);
}

/**
 * @private
 * @param {Error} error
 */
function writingCSSFileErrored(error) {
	Log.error("Error while writing css file.");
	Log.error(error);
}

/**
 * @private
 * @param {string} lessFilePath
 * @param {Error} error
 * @param {string} css
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
 * @private
 * @param {string} filePath
 * @param {string} lessFileContents
 */
function lessFileRead(filePath, lessFileContents) {
	var lessFileWithGlobals = lessFileContents + globalVariables + globalMixins;

	less.render(lessFileWithGlobals, lessFileCompiled.bind(null, filePath));
}

/**
 * @private
 * @param {Error} error
 */
function readingGlobalFilesErrored(error) {
	Log.error("Error while reading global less files, unable to compile less files.");
	Log.error(error);
}