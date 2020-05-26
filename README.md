### A utility for creating .tar.gz archives that contain files that match a set of glob paths.

## What this does

Loads a whitelist of files from a list of glob paths and compresses them into a .tar.gz file.

## Installing

You can add this directly to a javascript project

```
yarn add @vht/tar-globs

yarn run tar-globs -i whitelist.globs -o archived.tar.gz
```

or use it in a non-javascript project by using `npm` or `yarn` to install it as a global command

```
yarn global add @vht/tar-globs

cd /your/project
tar-globs -i whitelist.globs -o archived.tar.gz
```

## Help / Docs

Run `tar-globs --help` for usage.

## Example glob file

A file containing one glob per line is used as the input (specified by the `--input <file>` option). For example:

```
!node_modules/
!**/*.spec.js
**/*.js
**/*.json
```
