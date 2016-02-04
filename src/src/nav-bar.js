import {bindable} from 'aurelia-framework';
import {inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {Session, HttpSessionTimedOutMessage} from 'service';
//import {Router} from 'aurelia-router';
import {I18N} from 'aurelia-i18n';
import {Http, Logger} from 'service';
import {DialogService} from 'dialog';

@inject(Session, I18N, Http, Logger, DialogService, EventAggregator)
export class NavBar {
  @bindable router = null;

  constructor(session, i18n, http, logger, dialogService, eventAggregator) {
    this.session = session;
    //this.router = router;
    this.i18n = i18n;
    this.http = http;
    this.logger = logger;
    this.dialogService = dialogService;

    this.hasFocus = true;
    this.searchTerm = undefined;

    this.label = {
      logout: this.i18n.tr('navBar.logout')
    };

    this.reminders = [];

    eventAggregator.subscribe(HttpSessionTimedOutMessage, function () {
      this.logout();
    }.bind(this));
  }

  get isUserLoggedIn() {
    return this.session.isLoggedIn === true;
  }

  get userName() {
    return this.session.getUserName();
  }

  search() {
    throw new Error('not implemented: ' + this.searchTerm);
  }

  get userSettingsUrl() {
    let userId = Number(this.session.getUserClaim('userId'));
    return `#/administration/employee/${userId}/info`;
  }

  hoverSettings(isHovered) {
    this.hovered = isHovered;
  }

  checkAccess(navModel) {
    if (navModel.config.accessRight) {
      return this.session.userHasAccessRight(navModel.config.accessRight);
    }

    return true;
  }

  logout() {
    this.session.clearUser();
    this.router.navigate('login');
  }
}

