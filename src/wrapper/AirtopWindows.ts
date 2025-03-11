declare namespace puppeteer {
  interface Page {
    mainFrame(): any;
  }
}

declare namespace playwright {
  interface Page {
    context(): any;
  }
}

declare namespace seleniumWebdriver {
  interface WebDriver {
    getSession(): Promise<any>;
    createCDPConnection(domain: string): Promise<any>;
  }
}

import fetch from 'node-fetch';
import type * as Airtop from '../api';
import {
  type Windows,
  Windows as WindowsClass,
  type Windows as WindowsNamespace,
} from '../api/resources/windows/client/Client';
import * as core from '../core';

export class AirtopWindows extends WindowsClass {
  constructor(
    readonly _options: WindowsNamespace.Options,
    private apiKeySupplier: core.Supplier<core.BearerToken | undefined>,
  ) {
    super(_options);
  }

  /**
   * @param {string} sessionId - The session id for the window.
   * @param {string} windowId - The Airtop window id of the browser window to target with an Airtop AI prompt.
   * @param {Airtop.SessionContentPromptHandlerRequestBody} request
   * @param {Windows.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @deprecated Use pageQuery instead
   * @example
   *     await client.windows.promptContent("6aac6f73-bd89-4a76-ab32-5a6c422e8b0b", "0334da2a-91b0-42c5-6156-76a5eba87430", {
   *         prompt: "What is the main idea of this page?"
   *     })
   */
  async promptContent(
    sessionId: string,
    windowId: string,
    request: Omit<Airtop.SessionPageQueryHandlerRequestBody, 'configuration'> & {
      configuration?: Omit<Airtop.PageQueryConfig, 'outputSchema'> & {
        outputSchema?: string | object;
      };
    },
    requestOptions?: WindowsNamespace.RequestOptions,
  ) {
    return super.promptContent(
      sessionId,
      windowId,
      {
        ...request,
        configuration: {
          ...request.configuration,
          outputSchema:
            typeof request.configuration?.outputSchema === 'object'
              ? JSON.stringify(request.configuration.outputSchema)
              : request.configuration?.outputSchema,
        },
      },
      {
        timeoutInSeconds: 600,
        ...requestOptions,
        maxRetries: 0,
      },
    );
  }

  /**
   * @param {string} sessionId - The session id for the window.
   * @param {string} windowId - The Airtop window id of the browser window to target with an Airtop AI prompt.
   * @param {Airtop.SessionPageQueryHandlerRequestBody} request
   * @param {Windows.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @example
   *     await client.windows.pageQuery("6aac6f73-bd89-4a76-ab32-5a6c422e8b0b", "0334da2a-91b0-42c5-6156-76a5eba87430", {
   *         prompt: "What is the main idea of this page?"
   *     })
   */
  async pageQuery(
    sessionId: string,
    windowId: string,
    request: Omit<Airtop.SessionPageQueryHandlerRequestBody, 'configuration'> & {
      configuration?: Omit<Airtop.PageQueryConfig, 'outputSchema'> & {
        outputSchema?: string | object;
      };
    },
    requestOptions?: WindowsNamespace.RequestOptions,
  ) {
    return super.pageQuery(
      sessionId,
      windowId,
      {
        ...request,
        configuration: {
          ...request.configuration,
          outputSchema:
            typeof request.configuration?.outputSchema === 'object'
              ? JSON.stringify(request.configuration.outputSchema)
              : request.configuration?.outputSchema,
        },
      },
      {
        timeoutInSeconds: 600,
        ...requestOptions,
        maxRetries: 0,
      },
    );
  }

  /**
   * @param {string} sessionId - The session id for the window.
   * @param {string} windowId - The Airtop window id of the browser window to scrape.
   * @param {Airtop.ScrapeContentRequest} request
   * @param {Windows.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @example
   *     await client.windows.scrapeContent("6aac6f73-bd89-4a76-ab32-5a6c422e8b0b", "0334da2a-91b0-42c5-6156-76a5eba87430")
   */
  scrapeContent(
    sessionId: string,
    windowId: string,
    request?: Airtop.ScrapeContentRequest,
    requestOptions?: WindowsNamespace.RequestOptions,
  ) {
    return super.scrapeContent(sessionId, windowId, request, {
      timeoutInSeconds: 600,
      ...requestOptions,
    });
  }

