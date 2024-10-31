import { AirtopClient as FernClient } from '../Client'; // alias the Fern generated client
import { AirtopWindows } from './AirtopWindows';
import { AirtopSessions } from './AirtopSessions';

type AugmentedOptions = FernClient.Options & { debug?: boolean };

export class AirtopClient {
  public debug: boolean;
  private _client: FernClient;
  private _windowsWrapper: AirtopWindows;
  private _sessionsWrapper: AirtopSessions;

  constructor(options: AugmentedOptions) {
    this._client = new FernClient(options);
    this.debug = options?.debug || false;
    this._windowsWrapper = new AirtopWindows(this._client, options?.apiKey);
    this._sessionsWrapper = new AirtopSessions(this._client, options?.debug);
  }

  get windows() {
    return this._windowsWrapper;
  }

  get sessions() {
    return this._sessionsWrapper;
  }

  get profiles() {
    return this._client.profiles;
  }

  log(message: string) {
    if (this.debug) {
      console.log(message);
    }
  }

  error(err: any) {
    console.error(err);
  }
}
