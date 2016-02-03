import {Config} from './config';

export {Logger} from './logger';
export {Session} from './session';

export {Http} from './http-client/http';
export {HttpRequestStartedMessage, HttpRequestFinishedMessage,
  HttpBadRequestMessage, HttpServerErrorRequestMessage,
  HttpSessionTimedOutMessage} from './http-client/http-client-messages';

export {AccessRightsAuthorizeStep, RolesAuthorizeStep} from './authorize-steps';

export function configure(aurelia, configCallback) {
  const config = new Config();

  if (configCallback !== undefined && typeof(configCallback) === 'function') {
    configCallback(config);
  }

  return config.locale();
}
