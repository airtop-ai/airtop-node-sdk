import { AirtopClient as FernClient } from '../Client'; // alias the Fern generated client
import { AirtopSessions } from './AirtopSessions';
import { AirtopWindows } from './AirtopWindows';
import {
	batchOperate,
	type BatchOperateConfig,
	type BatchOperationInput,
	type BatchOperationResponse,
	type BatchOperationUrl,
} from "../utils";

type AugmentedOptions = FernClient.Options & { debug?: boolean };

export class AirtopClient {
  public debug: boolean;
  private _client: FernClient;
  private _windows: AirtopWindows | undefined;
  private _sessions: AirtopSessions | undefined;

  constructor(private _options: AugmentedOptions) {
    this._client = new FernClient(_options);
    this.debug = _options?.debug || false;
  }

  public get sessions(): AirtopSessions {
    return (this._sessions ??= new AirtopSessions(this._options, this.debug));
  }

  public get windows(): AirtopWindows {
    return (this._windows ??= new AirtopWindows(this._options, this._options.apiKey));
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

	batchOperate = async<T> (
		urls: BatchOperationUrl[],
		operation: (input: BatchOperationInput) => Promise<BatchOperationResponse<T>>,
		config?: BatchOperateConfig,
	): Promise<T[]> => {
		return await batchOperate(urls, operation, this, config);
	};
}
