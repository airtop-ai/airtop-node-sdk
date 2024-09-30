export enum LiveViewEventName {
  /** Child --> Parent events */
  BrowserDisconnected = 'BrowserDisconnected',
  NewWindowOpened = 'NewWindowOpened',
  UrlChange = 'UrlChange',

  /** Parent --> Child events */
  CloseWindow = 'CloseWindow',
  NavigateBack = 'NavigateBack',
  NavigateForward = 'NavigateForward',
  NavigateToUrl = 'NavigateToUrl',
  RefreshPage = 'RefreshPage',
}

export type LiveViewMessage =
  | {
      // Events with no payload
      eventName:
        | LiveViewEventName.BrowserDisconnected
        | LiveViewEventName.CloseWindow
        | LiveViewEventName.NavigateBack
        | LiveViewEventName.NavigateForward
        | LiveViewEventName.RefreshPage;
    }
  | { eventName: LiveViewEventName.NavigateToUrl; payload: string } // url
  | { eventName: LiveViewEventName.NewWindowOpened; payload: string } // browserId
  | { eventName: LiveViewEventName.UrlChange; payload: string }; // url
