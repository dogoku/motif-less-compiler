![](https://david-dm.org/briandipalma/motif-less-compiler.png)
[![Build Status](https://travis-ci.org/dogoku/motif-less-compiler.png)](https://travis-ci.org/simkimsia/UtilityBehaviors)


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

| Argument           | Description                                  | Type    | Default              | Status         |
|:-------------------|:---------------------------------------------|:--------|:--------------------:|:--------------:|
|`--autoprefix`      | Add auto-prefixer functionality to compiler  | Boolean | **false**            | Backlog        |
|`-c, --config`      | Path to config file                          | Path    | `./less_config.json` | Done           |
|`-g, --globals`     | Global import files                          | Boolean | **false**            | In development |
|`-h, --help`        | Show usage and help information              | Boolean | **false**            | Done           |
|`--ignorefiles`     | Ignore files with the given filenames        | Array   | `null`               | Backlog        |
|`--ignorefolders`   | Ignore folders in the given array            | Array   | `null`               | Backlog        |
|`-t, --theme`       | Name of a Bladerunner theme to use           | Boolean | `cotton`             | Backlog        |
|`-v, --verbose`     | Verbose mode                                 | Boolean | **false**            | Backlog        |
|`-w, --watch`       | Watch directory for changes to LESS files    | Boolean | **false**            | In development |

####Example usage

Single letter arguments use one `-`. Everything else uses two `-`

	motif-less-compiler -v --perforce

You can force booleans to false, by using `no-`

	motif-less-compiler --no-watch

You can use declare the same argument multiple times for arrays

###Config file

The config.js file, is a JSON file with the configuration
The arguments must be declared using their **long** format.


####Example usage with config.js

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
