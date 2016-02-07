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
      redirect: 'tree-view'
    }, {
      route: 'tree-view',
      name: 'tree-vew',
      moduleId: './treeview/treeview',
      title: 'tree view example',
      nav: true
    }, {
      route: 'custom-node-view',
      name: 'custom-node-view',
      moduleId: './custom-node-view/custom-node-view',
      title: 'custom node view && filter',
      nav: true
    }, {
      route: 'selection',
      name: 'selection',
      moduleId: './selection/selection',
      title: 'selection',
      nav: true
    }];
  }
}
