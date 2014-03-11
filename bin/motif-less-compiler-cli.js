#!/usr/bin/env node
"use strict";
var yargs = require("yargs")
	.usage("Compiles Less files for a Bladerunner app.\nUsage: node motif-less-compiler")

	.config("c").alias("c", "config").describe("c", "Path to config file").default("c","config.json")

	.boolean("autoprefix").describe("Add auto-prefixer functionality to compiler")
	.boolean("h").alias("h", "help").describe("p4", "Show help")
	.boolean("p4").alias("p4", "perforce").describe("p4", "Use perforce to checkout files before saving")
	.boolean("v").alias("v", "verbose").describe("v", "Verbose mode")
	.boolean("w").alias("w", "watch").describe("w", "Watch directory for changes to LESS files")

	.string("g").alias("g","globals").describe("g", "Import files into every file that is compiled")
	.string("ignorefiles").describe("ignorefiles", "Ignore files with the given filenames")
	.string("ignorefolders").describe("ignorefolders", "Ignore folders in the given array")
	.string("t").alias("t", "theme").describe("t", "Name of a Bladerunner theme to use");
var argv = yargs.argv;

var motifLessCompiler = require("../lib/motif-less-compiler");

if (argv.help) {
	console.log(yargs.help());
} else {
	motifLessCompiler(argv);
}