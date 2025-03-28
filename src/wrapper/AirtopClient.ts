import { AirtopClient as FernClient } from '../Client'; // alias the Fern generated client
import * as core from '../core';
import {
  type BatchOperateConfig,
  type BatchOperationInput,
  type BatchOperationResponse,
  type BatchOperationUrl,
  batchOperate,
} from '../utils';
import { AirtopSessions } from './AirtopSessions';
import { AirtopWindows } from './AirtopWindows';
import { AirtopRequests } from './AirtopRequests';
import { AirtopFiles } from './AirtopFiles';
import { SDK_VERSION } from '../version';

type AugmentedOptions = FernClient.Options & { debug?: boolean };

export class AirtopClient {
  public debug: boolean;
  private _client: FernClient;
  private _windows: AirtopWindows | undefined;
  private _sessions: AirtopSessions | undefined;
  private _requests: AirtopRequests | undefined;
  private _files: AirtopFiles | undefined;

  constructor(private _options: AugmentedOptions) {
    const version = SDK_VERSION;
    if (!_options.fetcher) {
      _options.fetcher = (req) => {
        return core.fetcher({
          ...req,
          headers: {
            ...req.headers,
            'x-airtop-sdk-source': 'javascript',
            'x-airtop-sdk-version': version,
          },
        });
      };
    }

    this._client = new FernClient(_options);
    this.debug = _options?.debug || false;
  }

  setApiKey(apiKey: string) {
    this._options.apiKey = apiKey;
  }

  setEnvironment(environment: string) {
    this._options.environment = environment;
  }

  public get sessions(): AirtopSessions {
    return (this._sessions ??= new AirtopSessions(this._options, this.debug));
  }

  public get windows(): AirtopWindows {
    return (this._windows ??= new AirtopWindows(this._options, this._options.apiKey));
  }

  public get requests(): AirtopRequests {
    return (this._requests ??= new AirtopRequests(this._options));
  }

  get files() {
    return (this._files ??= new AirtopFiles(this._options));
  }

  get profiles() {
    return this._client.profiles;
  }

  log(message: string) {
    if (this.debug) {
      console.log(message);
    }
  }

  warn(message: string) {
    console.warn(message);
  }

  error(err: any) {
    console.error(err);
  }

  batchOperate = async <T>(
    urls: BatchOperationUrl[],
    operation: (input: BatchOperationInput) => Promise<BatchOperationResponse<T>>,
    config?: BatchOperateConfig,
  ): Promise<T[]> => {
    return await batchOperate(urls, operation, this, config);
  };
}
