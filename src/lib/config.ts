import Conf from "conf";

const config = new Conf({ projectName: "what-now" });

const typedGetConfig = (key: string) => {
	return config.get(key) as string;
};

export const getGitHubToken = () => {
	return typedGetConfig("githubToken");
};

export const setGitHubToken = (token: string) => {
	config.set("githubToken", token);
};

export const getRepos = () => {
	return typedGetConfig("repos");
};

/**
 * Set the repositories configuration.
 *
 * Expected format: a comma-separated list of GitHub repositories,
 * where each entry matches "owner/repo" (e.g. "octocat/Hello-World,foo/bar").
 */
export const setRepos = (repos: string) => {
	if (!isValidReposString(repos)) {
		throw new Error(
			'Invalid repos format. Expected a comma-separated list of "owner/repo" entries.',
		);
	}
	config.set("repos", repos);
};

/**
 * Validate that a repos string is a comma-separated list of "owner/repo" identifiers.
 */
const isValidReposString = (repos: string): boolean => {
	// Allow empty string to represent "no repositories" if needed.
	if (repos.trim() === "") {
		return true;
	}

	const repoPattern = /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/;

	return repos
		.split(",")
		.map((entry) => entry.trim())
		.every((entry) => repoPattern.test(entry));
};
