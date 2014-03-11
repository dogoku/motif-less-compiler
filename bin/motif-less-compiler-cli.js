#!/usr/bin/env node
"use strict";

var motifLessCompiler = require("../lib/motif-less-compiler");
var options = require("../lib/argument-parser")(process.argv);

if (options !== null) {
	motifLessCompiler(options);
}
