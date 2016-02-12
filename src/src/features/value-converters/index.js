export function configure(aurelia, configCallback) {
  aurelia.globalResources('./date-format');
  aurelia.globalResources('./short-date-format');
  aurelia.globalResources('./date-time-format');
  aurelia.globalResources('./short-date-time-format');
  aurelia.globalResources('./console-debug');
  aurelia.globalResources('./sum-format');
}
