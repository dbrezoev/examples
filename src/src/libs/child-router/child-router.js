export class ChildRouter {
  constructor(session) {
    this.session = session;
    this.navModel = {};
  }

  configureRouter(config, router) {
    config.map(this.navModel);
    config.mapUnknownRoutes('not-found', 'not-found');
    this.router = router;
  }

  checkAccess(navModel) {
    if (navModel.config.accessRight) {
      return this.session.userHasAccessRight(navModel.config.accessRight);
    }

    return true;
  }
}
