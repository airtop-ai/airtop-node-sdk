import type { AirtopClient } from '../wrapper/AirtopClient';
import type * as Airtop from '../api';

export async function uploadFileAndSelectInput({
  client,
  sessionId,
  windowId,
  configuration,
}: {
  client: AirtopClient;
  sessionId: string;
  windowId: string;
  configuration: Airtop.SessionFileInputHandlerRequestBody & { uploadFilePath: string };
}): Promise<{
  fileId: string;
  aiResponse: Airtop.AiPromptResponse;
}> {
  const windowInfo = await client.windows.getWindowInfo(sessionId, windowId);
  if (!windowInfo) {
    throw new Error('window not found');
  }

  client.log(
    `starting file upload: sessionId: ${sessionId}, windowId: ${windowId}, uploadFilePath: ${configuration.uploadFilePath}`,
  );
  const fileUploadResponse = await client.files.upload(configuration.uploadFilePath);
  if (fileUploadResponse.errors && fileUploadResponse.errors.length > 0) {
    client.log(`file upload failed: ${JSON.stringify(fileUploadResponse.errors)}`);
    throw new Error('file upload failed');
  }
  const fileId = fileUploadResponse.data.id;
  client.log(`file upload to cloud complete: file id: ${fileId}`);

  await client.files.push(fileId, {
    sessionIds: [sessionId],
  });
  client.log('file pushed to session');

  client.log('waiting for file upload to become available');
  const waitResult = await client.sessions.waitForUploadAvailable(sessionId, fileId);
  if (waitResult) {
    client.log('file upload available');
  } else {
    client.log('file upload not available within timeout');
    throw new Error('file upload not available within timeout');
  }

  client.log('executing file input interaction');
  const fileInputResponse = await client.windows.fileInput(sessionId, windowId, {
    fileId: fileId,
    ...configuration,
  });
  if (fileInputResponse.errors && fileInputResponse.errors.length > 0) {
    client.log(`file input failed: ${JSON.stringify(fileInputResponse.errors)}`);
    throw new Error('file input failed');
  }

  client.log('file upload and file input interaction complete');
  client.log(JSON.stringify(fileInputResponse, null, 2));

  return {
    fileId,
    aiResponse: fileInputResponse,
  };
}
