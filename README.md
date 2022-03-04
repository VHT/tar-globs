### A utility for creating .tar.gz archives that contain files that match a set of glob paths.

## What this does

Loads files from a list of glob paths and compresses them into an archive (.tar.gz or .zip).

## Installing and Running

You can add this directly to a javascript project

```
yarn add @vht/tar-globs

yarn run tar-globs -i globs.json -o archived.tar.gz
```

or use it in a non-javascript project by using `npm` or `yarn` to install it as a global command

```
yarn global add @vht/tar-globs

cd /your/project
tar-globs -i globs.json -o archived.tar.gz
```

## Help / Docs

Run `tar-globs --help` for usage.

## Example config file

A config file needs to be passed to the `--input <file>` parameter.
This file should be JSON that includes the following fields:

* `globs: string[]` - An array of strings, each representing a glob of files to include into the archive. Refer to [micromatch](https://github.com/micromatch/micromatch) for supported glob patterns.

* `rename: Record<string, string>` - (Optional) A hash of files to rename. If a file matches the 'key' in the hash, then it will be renaming in the archive to the 'value'.

_Example config:_
```
{
  "globs": [
    "!node_modules/",
    "!**/*.spec.js",
    "**/*.js",
    "**/*.json"
  ],
  "rename": {
    "src/something.js": "src/somethingElse.js"
  }
}
```
