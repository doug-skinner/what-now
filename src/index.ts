#!/usr/bin/env node
import { Command } from "commander";
import { getGitHubToken, setGitHubToken } from "./lib/config.js";

const program = new Command();

program
	.name("what-now")
	.description("A CLI tool to help you decide what to do next.")
	.version("0.1.0");

// Command to set GitHub token
program
	.command("set-token <token>")
	.description("Set the GitHub token for authentication")
	.action((token) => {
		setGitHubToken(token);
		console.log("GitHub token has been set.");
	});

// Command to get GitHub token
program
	.command("get-token")
	.description("Get the currently set GitHub token")
	.action(() => {
		const token = getGitHubToken();
		if (token) {
			console.log("Current GitHub token:", token);
		} else {
			console.log(
				"No GitHub token is set. Set one using the set-token command.",
			);
		}
	});

program.parse(process.argv);
