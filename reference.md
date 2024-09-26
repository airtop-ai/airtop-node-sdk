# Reference

## Profiles

<details><summary><code>client.profiles.<a href="/src/api/resources/profiles/client/Client.ts">get</a>({ ...params }) -> Airtop.ListExternalProfileV1EnvelopeDefaultMetaWrapper</code></summary>
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

<details><summary><code>client.sessions.<a href="/src/api/resources/sessions/client/Client.ts">list</a>({ ...params }) -> Airtop.ListExternalSessionWithConnectionInfoEnvelopeDefaultMetaWrapper</code></summary>
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
await client.sessions.list();
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

<details><summary><code>client.sessions.<a href="/src/api/resources/sessions/client/Client.ts">create</a>({ ...params }) -> Airtop.ExternalSessionWithConnectionInfoEnvelopeDefaultMetaWrapper</code></summary>
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

<details><summary><code>client.sessions.<a href="/src/api/resources/sessions/client/Client.ts">getinfo</a>(id) -> Airtop.ExternalSessionWithConnectionInfoEnvelopeDefaultMetaWrapper</code></summary>
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
await client.sessions.getinfo("6aac6f73-bd89-4a76-ab32-5a6c422e8b0b");
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

**id:** `string` — UUID of the session to get

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

**id:** `string` — UUID of the session to delete

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

## Windows

<details><summary><code>client.windows.<a href="/src/api/resources/windows/client/Client.ts">getWindowInfo</a>(sessionId, windowId, { ...params }) -> Airtop.WindowEnvelopeDefaultMetaWrapper</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.windows.getWindowInfo("6aac6f73-bd89-4a76-ab32-5a6c422e8b0b", "7334da2a-91b0-42c5-6156-76a5eba87430", {
    screenResolution: "1920x1080",
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

**sessionId:** `string` — UUID of the session that owns the window

</dd>
</dl>

<dl>
<dd>

**windowId:** `string` — id of the browser window, either the windowId (uuid) or targetId (simple string)

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

<details><summary><code>client.windows.<a href="/src/api/resources/windows/client/Client.ts">promptContent</a>(sessionId, windowId, { ...params }) -> Airtop.AiResponseEnvelopeExternalSessionAiResponseMetadataWrapper</code></summary>
<dl>
<dd>

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

**sessionId:** `string` — The session id to submit a prompt about

</dd>
</dl>

<dl>
<dd>

**windowId:** `string` — The window id to submit a prompt about

</dd>
</dl>

<dl>
<dd>

**request:** `Airtop.PromptContentRequest`

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

<details><summary><code>client.windows.<a href="/src/api/resources/windows/client/Client.ts">scrapeContent</a>(sessionId, windowId, { ...params }) -> Airtop.ScrapeResponseEnvelopeExternalSessionAiResponseMetadataWrapper</code></summary>
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

**sessionId:** `string` — The session id to scrape

</dd>
</dl>

<dl>
<dd>

**windowId:** `string` — The window id to scrape

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

<details><summary><code>client.windows.<a href="/src/api/resources/windows/client/Client.ts">summarizeContent</a>(sessionId, windowId, { ...params }) -> Airtop.AiResponseEnvelopeExternalSessionAiResponseMetadataWrapper</code></summary>
<dl>
<dd>

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

**sessionId:** `string` — The session id to summarize

</dd>
</dl>

<dl>
<dd>

**windowId:** `string` — The window id to summarize

</dd>
</dl>

<dl>
<dd>

**request:** `Airtop.SummarizeContentRequest`

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
