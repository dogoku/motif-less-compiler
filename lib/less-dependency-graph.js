"use strict";
var DepGraph = require("dependency-graph").DepGraph;
var graph = new DepGraph();
var path = require("path");

function addFile (filePath) {
	var absFilePath = path.resolve(process.cwd(), filePath);

	if (graph.hasNode(absFilePath) === false) {
		graph.addNode(absFilePath);
	}

	return absFilePath;
}

function removeDependencies (filePath) {
	var absFilePath = path.resolve(process.cwd(), filePath);

	if (graph.hasNode(absFilePath)) {
		graph.dependenciesOf(absFilePath).forEach(function(depPath) {
			graph.removeDependency(absFilePath, depPath);
		});
	}

	return absFilePath;
}

function addDependencies(filePath, depPaths) {
	var absFilePath = addFile(filePath);

	removeDependencies(absFilePath);
	depPaths.forEach(function(depPath) {
		var absDepPath = addFile(depPath);
		graph.addDependency(absFilePath, absDepPath);
	});

}

function getDependants(filePath) {
	var absFilePath = path.resolve(process.cwd(), filePath);
	return graph.hasNode(absFilePath) ? graph.dependantsOf(absFilePath) : [];
}

exports.addDependencies = addDependencies;
exports.removeDependencies = removeDependencies;
exports.getDependants = getDependants;

exports._graph = graph;