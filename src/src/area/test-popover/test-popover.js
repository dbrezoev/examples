import {ChildRouter} from 'libs/child-router/child-router';
import {Session} from 'service';
import {inject, useView} from 'aurelia-framework';
import {I18N} from 'aurelia-i18n';

@inject(Session, I18N)
@useView('libs/child-router/tabs-router.html')
//@useView('libs/child-router/child-router.html')
export class TestGrid extends ChildRouter {
  constructor(session, i18n) {
    super(session);
    this.i18n = i18n;
    this.navModel = [{
      route: '',
      redirect: 'popover-attribute'
    }, {
      route: 'popover-attribute',
      name: 'popover-attribute',
      moduleId: './popover-attribute/popover-attribute',
      title: 'popover atttribute example',
      nav: true
    }, {
      route: 'popover',
      name: 'popover',
      moduleId: './popover/popover',
      title: 'popover',
      nav: true
    }];
  }
}