  /**
   * @param {string} sessionId - The session id for the window.
   * @param {string} windowId - The Airtop window id of the browser window to summarize.
   * @param {Airtop.SessionSummaryHandlerRequestBody} request
   * @param {Windows.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @example
   *     await client.windows.summarizeContent("6aac6f73-bd89-4a76-ab32-5a6c422e8b0b", "0334da2a-91b0-42c5-6156-76a5eba87430")
   */
  summarizeContent(
    sessionId: string,
    windowId: string,
    request?: Omit<Airtop.SessionSummaryHandlerRequestBody, 'configuration'> & {
      configuration?: Omit<Airtop.SessionSummaryHandlerRequestBody['configuration'], 'outputSchema'> & {
        outputSchema?: string | object;
      };
    },
    requestOptions?: WindowsNamespace.RequestOptions,
  ) {
    return super.summarizeContent(
      sessionId,
      windowId,
      {
        ...request,
        configuration: {
          ...request?.configuration,
          outputSchema:
            typeof request?.configuration?.outputSchema === 'object'
              ? JSON.stringify(request?.configuration?.outputSchema)
              : request?.configuration?.outputSchema,
        },
      },
      {
        timeoutInSeconds: 600,
        ...requestOptions,
        maxRetries: 0,
      },
    );
  }

  async getWindowInfoForPuppeteerPage(
    session: Airtop.ExternalSessionWithConnectionInfo,
    page: puppeteer.Page,
    request?: Airtop.GetWindowInfoRequest,
    requestOptions?: WindowsNamespace.RequestOptions,
  ) {
    const targetId = await (page.mainFrame() as any)._id;
    return await this.getWindowInfo(session.id, targetId, request, requestOptions);
  }

  async getWindowInfoForPlaywrightPage(
    session: Airtop.ExternalSessionWithConnectionInfo,
    page: playwright.Page,
    request?: Airtop.GetWindowInfoRequest,
    requestOptions?: WindowsNamespace.RequestOptions,
  ) {
    // Retrieve target information
    const cdpSession = await page.context().newCDPSession(page);
    const { targetInfo } = await cdpSession.send('Target.getTargetInfo');
    const targetId = targetInfo.targetId;
    if (!targetId) {
      throw new Error('TargetId not found');
    }
    return await this.getWindowInfo(session.id, targetId, request, requestOptions);
  }

  /**
   * @param {string} sessionId - The session id for the window.
   * @param {string} windowId - The Airtop window id of the browser window.
   * @param {Airtop.SessionClickHandlerRequestBody} request
   * @param {Windows.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @example
   *     await client.windows.click("6aac6f73-bd89-4a76-ab32-5a6c422e8b0b", "0334da2a-91b0-42c5-6156-76a5eba87430", {
   *         elementDescription: "The login button"
   *     })
   */
  public async click(
    sessionId: string,
    windowId: string,
    request: Airtop.SessionClickHandlerRequestBody,
    requestOptions?: WindowsNamespace.RequestOptions,
  ): Promise<Airtop.AiPromptResponse> {
    return super.click(sessionId, windowId, request, {
      timeoutInSeconds: 600,
      ...requestOptions,
      maxRetries: 0,
    });
  }

  /**
   * @param {string} sessionId - The session id for the window.
   * @param {string} windowId - The Airtop window id of the browser window.
   * @param {Airtop.SessionHoverHandlerRequestBody} request
   * @param {Windows.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @example
   *     await client.windows.hover("6aac6f73-bd89-4a76-ab32-5a6c422e8b0b", "0334da2a-91b0-42c5-6156-76a5eba87430")
   */
  public async hover(
    sessionId: string,
    windowId: string,
    request: Airtop.SessionHoverHandlerRequestBody,
    requestOptions?: WindowsNamespace.RequestOptions,
  ): Promise<Airtop.AiPromptResponse> {
    return super.hover(sessionId, windowId, request, {
      timeoutInSeconds: 600,
      ...requestOptions,
      maxRetries: 0,
    });
  }

  /**
   * @param {string} sessionId - The session id for the window.
   * @param {string} windowId - The Airtop window id of the browser window.
   * @param {Airtop.SessionTypeHandlerRequestBody} request
   * @param {Windows.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @example
   *     await client.windows.type("6aac6f73-bd89-4a76-ab32-5a6c422e8b0b", "0334da2a-91b0-42c5-6156-76a5eba87430", {
   *         text: "Example text"
   *     })
   */
  public async type(
    sessionId: string,
    windowId: string,
    request: Airtop.SessionTypeHandlerRequestBody,
    requestOptions?: WindowsNamespace.RequestOptions,
  ): Promise<Airtop.AiPromptResponse> {
    return super.type(sessionId, windowId, request, {
      timeoutInSeconds: 600,
      ...requestOptions,
      maxRetries: 0,
    });
  }

