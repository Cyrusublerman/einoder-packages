import { BaseComponent } from '../foundation.js';

export class Subheader extends BaseComponent {
  constructor(options = {}, deps = {}) {
    super({ ...options, componentType: 'subheader' }, deps);
    this.sectionTitle = options.sectionTitle ?? 'SECTION';
    this.onPrevClick = options.onPrevClick ?? null;
    this.onNextClick = options.onNextClick ?? null;
    this.visible = options.visible ?? true;
  }

  render() {
    if (this.element) return this.element;
    this.element = this.createElement('div', 'subheader');
    this.setState(this.element, 'open', this.visible);

    this.titleEl = this.createElement('div', 'subheader-title', this.sectionTitle);
    this.nav = this.createElement('div', 'subheader-nav');
    this.prev = this.createElement('button', 'subheader-prev');
    this.prev.type = 'button';
    this.prev.textContent = 'PREV ←';
    this.next = this.createElement('button', 'subheader-next');
    this.next.type = 'button';
    this.next.textContent = '→ NEXT';
    if (this.onPrevClick) this.prev.addEventListener('click', this.onPrevClick);
    if (this.onNextClick) this.next.addEventListener('click', this.onNextClick);
    this.appendElement(this.nav, this.prev);
    this.appendElement(this.nav, this.next);
    this.appendElement(this.element, this.titleEl);
    this.appendElement(this.element, this.nav);
    return this.element;
  }

  setTitle(title) {
    this.sectionTitle = title;
    if (this.titleEl) this.titleEl.textContent = title;
  }

  setVisible(on) {
    this.visible = on;
    if (this.element) this.setState(this.element, 'open', on);
  }
}
