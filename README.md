[![Build Status](https://travis-ci.org/dogoku/motif-less-compiler.png)](https://travis-ci.org/dogoku/motif-less-compiler)
[![Dependency Status](https://david-dm.org/dogoku/motif-less-compiler.svg)](https://david-dm.org/dogoku/motif-less-compiler)


#Motif LESS compiler

A custom LESS compiler for Bladerunner apps

##Usage

- Install by running

	`npm i -g briandipalma/motif-less-compiler#v1.2.1`

- Then `cd` into the root of your application e.g. `fxtrader` for the FxMotif.

- Execute

	`motif-less-compiler`

**Note that:**
Only errors generate console output, successful runs produce no output.

##Configuration

The compiler accepts a number of arguments either passed from the command line or via a config file

###Command line arguments

| Argument         | Description                               | Type    | Default              | Status  |
|:-----------------|:------------------------------------------|:--------|:--------------------:|:-------:|
|`--autoprefix`    | [Autoprefixer][ai] browser configuration  | Array   | Empty Array          | Done    |
|`-c, --config`    | Path to config file                       | Path    | `./less_config.json` | Done    |
|`-g, --globals`   | Global import files                       | Boolean | **false**            | Done    |
|`-h, --help`      | Show usage and help information           | Boolean | **false**            | Done    |
|`--ignorefiles`   | Ignore files with the given filenames     | Array   | Empty Array          | Backlog |
|`--ignorefolders` | Ignore folders in the given array         | Array   | Empty Array          | Backlog |
|`-t, --theme`     | Name of a Bladerunner theme to use        | Boolean | `cotton`             | Backlog |
|`-v, --verbose`   | Verbose mode                              | Boolean | **false**            | Backlog |
|`-w, --watch`     | Watch directory for changes to LESS files | Boolean | **false**            | Done    |

####Example usage

Single letter arguments use one `-`. Everything else uses two `-`

	motif-less-compiler -v --perforce

You can force booleans to false, by using `no-`

	motif-less-compiler --no-watch

You can use declare the same argument multiple times for arrays

###Config file

The config file, must contain a single JSON object.
The object's keys must match the CLI arguments' **long** format.


####Example usage with config file

	motif-less-compiler -c path/to/my-config.js

Config.js

	{
		"watch": false,
		"ignoreFolders":[ ".svn", ".git", "node_modules" ],
		"ignoreFiles": [ "variables.less", "mixins.less" ],
		"theme": "cotton",
		"globals":[
			"/default-aspect/themes/cotton/ontology/variables.less",
			"/default-aspect/themes/cotton/mixins.less"
		]
	};

##Development

###Linking to npm

Remove any previously installed version

	`npm r -g motif-less-compiler`

If you want to make a PR to the repo fork it.

- Clone the repo you wish to develop in.
	`git clone <repo-url>`

- Then `cd` into the repo directory.

- Once inside the repo directory run

	`npm link`

- Now when you execute `motif-less-compiler` your local cloned repo will be used.

- Work away.

###Debugging

In order to debug a nodejs app, you need to install [Node Inspector][inspector]

	`npm install -g node-inspector`

Once node-inspector is installed you can debug the app, by running the CLI script using `node-debug`

	`node-debug bin/motif-less-compiler-cli.js`

Keep in mind that all paths will be relative to your current working directory.

###Testing

 Add any tests you have inside the `test` directory.
- Tests are setup to use [Mocha][mocha] as the test runner and [Chai][chai] as the assertion library

To run the tests, `cd` to the repo directory and run

	npm test

###Commiting changes

- Simply fork the repo on github, make changes and create a [Pull Request][pr].

- Every Pull Request should atleast pass [Travis CI][travis] in order to be accepted


<!--- Link References -->
[ai]: https://github.com/ai/autoprefixer
[inspector]: https://github.com/node-inspector/node-inspector
[mocha]: http://visionmedia.github.io/mocha/
[chai]: http://chaijs.com/
[pr]: http://code.tutsplus.com/articles/team-collaboration-with-github--net-29876
[travis]: https://travis-ci.org/