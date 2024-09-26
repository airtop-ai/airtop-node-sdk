export * as Airtop from "./api";
export * as Resources from './api/resources';
export { AirtopEnvironment } from "./environments";
export { AirtopError, AirtopTimeoutError } from "./errors";
import { AirtopClient } from './wrapper/AirtopClient';

const client = new AirtopClient();
export default client;
