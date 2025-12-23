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
