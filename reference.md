# Reference

## Windows

<details><summary><code>client.windows.<a href="/src/api/resources/windows/client/Client.ts">asyncCreateAutomation</a>(sessionId, windowId, { ...params }) -> Airtop.AsyncSessionAiResponseEnvelope</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Create an automation of a browser window asynchronously

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.windows.asyncCreateAutomation(
    "6aac6f73-bd89-4a76-ab32-5a6c422e8b0b",
    "0334da2a-91b0-42c5-6156-76a5eba87430",
);
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**sessionId:** `string` — The session id for the window.

</dd>
</dl>

<dl>
<dd>

**windowId:** `string` — The Airtop window id of the browser window.

</dd>
</dl>

<dl>
<dd>

**request:** `Airtop.AsyncCreateAutomationRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Windows.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.windows.<a href="/src/api/resources/windows/client/Client.ts">asyncCreateFormFiller</a>(sessionId, windowId, { ...params }) -> Airtop.AsyncSessionAiResponseEnvelope</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Create a form filler automation asynchronously

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.windows.asyncCreateFormFiller(
    "6aac6f73-bd89-4a76-ab32-5a6c422e8b0b",
    "0334da2a-91b0-42c5-6156-76a5eba87430",
);
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**sessionId:** `string` — The session id for the window.

</dd>
</dl>

<dl>
<dd>

**windowId:** `string` — The Airtop window id of the browser window.

</dd>
</dl>

<dl>
<dd>

**request:** `Airtop.AsyncCreateFormFillerRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Windows.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.windows.<a href="/src/api/resources/windows/client/Client.ts">asyncExecuteAutomation</a>(sessionId, windowId, { ...params }) -> Airtop.AsyncSessionAiResponseEnvelope</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Execute an automation of a browser window asynchronously

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.windows.asyncExecuteAutomation(
    "6aac6f73-bd89-4a76-ab32-5a6c422e8b0b",
    "0334da2a-91b0-42c5-6156-76a5eba87430",
    {
        automationId: "automationId",
    },
);
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**sessionId:** `string` — The session id for the window.

</dd>
</dl>

<dl>
<dd>

**windowId:** `string` — The Airtop window id of the browser window.

</dd>
</dl>

<dl>
<dd>

**request:** `Airtop.AsyncExecuteAutomationRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Windows.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.windows.<a href="/src/api/resources/windows/client/Client.ts">asyncFillForm</a>(sessionId, windowId, { ...params }) -> Airtop.AsyncSessionAiResponseEnvelope</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Fill a form of a browser window asynchronously using a form-filler automation

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.windows.asyncFillForm("6aac6f73-bd89-4a76-ab32-5a6c422e8b0b", "0334da2a-91b0-42c5-6156-76a5eba87430", {
    automationId: "automationId",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**sessionId:** `string` — The session id for the window.

</dd>
</dl>

<dl>
<dd>

**windowId:** `string` — The Airtop window id of the browser window.

</dd>
</dl>

<dl>
<dd>

**request:** `Airtop.AsyncFillFormRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Windows.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.windows.<a href="/src/api/resources/windows/client/Client.ts">create</a>(sessionId, { ...params }) -> Airtop.WindowIdResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Creates a new browser window in a session. Optionally, you can specify a url to load on the window upon creation.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.windows.create("6aac6f73-bd89-4a76-ab32-5a6c422e8b0b");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**sessionId:** `string` — ID of the session that owns the window.

</dd>
</dl>

<dl>
<dd>

