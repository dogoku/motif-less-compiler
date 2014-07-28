[![Build Status](https://travis-ci.org/dogoku/motif-less-compiler.png)](https://travis-ci.org/dogoku/motif-less-compiler)
[![Dependency Status](https://david-dm.org/dogoku/motif-less-compiler.svg)](https://david-dm.org/dogoku/motif-less-compiler)


#Motif LESS compiler

A custom LESS compiler with the following features:
- File watching - watch for .less file changes and recompile the file and all it's dependants
- Global imports - Specify files to be imported into every LESS file
- Filtering - Add include or ignore filters for directories and files, using [glob patterns][gp]
- Autoprefix - Auto browser prefixing, using the awesome [Autoprefixer][ai]
- Bladerunner Themes - Built in support for [BladerunnerJS][BRJS] themes

##Usage

- Install by running

	`npm i -g dogoku/motif-less-compiler#v1.2.1`

- Then `cd` into the root of your application e.g. `fxtrader` for the FxMotif.

- Execute

	`motif-less-compiler [arguments]`

**Note that:**
Only errors generate console output, successful runs produce no output.

##Configuration

The compiler accepts a number of arguments either passed from the command line or via a config file

###Command line arguments

| Argument         | Description                               | Type    | Default              | Status  |
|:-----------------|:------------------------------------------|:--------|:--------------------:|:-------:|
|`--autoprefix`    | [Autoprefixer][ai] browser configuration  | Array   | Empty Array          | Done    |
|`-c, --config`    | Path to config file                       | Path    | `./less_config.json` | Done    |
|`--filterfiles`   | Filter files using [glob patterns][gp]    | Array   | Empty Array          | Done    |
|`--filterfolders` | Filter folders using [glob patterns][gp]  | Array   | Empty Array          | Done    |
|`-g, --globals`   | Paths to global import files              | Boolean | **false**            | Done    |
|`-h, --help`      | Show usage and help information           | Boolean | **false**            | Done    |
|`-t, --theme`     | Name of a Bladerunner theme to use        | Boolean | `cotton`             | Done    |
|`-v, --verbose`   | Verbose: `0-silent` `1-low` `2-noisy`     | Integer | 1 - Low              | In DEV  |
|`-w, --watch`     | Watch directory for changes to LESS files | Boolean | **false**            | Done    |

####Example usage

Single letter arguments use one `-`. Everything else uses two `-`

	motif-less-compiler -v --perforce

You can force booleans to false, by using `no-`

	motif-less-compiler --no-watch

You can use declare the same argument multiple times for arrays

####Filter Patterns

We are using the [minimatch][mn] glob matcher to power our directory and file filtering.

Matching is done against the **absolute paths** of files and directories,
so write your glob patterns appropriately.

Here's a quick list with example filters

 - `**/styles/**` - match all files that are under a `styles` directory or it's subfolders
 - `**/*.less` - match all less files
 -  `!**/_*.less` - exclude all .less starting with an `_`

###Config file

The config file, must contain a single JSON object.
The object's keys must match the CLI arguments' **long** format.


####Example usage with config file

	motif-less-compiler -c path/to/my-config.js

Config.js

	{
		"watch": false,
		"filterfolder":[ "**/.svn", "**/.git", "**/node_modules" ],
		"filterfiles": [ "**/styles/**",  "!**/_*.less"],
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

Simply fork the repo on github, make changes and create a Pull Request.

Here's a [quick guide][pr] on how to do that


##Credits

###Third Party Libs

This project uses the following open source libraries. Check them out!

- [Autoprefixer][ai] for cross browser awesomeness
- [Bluebird][bb] for promises of hapiness
- [Chokidar][chok] for file watching on steroids
- [Dependency-Graph][dg] for keeping up with the dependencies
- [minimatch][mn] for file filtering like a pro
- [yargs][yaar] for argument parsing sweeter than rum
- [Mocha][mocha] and [Chai][chai] for testing

> Made with `<3` and lots of coffee by [@briandipalma][brian] and [@dogoku][dogoku]


<!--- Link References -->
[ai]: https://github.com/ai/autoprefixer
[bb]: https://github.com/petkaantonov/bluebird
[brian]: https://github.com/briandipalma
[BRJS]: https://github.com/BladeRunnerJS/brjs
[chai]: http://chaijs.com/
[chok]: https://github.com/paulmillr/chokidar
[dg]: https://github.com/jriecken/dependency-graph
[dogoku]: https://github.com/dogoku
[inspector]: https://github.com/node-inspector/node-inspector
[gp]: #filter-patterns
[mn]: https://github.com/isaacs/minimatch
[mocha]: http://visionmedia.github.io/mocha/
[pr]: http://code.tutsplus.com/articles/team-collaboration-with-github--net-29876
[yaar]: https://github.com/chevex/yargs