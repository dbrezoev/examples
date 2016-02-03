export const customElementHelper = {
  dispatchEvent(element, eventName, data) {
    let changeEvent;
    if (window.CustomEvent) {
      changeEvent = new CustomEvent(eventName, {
        detail: data,
        bubbles: true
      });
    } else {
      changeEvent = document.createEvent('CustomEvent');
      changeEvent.initCustomEvent(eventName, true, true, data);
    }

    element.dispatchEvent(changeEvent);
  },
  getAureliaViewModels(element, selector) {
    return Array.from(element.getElementsByTagName(selector)).map(el => {
      if (el.au && el.au.controller) {
        return el.au.controller.viewModel;
      } else {
        throw new Error('Not an aurelia view model!');
      }
    });
  }
};