**request:** `Airtop.CreateWindowInputV1Body`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Windows.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.windows.<a href="/src/api/resources/windows/client/Client.ts">getWindowInfo</a>(sessionId, windowId, { ...params }) -> Airtop.WindowResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Get information about a browser window in a session, including the live view url.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.windows.getWindowInfo("6aac6f73-bd89-4a76-ab32-5a6c422e8b0b", "7334da2a-91b0-42c5-6156-76a5eba87430", {
    screenResolution: "1280x720",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**sessionId:** `string` — ID of the session that owns the window.

</dd>
</dl>

<dl>
<dd>

**windowId:** `string` — ID of the browser window, which can either be a normal AirTop windowId or a [CDP TargetId](https://chromedevtools.github.io/devtools-protocol/tot/Target/#type-TargetID) from a browser automation library like Puppeteer (typically associated with the page or main frame). Our SDKs will handle retrieving a TargetId for you from various popular browser automation libraries, but we also have details in our guides on how to do it manually.

</dd>
</dl>

<dl>
<dd>

**request:** `Airtop.GetWindowInfoRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Windows.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.windows.<a href="/src/api/resources/windows/client/Client.ts">loadUrl</a>(sessionId, windowId, { ...params }) -> Airtop.OperationOutcomeResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Loads a specified url on a given window

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.windows.loadUrl("6aac6f73-bd89-4a76-ab32-5a6c422e8b0b", "7334da2a-91b0-42c5-6156-76a5eba87430", {
    url: "https://www.airtop.ai",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**sessionId:** `string` — ID of the session that owns the window.

</dd>
</dl>

<dl>
<dd>

**windowId:** `string` — Airtop window ID of the browser window.

</dd>
</dl>

<dl>
<dd>

**request:** `Airtop.WindowLoadUrlV1Body`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Windows.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.windows.<a href="/src/api/resources/windows/client/Client.ts">close</a>(sessionId, windowId) -> Airtop.WindowIdResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Closes a browser window in a session

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.windows.close("6aac6f73-bd89-4a76-ab32-5a6c422e8b0b", "7334da2a-91b0-42c5-6156-76a5eba87430");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**sessionId:** `string` — ID of the session that owns the window.

</dd>
</dl>

<dl>
<dd>

**windowId:** `string` — Airtop window ID of the browser window.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Windows.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.windows.<a href="/src/api/resources/windows/client/Client.ts">click</a>(sessionId, windowId, { ...params }) -> Airtop.AiPromptResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Execute a click interaction in a specific browser window

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.windows.click("6aac6f73-bd89-4a76-ab32-5a6c422e8b0b", "0334da2a-91b0-42c5-6156-76a5eba87430", {
    elementDescription: "The login button",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**sessionId:** `string` — The session id for the window.

</dd>
</dl>

<dl>
<dd>

**windowId:** `string` — The Airtop window id of the browser window.

</dd>
</dl>

<dl>
<dd>

**request:** `Airtop.SessionClickHandlerRequestBody`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Windows.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.windows.<a href="/src/api/resources/windows/client/Client.ts">createFormFiller</a>(sessionId, windowId, { ...params }) -> Airtop.AiPromptResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Create a form-filler automation synchronously for the form loaded in the browser window

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.windows.createFormFiller("6aac6f73-bd89-4a76-ab32-5a6c422e8b0b", "0334da2a-91b0-42c5-6156-76a5eba87430");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**sessionId:** `string` — The session id for the window.

</dd>
</dl>

<dl>
<dd>

**windowId:** `string` — The Airtop window id of the browser window.

</dd>
</dl>

<dl>
<dd>

**request:** `Airtop.CreateFormFillerRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Windows.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.windows.<a href="/src/api/resources/windows/client/Client.ts">fileInput</a>(sessionId, windowId, { ...params }) -> Airtop.AiPromptResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Execute a file input interaction in a specific browser window.
includeHiddenElements defaults to true and considers hidden file input elements.
If there is only one file input element, it will be used directly.
If there are multiple file input elements, the elementDescription will be used by AI to
select among them.
If no file input elements are found by inspecting the page structure, elementDescription
will be used by AI to try to find a match visually.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.windows.fileInput("6aac6f73-bd89-4a76-ab32-5a6c422e8b0b", "0334da2a-91b0-42c5-6156-76a5eba87430");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**sessionId:** `string` — The session id for the window.

</dd>
</dl>

<dl>
<dd>

**windowId:** `string` — The Airtop window id of the browser window.

</dd>
</dl>

<dl>
<dd>

**request:** `Airtop.SessionFileInputHandlerRequestBody`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Windows.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.windows.<a href="/src/api/resources/windows/client/Client.ts">fillForm</a>(sessionId, windowId, { ...params }) -> Airtop.AiPromptResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Fill a form of a browser window synchronously using a form-filler automation

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.windows.fillForm("6aac6f73-bd89-4a76-ab32-5a6c422e8b0b", "0334da2a-91b0-42c5-6156-76a5eba87430", {
    automationId: "automationId",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**sessionId:** `string` — The session id for the window.

</dd>
</dl>

<dl>
<dd>

**windowId:** `string` — The Airtop window id of the browser window.

</dd>
</dl>

<dl>
<dd>

**request:** `Airtop.FillFormRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Windows.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.windows.<a href="/src/api/resources/windows/client/Client.ts">hover</a>(sessionId, windowId, { ...params }) -> Airtop.AiPromptResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Execute a hover interaction in a specific browser window

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.windows.hover("6aac6f73-bd89-4a76-ab32-5a6c422e8b0b", "0334da2a-91b0-42c5-6156-76a5eba87430", {
    elementDescription: "The search box input in the top right corner",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**sessionId:** `string` — The session id for the window.

</dd>
</dl>

<dl>
<dd>

**windowId:** `string` — The Airtop window id of the browser window.

</dd>
</dl>

<dl>
<dd>

**request:** `Airtop.SessionHoverHandlerRequestBody`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Windows.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.windows.<a href="/src/api/resources/windows/client/Client.ts">monitor</a>(sessionId, windowId, { ...params }) -> Airtop.AiPromptResponse</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.windows.monitor("6aac6f73-bd89-4a76-ab32-5a6c422e8b0b", "0334da2a-91b0-42c5-6156-76a5eba87430", {
    condition: "Determine if the user appears to be signed in to the website",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**sessionId:** `string` — The session id for the window.

</dd>
</dl>

<dl>
<dd>

**windowId:** `string` — The Airtop window id of the browser window.

</dd>
</dl>

<dl>
<dd>

**request:** `Airtop.SessionMonitorHandlerRequestBody`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Windows.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.windows.<a href="/src/api/resources/windows/client/Client.ts">pageQuery</a>(sessionId, windowId, { ...params }) -> Airtop.AiPromptResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Submit a prompt that queries the content of a specific browser window. You may extract content from the page, or ask a question about the page and allow the AI to answer it (ex. Is the user logged in?).

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.windows.pageQuery("6aac6f73-bd89-4a76-ab32-5a6c422e8b0b", "0334da2a-91b0-42c5-6156-76a5eba87430", {
    prompt: "What is the main idea of this page?",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**sessionId:** `string` — The session id for the window.

</dd>
</dl>

<dl>
<dd>

**windowId:** `string` — The Airtop window id of the browser window.

</dd>
</dl>

<dl>
<dd>

**request:** `Airtop.SessionPageQueryHandlerRequestBody`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Windows.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.windows.<a href="/src/api/resources/windows/client/Client.ts">paginatedExtraction</a>(sessionId, windowId, { ...params }) -> Airtop.AiPromptResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Submit a prompt that queries the content of a specific browser window and paginates through pages to return a list of results.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.windows.paginatedExtraction(
    "6aac6f73-bd89-4a76-ab32-5a6c422e8b0b",
    "0334da2a-91b0-42c5-6156-76a5eba87430",
    {
        prompt: "This site contains a list of results about <provide details about the list>. Navigate through 3 pages of results and return the title and <provide details about the data you want to extract> about each result in this list.",
    },
);
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**sessionId:** `string` — The session id for the window.

</dd>
</dl>

<dl>
<dd>

**windowId:** `string` — The Airtop window id of the browser window.

</dd>
</dl>

<dl>
<dd>

**request:** `Airtop.SessionPaginatedExtractionHandlerRequestBody`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Windows.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.windows.<a href="/src/api/resources/windows/client/Client.ts">promptContent</a>(sessionId, windowId, { ...params }) -> Airtop.AiPromptResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

This endpoint is deprecated. Please use the `pageQuery` endpoint instead.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.windows.promptContent("6aac6f73-bd89-4a76-ab32-5a6c422e8b0b", "0334da2a-91b0-42c5-6156-76a5eba87430", {
    prompt: "What is the main idea of this page?",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**sessionId:** `string` — The session id for the window.

</dd>
</dl>

<dl>
<dd>

**windowId:** `string` — The Airtop window id of the browser window.

</dd>
</dl>

<dl>
<dd>

**request:** `Airtop.SessionPageQueryHandlerRequestBody`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Windows.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.windows.<a href="/src/api/resources/windows/client/Client.ts">scrapeContent</a>(sessionId, windowId, { ...params }) -> Airtop.ScrapeResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Scrape a window and return the content as markdown

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.windows.scrapeContent("6aac6f73-bd89-4a76-ab32-5a6c422e8b0b", "0334da2a-91b0-42c5-6156-76a5eba87430");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**sessionId:** `string` — The session id for the window.

</dd>
</dl>

<dl>
<dd>

**windowId:** `string` — The Airtop window id of the browser window to scrape.

</dd>
</dl>

<dl>
<dd>

**request:** `Airtop.ScrapeContentRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Windows.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.windows.<a href="/src/api/resources/windows/client/Client.ts">screenshot</a>(sessionId, windowId, { ...params }) -> Airtop.AiPromptResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Take a screenshot of a browser window

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.windows.screenshot("6aac6f73-bd89-4a76-ab32-5a6c422e8b0b", "0334da2a-91b0-42c5-6156-76a5eba87430");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**sessionId:** `string` — The session id for the window.

</dd>
</dl>

<dl>
<dd>

**windowId:** `string` — The Airtop window id of the browser window.

</dd>
</dl>

<dl>
<dd>

**request:** `Airtop.SessionScreenshotHandlerRequestBody`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Windows.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.windows.<a href="/src/api/resources/windows/client/Client.ts">scroll</a>(sessionId, windowId, { ...params }) -> Airtop.AiPromptResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Execute a scroll interaction in a specific browser window

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.windows.scroll("6aac6f73-bd89-4a76-ab32-5a6c422e8b0b", "0334da2a-91b0-42c5-6156-76a5eba87430");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**sessionId:** `string` — The session id for the window.

</dd>
</dl>

<dl>
<dd>

**windowId:** `string` — The Airtop window id of the browser window.

</dd>
</dl>

<dl>
<dd>

**request:** `Airtop.SessionScrollHandlerRequestBody`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Windows.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.windows.<a href="/src/api/resources/windows/client/Client.ts">summarizeContent</a>(sessionId, windowId, { ...params }) -> Airtop.AiPromptResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

This endpoint is deprecated. Please use the `pageQuery` endpoint and ask for a summary in the prompt instead.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.windows.summarizeContent("6aac6f73-bd89-4a76-ab32-5a6c422e8b0b", "0334da2a-91b0-42c5-6156-76a5eba87430");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**sessionId:** `string` — The session id for the window.

</dd>
</dl>

<dl>
<dd>

**windowId:** `string` — The Airtop window id of the browser window to summarize.

</dd>
</dl>

<dl>
<dd>

**request:** `Airtop.SessionSummaryHandlerRequestBody`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Windows.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.windows.<a href="/src/api/resources/windows/client/Client.ts">type</a>(sessionId, windowId, { ...params }) -> Airtop.AiPromptResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Execute a type interaction in a specific browser window

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.windows.type("6aac6f73-bd89-4a76-ab32-5a6c422e8b0b", "0334da2a-91b0-42c5-6156-76a5eba87430", {
    text: "Example text",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**sessionId:** `string` — The session id for the window.

</dd>
</dl>

<dl>
<dd>

**windowId:** `string` — The Airtop window id of the browser window.

</dd>
</dl>

<dl>
<dd>

**request:** `Airtop.SessionTypeHandlerRequestBody`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Windows.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## Automations

<details><summary><code>client.automations.<a href="/src/api/resources/automations/client/Client.ts">list</a>() -> Airtop.ListAutomationsOutput</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

List all automations for a given organization

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.automations.list();
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**requestOptions:** `Automations.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.automations.<a href="/src/api/resources/automations/client/Client.ts">update</a>({ ...params }) -> Airtop.AutomationOutput</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Update the description of a specific automation

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.automations.update({
    description: "description",
    id: "id",
    orgId: "orgId",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Airtop.UpdateAutomationDescriptionInputBody`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Automations.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.automations.<a href="/src/api/resources/automations/client/Client.ts">get</a>(automationId) -> Airtop.AutomationOutput</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Get a specific automation by ID

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.automations.get("automationId");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**automationId:** `string` — ID of the automation to retrieve

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Automations.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.automations.<a href="/src/api/resources/automations/client/Client.ts">delete</a>(automationId) -> Airtop.DeleteAutomationOutputWrapperBody</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Delete a specific automation

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.automations.delete("automationId");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**automationId:** `string` — ID of the automation to delete

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Automations.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## Files

<details><summary><code>client.files.<a href="/src/api/resources/files/client/Client.ts">list</a>({ ...params }) -> Airtop.FilesResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Get a list of files filtered by session ID

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.files.list({
    offset: 1,
    limit: 10,
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Airtop.FilesListRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Files.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.files.<a href="/src/api/resources/files/client/Client.ts">create</a>({ ...params }) -> Airtop.EnvelopeCreateFileV1EnvelopeDefaultMeta</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.files.create({
    fileName: "fileName",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Airtop.CreateFileRestInputV1`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Files.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.files.<a href="/src/api/resources/files/client/Client.ts">get</a>(id) -> Airtop.EnvelopeGetFileV1EnvelopeDefaultMeta</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.files.get("id");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` — ID of the file

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Files.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.files.<a href="/src/api/resources/files/client/Client.ts">delete</a>(id) -> void</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.files.delete("id");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` — ID of the file

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Files.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.files.<a href="/src/api/resources/files/client/Client.ts">push</a>(id, { ...params }) -> void</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Push a file to one or more sessions, making it available for the sessions to use

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.files.push("id");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` — ID of the file

</dd>
</dl>

<dl>
<dd>

**request:** `Airtop.PushFileBodyV1`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Files.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## Profiles

<details><summary><code>client.profiles.<a href="/src/api/resources/profiles/client/Client.ts">delete</a>({ ...params }) -> void</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Delete profiles matching by id

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.profiles.delete();
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Airtop.ProfilesDeleteRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Profiles.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## Requests

<details><summary><code>client.requests.<a href="/src/api/resources/requests/client/Client.ts">getRequestStatus</a>(requestId) -> Airtop.RequestStatusResponse</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.requests.getRequestStatus("123e4567-e89b-12d3-a456-426614174000");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**requestId:** `string` — The ID of the request to check.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Requests.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## Sessions

<details><summary><code>client.sessions.<a href="/src/api/resources/sessions/client/Client.ts">list</a>({ ...params }) -> Airtop.SessionsResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Get a paginated list of sessions filtered by ID or status

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.sessions.list({
    offset: 1,
    limit: 10,
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Airtop.SessionsListRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Sessions.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.sessions.<a href="/src/api/resources/sessions/client/Client.ts">create</a>({ ...params }) -> Airtop.SessionResponse</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.sessions.create();
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Airtop.SessionRestInputV1`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Sessions.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.sessions.<a href="/src/api/resources/sessions/client/Client.ts">getInfo</a>(id) -> Airtop.SessionResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Get a session by ID

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.sessions.getInfo("6aac6f73-bd89-4a76-ab32-5a6c422e8b0b");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` — Id of the session to get

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Sessions.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.sessions.<a href="/src/api/resources/sessions/client/Client.ts">terminate</a>(id) -> void</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Ends a session by ID. If a given session id does not exist within the organization, it is ignored.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.sessions.terminate("6aac6f73-bd89-4a76-ab32-5a6c422e8b0b");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` — ID of the session to delete.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Sessions.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.sessions.<a href="/src/api/resources/sessions/client/Client.ts">events</a>(id, { ...params }) -> core.Stream<Airtop.SessionsEventsResponse></code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Get a session event stream for a given session ID

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
const response = await client.sessions.events("6aac6f73-bd89-4a76-ab32-5a6c422e8b0b", {
    lastEventId: 0,
    all: true,
});
for await (const item of response) {
    console.log(item);
}
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` — ID of the session to get status info for

</dd>
</dl>

<dl>
<dd>

**request:** `Airtop.SessionsEventsRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Sessions.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.sessions.<a href="/src/api/resources/sessions/client/Client.ts">saveProfileOnTermination</a>(sessionId, profileName) -> void</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.sessions.saveProfileOnTermination("6aac6f73-bd89-4a76-ab32-5a6c422e8b0b", "myProfile");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**sessionId:** `string` — ID of the session.

</dd>
</dl>

<dl>
<dd>

**profileName:** `string` — Name under which to save the profile.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Sessions.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>
