import type { AiPromptResponse } from "../api";

export type ProcessScreenshotsResponse = {
	index: number;
	success: boolean;
	binaryData?: Buffer;
	mimeType?: string;
	error?: Error;
};

function extractMimeAndBase64(dataUrl: string): {
	mimeType: string;
	base64Data: string;
} {
	const match = dataUrl.match(/^data:(image\/\w+);base64,(.+)$/);
	if (match) {
		return { mimeType: match[1], base64Data: match[2] };
	}
	return {
		mimeType: "image/jpeg",
		base64Data: dataUrl.replace(/^data:image\/jpeg;base64,/, ""),
	};
}

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
				const { mimeType, base64Data } = extractMimeAndBase64(
					screenshot.dataUrl,
				);
				const binaryData = Buffer.from(base64Data, "base64");
				return {
					index,
					binaryData,
					mimeType,
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
