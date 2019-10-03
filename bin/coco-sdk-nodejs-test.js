#!/usr/bin/env node

const cli = require("../src/cli");
const readline = require("readline");

cli(process.argv.slice(2));

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on("line", data => {
  cli(data).then(() => {
    rl.close();
  });
});
