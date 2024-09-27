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
    createCDPConnection(domain: string): Promise<any>;
  }
}

import { AirtopClient as FernClient } from '../Client';
import * as Airtop from '../api';
import { Windows as WindowsClass, Windows as WindowsNamespace } from '../api/resources/windows/client/Client';

export class AirtopWindows {
  private _windows: WindowsClass;

  constructor(private airtopClient: FernClient) {
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
    sessionId: string,
    page: puppeteer.Page,
    request?: Airtop.GetWindowInfoRequest,
    requestOptions?: WindowsNamespace.RequestOptions,
  ): Promise<Airtop.WindowEnvelopeDefaultMetaWrapper> {
    const targetId = await (page.mainFrame() as any)._id;
    return await this.getWindowInfo(sessionId, targetId, request, requestOptions);
  }

  async getWindowInfoForPlaywrightPage(
    sessionId: string,
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
    return await this.getWindowInfo(sessionId, targetId, request, requestOptions);
  }

  async getWindowInfoForSeleniumDriver(
    sessionId: string,
    driver: seleniumWebdriver.WebDriver,
    request?: Airtop.GetWindowInfoRequest,
    requestOptions?: WindowsNamespace.RequestOptions,
  ): Promise<Airtop.WindowEnvelopeDefaultMetaWrapper> {
    const cdpSession = await driver.createCDPConnection('page');
    // Fetch the available targets using the Target domain
    const { targetInfo } = await cdpSession.send('Target.getTargetInfo');
    const targetId = targetInfo.targetId;
    if (!targetId) {
      throw new Error('TargetId not found');
    }
    return await this.getWindowInfo(sessionId, targetId, request, requestOptions);
  }
}
