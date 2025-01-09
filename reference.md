# Reference

## Windows

<details><summary><code>client.windows.<a href="/src/api/resources/windows/client/Client.ts">create</a>(sessionId, { ...params }) -> Airtop.WindowIdResponse</code></summary>
<dl>
<dd>

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

<details><summary><code>client.windows.<a href="/src/api/resources/windows/client/Client.ts">hover</a>(sessionId, windowId, { ...params }) -> Airtop.AiPromptResponse</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.windows.hover("6aac6f73-bd89-4a76-ab32-5a6c422e8b0b", "0334da2a-91b0-42c5-6156-76a5eba87430");
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

<details><summary><code>client.windows.<a href="/src/api/resources/windows/client/Client.ts">pageQuery</a>(sessionId, windowId, { ...params }) -> Airtop.AiPromptResponse</code></summary>
<dl>
<dd>

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

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.windows.paginatedExtraction(
    "6aac6f73-bd89-4a76-ab32-5a6c422e8b0b",
    "0334da2a-91b0-42c5-6156-76a5eba87430"
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

## Profiles

<details><summary><code>client.profiles.<a href="/src/api/resources/profiles/client/Client.ts">get</a>({ ...params }) -> Airtop.ProfilesResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Get profiles matching by id

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
await client.profiles.get();
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

**request:** `Airtop.ProfilesGetRequest`

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

## Sessions

<details><summary><code>client.sessions.<a href="/src/api/resources/sessions/client/Client.ts">list</a>({ ...params }) -> Airtop.SessionsResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Get a list of sessions by ID

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

**sessionId:** `string` — ID of the session that owns the window.

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