  /**
   * Submit a prompt that queries the content of a specific browser window and paginates through pages to return a list of results.
   *
   * @param {string} sessionId - The session id for the window.
   * @param {string} windowId - The Airtop window id of the browser window.
   * @param {Airtop.SessionPaginatedExtractionHandlerRequestBody} request
   * @param {Windows.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @example
   *     await client.windows.paginatedExtraction("6aac6f73-bd89-4a76-ab32-5a6c422e8b0b", "0334da2a-91b0-42c5-6156-76a5eba87430")
   */
  public async paginatedExtraction(
    sessionId: string,
    windowId: string,
    request: Airtop.SessionPaginatedExtractionHandlerRequestBody,
    requestOptions?: WindowsNamespace.RequestOptions,
  ): Promise<Airtop.AiPromptResponse> {
    return super.paginatedExtraction(sessionId, windowId, request, {
      timeoutInSeconds: 600,
      ...requestOptions,
      maxRetries: 0,
    });
  }

  /**
   * Execute a scroll interaction in a specific browser window
   *
   * @param {string} sessionId - The session id for the window.
   * @param {string} windowId - The Airtop window id of the browser window.
   * @param {Airtop.SessionScrollHandlerRequestBody} request
   * @param {Windows.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @example
   *     await client.windows.scroll("6aac6f73-bd89-4a76-ab32-5a6c422e8b0b", "0334da2a-91b0-42c5-6156-76a5eba87430")
   */
  public async scroll(
    sessionId: string,
    windowId: string,
    request: Airtop.SessionScrollHandlerRequestBody = {},
    requestOptions?: Windows.RequestOptions,
  ): Promise<Airtop.AiPromptResponse> {
    return super.scroll(sessionId, windowId, request, {
      timeoutInSeconds: 600,
      ...requestOptions,
      maxRetries: 0,
    });
  }

  /**
   * @param {string} sessionId - The session id for the window.
   * @param {string} windowId - The Airtop window id of the browser window.
   * @param {Airtop.SessionMonitorHandlerRequestBody} request
   * @param {Windows.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @example
   *     await client.windows.monitor("6aac6f73-bd89-4a76-ab32-5a6c422e8b0b", "0334da2a-91b0-42c5-6156-76a5eba87430")
   */
  public async monitor(
    sessionId: string,
    windowId: string,
    request: Airtop.SessionMonitorHandlerRequestBody = {},
    requestOptions?: Windows.RequestOptions,
  ): Promise<Airtop.AiPromptResponse> {
    return super.monitor(sessionId, windowId, request, {
      timeoutInSeconds: 600,
      ...requestOptions,
      maxRetries: 0,
    });
  }

  private async executeSeleniumCDPCommand(
    driver: seleniumWebdriver.WebDriver,
    session: Airtop.ExternalSessionWithConnectionInfo,
    apiKey: string,
  ) {
    // Get the current WebDriver session ID
    const webDriverSessionId = (await driver.getSession()).getId();
    if (!webDriverSessionId) {
      throw new Error('No WebDriver session available');
    }
    const chromedriverSessionUrl = `${session.chromedriverUrl}/session/${webDriverSessionId}/chromium/send_command_and_get_result`;
    const response = await fetch(chromedriverSessionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        cmd: 'Target.getTargetInfo',
        params: {},
      }),
    });

    return response.json();
  }

  async getWindowInfoForSeleniumDriver(
    session: Airtop.ExternalSessionWithConnectionInfo,
    driver: seleniumWebdriver.WebDriver,
    request?: Airtop.GetWindowInfoRequest,
    requestOptions?: WindowsNamespace.RequestOptions,
  ) {
    const apiKey = await core.Supplier.get(this.apiKeySupplier);
    const result = await this.executeSeleniumCDPCommand(driver, session, apiKey || '');
    const targetId = result?.value?.targetInfo?.targetId;
    if (!targetId) {
      throw new Error('TargetId not found');
    }
    return await this.getWindowInfo(session.id, targetId, request, requestOptions);
  }
}
