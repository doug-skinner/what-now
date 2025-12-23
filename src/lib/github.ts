import { Octokit } from "octokit";
import { getGitHubToken } from "./config.js";

const getOctokitInstance = (): Octokit => {
	const token = getGitHubToken();
	if (!token) {
		throw new Error(
			"GitHub token is not set. Please set it using the set-token command.",
		);
	}
	return new Octokit({ auth: token });
};

export type Issue = {
	repo: string;
	id: number;
	number: number;
	title: string;
	url: string;
	body: string;
	assignee: string;
	labels: string[];
	created_at: string;
};

export const fetchOpenRepoIssues = async (repo: string) => {
	const octokit = getOctokitInstance();
	const [owner, repoName] = repo.split("/");
	if (!owner || !repoName) {
		throw new Error(
			`Invalid repository format: ${repo}. Expected "owner/repo".`,
		);
	}

	const issuesResponse = await octokit.rest.issues.listForRepo({
		owner,
		repo: repoName,
		state: "open",
	});

	const issues: Issue[] = [];
	issuesResponse.data.forEach((issue) => {
		issues.push({
			id: issue.id,
			number: issue.number,
			title: issue.title,
			body: issue.body || "",
			url: issue.html_url,
			assignee: issue.assignee ? issue.assignee.login : "Unassigned",
			labels: issue.labels.map((label) =>
				typeof label === "string" ? label : label.name || "",
			),
			created_at: issue.created_at,
			repo,
		});
	});

	return issues;
};
