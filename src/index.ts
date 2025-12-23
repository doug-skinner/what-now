#!/usr/bin/env node
import { Command } from "commander";
import ora from "ora";
import { prioritizeIssuesWithAI } from "./lib/ai.js";
import {
	getGitHubToken,
	getRepos,
	setGitHubToken,
	setRepos,
} from "./lib/config.js";
import { fetchOpenRepoIssues } from "./lib/github.js";

const program = new Command();

program
	.name("what-now")
	.description("A CLI tool to help you decide what to do next.")
	.version("0.1.0");

program
	.command("set-token <token>")
	.description("Set the GitHub token for authentication")
	.action((token) => {
		setGitHubToken(token);
		console.log("GitHub token has been set.");
	});

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

program
	.command("set-repos <repos>")
	.description(
		"Set a comma-separated list of repos the CLI will act against (eg: username/repo,username/repo2)",
	)
	.action((repos) => {
		setRepos(repos);
		console.log("Repos have been set.");
	});

program
	.command("get-repos")
	.description("Get the currently set repos")
	.action(() => {
		const repos = getRepos();
		if (repos) {
			console.log("Current repos:", repos);
		} else {
			console.log(
				"No repos set. Use set-repos with format: username/repo,username/repo2",
			);
		}
	});

program
	.command("prioritize")
	.description(
		"Fetch open issues from configured repos and prioritize them using AI",
	)
	.action(async () => {
		const fetchSpinner = ora("Fetching open issues...");

		try {
			const reposString = getRepos();
			if (!reposString) {
				console.log(
					"No repos set. Use set-repos with format: username/repo,username/repo2",
				);
				return;
			}

			const repos = reposString.split(",").map((r) => r.trim());
			let allIssues = [];

			fetchSpinner.start();
			for (const repo of repos) {
				fetchSpinner.text = `Fetching open issues for ${repo}`;
				const issues = await fetchOpenRepoIssues(repo);
				allIssues = allIssues.concat(issues);
			}
			fetchSpinner.succeed("Fetched open issues.");

			if (allIssues.length === 0) {
				console.log("No open issues found in the configured repositories.");
				return;
			}

			const aiSpinner = ora("Prioritizing issues with AI...").start();
			try {
				const prioritizedOutput = await prioritizeIssuesWithAI(allIssues);
				aiSpinner.succeed("Prioritization complete.");
				console.log("Prioritized Issues:\n", prioritizedOutput);
			} catch (error) {
				aiSpinner.fail("Failed to prioritize issues with AI.");
				throw error;
			}
		} catch (error) {
			if (fetchSpinner.isSpinning) {
				fetchSpinner.fail("Failed to fetch open issues.");
			}
			console.error("Error during prioritization:", error);
		}
	});

program.parse(process.argv);
