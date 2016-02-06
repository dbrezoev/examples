export class ListItem {
  constructor(item, opts) {
    this.item = item;
    this.text = item.text;
    this.expanded = item.expanded || false;
    this.hasChildren = Array.isArray(item.nodes);


    this.visible = true;
    this.nestedLevel = 0;

    Object.assign(this, opts);

    if (this.hasChildren) {
      this.children = item.nodes.map(itemData => new ListItem(itemData, {
        parent: this,
        visible: this.expanded,
        nestedLevel: this.nestedLevel + 1
      }));
    }

    if (this.expanded) {
      this.expand();
    }
  }

  getChildren() {
    return this.children || [];
  }

  toggleChildrenVisibility() {
    this.expanded = !this.expanded;
    this.getChildren().forEach(c => c.setVisibleStatus(this.expanded));
  }

  setVisibleStatus(visible) {
    if (visible === false) {
      this.getChildren().forEach(c => c.setVisibleStatus(false));
    } else if (this.expanded) {
      this.getChildren().forEach(c => c.setVisibleStatus(true));
    }

    this.visible = visible;
  }

  expand() {
    this.expanded = true;
    this.visible = true;
    if (this.parent) {
      this.parent.expand();
    }
  }

  collapse() {
    this.expanded = false;
    this.getChildren().forEach(c => c.setVisibleStatus(false));
  }
}
