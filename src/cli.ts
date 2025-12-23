#!/usr/bin/env node
import { Command } from "commander";
import * as fs from "fs";
import * as path from "path";

const packageJsonPath = path.resolve(__dirname, "..", "package.json");
const pkg = JSON.parse(fs.readFileSync(packageJsonPath, "utf8")) as {
  description?: string;
  version?: string;
};
const program = new Command();


program.addHelpText(
  "before",
  () => `\n${pkg.description || "No description available."}\n`
);

program.parse(process.argv);
