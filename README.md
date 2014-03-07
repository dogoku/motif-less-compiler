To Use
------

Install by running

`npm i -g briandipalma/motif-less-compiler#1.0.0`

Then `cd` into the root of your application e.g. `fxtrader` for the FxMotif.

Execute

`motif-less-compiler`

Only errors generate console output, successful runs produce no output.

To Develop
----------

Firstly you must remove any installed version

`npm r -g motif-less-compiler`

If you want to make a PR to the repo fork it.
Clone the repo you wish to develop in.

`git clone <repo-url>`

Then `cd` into the repo directory.

Once inside the repo directory run

`npm link`

Now when you execute `motif-less-compiler` your local cloned repo will be used.

Work away.