#!/usr/bin/env node
"use strict";

var motifLessWatcher = require("../lib/less-file-watcher");
var options = require("../lib/argument-parser")(process.argv);

motifLessWatcher(options);