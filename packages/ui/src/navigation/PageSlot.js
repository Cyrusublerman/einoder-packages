import { BaseComponent } from '../foundation.js';

export class PageSlot extends BaseComponent {
  constructor(options = {}, deps = {}) {
    super({ ...options, componentType: 'page-slot' }, deps);
    this.label = options.label ?? '';
  }

  render() {
    if (this.element) return this.element;
    this.element = this.createElement('main', 'page-slot');
    if (this.label) {
      this.appendElement(this.element, this.createElement('div', 'page-slot-label', this.label));
    }
    this.body = this.createElement('div', 'page-slot-row');
    this.appendElement(this.element, this.body);
    return this.element;
  }

  mountChild(component) {
    if (!this.element) this.render();
    const el = typeof component.render === 'function' ? component.render() : component;
    this.appendElement(this.body, el);
    if (component instanceof BaseComponent) this.addChild(component);
    return el;
  }
}
