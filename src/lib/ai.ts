import { createAmazonBedrock } from "@ai-sdk/amazon-bedrock";
import { generateText } from "ai";
import type { Issue } from "./github.js";

const getAIClient = () => {
	if (process.env.AWS_BEARER_TOKEN_BEDROCK) {
		if (!process.env.AWS_REGION) {
			throw new Error(
				"AWS_REGION environment variable is required when using Amazon Bedrock.",
			);
		}
		const bedrock = createAmazonBedrock({
			region: process.env.AWS_REGION,
			apiKey: process.env.AWS_BEARER_TOKEN_BEDROCK,
		});
		return bedrock("global.anthropic.claude-sonnet-4-5-20250929-v1:0");
	}
	throw new Error("No AI client configured.");
};

export const prioritizeIssuesWithAI = async (issues: Issue[]) => {
	const aiClient = getAIClient();

	const issuesList = issues
		.map(
			(issue, i) =>
				`${i + 1}. [${issue.repo}#${issue.number}] ${issue.title}
   Labels: ${issue.labels.join(", ") || "none"}
   Created: ${new Date(issue.created_at).toLocaleDateString()}
   URL: ${issue.url}
   Description: ${issue.body}`,
		)
		.join("\n\n");

	const prompt = `You are helping a solo developer prioritize their work.

Current open issues:
${issuesList}


Recommend the top 3 tasks they should work on RIGHT NOW and explain why in 1-2 sentences each. Consider:
- Impact vs effort
- Time available
- Energy level
- Freshness (avoid stale issues unless critical)
- Dependencies

Format as:
1. [repo#number] Title
   Why: brief explanation

2. [repo#number] Title
   Why: brief explanation

3. [repo#number] Title
   Why: brief explanation`;

	const { text } = await generateText({
		model: aiClient,
		prompt,
	});
	return text;
};
