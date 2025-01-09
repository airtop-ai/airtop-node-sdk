# Airtop TypeScript Library

[![fern shield](https://img.shields.io/badge/%F0%9F%8C%BF-Built%20with%20Fern-brightgreen)](https://buildwithfern.com?utm_source=github&utm_medium=github&utm_campaign=readme&utm_source=https%3A%2F%2Fgithub.com%2Fairtop-ai%2Fairtop-node-sdk)
[![npm shield](https://img.shields.io/npm/v/@airtop/sdk)](https://www.npmjs.com/package/@airtop/sdk)

The Airtop TypeScript library provides convenient access to the Airtop API from TypeScript.

## Installation

```sh
npm i -s @airtop/sdk
```

## Usage

Instantiate and use the client with the following:

```typescript
import { AirtopClient } from "@airtop/sdk";

const client = new AirtopClient({ apiKey: "YOUR_API_KEY" });
const session = await client.sessions.create();

// use any url and prompt you like below
const window = await client.windows.create(session.data.id, { url: "https://www.wikipedia.org" });
const contentSummary = await client.windows.pageQuery(session.data.id, window.data.windowId, {
  prompt: 'Summarize the contents of the page in 1 short paragraph up to 170 characters.',
});
console.log(contentSummary.data.modelResponse);

await client.sessions.terminate(session.data.id);
```

Get an API key from the [Airtop Developer Portal](https://portal.airtop.ai/api-keys).

See more information and examples in our [Quick Start Guide](https://docs.airtop.ai/guides/getting-started/quick-start)
or [API Reference](https://docs.airtop.ai/api-reference/airtop-api).

## Request And Response Types

The SDK exports all request and response types as TypeScript interfaces. Simply import them with the
following namespace:

```typescript
import { Airtop } from "@airtop/sdk";

const request: Airtop.CreateWindowInputV1Body = {
    ...
};
```

## Exception Handling

When the API returns a non-success status code (4xx or 5xx response), a subclass of the following error
will be thrown.

```typescript
import { AirtopError } from "@airtop/sdk";

try {
    await client.windows.create(...);
} catch (err) {
    if (err instanceof AirtopError) {
        console.log(err.statusCode);
        console.log(err.message);
        console.log(err.body);
    }
}
```

## Advanced

### Retries

The SDK is instrumented with automatic retries with exponential backoff. A request will be retried as long
as the request is deemed retriable and the number of retry attempts has not grown larger than the configured
retry limit (default: 2).

A request is deemed retriable when any of the following HTTP status codes is returned:

-   [408](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/408) (Timeout)
-   [429](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/429) (Too Many Requests)
-   [5XX](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/500) (Internal Server Errors)

Use the `maxRetries` request option to configure this behavior.

```typescript
const response = await client.windows.create(..., {
    maxRetries: 0 // override maxRetries at the request level
});
```

### Timeouts

The SDK defaults to a 60 second timeout. Use the `timeoutInSeconds` option to configure this behavior.

```typescript
const response = await client.windows.create(..., {
    timeoutInSeconds: 30 // override timeout to 30s
});
```

### Aborting Requests

The SDK allows users to abort requests at any point by passing in an abort signal.

```typescript
const controller = new AbortController();
const response = await client.windows.create(..., {
    abortSignal: controller.signal
});
controller.abort(); // aborts the request
```

### Runtime Compatibility

The SDK defaults to `node-fetch` but will use the global fetch client if present. The SDK works in the following
runtimes:

-   Node.js 18+
-   Vercel
-   Cloudflare Workers
-   Deno v1.25+
-   Bun 1.0+
-   React Native

### Customizing Fetch Client

The SDK provides a way for your to customize the underlying HTTP client / Fetch function. If you're running in an
unsupported environment, this provides a way for you to break glass and ensure the SDK works.

```typescript
import { AirtopClient } from "@airtop/sdk";

const client = new AirtopClient({
    ...
    fetcher: // provide your implementation here
});
```

## Contributing

While we value open-source contributions to this SDK, this library is generated programmatically.
Additions made directly to this library would have to be moved over to our generation code,
otherwise they would be overwritten upon the next generated release. Feel free to open a PR as
a proof of concept, but know that we will not be able to merge it as-is. We suggest opening
an issue first to discuss with us!

On the other hand, contributions to the README are always very welcome!
