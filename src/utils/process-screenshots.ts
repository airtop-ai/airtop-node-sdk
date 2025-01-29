import type { AiPromptResponse } from "api";

type ProcessScreenshotsResponse = {
	index: number;
	success: boolean;
	binaryData?: Buffer;
	error?: Error;
};

export async function processScreenshots(
	response: AiPromptResponse,
): Promise<ProcessScreenshotsResponse[]> {
	const screenshots = response.meta.screenshots;

	if (!screenshots) {
		return [];
	}

	const processedScreenshots: ProcessScreenshotsResponse[] = screenshots.map(
		(screenshot, index) => {
			if (!screenshot.dataUrl) {
				return {
					index,
					error: new Error("Screenshot data URL not found"),
					success: false,
				};
			}

			try {
				const base64Data = screenshot.dataUrl.replace(
					/^data:image\/jpeg;base64,/,
					"",
				);
				const binaryData = Buffer.from(base64Data, "base64");
				return {
					index,
					binaryData,
					success: true,
				};
			} catch (err) {
				console.error(`Error processing screenshot ${index}:`, err);
				return {
					index,
					error: err instanceof Error ? err : new Error(String(err)),
					success: false,
				};
			}
		},
	);

	return processedScreenshots;
}
