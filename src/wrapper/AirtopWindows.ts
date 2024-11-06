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


export class AirtopWindows {
  private _windows: WindowsClass;

  constructor(private airtopClient: FernClient, private apiKeySupplier: core.Supplier<core.BearerToken | undefined>) {
    this._windows = airtopClient.windows;
  }

  async create(sessionId: string, request: Airtop.CreateWindowInputV1Body, requestOptions?: WindowsNamespace.RequestOptions) {
    return this._windows.create(sessionId, request, requestOptions);
  }

  async loadUrl(
    sessionId: string,
    windowId: string,
    request: Airtop.WindowLoadUrlV1Body,
    requestOptions?: WindowsNamespace.RequestOptions,
  ) {
    return this._windows.loadUrl(sessionId, windowId, request, requestOptions);
  }

  async close(sessionId: string, windowId: string, requestOptions?: WindowsNamespace.RequestOptions) {
    return this._windows.close(sessionId, windowId, requestOptions);
  }

  async getWindowInfo(
    sessionId: string,
    windowId: string,
    request?: Airtop.GetWindowInfoRequest,
    requestOptions?: WindowsNamespace.RequestOptions,
  ) {
    return this._windows.getWindowInfo(sessionId, windowId, request, requestOptions);
  }

  /**
   * @deprecated Use pageQuery instead
   */
  async promptContent(
    sessionId: string,
    windowId: string,
    request: Airtop.SessionPageQueryHandlerRequestBody,
    requestOptions?: WindowsNamespace.RequestOptions,
  ) {
    return this._windows.promptContent(sessionId, windowId, request, {
      timeoutInSeconds: 600,
      ...requestOptions,
      maxRetries: 0,
    });
  }

  async pageQuery(
    sessionId: string,
    windowId: string,
    request: Airtop.SessionPageQueryHandlerRequestBody,
    requestOptions?: WindowsNamespace.RequestOptions,
  ) {
    return this._windows.pageQuery(sessionId, windowId, request, {
      timeoutInSeconds: 600,
      ...requestOptions,
      maxRetries: 0,
    });
  }

  scrapeContent(
    sessionId: string,
    windowId: string,
    request?: Airtop.ScrapeContentRequest,
    requestOptions?: WindowsNamespace.RequestOptions,
  ) {
    return this._windows.scrapeContent(sessionId, windowId, request, { timeoutInSeconds: 600, ...requestOptions });
  }

  summarizeContent(
    sessionId: string,
    windowId: string,
    request?: Airtop.SessionSummaryHandlerRequestBody,
    requestOptions?: WindowsNamespace.RequestOptions,
  ) {
    return this._windows.summarizeContent(sessionId, windowId, request, {
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
