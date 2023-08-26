# Advent of Code 2022
https://adventofcode.com/2022

[![Build Status](https://github.com/cp4r3z/adventofcode-js-2022/actions/workflows/node.js.yml/badge.svg)](https://github.com/cp4r3z/adventofcode-js-2022/actions)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/cp4r3z/adventofcode-js-2022/main/LICENSE)

## Setup

```
npm install -g typescript
```

**Ctrl+Shift+B**, tsc: build or tsc: watch

https://code.visualstudio.com/docs/typescript/typescript-compiling

## Running Unit Tests

*All Tests*
```shell
npm test
```
*Specific Day's Tests*
```shell
npm test 01
```
## Debugging

In VSCode, enable "Auto Attach" and run the script with the --inspect flag.

https://code.visualstudio.com/docs/nodejs/nodejs-debugging

### npm run test (node-terminal)

The `launch.json` file is setup so you can run/debug the unit test of *the currently open* .ts file by simply hitting F5. 

* If you hit F5 from a top-level file (like this one!) all unit tests will be run.
* You'll have to hit Shift+F5 to stop the debugger and clear the terminal.
