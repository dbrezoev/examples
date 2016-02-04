import {I18N} from 'aurelia-i18n';
import {inject} from 'aurelia-framework';
//import {accessRight} from 'enum/access-right';

@inject(I18N)
export class RoutesConfig {
  constructor(i18n) {
    this.i18n = i18n;
  }

  getRoutes() {
    return [{
      route: '',
      redirect: 'test-grid'
    }, {
      route: 'test-dialog',
      name: 'test-dialog',
      moduleId: './area/test-dialog/welcome',
      nav: true,
      title: 'Test Dialog'
    }, {
      route: 'test-assign',
      name: 'test-assign',
      moduleId: './area/test-assign/test-assign',
      nav: true,
      title: 'Test Assign'
    }, {
      route: 'test-split',
      name: 'test-split',
      moduleId: './area/test-split/test-split',
      nav: true,
      title: 'Test Splitter'
    }, {
      route: 'test-popover',
      name: 'test-popover',
      moduleId: './area/test-popover/test-popover',
      nav: true,
      title: 'Test Popover'
    }, {
      route: 'test-grid',
      name: 'test-grid',
      moduleId: './area/test-grid/test-grid',
      nav: true,
      title: 'Test Grid'
    }];
  }
}
