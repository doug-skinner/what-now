#!/usr/bin/env node
import { Command } from "commander";

const program = new Command();

program
	.name("what-now")
	.description("A CLI tool to help you decide what to do next.")
	.version("0.1.0");

program.parse(process.argv);
