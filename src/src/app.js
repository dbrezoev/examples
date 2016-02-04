import moment from 'moment';
import 'moment/locale/bg';
import {I18N} from 'aurelia-i18n';
import {AccessRightsAuthorizeStep} from 'service';
import {inject} from 'aurelia-framework';

import {EventAggregator} from 'aurelia-event-aggregator';
import {HttpRequestStartedMessage, HttpRequestFinishedMessage,
  HttpBadRequestMessage, HttpServerErrorRequestMessage} from 'service';

import {RoutesConfig} from './routes-config';

import {DialogService} from 'dialog';
import {ErrorsDialog} from './errors-dialog/errors-dialog';

@inject(I18N, RoutesConfig, EventAggregator, DialogService)
export class App {
  constructor(i18n, routesConfig, eventAggregator, dialogService) {
    this.i18n = i18n;
    this.routesConfig = routesConfig;
    this.dialogService = dialogService;
    moment.locale('bg');

    this.showLoadingMask = false;
    eventAggregator.subscribe(HttpRequestStartedMessage, function() {
      this.showLoadingMask = true;
    }.bind(this));

    eventAggregator.subscribe(HttpRequestFinishedMessage, function () {
      this.showLoadingMask = false;
    }.bind(this));

    eventAggregator.subscribe(HttpBadRequestMessage, function (model) {
      this.dialogService.openDialog({
        viewModel: ErrorsDialog,
        model: {errors: [model.error]}
      });
    }.bind(this));

    eventAggregator.subscribe(HttpServerErrorRequestMessage, function (model) {
      this.dialogService.openDialog({
        viewModel: ErrorsDialog,
        model: {errors: model.errors}
      });
    }.bind(this));
  }

  configureRouter(config, router) {
    //config.options.pushState = true;
    config.title = this.i18n.tr('config.pageTitle');
    //config.addPipelineStep('authorize', AccessRightsAuthorizeStep);
    config.map(this.routesConfig.getRoutes());
    config.mapUnknownRoutes('./not-found', 'not-found');

    this.router = router;
  }
}
