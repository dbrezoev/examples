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

    // for testing reminders type in console: this.navBar.onReceiveReminders(this.navBar.getFakeReminders(22))
    window.navBar = this;

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

  onReceiveReminders(reminders) {
    let lengthDifference = reminders.length - this.reminders.length;
    if (lengthDifference > 0) {
      let message = `${lengthDifference} ${this.i18n.tr('navBar.reminders.' + (lengthDifference === 1 ? 'newReminder' : 'newReminders'))}`;
      this.logger.info(message);
    }

    this.reminders = reminders;
  }

  getFakeReminders(count) {
    let fakeReminders = [];
    for (let i = 0; i < count; i++) {
      fakeReminders.push({
        id: i,
        caseId: "a9b9cd24-35e5-bd10-e053-0100007f5c18",
        workUnitId: "fe8c3425-f0d9-7405-e053-0100007fc08e",
        dateAdded: "2016-01-10T12:32:08.212+00:00",
        time: "2016-01-18T07:55:08.212+00:00",
        remindText: "helooooooo helooooooo helooooooo  helooooooooooooo helooooooo " + i
      });
    }

    return fakeReminders;
  }

  onRemindersButtonClick() {
    this.dialogService.openDialog({
      viewModel: RemindersDialog,
      model: {reminders: this.reminders}
    });
  }
}

