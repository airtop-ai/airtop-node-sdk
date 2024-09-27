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

import { Page as PuppeteerPage } from 'puppeteer';
import { Page as PlaywrightPage } from 'playwright';
import { WebDriver } from 'selenium-webdriver';
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

  async getWindowInfo(
    sessionId: string,
    windowId: string,
    request?: Airtop.GetWindowInfoRequest,
    requestOptions?: WindowsNamespace.RequestOptions,
  ): Promise<Airtop.WindowEnvelopeDefaultMetaWrapper> {
    return this._windows.getWindowInfo(sessionId, windowId, request, requestOptions);
  }

  async promptContent(
    sessionId: string,
    windowId: string,
    request: Airtop.PromptContentRequest,
    requestOptions?: WindowsNamespace.RequestOptions,
  ): Promise<Airtop.AiResponseEnvelopeExternalSessionAiResponseMetadataWrapper> {
    return this._windows.promptContent(sessionId, windowId, request, requestOptions);
  }

  scrapeContent(
    sessionId: string,
    windowId: string,
    requestOptions?: Airtop.ScrapeContentRequest,
  ): Promise<Airtop.ScrapeResponseEnvelopeExternalSessionAiResponseMetadataWrapper> {
    return this._windows.scrapeContent(sessionId, windowId, requestOptions);
  }

  summarizeContent(
    sessionId: string,
    windowId: string,
    request?: Airtop.SummarizeContentRequest,
    requestOptions?: WindowsNamespace.RequestOptions,
  ): Promise<Airtop.AiResponseEnvelopeExternalSessionAiResponseMetadataWrapper> {
    return this._windows.summarizeContent(sessionId, windowId, request, requestOptions);
  }

  async getWindowInfoForPuppeteerPage(
    session: Airtop.ExternalSessionWithConnectionInfo,
    page: puppeteer.Page,
    request?: Airtop.GetWindowInfoRequest,
    requestOptions?: WindowsNamespace.RequestOptions,
  ): Promise<Airtop.WindowEnvelopeDefaultMetaWrapper> {
    const targetId = await (page.mainFrame() as any)._id;
    return await this.getWindowInfo(session.id, targetId, request, requestOptions);
  }

  async getWindowInfoForPlaywrightPage(
    session: Airtop.ExternalSessionWithConnectionInfo,
    page: playwright.Page,
    request?: Airtop.GetWindowInfoRequest,
    requestOptions?: WindowsNamespace.RequestOptions,
  ): Promise<Airtop.WindowEnvelopeDefaultMetaWrapper> {
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
  ): Promise<Airtop.WindowEnvelopeDefaultMetaWrapper> {
    const apiKey = await core.Supplier.get(this.apiKeySupplier);
    const result = await this.executeSeleniumCDPCommand(driver, session, apiKey || '');
    const targetId = result?.value?.targetInfo?.targetId;
    if (!targetId) {
      throw new Error('TargetId not found');
    }
    return await this.getWindowInfo(session.id, targetId, request, requestOptions);
  }
}
