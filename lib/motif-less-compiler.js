/** @module motif-less-compiler/lib/motif-less-compiler */

"use strict";

var options = null;
var autoprefixer = require("autoprefixer");
var globalImportString = "";
var fs = require("fs");
var path = require("path");
var less = require("less");
var Log = require("fell").Log;
var lessDependancies = require("./less-dependency-graph");
var Promise = require("bluebird");
var readFile = Promise.promisify(fs.readFile);
var writeFile = Promise.promisify(fs.writeFile);

/**
 * Will load globally required less variables and mixins.
 *
 * @alias module:motif-less-compiler/lib/motif-less-compiler
 */

function initializeCompiler(opts) {
	var lastReadGlobal;
	var allGlobalsExist;

	options = opts;

	allGlobalsExist = options.globals.every(function(filePath) {
		filePath = path.resolve(process.cwd(), filePath);
		lastReadGlobal = filePath;
		return fs.existsSync(filePath);
	});

	if (allGlobalsExist){
		globalImportString = options.globals.reduce(function (importString, globalPath) {
			return importString + "@import \"" + globalPath + "\";";
		}, "");
		return Promise.resolve();
	} else {
		return Promise.reject(lastReadGlobal).catch(readingGlobalFilesErrored);
	}

}

/**
 * @private
 * @param {Error} error
 */
function readingGlobalFilesErrored(globalPath) {
	Log.error("\nError while reading global less files:");
	Log.error(globalPath);
	process.exit(0);
}

/**
 * [compileLessFileAsync description]
 * @return {[type]}
 */
function compileLessFileAsync(filePath) {
	var resolver = new Promise.pending();

	readFile(filePath, "utf8").
	then(addGlobalImports.bind(null, filePath)).
	then(parseLessFile.bind(null, filePath)).
	then(compileLessCode.bind(null, filePath)).
	then(saveCSSFile.bind(null, filePath)).
	then(compileDependants.bind(null, filePath)).

	catch(lessCompilerError.bind(null, filePath, resolver)).
	done(lessCompilerDone.bind(null, filePath, resolver));

	return resolver.promise;
}


/**
 * @private
 * @param {string} filePath
 * @param {string} lessFileContents
 */
function addGlobalImports(filePath, lessFileContents) {
	var lessCode = lessFileContents;

	if (options.globals.indexOf(filePath) === -1) {
		lessCode = globalImportString + "\n" + lessFileContents;
	}

	return Promise.resolve(lessCode);
}


function parseLessFile(filePath, lessFileContents) {
	var resolver = Promise.pending();
	var lessOptions = {
		paths: [path.dirname(filePath), process.cwd()],
		optimizations: 0,
		filename: path.basename(filePath),
		strictMath: true
	};

	(new less.Parser(lessOptions))
		.parse(lessFileContents, function (e, root, options) {
			if (e) {
				resolver.reject(e);
			} else {
				resolver.resolve(root,options);
			}
		});

	return resolver.promise;
}

function compileLessCode (filePath, root, options) {
	var css = null;
	var isNotPartial = path.basename(filePath).indexOf("_") !== 0;

	try {
		css = isNotPartial? root.toCSS(options) : css;
		updateDependencies(filePath, root.rules);
		return Promise.resolve(css);
	} catch (error) {
		return Promise.reject(error);
	}
}

function updateDependencies (filePath, rules) {
	var parsedImports = rules.reduce(function (deps, rule) {
		if (rule.importedFilename) {
			deps.push(rule.importedFilename);
		}
		return deps;
	}, []);

	lessDependancies.addDependencies(filePath, parsedImports);
}

/**
 * @private
 * @param {string} lessFilePath
 * @param {string|null} the css code to be saved. null if file is partial
 */
function saveCSSFile(lessFilePath, css) {
	var cssFilePath = lessFilePath.replace(/\.less$/, ".css");

	if (css === null || options.globals.indexOf(lessFilePath) !== -1) {
		return Promise.resolve();
	}

	if (options.autoprefix.length) {
		css = autoprefixer(options.autoprefix).process(css).css;
	}

	return writeFile(cssFilePath, css);
}

function compileDependants (filePath) {
	var dependants = lessDependancies.getDependants(filePath);

	if (dependants.length) {

		return Promise.map(dependants, function(depPath) {
			return compileLessFileAsync(depPath);
		});
	}

	return Promise.resolve();
}

function lessCompilerError(filePath, promise, error) {
	Log.error("\nError while compiling: ", filePath);
	Log.error(error);
	promise.reject();
}

function lessCompilerDone(filePath, promise) {
	promise.resolve();
}


exports.initializeCompiler = initializeCompiler;
exports.compileMotifLessFile = compileLessFileAsync;