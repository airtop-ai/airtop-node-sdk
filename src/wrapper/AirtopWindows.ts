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
import { AirtopClient as FernClient } from '../Client';
import * as Airtop from '../api';
import { Windows as WindowsClass, Windows as WindowsNamespace } from '../api/resources/windows/client/Client';
import * as core from '../core';


export class AirtopWindows extends WindowsClass {

  constructor(readonly _options: WindowsNamespace.Options, private apiKeySupplier: core.Supplier<core.BearerToken | undefined>) {
    super(_options);
  }

  /**
     * @param {string} sessionId - The session id for the window.
     * @param {string} windowId - The Airtop window id of the browser window to target with an Airtop AI prompt.
     * @param {Airtop.SessionContentPromptHandlerRequestBody} request
     * @param {Windows.RequestOptions} requestOptions - Request-specific configuration.
     *
     * @example
     *     await client.windows.promptContent("6aac6f73-bd89-4a76-ab32-5a6c422e8b0b", "0334da2a-91b0-42c5-6156-76a5eba87430", {
     *         prompt: "What is the main idea of this page?"
     *     })
     */
  async promptContent(
    sessionId: string,
    windowId: string,
    request: Airtop.SessionContentPromptHandlerRequestBody,
    requestOptions?: WindowsNamespace.RequestOptions,
  ) {
    return super.promptContent(sessionId, windowId, request, {
      timeoutInSeconds: 600,
      ...requestOptions,
      maxRetries: 0,
    });
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
    return super.scrapeContent(sessionId, windowId, request, { timeoutInSeconds: 600, ...requestOptions });
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
    request?: Airtop.SessionSummaryHandlerRequestBody,
    requestOptions?: WindowsNamespace.RequestOptions,
  ) {
    return super.summarizeContent(sessionId, windowId, request, {
      timeoutInSeconds: 600,
      ...requestOptions,
      maxRetries: 0,
    });
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
